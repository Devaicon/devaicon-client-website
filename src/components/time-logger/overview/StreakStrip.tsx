"use client";

import { motion, useReducedMotion } from "framer-motion";
import AnimatedNumber from "../AnimatedNumber";
import Card from "./Card";
import FlameIcon from "./FlameIcon";
import StreakBackdrop from "./StreakBackdrop";
import { formatDayLabel, type StreakDay } from "../metrics";
import { staggerContainer, staggerItem } from "../motion";
import type { SectionSize } from "./sections";

/**
 * The streak, as a strip rather than a column.
 *
 * It used to own the whole slot beside the calendar for the sake of a number
 * and a short bullet list. Laid out horizontally it says more in a third of
 * the height: the flame carries the magnitude, the rail carries the shape of
 * the last two weeks, and the misses collapse to one line of chips.
 *
 * Minimised it is not that strip in a narrower box but a column, and everything
 * in it grows: a card two rows tall has the room, and a strip's worth of small
 * parts floating in it would look like a mistake rather than a choice.
 */

/** How many missed days are named before the rest become a "+N more". */
const NAMED_MISSES = 3;

const SQUARE: Record<StreakDay["state"], string> = {
  logged: "bg-orange-500 dark:bg-orange-400",
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
  const reduced = useReducedMotion();
  const named = missingWeekdays.slice(-NAMED_MISSES);
  const overflow = missingWeekdays.length - named.length;
  const tall = size === "min";

  return (
    <Card
      title="Logging streak"
      className={className}
      backdrop={<StreakBackdrop streakWeekdays={streakWeekdays} />}
    >
      <div
        className={
          tall
            ? "flex h-full flex-col justify-center gap-7"
            : "flex h-full flex-wrap content-center items-center gap-x-8 gap-y-5"
        }
      >
        {/* ---------- flame + count ---------- */}
        <div className="flex items-center gap-3">
          <FlameIcon
            streakWeekdays={streakWeekdays}
            sizeClass={tall ? "h-24 w-24 sm:h-28 sm:w-28" : "h-16 w-16 sm:h-20 sm:w-20"}
          />
          <div className="flex items-baseline">
            <span
              className={`font-semibold tabular-nums leading-none ${
                tall ? "text-7xl sm:text-8xl" : "text-6xl sm:text-7xl"
              }`}
            >
              <AnimatedNumber
                value={streakWeekdays}
                format={(n) => String(Math.round(n))}
              />
            </span>
            <span className="ml-2 text-base font-normal text-neutral-500 dark:text-neutral-400">
              {streakWeekdays === 1 ? "weekday" : "weekdays"}
            </span>
          </div>
        </div>

        {/* ---------- the last ten working days ---------- */}
        <motion.ul
          variants={staggerContainer(!!reduced)}
          initial="initial"
          animate="animate"
          className={`flex flex-wrap items-center ${tall ? "gap-2" : "gap-1.5"}`}
          aria-label="The last ten working days"
        >
          {recentWeekdays.map((d) => (
            <motion.li
              key={d.date}
              variants={staggerItem(!!reduced)}
              title={`${formatDayLabel(d.date)} — ${STATE_LABEL[d.state]}`}
              className={`${
                tall ? "h-9 w-9 rounded-lg sm:h-10 sm:w-10" : "h-7 w-7 rounded-md"
              } ${SQUARE[d.state]}`}
            >
              <span className="sr-only">
                {formatDayLabel(d.date)}: {STATE_LABEL[d.state]}
              </span>
            </motion.li>
          ))}
        </motion.ul>

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
