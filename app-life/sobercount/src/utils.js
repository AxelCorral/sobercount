import { SPORT_TYPES } from './constants.js'

export function formatMinutes(minutes) {
  const abs = Math.abs(Math.round(minutes))
  if (abs < 60) return `${abs} min`
  if (abs < 1440) {
    const h = Math.floor(abs / 60)
    const m = abs % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }
  const days = Math.floor(abs / 1440)
  const h = Math.floor((abs % 1440) / 60)
  return h > 0 ? `${days}j ${h}h` : `${days} jours`
}

export function calcSportLifeMinutes(sportEvent) {
  const sport = SPORT_TYPES.find(s => s.id === sportEvent.sport_type_id)
  return Math.round((sportEvent.duration_minutes || 0) * (sport?.ratio ?? 0))
}
