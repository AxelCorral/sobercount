import React, { useMemo } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type FadeThroughProps = {
  /** Décalage vertical pendant la transition (px). */
  shift?: number;
};

/**
 * Transition « fondu par le fond » : la scène sortante s'efface et monte
 * légèrement, puis la suivante apparaît. Les deux ne se superposent
 * presque pas, ce qui évite les textes qui se chevauchent.
 */
const FadeThroughPresentation: React.FC<
  TransitionPresentationComponentProps<FadeThroughProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const shift = passedProps.shift ?? 18;
  const entering = presentationDirection === "entering";
  const style = useMemo((): React.CSSProperties => {
    const p = presentationProgress;
    const opacity = entering
      ? interpolate(p, [0.4, 1], [0, 1], { extrapolateLeft: "clamp" })
      : interpolate(p, [0, 0.6], [1, 0], { extrapolateRight: "clamp" });
    const y = entering ? (1 - p) * shift : -p * shift;
    return { opacity, transform: `translateY(${y}px)` };
  }, [entering, presentationProgress, shift]);
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const fadeThrough = (
  props: FadeThroughProps = {},
): TransitionPresentation<FadeThroughProps> => ({
  component: FadeThroughPresentation,
  props,
});
