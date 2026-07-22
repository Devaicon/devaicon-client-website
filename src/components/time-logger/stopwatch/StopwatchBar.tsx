"use client";

import { formatClock } from "../format";
import type { UseStopwatch } from "./useStopwatch";

export default function StopwatchBar({ sw }: { sw: UseStopwatch }) {
  if (sw.status === "idle") return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          sw.status === "running" ? "animate-pulse bg-red-500" : "bg-neutral-400"
        }`}
        aria-hidden="true"
      />
      <span className="text-lg font-semibold tabular-nums">
        {formatClock(sw.elapsedMs)}
      </span>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {sw.projectHint || "No project set"}
        {sw.status === "paused" && " · paused"}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {sw.status === "running" ? (
          <button
            type="button"
            onClick={sw.pause}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={sw.resume}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Resume
          </button>
        )}
        <button
          type="button"
          onClick={sw.stop}
          className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
