"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The current time, re-read every `stepMs` and aligned to it, so a clock ticks
 * over on the second rather than some fraction of a second late.
 *
 * One timer per step is shared by every subscriber, so the header clock and
 * the timeline's "now" line can never disagree about what time it is. The
 * server snapshot is null: the server's clock is not the reader's, and
 * rendering it would only produce a hydration mismatch.
 */

type Ticker = { now: Date; listeners: Set<() => void>; timer: number | null };

const tickers = new Map<number, Ticker>();

function tickerFor(stepMs: number): Ticker {
  let t = tickers.get(stepMs);
  if (!t) {
    t = { now: new Date(), listeners: new Set(), timer: null };
    tickers.set(stepMs, t);
  }
  return t;
}

function schedule(stepMs: number, t: Ticker) {
  const wait = stepMs - (Date.now() % stepMs);
  t.timer = window.setTimeout(() => {
    t.now = new Date();
    t.listeners.forEach((l) => l());
    schedule(stepMs, t);
  }, wait);
}

function subscribeTo(stepMs: number, cb: () => void): () => void {
  const t = tickerFor(stepMs);
  t.listeners.add(cb);
  if (t.timer === null) {
    // It may have sat idle since the last subscriber left; start from now.
    t.now = new Date();
    schedule(stepMs, t);
  }
  return () => {
    t.listeners.delete(cb);
    if (t.listeners.size === 0 && t.timer !== null) {
      window.clearTimeout(t.timer);
      t.timer = null;
    }
  };
}

export function useNow(stepMs: number): Date | null {
  const subscribe = useCallback((cb: () => void) => subscribeTo(stepMs, cb), [stepMs]);
  const getSnapshot = useCallback(() => tickerFor(stepMs).now, [stepMs]);
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
