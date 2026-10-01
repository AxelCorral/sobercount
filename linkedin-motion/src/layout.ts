import { useVideoConfig } from "remotion";
import { sizes } from "./theme";

/**
 * Infos de mise en page partagées par les deux formats (4:5 et 1:1).
 * `pick(portrait, square)` choisit une valeur selon le format courant.
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const square = height / width < 1.15;
  const margin = sizes.safeMargin;
  return {
    width,
    height,
    square,
    margin,
    contentWidth: width - margin * 2,
    contentHeight: height - margin * 2,
    pick: <T,>(portrait: T, sq: T): T => (square ? sq : portrait),
  };
};

export type Layout = ReturnType<typeof useLayout>;
