/**
 * Tous les textes de la vidéo. Modifie-les ici : les composants n'en
 * contiennent aucun. La typographie française (espaces insécables avant
 * « : » et « », apostrophes courbes) est appliquée automatiquement.
 */

export const identity = {
  firstName: "Axel",
  lastName: "Corral",
  initials: "AC", // affichées si public/photo.jpg est absent
  role: "Data Engineer · Analytics Engineer",
};

/** En-têtes des scènes. */
export const sections = {
  path: { title: "Parcours" },
  stack: { title: "Stack" },
  projects: { label: "Ce que j'ai construit" },
  cta: { title: "Je cherche" },
};

/** Scène 2 — jalons de la timeline (dans l'ordre). */
export const path: Array<{
  title: string;
  detail?: string;
  badge?: string;
}> = [
  { title: "BUT Science des Données", badge: "Major de promotion" },
  {
    title: "Master 2 MIASHS — ISMAG",
    detail: "Université Toulouse Jean Jaurès",
  },
  {
    title: "Alternance Data Analyst / Master Data",
    detail: "DRT (groupe DSM-Firmenich)",
  },
];

/**
 * Scène 3 — stack, rangée par rangée (chaque sous-liste = une rangée du
 * graphe). Une rangée trop large pour l'écran est coupée automatiquement.
 */
export const stackRows: string[][] = [
  ["SQL", "Python", "dbt"],
  ["Power BI / DAX", "Power Automate"],
  ["AWS S3 · Athena", "Git"],
  ["Next.js · TypeScript"],
];

/** Scène 4 — projets (une carte chacun, ~1,5 s par carte). */
export const projects: Array<{
  title: string;
  description: string;
  tags: string[];
}> = [
  {
    title: "football-pipeline",
    description: "Pipeline ML de prédiction de matchs.",
    tags: ["dbt staging/marts", "GitLab CI 5 étapes", "Streamlit"],
  },
  {
    title: "JobTrackr",
    description:
      "Mon « Career Operating System » : ingestion multi-sources, scoring IA, agent automatisé toutes les 4 h.",
    tags: ["Next.js 15", "PostgreSQL Neon", "Vercel"],
  },
  {
    title: "Vers l'Élysée",
    description:
      "Simulateur probabiliste de campagne présidentielle (31 décisions).",
    tags: ["Supabase", "Vercel", "Data Notebook"],
  },
  {
    title: "Retraites COR 2026",
    description:
      "Mini-mémoire open source sur la soutenabilité des retraites.",
    tags: ["Python", "matplotlib", "open source"],
  },
];

export const projectsFootnote =
  "+ pipelines & workflows Power Automate / Power BI en entreprise";

/** Scène 5 — ce que je cherche + contact. */
export const cta = {
  rolePrefix: "Poste junior",
  role: "Data Engineer / Analytics Engineer",
  availability: "Disponible immédiatement",
  location: "Paris / IDF · Europe de l'Ouest",
  links: ["linkedin.com/in/axelcorral", "github.com/AxelCorral"],
};

/** Fichiers optionnels à déposer dans public/. */
export const media = {
  photo: "photo.jpg", // photo ronde de la scène 1 (sinon initiales)
  music: {
    enabled: false, // passe à true après avoir ajouté public/music.mp3
    file: "music.mp3",
    volume: 0.5,
    fadeInFrames: 20,
    fadeOutFrames: 45,
  },
};
