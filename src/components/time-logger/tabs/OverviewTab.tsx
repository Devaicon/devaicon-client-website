"use client";

import { useMemo, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { computeMetrics, formatDayLabel } from "../metrics";
import Last7DaysChart from "../charts/Last7DaysChart";
import BreakdownBar from "../charts/BreakdownBar";
import MonthCalendar from "../MonthCalendar";
import StatSection from "../overview/StatSection";
import { useTimeFormat } from "../TimeFormatProvider";
import type { LoggerConfig } from "../config";
import type { LoggerData } from "../useLoggerData";

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

export default function OverviewTab({
  data,
  config,
}: {
  data: LoggerData;
  config: LoggerConfig;
}) {
  const { logs, loading, projects, createLog, deleteLog } = data;
  const m = useMemo(() => computeMetrics(logs), [logs]);
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();

  const now = new Date();
  const monthLabel = now.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  // The tile band renders its own skeleton, sized to the user's own layout, so
  // the loading state can't jump to a different shape once the data lands.
  if (loading) {
    return <StatSection config={config} metrics={m} loading />;
  }

  const totalForApproval = m.pendingHours + m.approvedHours;
  const approvedPct =
    totalForApproval === 0 ? 0 : (m.approvedHours / totalForApproval) * 100;

  return (
    <div className="space-y-4">
      <StatSection config={config} metrics={m} loading={false} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title={monthLabel} className="lg:col-span-2">
          <MonthCalendar
            days={m.monthDays}
            projects={projects}
            createLog={createLog}
            deleteLog={deleteLog}
          />
        </Card>

        <Card title="Logging streak">
          <div className="text-3xl font-semibold tabular-nums">
            {m.streakWeekdays}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              {m.streakWeekdays === 1 ? "weekday" : "weekdays"}
            </span>
          </div>
          {m.offDaysThisMonth > 0 && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {m.offDaysThisMonth} day{m.offDaysThisMonth === 1 ? "" : "s"} off
              this month
            </p>
          )}
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
        <Card title="Last 7 days" className="lg:col-span-2">
          <Last7DaysChart days={m.last7Days} />
        </Card>
        <Card title="Approval">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Approved</span>
            <span className="tabular-nums font-medium">
              {fmt(m.approvedHours)}
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Pending</span>
            <span className="tabular-nums font-medium">
              {fmt(m.pendingHours)}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900">
            <motion.div
              className="h-full rounded-full bg-green-600 dark:bg-green-500"
              initial={false}
              animate={{ width: `${approvedPct}%` }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          {totalForApproval === 0 && (
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Nothing logged yet.
            </p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
      </div>
    </div>
  );
}
