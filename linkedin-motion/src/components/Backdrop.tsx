import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

/**
 * Fond commun à toutes les scènes : grille de points qui dérive lentement,
 * halo ambré et repères de coupe dans les coins (esprit éditorial).
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const grid = 54;
  const drift = interpolate(frame, [0, durationInFrames], [0, grid]);
  const glowX = interpolate(t, [0, 1], [78, 30]);
  const glowY = interpolate(t, [0, 1], [18, 70]);

  const mark = 34; // longueur des repères de coupe
  const inset = 40;
  const corners: Array<[number, number, number, number]> = [
    [inset, inset, 1, 1],
    [width - inset, inset, -1, 1],
    [inset, height - inset, 1, -1],
    [width - inset, height - inset, -1, -1],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(224, 164, 88, 0.11), rgba(224, 164, 88, 0) 58%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${colors.creamGhost} 1.6px, transparent 2px)`,
          backgroundSize: `${grid}px ${grid}px`,
          backgroundPosition: `${drift * 0.5}px ${-drift}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(20, 17, 16, 0) 55%, rgba(10, 8, 7, 0.55) 100%)",
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {corners.map(([x, y, dx, dy]) => (
          <path
            key={`${x}-${y}`}
            d={`M ${x} ${y + dy * mark} V ${y} H ${x + dx * mark}`}
            fill="none"
            stroke={colors.amber}
            strokeOpacity={0.45}
            strokeWidth={2}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
