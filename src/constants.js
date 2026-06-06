// Données épidémiologiques reconnues — NE PAS MODIFIER sans vérifier les sources

// 1 cigarette = 11 minutes de vie perdue
// Source : Doll R, Peto R et al. "Mortality in relation to smoking: 50 years' observations
//          on male British doctors." BMJ 2004;328:1519. + méta-analyses Shaw & al.
export const MINUTES_PER_CIGARETTE = 11

// 1 pinte de bière (568 ml, ~5% ABV) = 30 minutes de vie perdue
// Source : GBD 2016 Alcohol Collaborators. "Alcohol use and burden for 195 countries and
//          territories, 1990–2016." The Lancet, Vol. 392, Issue 10152, Sept. 2018.
//          (calcul : ~2.3 unités standard × ~13 min/unité)
export const MINUTES_PER_BEER = 15

export const SOURCES = {
  cigarette: 'Doll & Peto, BMJ 2004',
  beer: 'The Lancet, GBD 2016',
}
