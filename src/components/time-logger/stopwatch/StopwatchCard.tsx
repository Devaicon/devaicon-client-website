"use client";

import type { Project } from "@/lib/types";
import { formatClock, formatHuman } from "../format";
import type { UseStopwatch } from "./useStopwatch";

export default function StopwatchCard({
  sw,
  projects,
}: {
  sw: UseStopwatch;
  projects: Project[];
}) {
  const idle = sw.status === "idle";

  function onReset() {
    if (confirm("Discard this timer without logging it?")) sw.reset();
  }

  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      {sw.isStale && (
        <div className="mb-4 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 px-3 py-2 text-sm text-amber-900 dark:text-amber-300">
          <p>
            This timer has been running since{" "}
            <strong>
              {sw.firstStartedAt
                ? new Date(sw.firstStartedAt).toLocaleString(undefined, {
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "earlier"}
            </strong>
            . Still working?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={sw.acknowledgeStale}
              className="rounded border border-amber-300 dark:border-amber-800 px-2 py-1 text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              Keep running
            </button>
            <button
              type="button"
              onClick={sw.stop}
              className="rounded bg-neutral-900 dark:bg-neutral-700 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              Stop &amp; log
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded px-2 py-1 text-xs underline hover:no-underline"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-5 py-4">
        <div className="text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
          {formatClock(sw.elapsedMs)}
        </div>
        {!idle && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatHuman(sw.elapsedMs)}
            {sw.status === "paused" && " · paused"}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {idle && (
            <button
              type="button"
              onClick={() => sw.start()}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-600 active:scale-[0.98]"
            >
              Start
            </button>
          )}
          {sw.status === "running" && (
            <button
              type="button"
              onClick={sw.pause}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Pause
            </button>
          )}
          {sw.status === "paused" && (
            <button
              type="button"
              onClick={sw.resume}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              Resume
            </button>
          )}
          {!idle && (
            <>
              <button
                type="button"
                onClick={sw.stop}
                className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Stop
              </button>
              <button
                type="button"
                onClick={onReset}
                className="rounded-md px-3 py-2.5 text-sm text-neutral-500 dark:text-neutral-400 underline hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Discard
              </button>
            </>
          )}
        </div>

        <div className="w-full max-w-xs">
          <label
            htmlFor="stopwatch-project"
            className="mb-1 block text-center text-xs text-neutral-600 dark:text-neutral-400"
          >
            Project (optional — you can pick this when you stop)
          </label>
          <select
            id="stopwatch-project"
            value={sw.projectHint}
            onChange={(e) => sw.setProjectHint(e.target.value)}
            disabled={idle}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-sm disabled:opacity-50"
          >
            <option value="">Not set</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {!sw.persistent && (
          <p className="text-center text-xs text-amber-700 dark:text-amber-400">
            This browser isn&rsquo;t saving timer state, so a reload will lose it.
          </p>
        )}
      </div>
    </section>
  );
}
