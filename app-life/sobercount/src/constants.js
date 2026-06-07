// Données épidémiologiques reconnues — NE PAS MODIFIER sans vérifier les sources

// 1 cigarette = 11 minutes de vie perdue
// Source : Doll R, Peto R et al. "Mortality in relation to smoking: 50 years' observations
//          on male British doctors." BMJ 2004;328:1519. + méta-analyses Shaw & al.
export const MINUTES_PER_CIGARETTE = 11

// 1 pinte de bière (568 ml, ~5% ABV) = 15 minutes de vie perdue
// Source : GBD 2016 Alcohol Collaborators. "Alcohol use and burden for 195 countries and
//          territories, 1990–2016." The Lancet, Vol. 392, Issue 10152, Sept. 2018.
export const MINUTES_PER_BEER = 15

export const SOURCES = {
  cigarette: 'Doll & Peto, BMJ 2004',
  beer: 'The Lancet, GBD 2016',
}

// Minutes de vie gagnées par minute d'exercice pratiqué (ratio)
// Sources : DC Lee et al., Progress in Cardiovascular Diseases 2017
// (55 137 adultes, 15 ans de suivi) ; I-Min Lee et al., PLOS Medicine 2012
// (~650 000 participants, 6 cohortes)
export const SPORT_TYPES = [
  {
    id: 'running',
    label: 'Course / Running',
    emoji: '🏃',
    ratio: 7,
    // "1 hour of running adds ~7 hours to life expectancy" — DC Lee et al. 2017
  },
  {
    id: 'cardio',
    label: 'Cardio (vélo, natation, elliptique)',
    emoji: '🚴',
    ratio: 4.5,
    // Extrapolé réduction mortalité relative au running (12% vs 40%) — I-Min Lee 2012
  },
  {
    id: 'team',
    label: 'Sport collectif / Fitness',
    emoji: '⚽',
    ratio: 4,
    // Activité modérée à vigoureuse — I-Min Lee et al. 2012
  },
  {
    id: 'walking',
    label: 'Marche rapide / Randonnée',
    emoji: '🚶',
    ratio: 3,
    // "1 hour brisk walking adds ~3.2 hours" — I-Min Lee 2012
  },
]

// Vie gagnée par journée bien hydratée
// Source : Dmitrieva et al., eBioMedicine 2023 (NIH/NHLBI)
// Étude sur 11 255 adultes sur 30 ans — hydratation adéquate associée à -21% risque mortalité précoce
// Estimation convertie : ~30 min/jour
export const HYDRATION_LIFE_GAIN_MINUTES = 30

// Calcul de l'objectif hydratation journalier personnalisé
// Source : EFSA (European Food Safety Authority) + National Academy of Medicine
// Formule de base : poids (kg) × 35 ml/kg
export function calculateDailyWaterGoal(profile) {
  if (!profile || !profile.poids) return 2500
  let base = profile.poids * 35
  if (profile.sexe === 'homme') base += 400
  if (profile.age && profile.age < 30) base += 200
  else if (profile.age && profile.age > 55) base -= 200
  return Math.max(1500, Math.min(4000, Math.round(base)))
}

// Seuil minimum de durée de sommeil par tranche d'âge
// Source : National Sleep Foundation (2015), consensus AASM/SRS
// Hirshkowitz M. et al., Sleep Health Journal, 2015
export const SLEEP_DURATION_THRESHOLDS = [
  { maxAge: 17, minHours: 8, label: 'Ados (8-10h recommandées)' },
  { maxAge: 64, minHours: 7, label: 'Adultes (7-9h recommandées)' },
  { maxAge: 99, minHours: 7, label: 'Seniors (7-8h recommandées)' },
]

// Vie gagnée par bonne nuit selon l'âge (en minutes)
// Source : Irish LA et al., Sleep Health Journal 2022
// (étude canadienne, espérance de vie comparée dormeurs courts vs recommandés)
// +1.2 an à 20 ans → ~35 min/nuit ; gains décroissants avec l'âge
// Méta-analyse GeroScience 2025 : 14% de hausse de mortalité <7h/nuit
export const SLEEP_LIFE_GAIN_BY_AGE = [
  { maxAge: 30, minutesPerNight: 35 },
  { maxAge: 55, minutesPerNight: 30 },
  { maxAge: 64, minutesPerNight: 25 },
  { maxAge: 99, minutesPerNight: 20 },
]

export function getSleepThreshold(age) {
  if (!age) return 7
  return SLEEP_DURATION_THRESHOLDS.find(t => age <= t.maxAge)?.minHours || 7
}

export function getSleepLifeGain(age) {
  if (!age) return 30
  return SLEEP_LIFE_GAIN_BY_AGE.find(t => age <= t.maxAge)?.minutesPerNight || 30
}
