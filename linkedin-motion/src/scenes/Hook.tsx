import React from "react";
import {
  AbsoluteFill,
  Easing,
  getStaticFiles,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DrawLine, DrawPath } from "../components/DrawLine";
import { TypeText } from "../components/TypeText";
import { identity, media } from "../data";
import { useLayout } from "../layout";
import { colors, fonts, motion, sizes } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Photo ronde si public/photo.jpg existe, sinon initiales. */
const Avatar: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hasPhoto = getStaticFiles().some((f) => f.name === media.photo);
  const s = spring({ frame: frame - 2, fps, config: { damping: 16, mass: 0.8 } });
  const ring = interpolate(frame, [4, 30], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const r = size / 2 + 9;
  const c = size / 2 + 12;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
        transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
      }}
    >
      <svg
        width={c * 2}
        height={c * 2}
        style={{ position: "absolute", left: -12, top: -12, overflow: "visible" }}
      >
        <DrawPath
          d={`M ${c} ${c - r} A ${r} ${r} 0 1 1 ${c - 0.01} ${c - r}`}
          progress={ring}
          width={3}
        />
      </svg>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: colors.surface,
          border: `2px solid ${colors.creamFaint}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasPhoto ? (
          <Img
            src={staticFile(media.photo)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: size * 0.4,
              letterSpacing: "-0.02em",
              color: colors.amber,
            }}
          >
            {identity.initials}
          </span>
        )}
      </div>
    </div>
  );
};

/** Petit graphe de pipeline décoratif (coin supérieur droit). */
const PipelineMotif: React.FC<{ x: number; y: number; scale: number }> = ({
  x,
  y,
  scale,
}) => {
  const frame = useCurrentFrame();
  const nodes: Array<[number, number]> = [
    [0, 40],
    [110, 0],
    [110, 96],
    [220, 48],
    [320, 48],
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ];
  const nodeAt = (i: number) => 6 + i * 5;
  return (
    <svg
      width={340 * scale}
      height={110 * scale}
      viewBox="-10 -10 340 116"
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
    >
      {edges.map(([a, b]) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        const mid = (x1 + x2) / 2;
        return (
          <DrawPath
            key={`${a}-${b}`}
            d={`M ${x1} ${y1} C ${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`}
            progress={interpolate(frame, [nodeAt(a), nodeAt(b) + 4], [0, 1], clamp)}
            color={colors.creamFaint}
            width={2}
          />
        );
      })}
      {nodes.map(([nx, ny], i) => {
        const p = interpolate(frame, [nodeAt(i), nodeAt(i) + 6], [0, 1], clamp);
        const last = i === nodes.length - 1;
        return (
          <circle
            key={i}
            cx={nx}
            cy={ny}
            r={last ? 9 : 7}
            fill={last ? colors.amber : colors.bg}
            stroke={last ? colors.amber : colors.sage}
            strokeWidth={2.5}
            opacity={p}
            transform={`translate(${nx} ${ny}) scale(${p}) translate(${-nx} ${-ny})`}
          />
        );
      })}
    </svg>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();

  const heroSize = L.pick(sizes.hero.portrait, sizes.hero.square);
  const lines = [identity.firstName, identity.lastName];
  const nameStart = 3;
  const letterCount = lines.join("").length;
  const nameDone = nameStart + letterCount * motion.letterStagger + 8;
  const roleStart = Math.round(nameDone - 10);

  const underline = interpolate(frame, [nameDone - 14, nameDone + 6], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  let letterIndex = 0;

  return (
    <AbsoluteFill>
      <PipelineMotif
        x={L.width - L.margin - 340 * L.pick(1, 0.85)}
        y={L.pick(L.margin + 40, L.margin + 20)}
        scale={L.pick(1, 0.85)}
      />
      <AbsoluteFill
        style={{
          padding: L.margin,
          justifyContent: "center",
          paddingTop: L.pick(L.margin + 60, L.margin),
        }}
      >
        <Avatar size={L.pick(176, 148)} />
        <div
          style={{
            marginTop: L.pick(70, 44),
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: heroSize,
            lineHeight: 0.94,
            letterSpacing: "-0.035em",
            color: colors.cream,
          }}
        >
          {lines.map((word) => (
            <div key={word} style={{ display: "flex" }}>
              {word.split("").map((ch) => {
                const i = letterIndex++;
                const s = spring({
                  frame: frame - (nameStart + i * motion.letterStagger),
                  fps,
                  config: { damping: 200 },
                  durationInFrames: 14,
                });
                return (
                  <span
                    key={`${ch}-${i}`}
                    style={{
                      display: "inline-block",
                      opacity: s,
                      transform: `translateY(${(1 - s) * 0.32 * heroSize}px)`,
                      filter: `blur(${(1 - s) * 10}px)`,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <DrawLine
          length={L.pick(430, 360)}
          thickness={6}
          progress={underline}
          style={{ marginTop: L.pick(38, 28) }}
        />
        <div
          style={{
            marginTop: L.pick(38, 30),
            fontFamily: fonts.mono,
            fontSize: sizes.mono,
            color: colors.cream,
            letterSpacing: "-0.01em",
          }}
        >
          <TypeText text={identity.role} start={roleStart} cursor />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
