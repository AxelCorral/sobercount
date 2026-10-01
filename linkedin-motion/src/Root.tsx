import React from "react";
import { Composition } from "remotion";
import { FPS, TOTAL_FRAMES } from "./theme";
import { AxelVideo } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Format principal LinkedIn 4:5 */}
      <Composition
        id="AxelLinkedIn"
        component={AxelVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1350}
      />
      {/* Variante carrée 1:1 — mêmes scènes, mise en page adaptée */}
      <Composition
        id="AxelLinkedInSquare"
        component={AxelVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1080}
      />
    </>
  );
};
