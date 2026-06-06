import React from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getEvents } from '../storage.js'
import { MINUTES_PER_CIGARETTE, MINUTES_PER_BEER } from '../constants.js'
import { formatMinutes, calcSportLifeMinutes } from '../utils.js'

const TOOLTIP_STYLE = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '10px',
  color: '#f5f5f5',
  fontSize: '12px',
}

const TICK = { fill: '#6b7280', fontSize: 10 }

function getLast14DayKeys() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return d.toISOString().slice(0, 10)
  })
}

function shortDate(isoDay) {
  const d = new Date(isoDay + 'T12:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
}

export default function StatsTab() {
  const events = getEvents()

  const totalBeers = events.filter(e => e.type === 'beer').length
  const totalCigs = events.filter(e => e.type === 'cigarette').length
  const totalAvoidMin = totalBeers * MINUTES_PER_BEER + totalCigs * MINUTES_PER_CIGARETTE

  const sportEvents = events.filter(e => e.type === 'sport')
  const totalSportSessions = sportEvents.length
  const totalSportLifeMin = sportEvents.reduce((s, e) => s + calcSportLifeMinutes(e), 0)

  if (events.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-8"
        style={{ minHeight: '70vh' }}
      >
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg font-medium" style={{ color: '#9ca3af' }}>Pas encore de données</p>
        <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
          Commence à logger tes activités pour voir tes stats !
        </p>
      </div>
    )
  }

  // Bar chart: 14 derniers jours (refus uniquement)
  const byDay = {}
  events.forEach(e => {
    const day = e.timestamp.slice(0, 10)
    if (!byDay[day]) byDay[day] = { beers: 0, cigs: 0 }
    if (e.type === 'beer') byDay[day].beers++
    else if (e.type === 'cigarette') byDay[day].cigs++
  })

  const barData = getLast14DayKeys().map(day => ({
    name: shortDate(day),
    Pintes: byDay[day]?.beers ?? 0,
    Clopes: byDay[day]?.cigs ?? 0,
  }))

  // Cumul par jour : refus (perdu évité) + sport (gagné) + bilan
  const sorted = [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  let cumAvoid = 0, cumSport = 0
  const cumByDay = {}

  sorted.forEach(e => {
    const day = e.timestamp.slice(0, 10)
    if (e.type === 'beer') cumAvoid += MINUTES_PER_BEER
    else if (e.type === 'cigarette') cumAvoid += MINUTES_PER_CIGARETTE
    else if (e.type === 'sport') cumSport += calcSportLifeMinutes(e)
    cumByDay[day] = { avoid: cumAvoid, sport: cumSport, net: Math.round(cumSport - cumAvoid) }
  })

  const cumulEntries = Object.entries(cumByDay).sort(([a], [b]) => a.localeCompare(b))

  const combinedLineData = cumulEntries.map(([day, { avoid, sport, net }]) => ({
    name: shortDate(day),
    'Refus': avoid,
    'Sport': sport,
    'Bilan': net,
  }))

  const sportLineData = cumulEntries
    .filter(([, d]) => d.sport > 0)
    .map(([day, { sport }]) => ({
      name: shortDate(day),
      'Min gagnées': sport,
    }))

  const hasSport = totalSportSessions > 0

  return (
    <div className="p-4 pb-4">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#f5f5f5' }}>Statistiques</h2>

      {/* Stat cards — refus */}
      <div className="flex gap-2 mb-2">
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{totalBeers}</div>
          <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>🍺 pintes</div>
        </div>
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{totalCigs}</div>
          <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>🚬 clopes</div>
        </div>
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#061209', border: '1px solid #22c55e' }}>
          <div className="text-lg font-bold leading-tight" style={{ color: '#22c55e' }}>
            {totalAvoidMin > 0 ? formatMinutes(totalAvoidMin) : '—'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>⏱ évités</div>
        </div>
      </div>

      {/* Stat cards — sport */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#0a1628', border: '1px solid #3b82f6' }}>
          <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{totalSportSessions}</div>
          <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>🏃 séances</div>
        </div>
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#0a1628', border: '1px solid #3b82f6' }}>
          <div className="text-lg font-bold leading-tight" style={{ color: '#3b82f6' }}>
            {totalSportLifeMin > 0 ? formatMinutes(totalSportLifeMin) : '—'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>⏱ sport</div>
        </div>
      </div>

      {/* Bar chart : refus 14 jours */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: '#1a1a1a' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#e5e7eb' }}>
          Évitements — 14 derniers jours
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData} barCategoryGap="25%" margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
            <XAxis dataKey="name" tick={TICK} interval={1} />
            <YAxis tick={TICK} allowDecimals={false} width={32} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#222222' }} />
            <Bar dataKey="Pintes" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="Clopes" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>Pintes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>Clopes</span>
          </div>
        </div>
      </div>

      {/* Line chart : bilan cumulé (refus + sport + net) */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: '#1a1a1a' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#e5e7eb' }}>
          Bilan cumulé (minutes)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={combinedLineData} margin={{ top: 4, right: 10, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
            <XAxis dataKey="name" tick={TICK} />
            <YAxis tick={TICK} width={32} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="Refus"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="Sport"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="Bilan"
              stroke="#a3e635"
              strokeWidth={2.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, fill: '#a3e635', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>Refus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5" style={{ backgroundColor: '#3b82f6' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>Sport</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5" style={{ backgroundColor: '#a3e635' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>Bilan net</span>
          </div>
        </div>
      </div>

      {/* Line chart : sport cumulé standalone */}
      {hasSport && (
        <div className="rounded-2xl p-4" style={{ backgroundColor: '#1a1a1a' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#e5e7eb' }}>
            Vie gagnée par le sport (cumulée)
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={sportLineData} margin={{ top: 4, right: 10, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
              <XAxis dataKey="name" tick={TICK} />
              <YAxis tick={TICK} width={32} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="Min gagnées"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
