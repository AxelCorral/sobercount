# linkedin-motion — vidéo LinkedIn d'Axel Corral

Vidéo motion design de 18 s (540 frames à 30 fps) réalisée avec Remotion.

| Composition          | Format      | Sortie                         |
| -------------------- | ----------- | ------------------------------ |
| `AxelLinkedIn`       | 1080 × 1350 | `out/axel-linkedin.mp4`        |
| `AxelLinkedInSquare` | 1080 × 1080 | `out/axel-linkedin-square.mp4` |

## Commandes

```powershell
npm i
npm run dev          # Remotion Studio (aperçu interactif)
npm run stills       # images de contrôle → out/stills/ (frames 40, 130, 210, 300, 470, 530)
npm run render:all   # rend les deux MP4 (H.264)
npm run check        # vérifie durée (17–19 s) et poids (< 50 Mo)
```

## Où modifier quoi

- **Textes** → `src/data.ts` (aucun texte dans les composants).
- **Couleurs, polices, tailles** → `src/theme.ts` (`colors`, `sizes`).
- **Rythme** → `src/theme.ts` : `sceneFrames` (durée de chaque scène),
  `motion.projectCardFrames` (temps par carte projet),
  `motion.typeCharsPerFrame` (vitesse machine à écrire),
  `motion.transitionFrames` (durée des transitions).

## Fichiers optionnels (`public/`)

- `public/photo.jpg` → photo ronde dans la scène 1 (sinon initiales « AC »).
- `public/music.mp3` → musique avec fondu d'entrée et de sortie. Elle n'est
  jouée que si `media.music.enabled` vaut `true` dans `src/data.ts`.

## Structure

```
src/
  theme.ts        couleurs, polices, tailles, durées
  data.ts         tous les textes + slots photo / musique
  layout.ts       adaptation 4:5 / 1:1
  text.ts         typographie française (espaces insécables, apostrophes)
  Root.tsx        les deux compositions
  Video.tsx       enchaînement des scènes, grain, musique
  scenes/         Hook, Path, Stack, Projects, Cta
  components/     Badge, ProjectCard, TypeText, DrawLine, GrainOverlay,
                  Backdrop, SceneHeader, FadeThrough
scripts/          stills.mjs, check-output.mjs
```
