import React from 'react'
import { getProfile } from '../storage.js'
import { MINUTES_PER_CIGARETTE, MINUTES_PER_BEER, HYDRATION_LIFE_GAIN_MINUTES, getSleepLifeGain } from '../constants.js'
import { formatMinutes, calcSportLifeMinutes } from '../utils.js'

function groupByDay(events) {
  const map = {}
  events.forEach(e => {
    const day = (e.type === 'hydration' || e.type === 'sleep')
      ? (e.date || e.timestamp.slice(0, 10))
      : e.timestamp.slice(0, 10)
    if (!map[day]) map[day] = { beers: 0, cigs: 0, sportSessions: [], hydrated: false, slept: false }
    if (e.type === 'beer') map[day].beers++
    else if (e.type === 'cigarette') map[day].cigs++
    else if (e.type === 'sport') map[day].sportSessions.push(e)
    else if (e.type === 'hydration') map[day].hydrated = true
    else if (e.type === 'sleep') map[day].slept = true
  })
  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
}

function frenchDate(isoDay) {
  const d = new Date(isoDay + 'T12:00:00')
  const str = d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function HistoryTab({ events }) {
  const profile = getProfile()
  const sleepGainPerNight = getSleepLifeGain(profile?.age)
  const groups = groupByDay(events)

  if (groups.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-8"
        style={{ minHeight: '70vh' }}
      >
        <div className="text-6xl mb-4">💪</div>
        <p className="text-lg font-medium" style={{ color: '#9ca3af' }}>Commence ce soir !</p>
        <p className="text-sm mt-2" style={{ color: '#6b7280' }}>Tes refus apparaîtront ici</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#f5f5f5' }}>Historique</h2>

      <div className="flex flex-col gap-3">
        {groups.map(([day, { beers, cigs, sportSessions, hydrated, slept }]) => {
          const avoidMin = beers * MINUTES_PER_BEER + cigs * MINUTES_PER_CIGARETTE
          const sportDurationMin = sportSessions.reduce((s, e) => s + (e.duration_minutes || 0), 0)
          const sportLifeMin = sportSessions.reduce((s, e) => s + calcSportLifeMinutes(e), 0)
          const hydrationLifeMin = hydrated ? HYDRATION_LIFE_GAIN_MINUTES : 0
          const sleepLifeMin = slept ? sleepGainPerNight : 0

          return (
            <div key={day} className="rounded-2xl p-4" style={{ backgroundColor: '#1a1a1a' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#e5e7eb' }}>
                {frenchDate(day)}
              </p>

              <div className="flex gap-3 flex-wrap mb-2">
                {beers > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍺</span>
                    <span className="font-bold" style={{ color: '#f59e0b' }}>{beers}</span>
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      pinte{beers > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {cigs > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚬</span>
                    <span className="font-bold" style={{ color: '#ef4444' }}>{cigs}</span>
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      clope{cigs > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {sportSessions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏃</span>
                    <span className="font-bold" style={{ color: '#3b82f6' }}>{sportSessions.length}</span>
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      séance{sportSessions.length > 1 ? 's' : ''} · {sportDurationMin} min
                    </span>
                  </div>
                )}
                {hydrated && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💧</span>
                    <span className="text-xs font-medium" style={{ color: '#06b6d4' }}>Journée hydratée</span>
                  </div>
                )}
                {slept && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">😴</span>
                    <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>Bonne nuit</span>
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                {avoidMin > 0 && (
                  <div className="text-sm font-medium" style={{ color: '#22c55e' }}>
                    +{formatMinutes(avoidMin)} via refus
                  </div>
                )}
                {sportLifeMin > 0 && (
                  <div className="text-sm font-medium" style={{ color: '#3b82f6' }}>
                    +{formatMinutes(sportLifeMin)} via sport
                  </div>
                )}
                {hydrationLifeMin > 0 && (
                  <div className="text-sm font-medium" style={{ color: '#06b6d4' }}>
                    +{formatMinutes(hydrationLifeMin)} via hydratation
                  </div>
                )}
                {sleepLifeMin > 0 && (
                  <div className="text-sm font-medium" style={{ color: '#8b5cf6' }}>
                    +{formatMinutes(sleepLifeMin)} via sommeil
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
