"use client";

import { useEffect, useState } from "react";
import { CloudOffIcon, RefreshCwIcon } from "lucide-react";
import type { LoggerData } from "./useLoggerData";

/**
 * Says plainly when the dashboard is working from this browser's copy rather
 * than the spreadsheet, and offers the sync that hands the held changes over.
 */
export default function SyncBanner({ data }: { data: LoggerData }) {
  const { offline, pendingSync, syncing, sync } = data;
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  // A success note only needs a moment; a failure stays until the next try.
  useEffect(() => {
    if (!result?.ok) return;
    const t = setTimeout(() => setResult(null), 5000);
    return () => clearTimeout(t);
  }, [result]);

  async function onSync() {
    setResult(null);
    const r = await sync();
    setResult(
      r.ok
        ? { ok: true, text: "Everything is in sync with the spreadsheet." }
        : { ok: false, text: r.message ?? "Sync failed." },
    );
  }

  if (!offline && pendingSync === 0) {
    if (!result) return null;
    return (
      <div
        role="status"
        className={`rounded-md border px-3 py-2 text-sm ${
          result.ok
            ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400"
            : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400"
        }`}
      >
        {result.text}
      </div>
    );
  }

  const changes = `${pendingSync} ${pendingSync === 1 ? "change" : "changes"}`;
  const text = offline
    ? pendingSync > 0
      ? `Google Sheets can't be reached. ${changes} ${
          pendingSync === 1 ? "is" : "are"
        } saved in this browser only and ${
          pendingSync === 1 ? "hasn't" : "haven't"
        } reached the spreadsheet yet.`
      : "Google Sheets can't be reached, so you're seeing the copy saved in this browser. New entries will be kept here until you sync."
    : `${changes} saved in this browser ${
        pendingSync === 1 ? "hasn't" : "haven't"
      } reached the spreadsheet yet.`;

  return (
    <div
      role="alert"
      className="rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 px-3 py-2 text-sm text-amber-800 dark:text-amber-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="flex items-start gap-2 min-w-0">
          <CloudOffIcon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            {text}
            {pendingSync > 0 && (
              <span className="block text-xs text-amber-700/80 dark:text-amber-400/80">
                Don&apos;t clear this site&apos;s data until they&apos;re synced.
              </span>
            )}
          </span>
        </span>
        <button
          onClick={onSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 dark:border-amber-800 bg-white dark:bg-amber-950 px-3 py-1 text-xs font-medium text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900 disabled:opacity-50 transition-colors"
        >
          <RefreshCwIcon
            className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
            aria-hidden
          />
          {syncing ? "Syncing…" : "Sync now"}
        </button>
      </div>
      {result && !result.ok && (
        <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">{result.text}</p>
      )}
    </div>
  );
}
