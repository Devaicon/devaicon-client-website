import type { ResolvedTheme } from "@/components/theme/theme";

// Recharts sets fills and strokes as props, so Tailwind classes can't reach
// them. This is the single place chart colour is defined for both themes.
export type ChartPalette = {
  bar: string;
  barToday: string;
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
};

const LIGHT: ChartPalette = {
  bar: "#a3a3a3",
  barToday: "#3d234b",
  grid: "#e5e5e5",
  axis: "#737373",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e5e5e5",
  tooltipText: "#171717",
};

const DARK: ChartPalette = {
  bar: "#525252",
  barToday: "#a78bfa",
  grid: "#262626",
  axis: "#a3a3a3",
  tooltipBg: "#171717",
  tooltipBorder: "#404040",
  tooltipText: "#f5f5f5",
};

export function getPalette(theme: ResolvedTheme): ChartPalette {
  return theme === "dark" ? DARK : LIGHT;
}
