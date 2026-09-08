"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { computeMetrics } from "../metrics";
import Last7DaysChart from "../charts/Last7DaysChart";
import BreakdownBar from "../charts/BreakdownBar";
import CalendarPanel from "../CalendarPanel";
import Card from "../overview/Card";
import QuickLogDialog from "../overview/QuickLogDialog";
import StatSection from "../overview/StatSection";
import StreakStrip from "../overview/StreakStrip";
import { useTimeFormat } from "../TimeFormatProvider";
import type { LoggerConfig } from "../config";
import type { LoggerData } from "../useLoggerData";

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
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  // Sits in the tile band's header, so logging an entry never costs you the
  // view of the figures it moves.
  const quickLogButton = (
    <button
      type="button"
      onClick={() => setQuickLogOpen(true)}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md bg-neutral-900 dark:bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50 transition-colors shadow-sm active:scale-[0.98]"
    >
      <PlusIcon className="h-3.5 w-3.5" />
      Log time
    </button>
  );

  // The tile band renders its own skeleton, sized to the user's own layout, so
  // the loading state can't jump to a different shape once the data lands.
  if (loading) {
    return (
      <StatSection config={config} metrics={m} loading actions={quickLogButton} />
    );
  }

  const totalForApproval = m.pendingHours + m.approvedHours;
  const approvedPct =
    totalForApproval === 0 ? 0 : (m.approvedHours / totalForApproval) * 100;

  return (
    <div className="space-y-4">
      <StatSection
        config={config}
        metrics={m}
        loading={false}
        actions={quickLogButton}
      />

      <CalendarPanel
        logs={logs}
        projects={projects}
        createLog={createLog}
        deleteLog={deleteLog}
      />

      <StreakStrip
        streakWeekdays={m.streakWeekdays}
        recentWeekdays={m.recentWeekdays}
        missingWeekdays={m.missingWeekdays}
        offDaysThisMonth={m.offDaysThisMonth}
      />

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

      <AnimatePresence>
        {quickLogOpen && (
          <QuickLogDialog
            projects={projects}
            createLog={createLog}
            onClose={() => setQuickLogOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
