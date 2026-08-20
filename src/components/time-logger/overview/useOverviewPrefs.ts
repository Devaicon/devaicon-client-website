"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { LoggerConfig } from "../config";
import type { CardId } from "./cards";
import {
  DEFAULT_PREFS,
  getExpanded,
  getPrefs,
  getServerExpanded,
  getServerPrefs,
  prefsEqual,
  sanitizePrefs,
  subscribePrefs,
  withPlacement,
  writeExpanded,
  writePrefs,
  type OverviewPrefs,
  type Placement,
} from "./preferences";

/**
 * "local-only" is not an error: the change is saved in this browser, it just
 * hasn't reached the account yet. "rejected" is — the server refused the shape,
 * so the local value was rolled back to the last one it accepted.
 */
export type SyncState = "idle" | "saving" | "local-only" | "rejected";

export type OverviewPrefsApi = {
  prefs: OverviewPrefs;
  expanded: boolean;
  setExpanded: (next: boolean) => void;
  setPlacement: (id: CardId, to: Placement) => void;
  reset: () => void;
  /** Always "idle" when preferences are browser-only. */
  sync: SyncState;
};

/** Long enough to collapse a burst of toggles, short enough to feel immediate. */
const DEBOUNCE_MS = 400;

export function useOverviewPrefs(config: LoggerConfig): OverviewPrefsApi {
  const scope = config.storageScope;
  const { apiBase } = config;
  const serverBacked = config.preferenceSync === "server";

  const subscribe = useCallback(
    (cb: () => void) => subscribePrefs(scope, cb),
    [scope],
  );
  const prefs = useSyncExternalStore(
    subscribe,
    useCallback(() => getPrefs(scope), [scope]),
    getServerPrefs,
  );
  const expanded = useSyncExternalStore(
    subscribe,
    useCallback(() => getExpanded(scope), [scope]),
    getServerExpanded,
  );

  const [sync, setSync] = useState<SyncState>("idle");

  // The last shape the server accepted, so a rejection has somewhere to land.
  const lastSavedRef = useRef<OverviewPrefs | null>(null);
  const pendingRef = useRef<OverviewPrefs | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set from the first local edit. Stops a slow GET from overwriting a change
  // the user made while it was still in flight.
  const dirtyRef = useRef(false);

  const flush = useCallback(async () => {
    const body = pendingRef.current;
    if (!body) return;
    try {
      const res = await fetch(`${apiBase}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overview: body }),
      });
      if (res.ok) {
        lastSavedRef.current = body;
        pendingRef.current = null;
        dirtyRef.current = false;
        setSync("idle");
        return;
      }
      if (res.status < 500) {
        // The server refused this payload outright. Keeping it locally would
        // leave the two stores disagreeing forever, so go back to the last
        // value it accepted — if we have one.
        const restore = lastSavedRef.current;
        if (restore) writePrefs(scope, restore);
        pendingRef.current = null;
        dirtyRef.current = false;
        setSync("rejected");
        return;
      }
      setSync("local-only");
    } catch {
      // Offline or the server is down. The mirror already holds the change.
      setSync("local-only");
    }
  }, [apiBase, scope]);

  // Pull the account's copy once. The mirror is already painted by now, so
  // this only matters when the user last edited on another device.
  useEffect(() => {
    if (!serverBacked) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/preferences`);
        if (!res.ok) return;
        const body = (await res.json()) as {
          preferences?: { overview?: unknown } | null;
        };
        const fromServer = sanitizePrefs(body?.preferences?.overview);
        if (cancelled || dirtyRef.current || !fromServer) return;
        lastSavedRef.current = fromServer;
        if (!prefsEqual(fromServer, getPrefs(scope))) writePrefs(scope, fromServer);
      } catch {
        // Offline. The mirror is showing the right thing regardless.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serverBacked, apiBase, scope]);

  // A queued save must not die with the component — switching tabs unmounts
  // this, and the user would rightly expect their toggle to have stuck.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current) void flush();
    };
  }, [flush]);

  const persist = useCallback(
    (next: OverviewPrefs) => {
      writePrefs(scope, next);
      if (!serverBacked) return;
      dirtyRef.current = true;
      pendingRef.current = next;
      setSync("saving");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => void flush(), DEBOUNCE_MS);
    },
    [scope, serverBacked, flush],
  );

  const setPlacement = useCallback(
    (id: CardId, to: Placement) => persist(withPlacement(getPrefs(scope), id, to)),
    [persist, scope],
  );

  const reset = useCallback(() => persist(DEFAULT_PREFS), [persist]);

  const setExpandedCb = useCallback(
    (next: boolean) => writeExpanded(scope, next),
    [scope],
  );

  return {
    prefs,
    expanded,
    setExpanded: setExpandedCb,
    setPlacement,
    reset,
    sync: serverBacked ? sync : "idle",
  };
}
