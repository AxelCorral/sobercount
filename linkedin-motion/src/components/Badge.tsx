import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, MONO_ADVANCE, motion, sizes } from "../theme";
import { TypeText } from "./TypeText";

type Variant = "outline" | "solid" | "sage";

/** Dimensions exactes d'un badge (la police mono a une chasse fixe). */
export const badgeMetrics = (label: string, fontSize = sizes.mono) => {
  const padX = Math.round(fontSize * 0.55);
  const padY = Math.round(fontSize * 0.3);
  const border = 2;
  const lineHeight = Math.round(fontSize * 1.25);
  return {
    width: Math.ceil(label.length * fontSize * MONO_ADVANCE) + (padX + border) * 2,
    height: lineHeight + (padY + border) * 2,
    padX,
    padY,
    border,
    lineHeight,
  };
};

const palette: Record<
  Variant,
  { bg: string; fg: string; border: string }
> = {
  outline: { bg: colors.surface, fg: colors.cream, border: colors.creamFaint },
  sage: { bg: "transparent", fg: colors.sage, border: colors.sage },
  solid: { bg: colors.amber, fg: colors.ink, border: colors.amber },
};

type Props = {
  label: string;
  /** Frame (locale) d'apparition. */
  appearAt: number;
  variant?: Variant;
  /** Texte tapé façon machine à écrire. */
  typed?: boolean;
  /** Frame à laquelle le badge « pulse » une fois. */
  pulseAt?: number;
  shape?: "tag" | "pill";
  fontSize?: number;
  style?: React.CSSProperties;
};

export const Badge: React.FC<Props> = ({
  label,
  appearAt,
  variant = "outline",
  typed = false,
  pulseAt,
  shape = "tag",
  fontSize = sizes.mono,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = badgeMetrics(label, fontSize);
  const c = palette[variant];

  const pop = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 14, stiffness: 170, mass: 0.7 },
  });
  const opacity = interpolate(frame - appearAt, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsation unique : léger gonflement + onde qui s'élargit puis s'efface.
  const pulseT = pulseAt === undefined ? -1 : frame - pulseAt;
  const bump = interpolate(pulseT, [0, 6, 16], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave = interpolate(pulseT, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radius = shape === "pill" ? m.height / 2 : 10;

  return (
    <div
      style={{
        position: "relative",
        width: m.width,
        height: m.height,
        flexShrink: 0,
        opacity,
        transform: `scale(${interpolate(pop, [0, 1], [0.82, 1]) + bump * 0.07})`,
        ...style,
      }}
    >
      {pulseT > 0 && wave < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            border: `3px solid ${colors.amber}`,
            opacity: 0.8 * (1 - wave),
            transform: `scale(${1 + wave * 0.28}, ${1 + wave * 0.9})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          backgroundColor: c.bg,
          border: `${m.border}px solid ${c.border}`,
          padding: `${m.padY}px ${m.padX}px`,
          fontFamily: fonts.mono,
          fontWeight: variant === "solid" ? 500 : 400,
          fontSize,
          lineHeight: `${m.lineHeight}px`,
          color: c.fg,
          whiteSpace: "pre",
        }}
      >
        {typed ? (
          <TypeText
            text={label}
            start={appearAt + 2}
            charsPerFrame={motion.typeCharsPerFrame * 1.4}
            style={{ whiteSpace: "pre" }}
          />
        ) : (
          label
        )}
      </div>
    </div>
  );
};
