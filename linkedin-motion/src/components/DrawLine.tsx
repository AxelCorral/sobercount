import React from "react";
import { colors } from "../theme";

type PathProps = {
  d: string;
  /** 0 → rien, 1 → tracé complet. */
  progress: number;
  color?: string;
  width?: number;
  opacity?: number;
  linecap?: "round" | "butt" | "square";
};

/** Un chemin SVG qui se dessine (à placer dans un <svg>). */
export const DrawPath: React.FC<PathProps> = ({
  d,
  progress,
  color = colors.amber,
  width = 2,
  opacity = 1,
  linecap = "round",
}) => {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0) {
    return null;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinecap={linecap}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
  );
};

type LineProps = {
  length: number;
  progress: number;
  thickness?: number;
  color?: string;
  vertical?: boolean;
  /** Le trait part de la fin (droite / bas) au lieu du début. */
  reverse?: boolean;
  style?: React.CSSProperties;
};

/** Trait droit qui se dessine, utilisable directement dans la mise en page. */
export const DrawLine: React.FC<LineProps> = ({
  length,
  progress,
  thickness = 2,
  color = colors.amber,
  vertical = false,
  reverse = false,
  style,
}) => {
  const half = thickness / 2;
  const [a, b] = reverse ? [length, 0] : [0, length];
  const d = vertical ? `M ${half} ${a} V ${b}` : `M ${a} ${half} H ${b}`;
  return (
    <svg
      width={vertical ? thickness : length}
      height={vertical ? length : thickness}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <DrawPath
        d={d}
        progress={progress}
        color={color}
        width={thickness}
        linecap="butt"
      />
    </svg>
  );
};
