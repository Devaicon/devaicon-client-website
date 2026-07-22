"use client";

import { useState } from "react";
import type { NonWorkingCategory, Project } from "@/lib/types";
import type { CalendarDay } from "./metrics";
import type { MutationResult, NewLogInput } from "./useLoggerData";

const WEEKDAY_HEADS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Full-day defaults for a marked day. The server requires hours > 0 and a
// summary of at least 10 characters, so these are not arbitrary.
const OFF_HOURS = 8;
const OFF_SUMMARY: Record<NonWorkingCategory, string> = {
  Leave: "Annual leave",
  Holiday: "Public holiday",
};

/** GitHub-style intensity buckets. */
function levelOf(hours: number): 0 | 1 | 2 | 3 | 4 {
  if (hours <= 0) return 0;
  if (hours < 2) return 1;
  if (hours < 4) return 2;
  if (hours < 6) return 3;
  return 4;
}

const LEVEL_CLASS: Record<number, string> = {
  0: "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500",
  1: "bg-violet-200 dark:bg-violet-950 text-violet-900 dark:text-violet-200",
  2: "bg-violet-300 dark:bg-violet-900 text-violet-900 dark:text-violet-100",
  3: "bg-violet-400 dark:bg-violet-800 text-violet-950 dark:text-violet-50",
  4: "bg-violet-600 dark:bg-violet-600 text-white",
};

/** Monday-start column index for the first cell of the month. */
function leadingBlanks(firstIso: string): number {
  const [y, m, d] = firstIso.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay(); // Sun = 0
  return day === 0 ? 6 : day - 1;
}

function formatLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function cellTitle(day: CalendarDay): string {
  const when = formatLong(day.date);
  if (day.offKind) return `${when} — ${day.offKind}`;
  if (day.hours > 0) return `${when} — ${day.hours.toFixed(2)} h logged`;
  if (day.isFuture) return `${when} — upcoming`;
  if (day.isWeekend) return `${when} — weekend`;
  return `${when} — nothing logged`;
}

export default function MonthCalendar({
  days,
  projects,
  createLog,
  deleteLog,
}: {
  days: CalendarDay[];
  projects: Project[];
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  deleteLog: (id: string) => Promise<MutationResult>;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (days.length === 0) return null;

  const selected = days.find((d) => d.date === selectedDate) ?? null;
  // Leave has to be attributed to a project because the server requires one.
  const markProject = projects[0]?.name ?? "";

  async function mark(day: CalendarDay, kind: NonWorkingCategory) {
    if (!markProject) return;
    setBusy(true);
    try {
      const result = await createLog({
        date: day.date,
        project: markProject,
        category: kind,
        hours: OFF_HOURS,
        description: OFF_SUMMARY[kind],
        tools: [],
        areas: [],
        status: "",
        reference: "",
      });
      if (!result.ok) alert(result.message ?? "Could not mark this day.");
      else setSelectedDate(null);
    } finally {
      setBusy(false);
    }
  }

  async function unmark(day: CalendarDay) {
    if (!day.offLogId) return;
    setBusy(true);
    try {
      const result = await deleteLog(day.offLogId);
      if (!result.ok) alert(result.message ?? "Could not remove this marking.");
      else setSelectedDate(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_HEADS.map((w) => (
          <div
            key={w}
            className="pb-1 text-center text-[10px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
          >
            {w}
          </div>
        ))}

        {Array.from({ length: leadingBlanks(days[0].date) }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          const base =
            "relative aspect-square rounded-md text-xs font-medium transition-colors";

          let tone: string;
          if (day.isFuture) {
            tone =
              "bg-transparent border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-300 dark:text-neutral-600";
          } else if (day.offKind) {
            tone =
              "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300";
          } else if (day.hours <= 0 && day.isWeekend) {
            tone = "bg-neutral-50 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-600";
          } else {
            tone = LEVEL_CLASS[levelOf(day.hours)];
          }

          return (
            <button
              key={day.date}
              type="button"
              title={cellTitle(day)}
              aria-label={cellTitle(day)}
              aria-pressed={isSelected}
              onClick={() => setSelectedDate(isSelected ? null : day.date)}
              className={`${base} ${tone} hover:opacity-80 ${
                day.isToday
                  ? "ring-2 ring-neutral-900 dark:ring-neutral-100 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900"
                  : ""
              } ${isSelected ? "outline outline-2 outline-violet-500" : ""}`}
            >
              <span className="absolute left-1 top-0.5">{day.dayOfMonth}</span>
              {day.offKind && (
                <span className="absolute bottom-0.5 right-1 text-[9px] uppercase">
                  {day.offKind === "Leave" ? "L" : "H"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className={`inline-block h-3 w-3 rounded-sm ${LEVEL_CLASS[l]}`}
            />
          ))}
          More
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-amber-100 dark:bg-amber-950" />
          Leave / holiday
        </span>
      </div>

      {selected && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm">
          <span className="font-medium">{formatLong(selected.date)}</span>
          {selected.hours > 0 && (
            <span className="text-neutral-500 dark:text-neutral-400">
              {selected.hours.toFixed(2)} h logged
            </span>
          )}
          {selected.isFuture && !selected.offKind && (
            <span className="text-neutral-500 dark:text-neutral-400">
              Upcoming — you can book leave ahead of time.
            </span>
          )}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selected.offKind ? (
              <>
                <span className="text-neutral-500 dark:text-neutral-400">
                  Marked as {selected.offKind.toLowerCase()}
                </span>
                <button
                  type="button"
                  onClick={() => unmark(selected)}
                  disabled={busy}
                  className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2.5 py-1 text-xs hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-50"
                >
                  {busy ? "Removing…" : "Remove marking"}
                </button>
              </>
            ) : selected.hours > 0 ? (
              <span className="text-neutral-500 dark:text-neutral-400">
                Work is logged for this day.
              </span>
            ) : !markProject ? (
              <span className="text-amber-700 dark:text-amber-400">
                Add a project first — leave is logged against one.
              </span>
            ) : (
              <>
                <span
                  className="text-neutral-500 dark:text-neutral-400"
                  title={`Logs ${OFF_HOURS}h against ${markProject}, excluded from your hour totals`}
                >
                  Mark as
                </span>
                <button
                  type="button"
                  onClick={() => mark(selected, "Leave")}
                  disabled={busy}
                  className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
                >
                  Leave
                </button>
                <button
                  type="button"
                  onClick={() => mark(selected, "Holiday")}
                  disabled={busy}
                  className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2.5 py-1 text-xs hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-50"
                >
                  Holiday
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
