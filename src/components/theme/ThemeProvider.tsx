"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "./theme";

type ThemeContextValue = {
  /** The user's chosen preference: "light" | "dark" | "system". */
  theme: Theme;
  /** What is actually applied right now: "light" | "dark". */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ---- preference store (localStorage), exposed via useSyncExternalStore ---- */
const prefListeners = new Set<() => void>();
function emitPref() {
  prefListeners.forEach((l) => l());
}
function subscribePref(cb: () => void) {
  prefListeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    prefListeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
function getPref(): Theme {
  return (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? DEFAULT_THEME;
}
function getPrefServer(): Theme {
  return DEFAULT_THEME;
}

/* ---- OS color-scheme store ---- */
function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function getSystemDarkServer(): boolean {
  return false;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribePref, getPref, getPrefServer);
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    getSystemDark,
    getSystemDarkServer,
  );

  const resolvedTheme: ResolvedTheme =
    theme === "dark" || (theme === "system" && systemDark) ? "dark" : "light";

  // Persist the default once so the preference is saved from the first visit.
  useEffect(() => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      localStorage.setItem(THEME_STORAGE_KEY, DEFAULT_THEME);
    }
  }, []);

  // Keep <html> in sync with the resolved theme.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    emitPref();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
