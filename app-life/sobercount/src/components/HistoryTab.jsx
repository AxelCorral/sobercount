import React from 'react'
import { getEvents } from '../storage.js'
import { MINUTES_PER_CIGARETTE, MINUTES_PER_BEER } from '../constants.js'
import { formatMinutes } from '../utils.js'

function groupByDay(events) {
  const map = {}
  events.forEach(e => {
    const day = e.timestamp.slice(0, 10)
    if (!map[day]) map[day] = { beers: 0, cigs: 0 }
    if (e.type === 'beer') map[day].beers++
    else map[day].cigs++
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

export default function HistoryTab() {
  const events = getEvents()
  const groups = groupByDay(events)

  if (groups.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-8"
        style={{ minHeight: '70vh' }}
      >
        <div className="text-6xl mb-4">💪</div>
        <p className="text-lg font-medium" style={{ color: '#9ca3af' }}>
          Commence ce soir !
        </p>
        <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
          Tes refus apparaîtront ici
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
        Historique
      </h2>

      <div className="flex flex-col gap-3">
        {groups.map(([day, { beers, cigs }]) => {
          const minutes = beers * MINUTES_PER_BEER + cigs * MINUTES_PER_CIGARETTE
          return (
            <div
              key={day}
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: '#e5e7eb' }}>
                {frenchDate(day)}
              </p>

              <div className="flex gap-3 flex-wrap">
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
              </div>

              <div className="mt-2 text-sm font-medium" style={{ color: '#22c55e' }}>
                +{formatMinutes(minutes)} de vie gagnée
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
