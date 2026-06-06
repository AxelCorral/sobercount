import React, { useState } from 'react'
import { getEvents, addEvent, clearAll, getProfile, isHydrationDoneToday } from '../storage.js'
import {
  MINUTES_PER_CIGARETTE,
  MINUTES_PER_BEER,
  HYDRATION_LIFE_GAIN_MINUTES,
  calculateDailyWaterGoal,
} from '../constants.js'
import { formatMinutes, calcSportLifeMinutes } from '../utils.js'
import SportModal from './SportModal.jsx'

function calcHydrationStreak(hydrationEvents) {
  const dates = new Set(hydrationEvents.map(e => e.date || e.timestamp.slice(0, 10)))
  if (dates.size === 0) return 0
  let streak = 0
  const d = new Date()
  while (true) {
    const dateStr = d.toISOString().slice(0, 10)
    if (dates.has(dateStr)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return streak
}

export default function HomeTab({ onNavigate }) {
  const [events, setEvents] = useState(() => getEvents())
  const [profile] = useState(() => getProfile())
  const [hydratedToday, setHydratedToday] = useState(() => isHydrationDoneToday())
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSportModal, setShowSportModal] = useState(false)

  const beers = events.filter(e => e.type === 'beer').length
  const cigarettes = events.filter(e => e.type === 'cigarette').length
  const avoidLostMin = beers * MINUTES_PER_BEER + cigarettes * MINUTES_PER_CIGARETTE

  const sportEvents = events.filter(e => e.type === 'sport')
  const totalSportSessions = sportEvents.length
  const totalSportDurationMin = sportEvents.reduce((s, e) => s + (e.duration_minutes || 0), 0)
  const totalSportLifeMin = sportEvents.reduce((s, e) => s + calcSportLifeMinutes(e), 0)

  const hydrationEvents = events.filter(e => e.type === 'hydration')
  const totalHydrationDays = hydrationEvents.length
  const totalHydrationLifeMin = totalHydrationDays * HYDRATION_LIFE_GAIN_MINUTES
  const hydrationStreak = calcHydrationStreak(hydrationEvents)

  const netMinutes = totalSportLifeMin + totalHydrationLifeMin - avoidLostMin
  const netPositive = netMinutes >= 0

  const waterGoalMl = calculateDailyWaterGoal(profile)

  const refresh = () => setEvents(getEvents())

  const handleBeer = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    addEvent('beer')
    refresh()
  }

  const handleCig = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    addEvent('cigarette')
    refresh()
  }

  const handleSportConfirm = ({ sport_type_id, duration_minutes }) => {
    if (navigator.vibrate) navigator.vibrate(50)
    addEvent('sport', { sport_type_id, duration_minutes })
    setShowSportModal(false)
    refresh()
  }

  const handleHydration = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    addEvent('hydration', { date: new Date().toISOString().slice(0, 10) })
    refresh()
    setHydratedToday(isHydrationDoneToday())
  }

  const handleReset = () => {
    clearAll()
    setEvents([])
    setHydratedToday(false)
    setShowConfirm(false)
  }

  return (
    <>
      <div className="p-4 pb-4">
        {/* Header */}
        <div className="text-center mb-4 pt-1">
          {profile?.prenom && (
            <p className="text-sm font-medium mb-0.5" style={{ color: '#9ca3af' }}>
              Bonjour {profile.prenom} 👋
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f5f5f5' }}>
            SoberCount
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Ce que tu as évité</p>
        </div>

        {/* Bandeau profil si absent */}
        {!profile && (
          <button
            onClick={() => onNavigate('profile')}
            className="w-full rounded-2xl px-4 py-3 text-left mb-4 flex items-center gap-3"
            style={{ backgroundColor: '#1a1205', border: '1px dashed #f59e0b' }}
          >
            <span className="text-2xl">👤</span>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>Complète ton profil</p>
              <p className="text-xs" style={{ color: '#92400e' }}>Pour personnaliser ton objectif d'hydratation</p>
            </div>
            <span className="text-lg" style={{ color: '#92400e' }}>›</span>
          </button>
        )}

        {/* Tap buttons */}
        <div className="flex flex-col gap-3 mb-4">
          <button
            onClick={handleBeer}
            className="w-full py-6 rounded-2xl text-center active:scale-[0.96] transition-transform duration-100 select-none"
            style={{ backgroundColor: '#1a1205', border: '2px solid #f59e0b' }}
          >
            <div className="text-4xl leading-none mb-1.5">🍺</div>
            <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>Pinte refusée</div>
            <div className="text-xs mt-0.5" style={{ color: '#92400e' }}>568 ml · +15 min de vie</div>
          </button>

          <button
            onClick={handleCig}
            className="w-full py-6 rounded-2xl text-center active:scale-[0.96] transition-transform duration-100 select-none"
            style={{ backgroundColor: '#1a0808', border: '2px solid #ef4444' }}
          >
            <div className="text-4xl leading-none mb-1.5">🚬</div>
            <div className="text-lg font-bold" style={{ color: '#ef4444' }}>Clope refusée</div>
            <div className="text-xs mt-0.5" style={{ color: '#991b1b' }}>+11 min de vie</div>
          </button>

          <button
            onClick={() => setShowSportModal(true)}
            className="w-full py-6 rounded-2xl text-center active:scale-[0.96] transition-transform duration-100 select-none"
            style={{ backgroundColor: '#0d1f3c', border: '2px solid #3b82f6' }}
          >
            <div className="text-4xl leading-none mb-1.5">🏃</div>
            <div className="text-lg font-bold" style={{ color: '#3b82f6' }}>Séance faite !</div>
            <div className="text-xs mt-0.5" style={{ color: '#1d4ed8' }}>enregistrer une session sport</div>
          </button>

          <button
            onClick={handleHydration}
            className="w-full py-6 rounded-2xl text-center active:scale-[0.96] transition-transform duration-100 select-none"
            style={{
              backgroundColor: '#071a20',
              border: `2px solid ${hydratedToday ? '#06b6d4' : '#164e63'}`,
            }}
          >
            <div className="text-4xl leading-none mb-1.5">💧</div>
            <div className="text-lg font-bold" style={{ color: hydratedToday ? '#06b6d4' : '#0e7490' }}>
              {hydratedToday ? 'Objectif atteint ✓' : 'Journée hydratée !'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: hydratedToday ? '#0e7490' : '#164e63' }}>
              {hydratedToday
                ? 'Appuie pour annuler'
                : `+${HYDRATION_LIFE_GAIN_MINUTES} min de vie · objectif ${waterGoalMl.toLocaleString('fr-FR')} ml`}
            </div>
          </button>
        </div>

        {/* Counters beer / cig */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#1a1a1a' }}>
            <div key={`b${beers}`} className="text-3xl font-bold count-pop" style={{ color: '#f59e0b' }}>
              {beers}
            </div>
            <div className="text-xs mt-1" style={{ color: '#6b7280' }}>pintes évitées</div>
          </div>
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#1a1a1a' }}>
            <div key={`c${cigarettes}`} className="text-3xl font-bold count-pop" style={{ color: '#ef4444' }}>
              {cigarettes}
            </div>
            <div className="text-xs mt-1" style={{ color: '#6b7280' }}>clopes évitées</div>
          </div>
        </div>

        {/* Sport card */}
        <div
          className="rounded-2xl p-4 mb-3"
          style={{ backgroundColor: '#0a1628', border: '2px solid #3b82f6' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold" style={{ color: '#93c5fd' }}>🏃 Séances de sport</span>
            <span key={`s${totalSportSessions}`} className="text-lg font-bold count-pop" style={{ color: '#3b82f6' }}>
              {totalSportSessions}
            </span>
          </div>
          <div className="text-xs mb-1" style={{ color: '#4b5563' }}>
            {totalSportDurationMin > 0 ? `${totalSportDurationMin} min pratiquées` : 'Aucune séance'}
          </div>
          <div key={`sl${totalSportLifeMin}`} className="text-2xl font-bold count-pop" style={{ color: '#3b82f6' }}>
            {totalSportLifeMin > 0 ? `+${formatMinutes(totalSportLifeMin)}` : '—'}
          </div>
          <div className="text-[10px] mt-1" style={{ color: '#1e3a5f' }}>
            Source : Lee et al. 2017, PLOS Medicine 2012
          </div>
        </div>

        {/* Hydration card */}
        <div
          className="rounded-2xl p-4 mb-3"
          style={{
            backgroundColor: '#071620',
            border: `2px solid ${hydratedToday ? '#06b6d4' : '#164e63'}`,
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold" style={{ color: '#22d3ee' }}>💧 Hydratation</span>
            {hydratedToday && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#083344', color: '#06b6d4' }}
              >
                ✓ Aujourd'hui
              </span>
            )}
          </div>
          <div className="text-xs mb-1" style={{ color: '#4b5563' }}>
            {totalHydrationDays > 0
              ? `${totalHydrationDays} jour${totalHydrationDays > 1 ? 's' : ''}${hydrationStreak > 1 ? ` · streak ${hydrationStreak} 🔥` : ''}`
              : 'Pas encore de journée hydratée'}
          </div>
          <div key={`h${totalHydrationLifeMin}`} className="text-2xl font-bold count-pop" style={{ color: '#06b6d4' }}>
            {totalHydrationLifeMin > 0 ? `+${formatMinutes(totalHydrationLifeMin)}` : '—'}
          </div>
          <div className="text-[10px] mt-1" style={{ color: '#164e63' }}>
            Source : Dmitrieva et al., eBioMedicine 2023 (NIH/NHLBI)
          </div>
        </div>

        {/* Vie gagnée — refus */}
        <div
          className="rounded-2xl px-4 py-4 text-center mb-3"
          style={{ backgroundColor: '#061209', border: '2px solid #22c55e' }}
        >
          <div className="text-xs mb-1 tracking-wide uppercase" style={{ color: '#4b5563' }}>
            ⏱ Vie gagnée par refus
          </div>
          <div
            key={`t${avoidLostMin}`}
            className="text-4xl font-bold my-1 count-pop"
            style={{ color: '#22c55e' }}
          >
            {avoidLostMin > 0 ? formatMinutes(avoidLostMin) : '—'}
          </div>
          <div className="text-[10px]" style={{ color: '#374151' }}>
            Sources : Lancet 2018, Doll &amp; Peto — BMJ 2004
          </div>
        </div>

        {/* Bilan net */}
        <div
          className="rounded-2xl px-4 py-4 text-center mb-4"
          style={{
            backgroundColor: netPositive ? '#071410' : '#120707',
            border: `2px solid ${netPositive ? '#22c55e' : '#ef4444'}`,
          }}
        >
          <div className="text-xs mb-1 tracking-wide uppercase" style={{ color: '#4b5563' }}>
            📊 Bilan espérance de vie
          </div>
          <div
            key={`n${netMinutes}`}
            className="text-4xl font-bold my-1 count-pop"
            style={{ color: netPositive ? '#22c55e' : '#ef4444' }}
          >
            {netMinutes === 0 ? '—' : `${netPositive ? '+' : '−'}${formatMinutes(Math.abs(netMinutes))}`}
          </div>
          <div className="text-xs" style={{ color: '#374151' }}>
            sport + hydratation − tabac &amp; alcool
          </div>
        </div>

        {/* Reset */}
        <div className="text-center">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-xs underline"
              style={{ color: '#374151' }}
            >
              Réinitialiser tout
            </button>
          ) : (
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#1a1a1a' }}>
              <p className="text-sm mb-3" style={{ color: '#9ca3af' }}>
                Êtes-vous sûr ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#2a2a2a', color: '#e5e7eb' }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ backgroundColor: '#b91c1c' }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSportModal && (
        <SportModal
          onConfirm={handleSportConfirm}
          onClose={() => setShowSportModal(false)}
        />
      )}
    </>
  )
}
