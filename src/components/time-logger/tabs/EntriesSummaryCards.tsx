"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedNumber from "../AnimatedNumber";
import { useTimeFormat } from "../TimeFormatProvider";
import { staggerContainer, staggerItem } from "../motion";
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
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={staggerItem(!!reduced)}
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
    </motion.div>
  );
}

/**
 * Live summary of whatever the Entries filters currently match. Every figure
 * recomputes as the filters change, and the numbers roll rather than swap so
 * the change is visible.
 */
export default function EntriesSummaryCards({
  summary,
}: {
  summary: EntriesSummary;
}) {
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();

  return (
    <motion.div
      variants={staggerContainer(!!reduced)}
      initial="initial"
      animate="animate"
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
        <AnimatedNumber value={summary.totalHours} format={(n) => fmt(n)} />
      </Card>

      <Card
        label="Entries"
        note={<>avg {fmt(summary.avgPerEntry)} each</>}
      >
        <AnimatedNumber
          value={summary.entryCount}
          format={(n) => String(Math.round(n))}
        />
      </Card>

      <Card
        label="Avg / logged day"
        note={
          <>
            over{" "}
            <AnimatedNumber
              value={summary.daysCovered}
              format={(n) => String(Math.round(n))}
            />{" "}
            {summary.daysCovered === 1 ? "day" : "days"}
          </>
        }
      >
        <AnimatedNumber value={summary.avgPerDay} format={(n) => fmt(n)} />
      </Card>

      <Card
        label="Approved"
        note={<>{fmt(summary.pendingHours)} pending</>}
      >
        <AnimatedNumber value={summary.approvedHours} format={(n) => fmt(n)} />
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900">
          <motion.div
            className="h-full rounded-full bg-green-600 dark:bg-green-500"
            initial={false}
            animate={{ width: `${summary.approvedPct}%` }}
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
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
    </motion.div>
  );
}
