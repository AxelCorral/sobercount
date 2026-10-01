import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, motion } from "../theme";

/** Nombre de frames nécessaires pour taper `text`. */
export const typeDuration = (
  text: string,
  charsPerFrame = motion.typeCharsPerFrame,
) => Math.ceil(text.length / charsPerFrame);

type Props = {
  text: string;
  /** Frame (locale) à laquelle la frappe commence. */
  start: number;
  charsPerFrame?: number;
  /** Affiche un curseur pendant la frappe, qui clignote deux fois ensuite. */
  cursor?: boolean;
  cursorColor?: string;
  style?: React.CSSProperties;
};

/**
 * Texte « machine à écrire ». La partie pas encore tapée reste dans le
 * flux (invisible) pour que la mise en page ne bouge pas pendant la frappe.
 */
export const TypeText: React.FC<Props> = ({
  text,
  start,
  charsPerFrame = motion.typeCharsPerFrame,
  cursor = false,
  cursorColor = colors.amber,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - start;
  const count = Math.max(
    0,
    Math.min(text.length, Math.floor(elapsed * charsPerFrame)),
  );
  const sinceDone = frame - (start + typeDuration(text, charsPerFrame));
  const blinkFrames = 8;
  const showCursor =
    cursor &&
    elapsed >= 0 &&
    (sinceDone < 0 ||
      (sinceDone < blinkFrames * 4 &&
        Math.floor(sinceDone / blinkFrames) % 2 === 1));

  return (
    <span style={{ whiteSpace: "pre-wrap", ...style }}>
      {text.slice(0, count)}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          width: 0,
          height: 0,
        }}
      >
        {showCursor ? (
          <span
            style={{
              position: "absolute",
              left: "0.08em",
              bottom: "-0.2em",
              width: "0.5em",
              height: "1.05em",
              backgroundColor: cursorColor,
            }}
          />
        ) : null}
      </span>
      <span style={{ opacity: 0 }}>{text.slice(count)}</span>
    </span>
  );
};
