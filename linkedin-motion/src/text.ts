const NNBSP = " "; // espace fine insécable
const NBSP = " "; // espace insécable

/** Typographie française : apostrophes courbes et espaces insécables. */
export const fr = (text: string) =>
  text
    .replace(/'/g, "’")
    .replace(/«\s+/g, `«${NNBSP}`)
    .replace(/\s+([»:;!?])/g, `${NNBSP}$1`)
    .replace(/(\d)\s+(h|min|s)\b/g, `$1${NBSP}$2`)
    .replace(/\s+—\s+/g, `${NBSP}— `);
