import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Badge } from "../components/Badge";
import { DrawLine, DrawPath } from "../components/DrawLine";
import { SceneHeader } from "../components/SceneHeader";
import { path, sections } from "../data";
import { useLayout } from "../layout";
import { fr } from "../text";
import { colors, fonts, sizes } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const pad2 = (n: number) => String(n).padStart(2, "0");

export const Path: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  // La ligne se trace de gauche à droite ; chaque jalon s'allume à son passage.
  const lineStart = 10;
  const lineEnd = 46;
  const line = interpolate(frame, [lineStart, lineEnd], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const n = path.length;
  const steps = path.map((_, i) => (n === 1 ? 0 : i / (n - 1)));
  const litAt = steps.map((s) => lineStart + s * (lineEnd - lineStart));

  const w = L.contentWidth;
  const inset = 26;
  const lineY = 78;
  const nodeX = steps.map((s) => inset + s * (w - inset * 2));

  return (
    <AbsoluteFill
      style={{
        padding: L.margin,
        justifyContent: "center",
        gap: L.pick(64, 40),
      }}
    >
      <SceneHeader title={sections.path.title} start={4} />

      {/* Timeline horizontale */}
      <svg width={w} height={lineY + 30} style={{ overflow: "visible" }}>
        <line
          x1={inset}
          x2={w - inset}
          y1={lineY}
          y2={lineY}
          stroke={colors.creamFaint}
          strokeWidth={2}
        />
        <DrawPath
          d={`M ${inset} ${lineY} H ${w - inset}`}
          progress={line}
          width={4}
          linecap="butt"
        />
        {nodeX.map((x, i) => {
          const lit = interpolate(frame, [litAt[i], litAt[i] + 6], [0, 1], clamp);
          const halo = interpolate(frame, [litAt[i], litAt[i] + 20], [0, 1], clamp);
          return (
            <g key={x}>
              {halo > 0 && halo < 1 ? (
                <circle
                  cx={x}
                  cy={lineY}
                  r={16 + halo * 26}
                  fill="none"
                  stroke={colors.amber}
                  strokeWidth={2}
                  opacity={1 - halo}
                />
              ) : null}
              <circle
                cx={x}
                cy={lineY}
                r={15}
                fill={lit > 0.5 ? colors.amber : colors.bg}
                stroke={lit > 0 ? colors.amber : colors.creamFaint}
                strokeWidth={3}
              />
              <text
                x={x}
                y={lineY - 38}
                textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                dx={i === 0 ? -inset + 4 : i === n - 1 ? inset - 4 : 0}
                fontFamily={fonts.mono}
                fontSize={sizes.mono}
                fill={lit > 0 ? colors.amber : colors.creamSoft}
                opacity={interpolate(frame, [4, 14], [0, 1], clamp)}
              >
                {pad2(i + 1)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Jalons */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {path.map((m, i) => {
          const start = litAt[i] + 2;
          const p = interpolate(frame, [start, start + 12], [0, 1], {
            ...clamp,
            easing: ease,
          });
          const rule = interpolate(frame, [start, start + 16], [0, 1], {
            ...clamp,
            easing: ease,
          });
          return (
            <div key={m.title} style={{ display: "flex", flexDirection: "column" }}>
              <DrawLine
                length={w}
                progress={rule}
                color={colors.creamFaint}
                thickness={2}
              />
              <div
                style={{
                  display: "flex",
                  gap: 28,
                  padding: `${L.pick(28, 20)}px 0`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 40}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: sizes.mono,
                    lineHeight: 1.3,
                    color: colors.amber,
                    width: 64,
                    flexShrink: 0,
                    paddingTop: 2,
                  }}
                >
                  {pad2(i + 1)}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: L.pick(14, 10),
                  }}
                >
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontWeight: 600,
                      fontSize: L.pick(46, 44),
                      lineHeight: 1.2,
                      color: colors.cream,
                      letterSpacing: "-0.01em",
                      textWrap: "balance",
                    }}
                  >
                    {fr(m.title)}
                  </div>
                  {m.detail ? (
                    <div
                      style={{
                        fontFamily: fonts.body,
                        fontSize: sizes.body,
                        lineHeight: 1.25,
                        color: colors.creamSoft,
                      }}
                    >
                      {fr(m.detail)}
                    </div>
                  ) : null}
                  {m.badge ? (
                    <Badge
                      label={fr(m.badge)}
                      appearAt={start + 8}
                      variant="solid"
                      shape="pill"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
