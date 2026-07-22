"use client";

import { useMemo, type ReactNode } from "react";
import type { TimeLog } from "@/lib/types";
import { computeMetrics } from "../metrics";
import Last7DaysChart from "../charts/Last7DaysChart";
import BreakdownBar from "../charts/BreakdownBar";

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 ${className}`}
    >
      <h3 className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function formatDayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function OverviewTab({
  logs,
  loading,
}: {
  logs: TimeLog[];
  loading: boolean;
}) {
  const m = useMemo(() => computeMetrics(logs), [logs]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          />
        ))}
      </div>
    );
  }

  const totalForApproval = m.pendingHours + m.approvedHours;
  const approvedPct =
    totalForApproval === 0 ? 0 : (m.approvedHours / totalForApproval) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Today" value={`${m.todayHours.toFixed(1)} h`} />
        <Tile label="This week" value={`${m.weekHours.toFixed(1)} h`} />
        <Tile label="This month" value={`${m.monthHours.toFixed(1)} h`} />
        <Tile
          label="Avg / logged day"
          value={`${m.avgPerLoggedDay.toFixed(1)} h`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Last 7 days" className="lg:col-span-2">
          <Last7DaysChart days={m.last7Days} />
        </Card>

        <Card title="Logging streak">
          <div className="text-3xl font-semibold tabular-nums">
            {m.streakWeekdays}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              {m.streakWeekdays === 1 ? "weekday" : "weekdays"}
            </span>
          </div>
          {m.missingWeekdays.length === 0 ? (
            <p className="mt-3 text-sm text-green-700 dark:text-green-400">
              You&rsquo;re fully caught up for the last two weeks.
            </p>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Not logged:
              </p>
              <ul className="mt-1 space-y-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                {m.missingWeekdays.map((d) => (
                  <li key={d}>{formatDayLabel(d)}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Hours by project · this month">
          <BreakdownBar
            items={m.byProject}
            emptyLabel="No hours logged this month yet."
          />
        </Card>
        <Card title="Hours by category · this month">
          <BreakdownBar
            items={m.byCategory}
            emptyLabel="No hours logged this month yet."
          />
        </Card>
        <Card title="Approval">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Approved</span>
            <span className="tabular-nums font-medium">
              {m.approvedHours.toFixed(1)} h
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Pending</span>
            <span className="tabular-nums font-medium">
              {m.pendingHours.toFixed(1)} h
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900">
            <div
              className="h-full rounded-full bg-green-600 dark:bg-green-500"
              style={{ width: `${approvedPct}%` }}
            />
          </div>
          {totalForApproval === 0 && (
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Nothing logged yet.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
