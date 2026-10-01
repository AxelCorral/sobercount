import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

type Props = {
  /** Intensité du grain (0 → invisible). */
  opacity?: number;
  /** Le motif change toutes les N frames. */
  refreshEvery?: number;
};

/** Grain de film léger, généré en SVG (pas d'image externe). */
export const GrainOverlay: React.FC<Props> = ({
  opacity = 0.5,
  refreshEvery = 2,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / refreshEvery) % 97;
  const id = `grain-${seed}`;
  return (
    <AbsoluteFill
      style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}
    >
      <svg width="100%" height="100%">
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          {/* Niveaux de gris opaques : le gris moyen est neutre en « overlay ». */}
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
