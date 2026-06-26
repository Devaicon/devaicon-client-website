export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

/** localStorage key for the persisted theme preference. */
export const THEME_STORAGE_KEY = "devaicon-theme";

/** Dark is the default when nothing is stored yet. */
export const DEFAULT_THEME: Theme = "dark";

export const THEMES: Theme[] = ["light", "dark", "system"];
