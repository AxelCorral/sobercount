/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
// Qualité des images intermédiaires : évite les aplats/banding sur fond sombre.
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// H.264, compatible LinkedIn.
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
