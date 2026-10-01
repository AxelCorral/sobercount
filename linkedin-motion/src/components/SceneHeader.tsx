import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useLayout } from "../layout";
import { fr } from "../text";
import { colors, fonts, sizes } from "../theme";
import { DrawLine } from "./DrawLine";

type Props = {
  /** Grand titre en Fraunces. */
  title?: string;
  /** Petit libellé mono à côté du trait ambré. */
  label?: string;
  /** Frame (locale) d'apparition. */
  start?: number;
  titleSize?: number;
};

/** En-tête de scène : trait ambré qui se dessine + titre / libellé. */
export const SceneHeader: React.FC<Props> = ({
  title,
  label,
  start = 2,
  titleSize,
}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const ease = Easing.bezier(0.22, 1, 0.36, 1);
  const line = interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const reveal = interpolate(frame, [start + 3, start + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <DrawLine length={64} thickness={4} progress={line} />
        {label ? (
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: sizes.mono,
              color: colors.amber,
              opacity: reveal,
              transform: `translateX(${(1 - reveal) * -16}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {fr(label)}
          </span>
        ) : null}
      </div>
      {title ? (
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: titleSize ?? L.pick(sizes.title.portrait, sizes.title.square),
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: colors.cream,
            opacity: reveal,
            transform: `translateY(${(1 - reveal) * 28}px)`,
          }}
        >
          {fr(title)}
        </div>
      ) : null}
    </div>
  );
};
