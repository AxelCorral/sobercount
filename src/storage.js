// Couche d'abstraction des données — pour migrer vers Supabase/Neon : modifier uniquement ce fichier.
// Contrat beer/cig   : { id, type, timestamp }
// Contrat sport      : { id, type:'sport', timestamp, sport_type_id, duration_minutes }
// Contrat hydration  : { id, type:'hydration', timestamp, date:'YYYY-MM-DD' }
// Contrat profil     : { prenom, sexe:'homme'|'femme'|'autre', age, poids, taille }

const KEY = 'sobercount_events'
const PROFILE_KEY = 'sobercount_profile'

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

    if (type === 'hydration') {
      const date = options.date || new Date().toISOString().slice(0, 10)
      const idx = events.findIndex(e => e.type === 'hydration' && e.date === date)
      if (idx !== -1) {
        events.splice(idx, 1)
        localStorage.setItem(KEY, JSON.stringify(events))
        return null // toggle off
      }
      const event = {
        id: crypto.randomUUID(),
        type: 'hydration',
        timestamp: new Date().toISOString(),
        date,
      }
      events.push(event)
      localStorage.setItem(KEY, JSON.stringify(events))
      return event
    }

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

export const isHydrationDoneToday = () => {
  const today = new Date().toISOString().slice(0, 10)
  return getEvents().some(e => e.type === 'hydration' && e.date === today)
}

export const getProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {}
}

export const clearAll = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}
