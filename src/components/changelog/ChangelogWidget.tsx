"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  APP_VERSION,
  CHANGELOG,
  compareVersions,
  type ChangelogEntry,
  type ChangelogTag,
} from "@/lib/changelog";

const SEEN_KEY = "devaicon.changelog.lastSeen";
const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 10_000;

const TAG_STYLES: Record<ChangelogTag, string> = {
  feature: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  improvement: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  fix: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

/* The last-seen version is external state, so it's read through an external
 * store rather than copied into React state inside an effect. getSeen returns
 * a string, which is referentially stable by value. */

function readSeen(): string | null {
  try {
    return window.localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

const seenListeners = new Set<() => void>();

function writeSeen(version: string): void {
  try {
    window.localStorage.setItem(SEEN_KEY, version);
  } catch {
    // Private mode: the toasts simply show again next visit.
  }
  seenListeners.forEach((l) => l());
}

function subscribeSeen(cb: () => void): () => void {
  seenListeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === SEEN_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    seenListeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** On the server there is nothing seen yet, which renders no toasts. */
function getSeenServer(): string | null {
  return null;
}

function EntryBody({ entry }: { entry: ChangelogEntry }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TAG_STYLES[entry.tag]}`}
        >
          {entry.tag}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          v{entry.version} · {entry.date}
        </span>
      </div>
      <h3 className="mt-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {entry.title}
      </h3>
      <ul className="mt-1.5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        {entry.items.map((item) => (
          <li key={item} className="flex gap-1.5">
            <span aria-hidden="true">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ChangelogWidget() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [panelOpen, setPanelOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  const seen = useSyncExternalStore(subscribeSeen, readSeen, getSeenServer);

  // First ever visit — don't dump the whole history on someone. Record the
  // current version and start notifying from the next release. This updates an
  // external system, which is what an effect is for; the store pushes the
  // change back into React.
  useEffect(() => {
    if (readSeen() === null) writeSeen(APP_VERSION);
  }, []);

  // Derived, not stored: writing lastSeen empties this on its own.
  const unseen: ChangelogEntry[] =
    seen === null
      ? []
      : CHANGELOG.filter((e) => compareVersions(e.version, seen) > 0).slice(
          0,
          MAX_TOASTS,
        );
  const hasUnread = unseen.length > 0;

  const markAllSeen = useCallback(() => writeSeen(APP_VERSION), []);

  // Auto-dismiss, paused while the user is hovering or focused inside.
  useEffect(() => {
    if (!hasUnread || paused) return;
    const id = window.setTimeout(markAllSeen, AUTO_DISMISS_MS);
    return () => window.clearTimeout(id);
  }, [hasUnread, paused, markAllSeen]);

  useEffect(() => {
    if (!panelOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPanelOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  function openPanel() {
    setPanelOpen(true);
    markAllSeen();
  }

  const visibleToasts = unseen.filter((e) => !dismissed.has(e.version));

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex w-[min(22rem,calc(100vw-2rem))] flex-col items-end gap-2">
      {!panelOpen &&
        visibleToasts.map((entry) => (
          <div
            key={entry.version}
            role="status"
            aria-live="polite"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="pointer-events-auto w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-lg motion-safe:animate-fadeInScale"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <EntryBody entry={entry} />
              </div>
              <button
                type="button"
                aria-label={`Dismiss notes for version ${entry.version}`}
                onClick={() =>
                  setDismissed((prev) => new Set(prev).add(entry.version))
                }
                className="shrink-0 rounded px-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

      {panelOpen && (
        <div
          role="dialog"
          aria-label="What's new"
          className="pointer-events-auto max-h-[70vh] w-full overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl"
        >
          <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3">
            <h2 className="text-sm font-semibold">What&rsquo;s new</h2>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Close"
              className="rounded px-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          </div>
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {CHANGELOG.map((entry) => (
              <li key={entry.version} className="p-4">
                <EntryBody entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => (panelOpen ? setPanelOpen(false) : openPanel())}
        aria-expanded={panelOpen}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-lg transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
      >
        {hasUnread && (
          <span className="h-2 w-2 rounded-full bg-violet-500" aria-hidden="true" />
        )}
        What&rsquo;s new
        <span className="text-neutral-400 dark:text-neutral-500">
          v{APP_VERSION}
        </span>
      </button>
    </div>
  );
}
