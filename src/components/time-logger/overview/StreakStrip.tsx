"use client";

import Card from "./Card";
import { formatDayLabel, type StreakDay } from "../metrics";
import type { SectionSize } from "./sections";

/**
 * The streak, as a strip rather than a column.
 *
 * It used to own the whole slot beside the calendar for the sake of a number
 * and a short bullet list. Laid out horizontally it says more in a third of
 * the height: the count carries the magnitude, the rail carries the shape of
 * the last two weeks, and the misses collapse to one line.
 *
 * Minimised it stacks into a column instead.
 */

/** How many missed days are named before the rest become a "+N more". */
const NAMED_MISSES = 3;

const SQUARE: Record<StreakDay["state"], string> = {
  logged: "bg-neutral-900 dark:bg-neutral-100",
  missing:
    "bg-amber-100 dark:bg-amber-950 ring-1 ring-inset ring-amber-400 dark:ring-amber-700",
  off: "bg-neutral-100 dark:bg-neutral-800",
  pending:
    "border border-dashed border-neutral-300 dark:border-neutral-600",
};

const STATE_LABEL: Record<StreakDay["state"], string> = {
  logged: "logged",
  missing: "not logged",
  off: "day off",
  pending: "today, nothing logged yet",
};

export default function StreakStrip({
  streakWeekdays,
  recentWeekdays,
  missingWeekdays,
  offDaysThisMonth,
  className = "",
  size = "max",
}: {
  streakWeekdays: number;
  recentWeekdays: StreakDay[];
  missingWeekdays: string[];
  offDaysThisMonth: number;
  className?: string;
  /** The slot the layout has given this card. */
  size?: SectionSize;
}) {
  const named = missingWeekdays.slice(-NAMED_MISSES);
  const overflow = missingWeekdays.length - named.length;
  const tall = size === "min";

  return (
    <Card title="Logging streak" className={className}>
      <div
        className={
          tall
            ? "flex h-full flex-col justify-center gap-5"
            : "flex h-full flex-wrap content-center items-center gap-x-8 gap-y-4"
        }
      >
        {/* ---------- count ---------- */}
        <div className="flex items-baseline">
          <span className="text-4xl font-semibold tabular-nums leading-none">
            {streakWeekdays}
          </span>
          <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
            {streakWeekdays === 1 ? "weekday" : "weekdays"}
          </span>
        </div>

        {/* ---------- the last ten working days ---------- */}
        <ul
          className="flex flex-wrap items-center gap-1.5"
          aria-label="The last ten working days"
        >
          {recentWeekdays.map((d) => (
            <li
              key={d.date}
              title={`${formatDayLabel(d.date)} — ${STATE_LABEL[d.state]}`}
              className={`h-5 w-5 rounded ${SQUARE[d.state]}`}
            >
              <span className="sr-only">
                {formatDayLabel(d.date)}: {STATE_LABEL[d.state]}
              </span>
            </li>
          ))}
        </ul>

        {/* ---------- gaps, and the month's days off ---------- */}
        <div className={tall ? "text-sm" : "ml-auto text-right text-sm"}>
          {missingWeekdays.length === 0 ? (
            <p className="text-green-700 dark:text-green-400">
              Fully caught up for the last two weeks.
            </p>
          ) : (
            <p className="text-amber-700 dark:text-amber-400">
              {missingWeekdays.length} not logged
              <span className="text-neutral-500 dark:text-neutral-400">
                {" · "}
                {named.map(formatDayLabel).join(" · ")}
                {overflow > 0 && ` · +${overflow} more`}
              </span>
            </p>
          )}
          {offDaysThisMonth > 0 && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {offDaysThisMonth} day{offDaysThisMonth === 1 ? "" : "s"} off this
              month
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
