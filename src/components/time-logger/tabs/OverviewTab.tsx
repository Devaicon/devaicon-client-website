"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckIcon, LayoutGridIcon, PlusIcon, RotateCcwIcon } from "lucide-react";
import { computeMetrics } from "../metrics";
import Last7DaysChart from "../charts/Last7DaysChart";
import BreakdownBar from "../charts/BreakdownBar";
import CalendarPanel from "../CalendarPanel";
import Card from "../overview/Card";
import QuickLogDialog from "../overview/QuickLogDialog";
import SectionCanvas from "../overview/SectionCanvas";
import StatSection from "../overview/StatSection";
import StreakStrip from "../overview/StreakStrip";
import { useSectionLayout } from "../overview/useSectionLayout";
import type { SectionId } from "../overview/sections";
import { useTimeFormat } from "../TimeFormatProvider";
import type { LoggerConfig } from "../config";
import type { LoggerData } from "../useLoggerData";

export default function OverviewTab({
  data,
  config,
  onLogged,
}: {
  data: LoggerData;
  config: LoggerConfig;
  /** Called with the project name after an entry is saved from this tab. */
  onLogged?: (project: string) => void;
}) {
  const { logs, loading, projects, createLog, deleteLog } = data;
  const m = useMemo(() => computeMetrics(logs), [logs]);
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [arranging, setArranging] = useState(false);
  const sections = useSectionLayout(config.storageScope);

  const ghostButton =
    "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors";

  const quickLogButton = (
    <button
      type="button"
      onClick={() => setQuickLogOpen(true)}
      disabled={loading}
      className="flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 dark:bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm active:scale-[0.98]"
    >
      <PlusIcon className="h-3.5 w-3.5" />
      Log time
    </button>
  );

  // The page's own controls, above everything the layout can move — a bar that
  // rearranged itself along with the sections would be unusable.
  const actionBar = (
    <div className="flex items-center gap-1">
      {quickLogButton}
      <span className="ml-auto flex items-center gap-1">
        {arranging && sections.customised && (
          <button type="button" onClick={sections.reset} className={ghostButton}>
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Reset layout
          </button>
        )}
        <button
          type="button"
          onClick={() => setArranging((v) => !v)}
          aria-pressed={arranging}
          className={
            arranging
              ? "flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 px-2 py-1 text-xs text-white dark:text-neutral-900 transition-colors"
              : ghostButton
          }
        >
          {arranging ? (
            <>
              <CheckIcon className="h-3.5 w-3.5" />
              Done
            </>
          ) : (
            <>
              <LayoutGridIcon className="h-3.5 w-3.5" />
              Arrange page
            </>
          )}
        </button>
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {actionBar}
        <StatSection config={config} metrics={m} loading />
      </div>
    );
  }

  const totalForApproval = m.pendingHours + m.approvedHours;
  const approvedPct =
    totalForApproval === 0 ? 0 : (m.approvedHours / totalForApproval) * 100;

  // Each block, keyed by the id the layout stores. Building them here rather
  // than inside the canvas keeps the canvas ignorant of what a section is.
  const content: Partial<Record<SectionId, ReactNode>> = {
    stats: <StatSection config={config} metrics={m} loading={false} />,
    calendar: (
      <CalendarPanel
        logs={logs}
        projects={projects}
        createLog={createLog}
        deleteLog={deleteLog}
      />
    ),
    streak: (
      <StreakStrip
        streakWeekdays={m.streakWeekdays}
        recentWeekdays={m.recentWeekdays}
        missingWeekdays={m.missingWeekdays}
        offDaysThisMonth={m.offDaysThisMonth}
      />
    ),
    last7: (
      <Card title="Last 7 days">
        <Last7DaysChart days={m.last7Days} />
      </Card>
    ),
    approval: (
      <Card title="Approval">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Approved</span>
          <span className="tabular-nums font-medium">{fmt(m.approvedHours)}</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Pending</span>
          <span className="tabular-nums font-medium">{fmt(m.pendingHours)}</span>
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
    ),
    byProject: (
      <Card title="Hours by project · this month">
        <BreakdownBar
          items={m.byProject}
          emptyLabel="No hours logged this month yet."
        />
      </Card>
    ),
    byCategory: (
      <Card title="Hours by category · this month">
        <BreakdownBar
          items={m.byCategory}
          emptyLabel="No hours logged this month yet."
        />
      </Card>
    ),
  };

  return (
    <div className="space-y-4">
      {actionBar}

      {arranging && (
        <p className="rounded-lg border border-dashed border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 px-3 py-2 text-xs text-violet-900 dark:text-violet-200">
          Drag a section by its handle to move it, or use the arrows. Sections
          can be widened, narrowed and hidden — your page is saved in this
          browser.
        </p>
      )}

      <SectionCanvas
        layout={sections.layout}
        api={sections}
        arranging={arranging}
        content={content}
      />

      <AnimatePresence>
        {quickLogOpen && (
          <QuickLogDialog
            projects={projects}
            createLog={createLog}
            onLogged={onLogged}
            onClose={() => setQuickLogOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
