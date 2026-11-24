"use client";

import { type ReactNode } from "react";
import { useTimeFormat } from "../TimeFormatProvider";
import type { EntriesSummary } from "../metrics";

function Card({
  label,
  children,
  note,
}: {
  label: string;
  children: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div
      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4"
    >
      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{children}</div>
      {note && (
        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {note}
        </div>
      )}
    </div>
  );
}

/**
 * Live summary of whatever the Entries filters currently match. Every figure
 * recomputes as the filters change.
 */
export default function EntriesSummaryCards({
  summary,
}: {
  summary: EntriesSummary;
}) {
  const { fmt } = useTimeFormat();

  return (
    <div
      className="grid grid-cols-2 gap-3 lg:grid-cols-5"
    >
      <Card
        label="Total hours"
        note={
          summary.nonWorkingCount > 0
            ? `excludes ${summary.nonWorkingCount} leave/holiday`
            : undefined
        }
      >
        {fmt(summary.totalHours)}
      </Card>

      <Card
        label="Entries"
        note={<>avg {fmt(summary.avgPerEntry)} each</>}
      >
        {summary.entryCount}
      </Card>

      <Card
        label="Avg / logged day"
        note={
          <>
            over {summary.daysCovered}{" "}
            {summary.daysCovered === 1 ? "day" : "days"}
          </>
        }
      >
        {fmt(summary.avgPerDay)}
      </Card>

      <Card
        label="Approved"
        note={<>{fmt(summary.pendingHours)} pending</>}
      >
        {fmt(summary.approvedHours)}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900">
          <div
            className="h-full rounded-full bg-green-600 dark:bg-green-500"
            style={{ width: `${summary.approvedPct}%` }}
          />
        </div>
      </Card>

      <Card
        label="Top project"
        note={
          summary.topProject
            ? `${fmt(summary.topProject.hours)} · ${Math.round(
                summary.topProject.share,
              )}%`
            : undefined
        }
      >
        <span className="block truncate text-base" title={summary.topProject?.name}>
          {summary.topProject?.name ?? "—"}
        </span>
      </Card>
    </div>
  );
}
