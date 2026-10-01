import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Badge } from "../components/Badge";
import { DrawLine, DrawPath } from "../components/DrawLine";
import { SceneHeader } from "../components/SceneHeader";
import { TypeText, typeDuration } from "../components/TypeText";
import { cta, sections } from "../data";
import { useLayout } from "../layout";
import { fr } from "../text";
import { colors, fonts, sizes } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const useRise = (start: number, distance = 24) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 12], [0, 1], { ...clamp, easing: ease });
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
};

/** Petite flèche géométrique qui se dessine devant chaque lien. */
const LinkArrow: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={30} height={30} viewBox="0 0 30 30" style={{ flexShrink: 0 }}>
    <DrawPath d="M 5 25 L 25 5" progress={progress} width={3} />
    <DrawPath d="M 11 5 H 25 V 19" progress={progress} width={3} />
  </svg>
);

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const roleAt = 12;
  const badgeAt = 24;
  const pulseAt = 34;
  const locationAt = 34;
  const ruleAt = 44;
  const linksAt = 52;
  const linkGap = 8;

  const role = useRise(roleAt);
  const location = useRise(locationAt);
  const rule = interpolate(frame, [ruleAt, ruleAt + 18], [0, 1], { ...clamp, easing: ease });
  const markerScale = interpolate(frame, [locationAt, locationAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });

  return (
    <AbsoluteFill
      style={{
        padding: L.margin,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <SceneHeader
        title={sections.cta.title}
        start={4}
        titleSize={L.pick(124, 104)}
      />

      <div
        style={{
          marginTop: L.pick(40, 28),
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: L.pick(sizes.lead.portrait, sizes.lead.square),
          lineHeight: 1.18,
          letterSpacing: "-0.015em",
          color: colors.cream,
          textWrap: "balance",
          ...role,
        }}
      >
        <span style={{ color: colors.creamSoft, fontWeight: 500 }}>
          {fr(cta.rolePrefix)}
        </span>{" "}
        <span style={{ color: colors.amber }}>{fr(cta.role)}</span>
      </div>

      <div style={{ marginTop: L.pick(48, 32) }}>
        <Badge
          label={fr(cta.availability)}
          appearAt={badgeAt}
          pulseAt={pulseAt}
          variant="solid"
          shape="pill"
        />
      </div>

      <div
        style={{
          marginTop: L.pick(34, 24),
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: fonts.body,
          fontSize: sizes.body,
          color: colors.cream,
          ...location,
        }}
      >
        <svg width={28} height={28} viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
          <circle
            cx={14}
            cy={14}
            r={11}
            fill="none"
            stroke={colors.sage}
            strokeWidth={3}
            transform={`translate(14 14) scale(${markerScale}) translate(-14 -14)`}
          />
          <circle cx={14} cy={14} r={4} fill={colors.sage} />
        </svg>
        {fr(cta.location)}
      </div>

      <DrawLine
        length={L.contentWidth}
        progress={rule}
        color={colors.creamFaint}
        style={{ marginTop: L.pick(56, 36), marginBottom: L.pick(40, 28) }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: L.pick(22, 16) }}>
        {cta.links.map((link, i) => {
          const start =
            linksAt +
            cta.links
              .slice(0, i)
              .reduce((sum, l) => sum + Math.round(typeDuration(l) * 0.55) + linkGap, 0);
          const arrow = interpolate(frame, [start - 4, start + 6], [0, 1], clamp);
          return (
            <div
              key={link}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                fontFamily: fonts.mono,
                fontSize: sizes.mono,
                color: colors.cream,
              }}
            >
              <LinkArrow progress={arrow} />
              <TypeText text={link} start={start} cursor={i === cta.links.length - 1} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
