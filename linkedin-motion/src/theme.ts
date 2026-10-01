import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { projects } from "./data";

/* ------------------------------------------------------------------ */
/*  Polices                                                            */
/* ------------------------------------------------------------------ */

const display = loadFraunces("normal", {
  weights: ["400", "600"],
  subsets: ["latin", "latin-ext"],
});
const body = loadInter("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});
const mono = loadJetBrainsMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});

export const fonts = {
  display: display.fontFamily, // Fraunces : titres
  body: body.fontFamily, // Inter : texte courant
  mono: mono.fontFamily, // JetBrains Mono : tags tech, chiffres
};

/** Chaque glyphe de JetBrains Mono fait exactement 0,6 em de large. */
export const MONO_ADVANCE = 0.6;

/* ------------------------------------------------------------------ */
/*  Palette « Ambré »                                                  */
/* ------------------------------------------------------------------ */

export const colors = {
  bg: "#141110", // fond quasi noir chaud
  surface: "#1C1816", // cartes
  cream: "#F3EBDD", // texte principal
  creamSoft: "rgba(243, 235, 221, 0.74)", // texte secondaire
  creamFaint: "rgba(243, 235, 221, 0.16)", // lignes fines, bordures
  creamGhost: "rgba(243, 235, 221, 0.06)", // grille de fond
  amber: "#E0A458", // accent principal
  amberSoft: "rgba(224, 164, 88, 0.16)",
  copper: "#B9773A", // accent ambre foncé
  sage: "#A3B8A0", // accent secondaire discret
  ink: "#141110", // texte posé sur l'ambre
};

/* ------------------------------------------------------------------ */
/*  Tailles (px) — min. 40 px texte courant, 90 px+ titres             */
/* ------------------------------------------------------------------ */

export const sizes = {
  safeMargin: 96, // rien d'important à moins de 80 px des bords
  hero: { portrait: 212, square: 176 }, // « Axel Corral »
  title: { portrait: 104, square: 92 }, // titres de scène / projets
  lead: { portrait: 60, square: 54 }, // phrase clé du CTA
  body: 42, // texte courant
  mono: 40, // tags, liens, compteurs
};

/* ------------------------------------------------------------------ */
/*  Rythme (frames à 30 fps)                                           */
/* ------------------------------------------------------------------ */

export const FPS = 30;

export const motion = {
  /** Durée des transitions entre scènes (8–12 frames recommandé). */
  transitionFrames: 10,
  /** Vitesse de la machine à écrire, en caractères par frame. */
  typeCharsPerFrame: 1.8,
  /** Décalage entre deux lettres du nom (frames). */
  letterStagger: 1.6,
  /** Décalage entre deux éléments qui apparaissent en cascade (frames). */
  stagger: 3,
  /** Temps d'affichage de chaque carte projet (45 = 1,5 s). */
  projectCardFrames: 45,
  /** Durée du glissement d'une carte projet à la suivante. */
  projectPushFrames: 12,
};

/** Durée de chaque scène (frames). Le total donne la durée de la vidéo. */
export const sceneFrames = {
  hook: 75, // 0 → 2,5 s
  path: 90, // 2,5 → 5,5 s
  stack: 75, // 5,5 → 8 s
  projects: motion.projectCardFrames * projects.length, // 8 → 14 s
  cta: 120, // 14 → 18 s
};

export const TOTAL_FRAMES = Object.values(sceneFrames).reduce(
  (sum, d) => sum + d,
  0,
);
