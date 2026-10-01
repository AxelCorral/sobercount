// Rend des images fixes de contrôle pour les deux formats.
// Usage : npm run stills            → frames 40, 130, 210, 300, 470, 530
//         npm run stills -- 255 345 → frames supplémentaires
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const defaultFrames = [40, 130, 210, 300, 470, 530];
const extra = process.argv.slice(2).map(Number).filter(Number.isFinite);
const frames = [...defaultFrames, ...extra];

const compositions = [
  { id: "AxelLinkedIn", prefix: "portrait" },
  { id: "AxelLinkedInSquare", prefix: "square" },
];

const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  enableCaching: true,
});

for (const { id, prefix } of compositions) {
  const composition = await selectComposition({ serveUrl, id });
  for (const frame of frames) {
    const output = path.resolve(
      "out/stills",
      `${prefix}-${String(frame).padStart(3, "0")}.png`,
    );
    await renderStill({ serveUrl, composition, frame, output });
    console.log(`✓ ${path.relative(process.cwd(), output)}`);
  }
}
