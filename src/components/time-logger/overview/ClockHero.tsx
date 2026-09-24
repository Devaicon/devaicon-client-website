"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { addDays, isWeekend, startOfWeek } from "../metrics";
import { useNow } from "../useNow";

/**
 * The head of the Overview: a large clock, today's calendar leaf and the week
 * it sits in, with the page's own controls in the corner.
 *
 * It is fixed rather than one of the movable sections. The Log time and
 * Customise buttons live here, and a bar that could be dragged around the page
 * or hidden along with the rest would take the way back out with it.
 */

function greetingFor(hour: number): string {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** ISO-8601 week number, the one printed on most desk calendars. */
function isoWeek(d: Date): number {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
  return Math.ceil(((x.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/**
 * Hours and minutes in the reader's own convention, split so the minutes and
 * the day period can be set apart typographically. `formatToParts` rather than
 * slicing a string, because where "PM" goes is itself locale-specific.
 */
function clockParts(d: Date) {
  const parts = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(d);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return { hour: pick("hour"), minute: pick("minute"), period: pick("dayPeriod") };
}

export default function ClockHero({
  username,
  actions,
}: {
  username?: string;
  /** The page's controls, set in the hero's top-right corner. */
  actions: ReactNode;
}) {
  const now = useNow(1000);
  const reduced = useReducedMotion();

  const clock = now ? clockParts(now) : { hour: "--", minute: "--", period: "" };
  const seconds = now ? String(now.getSeconds()).padStart(2, "0") : "--";
  // The colon breathes with the seconds. With reduced motion it simply stays.
  const colonDim = !reduced && now !== null && now.getSeconds() % 2 === 1;

  const weekStart = now ? startOfWeek(now) : null;
  const week = weekStart ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : [];

  return (
    <section
      aria-label="Clock and calendar"
      className="card-shine relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-7"
    >
      {/* A wash of the brand violet from the corner, so the hero reads as the
          page's head without shouting over the figures beneath it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl dark:bg-violet-900/30"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          {now ? greetingFor(now.getHours()) : "Hello"}
          {username ? `, ${username}` : ""}
        </p>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>

      <div className="relative mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {/* ---------- clock ---------- */}
        <div>
          <time
            dateTime={now?.toISOString()}
            // Announcing every second would drown a screen reader; the date
            // and time are read once, on arrival.
            aria-live="off"
            className="flex items-baseline font-bold leading-none tracking-tight tabular-nums text-neutral-900 dark:text-neutral-50"
          >
            <span className="text-7xl sm:text-8xl lg:text-9xl">{clock.hour}</span>
            <span
              aria-hidden
              className={`px-1 text-7xl text-violet-600 transition-opacity duration-300 sm:text-8xl lg:text-9xl dark:text-violet-400 ${
                colonDim ? "opacity-25" : "opacity-100"
              }`}
            >
              :
            </span>
            <span className="text-7xl sm:text-8xl lg:text-9xl">{clock.minute}</span>
            <span className="ml-3 flex flex-col gap-1 self-end pb-2 text-left font-normal tracking-normal">
              {clock.period && (
                <span className="text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400">
                  {clock.period}
                </span>
              )}
              <span className="text-2xl font-semibold text-neutral-400 dark:text-neutral-500">
                {seconds}
              </span>
            </span>
          </time>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {now
              ? `${now.toLocaleDateString(undefined, { weekday: "long" })} · Week ${isoWeek(now)} of ${now.getFullYear()}`
              : " "}
          </p>
        </div>

        {/* ---------- calendar ---------- */}
        <div className="flex flex-wrap items-end gap-5">
          <div
            aria-hidden
            className="w-28 shrink-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-center shadow-sm"
          >
            <div className="bg-violet-700 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white dark:bg-violet-500 dark:text-neutral-950">
              {now ? now.toLocaleDateString(undefined, { month: "short" }) : "—"}
            </div>
            <div className="pb-1 pt-2 text-6xl font-bold leading-none tracking-tighter tabular-nums">
              {now ? now.getDate() : "–"}
            </div>
            <div className="pb-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {now ? now.toLocaleDateString(undefined, { weekday: "short" }) : " "}
            </div>
          </div>

          {week.length > 0 && now && (
            <ol aria-label="This week" className="grid grid-cols-7 gap-1 text-center">
              {week.map((d) => {
                const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
                const off = isWeekend(d);
                return (
                  <li
                    key={d.toISOString()}
                    aria-current={isToday ? "date" : undefined}
                    className={`flex w-9 flex-col items-center gap-1 rounded-lg py-1.5 ${
                      isToday
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                        : off
                          ? "text-neutral-400 dark:text-neutral-600"
                          : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    <span className="text-[10px] uppercase">
                      {d.toLocaleDateString(undefined, { weekday: "narrow" })}
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{d.getDate()}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
