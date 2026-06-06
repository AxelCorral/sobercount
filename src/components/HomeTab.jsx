import React, { useState } from 'react'
import { getEvents, addEvent, clearAll } from '../storage.js'
import { MINUTES_PER_CIGARETTE, MINUTES_PER_BEER } from '../constants.js'
import { formatMinutes } from '../utils.js'

export default function HomeTab() {
  const [events, setEvents] = useState(() => getEvents())
  const [showConfirm, setShowConfirm] = useState(false)

  const beers = events.filter(e => e.type === 'beer').length
  const cigarettes = events.filter(e => e.type === 'cigarette').length
  const totalMinutes = beers * MINUTES_PER_BEER + cigarettes * MINUTES_PER_CIGARETTE

  const handleBeer = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    addEvent('beer')
    setEvents(getEvents())
  }

  const handleCig = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    addEvent('cigarette')
    setEvents(getEvents())
  }

  const handleReset = () => {
    clearAll()
    setEvents([])
    setShowConfirm(false)
  }

  return (
    <div className="p-4 pb-4">
      {/* Header */}
      <div className="text-center mb-5 pt-1">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f5f5f5' }}>
          SoberCount
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Ce que tu as évité</p>
      </div>

      {/* Tap buttons */}
      <div className="flex flex-col gap-3 mb-5">
        <button
          onClick={handleBeer}
          className="w-full py-7 rounded-2xl text-center active:scale-[0.96] transition-transform duration-100 select-none"
          style={{ backgroundColor: '#1a1205', border: '2px solid #f59e0b' }}
        >
          <div className="text-5xl leading-none mb-2">🍺</div>
          <div className="text-xl font-bold" style={{ color: '#f59e0b' }}>Pinte refusée</div>
          <div className="text-xs mt-1" style={{ color: '#92400e' }}>568 ml · +15 min de vie</div>
        </button>

        <button
          onClick={handleCig}
          className="w-full py-7 rounded-2xl text-center active:scale-[0.96] transition-transform duration-100 select-none"
          style={{ backgroundColor: '#1a0808', border: '2px solid #ef4444' }}
        >
          <div className="text-5xl leading-none mb-2">🚬</div>
          <div className="text-xl font-bold" style={{ color: '#ef4444' }}>Clope refusée</div>
          <div className="text-xs mt-1" style={{ color: '#991b1b' }}>+11 min de vie</div>
        </button>
      </div>

      {/* Counters */}
      <div className="flex gap-3 mb-3">
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#1a1a1a' }}>
          <div
            key={`b${beers}`}
            className="text-3xl font-bold count-pop"
            style={{ color: '#f59e0b' }}
          >
            {beers}
          </div>
          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>pintes évitées</div>
        </div>
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#1a1a1a' }}>
          <div
            key={`c${cigarettes}`}
            className="text-3xl font-bold count-pop"
            style={{ color: '#ef4444' }}
          >
            {cigarettes}
          </div>
          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>clopes évitées</div>
        </div>
      </div>

      {/* Vie gagnée */}
      <div
        className="rounded-2xl px-5 py-5 text-center mb-4"
        style={{ backgroundColor: '#061209', border: '2px solid #22c55e' }}
      >
        <div className="text-xs mb-1 tracking-wide uppercase" style={{ color: '#4b5563' }}>
          ⏱ Temps de vie gagné
        </div>
        <div
          key={`t${totalMinutes}`}
          className="text-5xl font-bold my-2 count-pop"
          style={{ color: '#22c55e' }}
        >
          {totalMinutes > 0 ? formatMinutes(totalMinutes) : '—'}
        </div>
        <div className="text-[10px] mt-1" style={{ color: '#374151' }}>
          Sources : Lancet 2018, Doll &amp; Peto — BMJ 2004
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
  )
}
