import React from "react";
import {
  AbsoluteFill,
  Easing,
  getStaticFiles,
  Html5Audio,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Backdrop } from "./components/Backdrop";
import { fadeThrough } from "./components/FadeThrough";
import { GrainOverlay } from "./components/GrainOverlay";
import { media } from "./data";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Path } from "./scenes/Path";
import { Projects } from "./scenes/Projects";
import { Stack } from "./scenes/Stack";
import { colors, motion, sceneFrames } from "./theme";

const scenes = [
  { id: "hook", Component: Hook, frames: sceneFrames.hook },
  { id: "path", Component: Path, frames: sceneFrames.path },
  { id: "stack", Component: Stack, frames: sceneFrames.stack },
  { id: "projects", Component: Projects, frames: sceneFrames.projects },
  { id: "cta", Component: Cta, frames: sceneFrames.cta },
];

/** Musique optionnelle : jouée seulement si activée ET présente dans public/. */
const Music: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const { enabled, file, volume, fadeInFrames, fadeOutFrames } = media.music;
  if (!enabled || !getStaticFiles().some((f) => f.name === file)) {
    return null;
  }
  return (
    <Html5Audio
      src={staticFile(file)}
      volume={(f) =>
        interpolate(
          f,
          [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames],
          [0, volume, volume, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};

export const AxelVideo: React.FC = () => {
  const T = motion.transitionFrames;
  const timing = linearTiming({
    durationInFrames: T,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Backdrop />
      <TransitionSeries>
        {scenes.map(({ id, Component, frames }, i) => {
          const isLast = i === scenes.length - 1;
          // Chaque scène est prolongée de la durée de la transition pour que
          // la suivante démarre pile au timecode prévu par le storyboard.
          return (
            <React.Fragment key={id}>
              <TransitionSeries.Sequence
                name={id}
                durationInFrames={frames + (isLast ? 0 : T)}
              >
                <Component />
              </TransitionSeries.Sequence>
              {isLast ? null : (
                <TransitionSeries.Transition
                  presentation={fadeThrough()}
                  timing={timing}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      <GrainOverlay />
      <Music />
    </AbsoluteFill>
  );
};
