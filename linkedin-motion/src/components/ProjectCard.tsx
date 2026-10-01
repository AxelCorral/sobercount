import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useLayout } from "../layout";
import { fr } from "../text";
import { colors, fonts, motion, sizes } from "../theme";
import { Badge } from "./Badge";
import { DrawLine } from "./DrawLine";

type Project = { title: string; description: string; tags: string[] };

type Props = {
  project: Project;
  index: number;
  total: number;
  /** Frame (locale à la scène) à laquelle la carte arrive à l'écran. */
  appearAt: number;
  width: number;
  height: number;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

export const ProjectCard: React.FC<Props> = ({
  project,
  index,
  total,
  appearAt,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const t = frame - appearAt;
  const ease = Easing.bezier(0.22, 1, 0.36, 1);
  const rise = (delay: number) => {
    const p = interpolate(t, [delay, delay + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    });
    return { opacity: p, transform: `translateY(${(1 - p) * 22}px)` };
  };
  const rule = interpolate(t, [2, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const padding = L.pick(52, 44);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        boxSizing: "border-box",
        padding,
        borderRadius: 20,
        backgroundColor: colors.surface,
        border: `2px solid ${colors.creamFaint}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Filet ambré sur le bord gauche */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: padding,
          width: 5,
          height: 120,
          backgroundColor: colors.amber,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontFamily: fonts.mono,
            fontSize: sizes.mono,
            color: colors.amber,
          }}
        >
          <span>{`${pad2(index + 1)} / ${pad2(total)}`}</span>
          <DrawLine
            length={width - padding * 2 - 240}
            progress={rule}
            color={colors.creamFaint}
          />
        </div>
        <div
          style={{
            marginTop: L.pick(40, 26),
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: L.pick(sizes.title.portrait, sizes.title.square),
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: colors.cream,
            textWrap: "balance",
            ...rise(0),
          }}
        >
          {fr(project.title)}
        </div>
        <div
          style={{
            marginTop: L.pick(30, 20),
            fontFamily: fonts.body,
            fontSize: sizes.body,
            lineHeight: 1.32,
            color: colors.creamSoft,
            textWrap: "pretty",
            ...rise(3),
          }}
        >
          {fr(project.description)}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {project.tags.map((tag, i) => (
          <Badge
            key={tag}
            label={tag}
            appearAt={appearAt + 5 + i * motion.stagger}
            variant={i === 0 ? "sage" : "outline"}
          />
        ))}
      </div>
    </div>
  );
};
