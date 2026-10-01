import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DrawLine } from "../components/DrawLine";
import { ProjectCard } from "../components/ProjectCard";
import { SceneHeader } from "../components/SceneHeader";
import { projects, projectsFootnote, sections } from "../data";
import { useLayout } from "../layout";
import { fr } from "../text";
import { colors, fonts, motion, sizes } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Projects: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const P = motion.projectCardFrames;
  const push = motion.projectPushFrames;
  const n = projects.length;

  // Les cartes sont posées sur une bande horizontale qui glisse d'une
  // carte à la suivante, centrée sur chaque changement (k × P).
  const cardW = L.contentWidth;
  const stride = cardW + L.margin;
  let position = 0;
  for (let k = 1; k < n; k++) {
    position += interpolate(frame, [k * P - push / 2, k * P + push / 2], [0, 1], {
      ...clamp,
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
  }

  const headerH = 50; // ligne du libellé mono
  const segmentsGap = L.pick(36, 28);
  const footnoteH = L.pick(120, 112);
  const cardTop = L.margin + headerH + segmentsGap + 6 + L.pick(44, 30);
  const cardH = L.height - L.margin - footnoteH - cardTop;

  const footIn = interpolate(frame, [12, 26], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <AbsoluteFill>
      {/* En-tête + barre de progression façon « stories » */}
      <div
        style={{
          position: "absolute",
          left: L.margin,
          top: L.margin,
          width: cardW,
          display: "flex",
          flexDirection: "column",
          gap: segmentsGap,
        }}
      >
        <SceneHeader label={sections.projects.label} start={4} />
        <div style={{ display: "flex", gap: 12 }}>
          {projects.map((p, k) => {
            const fill = interpolate(frame, [k * P, (k + 1) * P], [0, 1], clamp);
            return (
              <div
                key={p.title}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.creamFaint,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${fill * 100}%`,
                    height: "100%",
                    backgroundColor: colors.amber,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bande de cartes */}
      <div
        style={{
          position: "absolute",
          left: L.margin,
          top: cardTop,
          display: "flex",
          gap: L.margin,
          transform: `translateX(${-position * stride}px)`,
        }}
      >
        {projects.map((p, k) => (
          <ProjectCard
            key={p.title}
            project={p}
            index={k}
            total={n}
            appearAt={k === 0 ? 4 : k * P - push / 2}
            width={cardW}
            height={cardH}
          />
        ))}
      </div>

      {/* Rappel en bas de scène */}
      <div
        style={{
          position: "absolute",
          left: L.margin,
          bottom: L.margin,
          width: cardW,
          height: footnoteH,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 18,
          opacity: footIn,
          transform: `translateY(${(1 - footIn) * 16}px)`,
        }}
      >
        <DrawLine length={cardW} progress={footIn} color={colors.creamFaint} />
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: sizes.mono,
            lineHeight: 1.25,
            color: colors.creamSoft,
            textWrap: "balance",
          }}
        >
          {projectsFootnote.startsWith("+") ? (
            <>
              <span style={{ color: colors.amber }}>+</span>
              {fr(projectsFootnote.slice(1))}
            </>
          ) : (
            fr(projectsFootnote)
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
