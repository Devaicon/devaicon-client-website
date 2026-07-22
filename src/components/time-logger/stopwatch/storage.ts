// Persisted stopwatch state. Everything here is defensive: a user in private
// browsing, or with a payload from an older build, must degrade rather than
// crash the dashboard.

const SCHEMA = 1;

export type Snapshot =
  | { status: "idle" }
  | {
      status: "running";
      /** Epoch ms when the current running segment began. */
      startedAt: number;
      /** Time banked from previous segments, in ms. */
      accumulatedMs: number;
      /** Epoch ms of the very first start; drives the entry date and stale check. */
      firstStartedAt: number;
      projectHint: string;
    }
  | {
      status: "paused";
      accumulatedMs: number;
      firstStartedAt: number;
      projectHint: string;
    };

export type PendingSession = {
  id: string;
  elapsedMs: number;
  startedAtISO: string;
  endedAtISO: string;
  projectHint: string;
};

export const IDLE: Snapshot = { status: "idle" };

export type Scope = "new" | "legacy";

function stateKey(scope: Scope) {
  return `devaicon.stopwatch.${scope}.v1`;
}
function pendingKey(scope: Scope) {
  return `devaicon.stopwatch.${scope}.pending.v1`;
}

// Probed once and cached: this is read on every render, and it writes.
let availability: boolean | null = null;

export function storageAvailable(): boolean {
  if (availability !== null) return availability;
  try {
    const probe = "__devaicon_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    availability = true;
  } catch {
    availability = false;
  }
  return availability;
}

function read<T>(key: string, validate: (v: unknown) => v is T): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { schema?: number; data?: unknown };
    if (parsed?.schema !== SCHEMA) {
      window.localStorage.removeItem(key);
      return null;
    }
    return validate(parsed.data) ? parsed.data : null;
  } catch {
    return null;
  }
}

function write(key: string, data: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ schema: SCHEMA, data }));
  } catch {
    // Quota or private mode. The hook keeps working in memory.
  }
}

function isSnapshot(v: unknown): v is Snapshot {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  if (s.status === "idle") return true;
  const common =
    typeof s.accumulatedMs === "number" &&
    typeof s.firstStartedAt === "number" &&
    typeof s.projectHint === "string";
  if (s.status === "paused") return common;
  if (s.status === "running") return common && typeof s.startedAt === "number";
  return false;
}

function isPending(v: unknown): v is PendingSession {
  if (typeof v !== "object" || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.elapsedMs === "number" &&
    typeof p.startedAtISO === "string" &&
    typeof p.endedAtISO === "string" &&
    typeof p.projectHint === "string"
  );
}

function readSnapshot(scope: Scope): Snapshot {
  return read(stateKey(scope), isSnapshot) ?? IDLE;
}

function readPending(scope: Scope): PendingSession | null {
  return read(pendingKey(scope), isPending);
}

/* ---------------------------------------------------------------------------
 * External store, consumed via useSyncExternalStore.
 *
 * getSnapshot must return a referentially stable value or React re-renders
 * forever, so parsed values are cached against the raw string that produced
 * them and only re-parsed when that string actually changes.
 * ------------------------------------------------------------------------- */

type Cached<T> = { raw: string | null; value: T };

const snapshotCache = new Map<Scope, Cached<Snapshot>>();
const pendingCache = new Map<Scope, Cached<PendingSession | null>>();

function rawOf(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

// Private browsing and exhausted quota make localStorage unwritable. Without a
// fallback the timer wouldn't merely fail to persist, it would never start:
// every write would be dropped and every read would return IDLE.
const memSnapshot = new Map<Scope, Snapshot>();
const memPending = new Map<Scope, PendingSession | null>();

export function getSnapshot(scope: Scope): Snapshot {
  if (!storageAvailable()) return memSnapshot.get(scope) ?? IDLE;
  const raw = rawOf(stateKey(scope));
  const cached = snapshotCache.get(scope);
  if (cached && cached.raw === raw) return cached.value;
  const value = readSnapshot(scope);
  snapshotCache.set(scope, { raw, value });
  return value;
}

export function getPending(scope: Scope): PendingSession | null {
  if (!storageAvailable()) return memPending.get(scope) ?? null;
  const raw = rawOf(pendingKey(scope));
  const cached = pendingCache.get(scope);
  if (cached && cached.raw === raw) return cached.value;
  const value = readPending(scope);
  pendingCache.set(scope, { raw, value });
  return value;
}

/** SSR has no localStorage; these constants keep the server render stable. */
export function getServerSnapshot(): Snapshot {
  return IDLE;
}
export function getServerPending(): PendingSession | null {
  return null;
}

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function writeSnapshot(scope: Scope, snapshot: Snapshot): void {
  if (storageAvailable()) write(stateKey(scope), snapshot);
  else memSnapshot.set(scope, snapshot);
  emit();
}

export function writePending(scope: Scope, pending: PendingSession | null): void {
  if (!storageAvailable()) {
    memPending.set(scope, pending);
    emit();
    return;
  }
  if (pending === null) {
    try {
      window.localStorage.removeItem(pendingKey(scope));
    } catch {
      // ignore
    }
  } else {
    write(pendingKey(scope), pending);
  }
  emit();
}

/** Fires on same-tab writes and on changes made by another tab. */
export function subscribeStopwatch(scope: Scope, cb: () => void): () => void {
  listeners.add(cb);
  const keys = new Set([stateKey(scope), pendingKey(scope)]);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || keys.has(e.key)) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
