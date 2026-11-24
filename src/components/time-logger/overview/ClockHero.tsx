"use client";

import type { ReactNode } from "react";
import { useNow } from "../useNow";

/**
 * The head of the Overview: the time and date, with the page's own controls
 * in the corner.
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
  const clock = now ? clockParts(now) : { hour: "--", minute: "--", period: "" };

  return (
    <section
      aria-label="Clock"
      className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
    >
      <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {now ? greetingFor(now.getHours()) : "Hello"}
          {username ? `, ${username}` : ""}
        </p>
        <time
          dateTime={now?.toISOString()}
          // Announcing every minute would drown a screen reader.
          aria-live="off"
          className="mt-1 flex items-baseline gap-2 font-semibold tabular-nums leading-none tracking-tight"
        >
          <span className="text-4xl sm:text-5xl">
            {clock.hour}:{clock.minute}
          </span>
          {clock.period && (
            <span className="text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400">
              {clock.period}
            </span>
          )}
        </time>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {now
            ? `${now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })} · Week ${isoWeek(now)}`
            : " "}
        </p>
      </div>
      <div className="flex items-center gap-1.5">{actions}</div>
    </section>
  );
}
