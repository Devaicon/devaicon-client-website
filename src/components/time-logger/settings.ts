/**
 * Behaviour preferences for the time logger, as opposed to the display-only
 * theme and time-format choices that live one level up in the app layout.
 *
 * These are browser-scoped rather than account-scoped. They describe how this
 * machine's input devices should behave — whether a wheel over the calendar
 * steps the month, whether saving an entry starts the timer — and the account
 * preferences endpoint only understands overview cards. Mirroring the stopwatch
 * store's shape keeps the read path identical: a schema-stamped envelope, a
 * memory fallback for private browsing, and an external store so a change in
 * one tab reaches every other one.
 */

export type LoggerSettings = {
  /** Start the stopwatch the moment an entry is saved. */
  autoStartStopwatch: boolean;
  /** Let a mouse wheel over the calendar step between months. */
  calendarWheelScroll: boolean;
};

export const DEFAULT_SETTINGS: LoggerSettings = {
  // Off by default: a timer nobody asked for is a timer that runs all night.
  autoStartStopwatch: false,
  // On by default, which is how the calendar has always behaved.
  calendarWheelScroll: true,
};

export type Scope = "new" | "legacy";

const SCHEMA = 1;

function settingsKey(scope: Scope) {
  return `devaicon.settings.${scope}.v1`;
}

let availability: boolean | null = null;

function storageAvailable(): boolean {
  if (availability !== null) return availability;
  try {
    const probe = "__devaicon_settings_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    availability = true;
  } catch {
    availability = false;
  }
  return availability;
}

function rawOf(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { schema?: number; data?: unknown };
    return parsed?.schema === SCHEMA ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * Reads one setting at a time, so a payload missing a key added in a later
 * release falls back to that key's default instead of being thrown away whole.
 */
export function sanitizeSettings(raw: unknown): LoggerSettings {
  if (typeof raw !== "object" || raw === null) return DEFAULT_SETTINGS;
  const r = raw as Record<string, unknown>;
  const bool = (v: unknown, fallback: boolean) =>
    typeof v === "boolean" ? v : fallback;
  return {
    autoStartStopwatch: bool(
      r.autoStartStopwatch,
      DEFAULT_SETTINGS.autoStartStopwatch,
    ),
    calendarWheelScroll: bool(
      r.calendarWheelScroll,
      DEFAULT_SETTINGS.calendarWheelScroll,
    ),
  };
}

const memory = new Map<Scope, LoggerSettings>();

/* getSnapshot must be referentially stable or React re-renders forever, so the
   parsed value is cached against the raw string that produced it. */
type Cached = { raw: string | null; value: LoggerSettings };
const cache = new Map<Scope, Cached>();

export function getSettings(scope: Scope): LoggerSettings {
  if (!storageAvailable()) return memory.get(scope) ?? DEFAULT_SETTINGS;
  const raw = rawOf(settingsKey(scope));
  const cached = cache.get(scope);
  if (cached && cached.raw === raw) return cached.value;
  const value = sanitizeSettings(parse(raw));
  cache.set(scope, { raw, value });
  return value;
}

/** SSR has no localStorage; this keeps the server render stable. */
export function getServerSettings(): LoggerSettings {
  return DEFAULT_SETTINGS;
}

const listeners = new Set<() => void>();

export function writeSettings(scope: Scope, settings: LoggerSettings): void {
  if (storageAvailable()) {
    try {
      window.localStorage.setItem(
        settingsKey(scope),
        JSON.stringify({ schema: SCHEMA, data: settings }),
      );
    } catch {
      // Quota or private mode. The provider keeps working in memory.
      memory.set(scope, settings);
    }
  } else {
    memory.set(scope, settings);
  }
  listeners.forEach((l) => l());
}

/** Fires on same-tab writes and on changes made by another tab. */
export function subscribeSettings(scope: Scope, cb: () => void): () => void {
  listeners.add(cb);
  const key = settingsKey(scope);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === key) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
