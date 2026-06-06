// Couche d'abstraction des données — pour migrer vers Supabase/Neon : modifier uniquement ce fichier.
// Contrat : chaque événement = { id: string, type: 'beer'|'cigarette', timestamp: ISO8601 }

const KEY = 'sobercount_events'

export const getEvents = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const addEvent = (type) => {
  try {
    const events = getEvents()
    const event = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
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
