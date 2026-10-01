// Vérifie durée (17–19 s) et poids (< 50 Mo) des vidéos rendues.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

const files = ["out/axel-linkedin.mp4", "out/axel-linkedin-square.mp4"];
let ok = true;

for (const file of files) {
  if (!existsSync(file)) {
    console.log(`✗ ${file} : introuvable (lance d'abord npm run render:all)`);
    ok = false;
    continue;
  }
  const raw = execFileSync(
    "npx",
    [
      "remotion",
      "ffprobe",
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=codec_name,width,height,r_frame_rate",
      "-of",
      "json",
      file,
    ],
    { encoding: "utf8", shell: process.platform === "win32" },
  );
  const info = JSON.parse(raw);
  const duration = Number(info.format.duration);
  const sizeMb = statSync(file).size / 1024 / 1024;
  const video = info.streams.find((s) => s.width);
  const good = duration >= 17 && duration <= 19 && sizeMb < 50;
  ok &&= good;
  console.log(
    `${good ? "✓" : "✗"} ${file} : ${duration.toFixed(2)} s, ${sizeMb.toFixed(1)} Mo, ` +
      `${video.codec_name} ${video.width}×${video.height} @ ${video.r_frame_rate}`,
  );
}

process.exitCode = ok ? 0 : 1;
