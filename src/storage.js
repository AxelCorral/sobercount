// Couche d'abstraction des données — pour migrer vers Supabase/Neon : modifier uniquement ce fichier.
// Contrat beer/cig : { id, type, timestamp }
// Contrat sport    : { id, type:'sport', timestamp, sport_type_id, duration_minutes }

const KEY = 'sobercount_events'

export const getEvents = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const addEvent = (type, options = {}) => {
  try {
    const events = getEvents()
    const event = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
      ...options,
    }
    events.push(event)
    localStorage.setItem(KEY, JSON.stringify(events))
    return event
  } catch {
    return null
  }
}

export const clearAll = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // localStorage indisponible ou plein — silencieux
  }
}
