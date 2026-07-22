"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  IDLE,
  getPending,
  getServerPending,
  getServerSnapshot,
  getSnapshot,
  storageAvailable,
  subscribeStopwatch,
  writePending,
  writeSnapshot,
  type PendingSession,
  type Scope,
  type Snapshot,
} from "./storage";

/** Beyond this, a restored running timer is treated as forgotten, not real. */
const STALE_AFTER_MS = 12 * 60 * 60 * 1000;

// Minimal structural type: the Wake Lock API isn't in every TS dom lib yet and
// we only ever call release().
type WakeLockLike = { release: () => Promise<void> };
type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockLike> };
};

export type UseStopwatch = {
  status: Snapshot["status"];
  elapsedMs: number;
  firstStartedAt: number | null;
  projectHint: string;
  pending: PendingSession | null;
  /** True when a restored timer looks forgotten and needs confirming. */
  isStale: boolean;
  /** False when localStorage is unavailable, so state won't survive a reload. */
  persistent: boolean;
  start: (projectHint?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  setProjectHint: (value: string) => void;
  clearPending: () => void;
  acknowledgeStale: () => void;
};

/** Elapsed is always derived from wall-clock time, never counted by a ticker. */
function elapsedOf(s: Snapshot, now: number): number {
  if (s.status === "idle") return 0;
  if (s.status === "paused") return s.accumulatedMs;
  return s.accumulatedMs + (now - s.startedAt);
}

// Module-level so their identity is stable across renders.
const noopSubscribe = () => () => {};
const alwaysPersistent = () => true;

function sameLocalDay(a: number, b: number): boolean {
  const x = new Date(a);
  const y = new Date(b);
  return (
    x.getFullYear() === y.getFullYear() &&
    x.getMonth() === y.getMonth() &&
    x.getDate() === y.getDate()
  );
}

export function useStopwatch(scope: Scope): UseStopwatch {
  // localStorage is the source of truth, so the timer survives a reload and
  // stays in step across tabs. Reading it through useSyncExternalStore avoids
  // a hydrate-in-an-effect round trip.
  const subscribe = useCallback(
    (cb: () => void) => subscribeStopwatch(scope, cb),
    [scope],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    () => getSnapshot(scope),
    getServerSnapshot,
  );
  const pending = useSyncExternalStore(
    subscribe,
    () => getPending(scope),
    getServerPending,
  );

  const [now, setNow] = useState(() => Date.now());
  const [staleAcknowledged, setStaleAcknowledged] = useState(false);
  const wakeLockRef = useRef<WakeLockLike | null>(null);
  const persistent = useSyncExternalStore(
    noopSubscribe,
    storageAvailable,
    alwaysPersistent,
  );

  const acquireWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) return;
      const nav = navigator as WakeLockNavigator;
      wakeLockRef.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {
      // Unsupported, denied, or the document isn't visible. Enhancement only.
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    try {
      void wakeLockRef.current?.release();
    } catch {
      // ignore
    }
    wakeLockRef.current = null;
  }, []);

  // Re-render once a second while running. The displayed value comes from
  // Date.now(), so a throttled interval makes the clock lag, never drift.
  useEffect(() => {
    if (snapshot.status !== "running") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [snapshot.status]);

  // Coming back to a backgrounded tab: resync immediately rather than waiting
  // up to a second, and re-acquire the wake lock, which auto-releases on hide.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      setNow(Date.now());
      if (snapshot.status === "running") void acquireWakeLock();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [snapshot.status, acquireWakeLock]);

  // Warn before leaving with a live timer or an unsaved measurement.
  useEffect(() => {
    const risky = snapshot.status !== "idle" || pending !== null;
    if (!risky) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [snapshot.status, pending]);

  const start = useCallback(
    (projectHint = "") => {
      const t = Date.now();
      setNow(t);
      setStaleAcknowledged(false);
      writeSnapshot(scope, {
        status: "running",
        startedAt: t,
        accumulatedMs: 0,
        firstStartedAt: t,
        projectHint,
      });
      void acquireWakeLock();
    },
    [scope, acquireWakeLock],
  );

  const pause = useCallback(() => {
    if (snapshot.status !== "running") return;
    writeSnapshot(scope, {
      status: "paused",
      accumulatedMs: snapshot.accumulatedMs + (Date.now() - snapshot.startedAt),
      firstStartedAt: snapshot.firstStartedAt,
      projectHint: snapshot.projectHint,
    });
    releaseWakeLock();
  }, [scope, snapshot, releaseWakeLock]);

  const resume = useCallback(() => {
    if (snapshot.status !== "paused") return;
    const t = Date.now();
    setNow(t);
    writeSnapshot(scope, {
      status: "running",
      startedAt: t,
      accumulatedMs: snapshot.accumulatedMs,
      firstStartedAt: snapshot.firstStartedAt,
      projectHint: snapshot.projectHint,
    });
    void acquireWakeLock();
  }, [scope, snapshot, acquireWakeLock]);

  const stop = useCallback(() => {
    if (snapshot.status === "idle") return;
    const end = Date.now();
    writePending(scope, {
      id: `${snapshot.firstStartedAt}-${end}`,
      elapsedMs: elapsedOf(snapshot, end),
      startedAtISO: new Date(snapshot.firstStartedAt).toISOString(),
      endedAtISO: new Date(end).toISOString(),
      projectHint: snapshot.projectHint,
    });
    writeSnapshot(scope, IDLE);
    setStaleAcknowledged(false);
    releaseWakeLock();
  }, [scope, snapshot, releaseWakeLock]);

  const reset = useCallback(() => {
    writeSnapshot(scope, IDLE);
    setStaleAcknowledged(false);
    releaseWakeLock();
  }, [scope, releaseWakeLock]);

  const setProjectHint = useCallback(
    (value: string) => {
      if (snapshot.status === "idle") return;
      writeSnapshot(scope, { ...snapshot, projectHint: value });
    },
    [scope, snapshot],
  );

  const clearPending = useCallback(() => writePending(scope, null), [scope]);

  const acknowledgeStale = useCallback(() => setStaleAcknowledged(true), []);

  const elapsedMs = elapsedOf(snapshot, now);

  const isStale =
    !staleAcknowledged &&
    snapshot.status !== "idle" &&
    (elapsedMs > STALE_AFTER_MS || !sameLocalDay(snapshot.firstStartedAt, now));

  return {
    status: snapshot.status,
    elapsedMs,
    firstStartedAt: snapshot.status === "idle" ? null : snapshot.firstStartedAt,
    projectHint: snapshot.status === "idle" ? "" : snapshot.projectHint,
    pending,
    isStale,
    persistent,
    start,
    pause,
    resume,
    stop,
    reset,
    setProjectHint,
    clearPending,
    acknowledgeStale,
  };
}
