import React, { useState } from 'react'
import { SPORT_TYPES } from '../constants.js'
import { formatMinutes } from '../utils.js'

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120, 180, 240]

const sportShort = label => {
  if (label.includes(' / ')) return label.split(' / ')[0]
  if (label.includes(' (')) return label.split(' (')[0]
  return label
}

export default function SportModal({ onConfirm, onClose }) {
  const [selectedDuration, setSelectedDuration] = useState(45)
  const [customDuration, setCustomDuration] = useState('')
  const [selectedSportId, setSelectedSportId] = useState('running')

  const rawCustom = parseInt(customDuration, 10)
  const duration = customDuration !== '' && rawCustom >= 5
    ? Math.min(rawCustom, 999)
    : selectedDuration

  const sport = SPORT_TYPES.find(s => s.id === selectedSportId)
  const previewMinutes = Math.round(duration * (sport?.ratio ?? 0))

  const handleConfirm = () => {
    if (duration < 5) return
    onConfirm({ sport_type_id: selectedSportId, duration_minutes: duration })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.78)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl"
        style={{
          backgroundColor: '#1a1a1a',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '20px 16px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: '#f5f5f5' }}>
            Séance de sport
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
            style={{ backgroundColor: '#2a2a2a', color: '#9ca3af' }}
          >
            ×
          </button>
        </div>

        {/* Durée */}
        <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#6b7280' }}>
          Combien de temps ?
        </p>
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {DURATION_PRESETS.map(d => {
            const active = selectedDuration === d && customDuration === ''
            return (
              <button
                key={d}
                onClick={() => { setSelectedDuration(d); setCustomDuration('') }}
                className="py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: active ? '#1d3a5c' : '#242424',
                  color: active ? '#60a5fa' : '#6b7280',
                  border: `1px solid ${active ? '#3b82f6' : 'transparent'}`,
                }}
              >
                {d}
              </button>
            )
          })}
        </div>
        <input
          type="number"
          inputMode="numeric"
          placeholder="Autre durée (min)"
          value={customDuration}
          onChange={e => setCustomDuration(e.target.value)}
          min="5"
          max="999"
          className="w-full rounded-xl px-3 py-2 text-sm mb-4"
          style={{
            backgroundColor: '#242424',
            color: '#f5f5f5',
            border: `1px solid ${customDuration !== '' ? '#3b82f6' : '#333'}`,
            outline: 'none',
          }}
        />

        {/* Type de sport */}
        <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#6b7280' }}>
          Quel type d'activité ?
        </p>
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {SPORT_TYPES.map(s => {
            const active = selectedSportId === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSportId(s.id)}
                className="py-2.5 px-3 rounded-xl text-xs font-medium text-left transition-colors"
                style={{
                  backgroundColor: active ? '#1d3a5c' : '#242424',
                  color: active ? '#60a5fa' : '#9ca3af',
                  border: `1px solid ${active ? '#3b82f6' : 'transparent'}`,
                }}
              >
                {s.emoji} {sportShort(s.label)}
              </button>
            )
          })}
        </div>

        {/* Preview */}
        <div
          className="rounded-xl px-4 py-2.5 mb-4 text-center"
          style={{ backgroundColor: '#0d1f3c' }}
        >
          <span className="text-sm font-semibold" style={{ color: '#93c5fd' }}>
            +{formatMinutes(previewMinutes)} de vie gagnées
          </span>
          <span className="text-xs ml-2" style={{ color: '#374151' }}>
            ({duration} min × {sport?.ratio}×)
          </span>
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          disabled={duration < 5}
          className="w-full py-3 rounded-2xl text-sm font-bold transition-opacity"
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            opacity: duration < 5 ? 0.4 : 1,
          }}
        >
          ✅ Valider ma séance
        </button>
      </div>
    </div>
  )
}
