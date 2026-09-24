"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckIcon,
  PlusIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { computeMetrics } from "../metrics";
import Last7DaysChart from "../charts/Last7DaysChart";
import BreakdownBar from "../charts/BreakdownBar";
import CalendarPanel from "../CalendarPanel";
import Card from "../overview/Card";
import ClockHero from "../overview/ClockHero";
import DayTimeline from "../overview/DayTimeline";
import QuickLogDialog from "../overview/QuickLogDialog";
import SectionCanvas from "../overview/SectionCanvas";
import StatSection from "../overview/StatSection";
import StreakStrip from "../overview/StreakStrip";
import { useOverviewPrefs } from "../overview/useOverviewPrefs";
import { useSectionLayout } from "../overview/useSectionLayout";
import { sectionById, type SectionId } from "../overview/sections";
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
  const { logs, loading, projects, createLog, deleteLog, me } = data;
  const m = useMemo(() => computeMetrics(logs), [logs]);
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  // One mode, not two. Choosing which figures you see and choosing where they
  // sit are the same act of customising the page, and a pair of near-identical
  // buttons that turned on near-identical modes only invited the question of
  // which one you wanted.
  const [customising, setCustomising] = useState(false);
  const sections = useSectionLayout(config.storageScope);
  // Held here rather than inside the tile band so the Reset below can undo the
  // cards and the layout together, and the band still gets a single instance.
  const prefs = useOverviewPrefs(config);

  function resetEverything() {
    prefs.reset();
    sections.reset();
  }

  // The page's own controls live in the clock hero, above everything the
  // layout can move — a bar that rearranged itself along with the sections
  // would be unusable. Reset only exists while customising, so it sits in the
  // customising banner beside the explanation of what it resets.
  const actions = (
    <>
      <button
        type="button"
        onClick={() => setCustomising((v) => !v)}
        aria-pressed={customising}
        title={customising ? "Finish customising" : "Customise the Overview"}
        className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          customising
            ? "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:text-neutral-950 dark:hover:bg-violet-400"
            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
        }`}
      >
        {customising ? (
          <>
            <CheckIcon className="h-3.5 w-3.5" />
            Done
          </>
        ) : (
          <>
            <SlidersHorizontalIcon className="h-3.5 w-3.5" />
            Customise
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => setQuickLogOpen(true)}
        disabled={loading}
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 px-3 py-1.5 text-xs font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm active:scale-[0.98]"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        Log time
      </button>
    </>
  );

  const hero = <ClockHero username={me?.username} actions={actions} />;

  if (loading) {
    return (
      <div className="space-y-4">
        {hero}
        <StatSection config={config} metrics={m} loading prefsApi={prefs} />
      </div>
    );
  }

  const totalForApproval = m.pendingHours + m.approvedHours;
  const approvedPct =
    totalForApproval === 0 ? 0 : (m.approvedHours / totalForApproval) * 100;

  // A block that lays itself out differently in a tall slot than a wide one
  // has to be told which it got; the canvas only positions, it does not render.
  const sizeOf = (id: SectionId) =>
    sections.layout.find((p) => p.id === id)?.size ??
    sectionById(id)?.defaultSize ??
    "max";

  // Each block, keyed by the id the layout stores. Building them here rather
  // than inside the canvas keeps the canvas ignorant of what a section is.
  const content: Partial<Record<SectionId, ReactNode>> = {
    stats: (
      <StatSection
        config={config}
        metrics={m}
        loading={false}
        editing={customising}
        compact={sizeOf("stats") === "min"}
        onCustomise={() => setCustomising(true)}
        prefsApi={prefs}
      />
    ),
    timeline: <DayTimeline logs={logs} />,
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
        size={sizeOf("streak")}
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
      {hero}

      {customising && (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 px-3 py-2 text-xs text-violet-900 dark:text-violet-200 sm:flex-row sm:items-center">
          <p className="flex-1">
            Drag a section by its handle to move it, or use the arrows. Each one
            can be maximised to the full width or minimised to a square, and
            hidden altogether. Your cards are saved with your preferences; where
            they sit is saved in this browser.
          </p>
          {/* Resets the cards and the layout together: two Reset buttons for
              one Customise mode would put the ambiguity straight back. */}
          <button
            type="button"
            onClick={resetEverything}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-md px-2 py-1 font-medium hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors sm:self-auto"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Reset layout
          </button>
        </div>
      )}

      <SectionCanvas
        layout={sections.layout}
        api={sections}
        arranging={customising}
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
