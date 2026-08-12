"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { formatHours } from "./format";
import {
  DEFAULT_TIME_FORMAT,
  TIME_FORMAT_STORAGE_KEY,
  type TimeFormat,
} from "./timeFormat";

type TimeFormatContextValue = {
  format: TimeFormat;
  setFormat: (format: TimeFormat) => void;
  /** Renders an hour quantity in the current format. */
  fmt: (hours: number, opts?: { decimals?: number; unit?: boolean }) => string;
};

const TimeFormatContext = createContext<TimeFormatContextValue | null>(null);

/* ---- preference store (localStorage), exposed via useSyncExternalStore ---- */
// Same shape as ThemeProvider: one store, so a change in one tab reaches every
// other tab, and the server snapshot keeps hydration stable.
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === TIME_FORMAT_STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
function getSnapshot(): TimeFormat {
  const stored = localStorage.getItem(TIME_FORMAT_STORAGE_KEY);
  return stored === "human" || stored === "decimal" ? stored : DEFAULT_TIME_FORMAT;
}
function getServerSnapshot(): TimeFormat {
  return DEFAULT_TIME_FORMAT;
}

export function TimeFormatProvider({ children }: { children: ReactNode }) {
  const format = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setFormat = useCallback((next: TimeFormat) => {
    localStorage.setItem(TIME_FORMAT_STORAGE_KEY, next);
    emit();
  }, []);

  const value = useMemo<TimeFormatContextValue>(
    () => ({
      format,
      setFormat,
      fmt: (hours, opts) => formatHours(hours, format, opts),
    }),
    [format, setFormat],
  );

  return (
    <TimeFormatContext.Provider value={value}>
      {children}
    </TimeFormatContext.Provider>
  );
}

export function useTimeFormat(): TimeFormatContextValue {
  const ctx = useContext(TimeFormatContext);
  if (!ctx) {
    throw new Error("useTimeFormat must be used within a TimeFormatProvider");
  }
  return ctx;
}
