"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_SETTINGS,
  getServerSettings,
  getSettings,
  subscribeSettings,
  writeSettings,
  type LoggerSettings,
  type Scope,
} from "./settings";

type SettingsContextValue = {
  settings: LoggerSettings;
  /** Writes one key; the rest of the record is left as it is. */
  setSetting: <K extends keyof LoggerSettings>(
    key: K,
    value: LoggerSettings[K],
  ) => void;
  reset: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

/**
 * Mounted inside the dashboard rather than the app layout, because these
 * preferences are namespaced by client: a legacy setting must never reach the
 * new tracker, the same way a legacy stopwatch never does.
 */
export function SettingsProvider({
  scope,
  children,
}: {
  scope: Scope;
  children: ReactNode;
}) {
  const subscribe = useCallback(
    (cb: () => void) => subscribeSettings(scope, cb),
    [scope],
  );
  const settings = useSyncExternalStore(
    subscribe,
    useCallback(() => getSettings(scope), [scope]),
    getServerSettings,
  );

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      // Read through getSettings rather than closing over `settings`, so two
      // writes in the same tick cannot drop the first one's change.
      setSetting: (key, next) =>
        writeSettings(scope, { ...getSettings(scope), [key]: next }),
      reset: () => writeSettings(scope, DEFAULT_SETTINGS),
    }),
    [settings, scope],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useLoggerSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useLoggerSettings must be used within a SettingsProvider");
  }
  return ctx;
}
