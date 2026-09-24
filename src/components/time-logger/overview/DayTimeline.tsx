"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, XIcon } from "lucide-react";
import type { TimeLog } from "@/lib/types";
import { addDays, formatDayLabel, isoLocal } from "../metrics";
import { fadeRise } from "../motion";
import {
  buildDayTimeline,
  formatClockMinutes,
  MINUTES_PER_DAY,
  type TimelineSession,
} from "../timeline";
import { useTimeFormat } from "../TimeFormatProvider";
import { useNow } from "../useNow";
import Card from "./Card";

/**
 * One day as a single 24-hour bar: green where work was logged, red where the
 * day has passed with nothing logged, grey for the hours still to come.
 *
 * Positions are reconstructed from when each entry was logged — see
 * timeline.ts for how, and for the cases where that has to be estimated.
 */

const pct = (min: number) => `${(min / MINUTES_PER_DAY) * 100}%`;

/** Every three hours on a wide screen; every six on a phone. */
const TICKS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function rangeOf(s: TimelineSession): string {
  return `${formatClockMinutes(s.startMin)}–${formatClockMinutes(s.endMin)}`;
}

/** The summary line of a composed description, without the structured tail. */
function summaryOf(description: string): string {
  return description.split("\n")[0]?.trim() ?? "";
}

export default function DayTimeline({ logs }: { logs: TimeLog[] }) {
  // A minute is the finest step the bar can show; ticking faster would only
  // re-render it for nothing.
  const now = useNow(60_000);
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();

  const [picked, setPicked] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const today = now ? isoLocal(now) : null;
  // Following today by default means the bar rolls over at midnight on its own
  // rather than staying pinned to the day the page was opened.
  const date = picked ?? today;

  const day = useMemo(
    () => (now && date ? buildDayTimeline(logs, date, now) : null),
    [logs, date, now],
  );

  const projects = useMemo(() => {
    if (!day) return [];
    const totals = new Map<string, number>();
    for (const s of day.sessions) totals.set(s.project, (totals.get(s.project) ?? 0) + s.hours);
    return [...totals.entries()]
      .map(([name, hours]) => ({ name, hours }))
      .sort((a, b) => b.hours - a.hours);
  }, [day]);

  if (!now || !date || !today || !day) {
    return (
      <Card title="Day timeline">
        <div className="h-12 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      </Card>
    );
  }

  // A filter for a project that is not on this day would hide everything and
  // offer no chip to undo it, so it quietly lapses.
  const activeFilter = projects.some((p) => p.name === filter) ? filter : null;
  const selected = day.sessions.find((s) => s.id === selectedId) ?? null;
  const hovered = day.sessions.find((s) => s.id === hoverId) ?? null;
  const loggedHours = day.sessions.reduce((t, s) => t + s.hours, 0);
  const unplacedHours = day.unplaced.reduce((t, l) => t + Number(l.hours || 0), 0);
  const isToday = date === today;

  function show(next: string | null) {
    // Landing on today goes back to following it.
    setPicked(next === null || next >= today! ? null : next);
    setSelectedId(null);
    setHoverId(null);
  }
  const step = (days: number) => show(isoLocal(addDays(parseISO(date!), days)));

  const navButton =
    "rounded-md p-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

  const header = (
    <div className="flex items-center gap-1">
      <span>Day timeline</span>
      <span className="ml-auto flex items-center gap-1 normal-case tracking-normal">
        {!isToday && (
          <button
            type="button"
            onClick={() => show(null)}
            className="rounded-md px-2 py-1 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Today
          </button>
        )}
        <button type="button" onClick={() => step(-1)} aria-label="Previous day" title="Previous day" className={navButton}>
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span aria-live="polite" className="min-w-[6.5rem] text-center text-xs font-medium text-neutral-700 dark:text-neutral-300">
          {isToday ? "Today" : formatDayLabel(date)}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={isToday}
          aria-label="Next day"
          title="Next day"
          className={navButton}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </span>
    </div>
  );

  return (
    <Card title={header}>
      <div className="flex flex-col gap-3" onKeyDown={(e) => e.key === "Escape" && setSelectedId(null)}>
        {/* ---------- summary + project filter ---------- */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="mr-1 text-neutral-600 dark:text-neutral-400">
            <span className="text-base font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
              {fmt(activeFilter ? (projects.find((p) => p.name === activeFilter)?.hours ?? 0) : loggedHours)}
            </span>{" "}
            {activeFilter ? `on ${activeFilter}` : "logged"}
          </span>
          {projects.length > 1 && (
            <span role="group" aria-label="Show one project" className="flex flex-wrap gap-1.5">
              {[{ name: null as string | null, hours: loggedHours }, ...projects].map((p) => {
                const on = activeFilter === p.name;
                return (
                  <button
                    key={p.name ?? "__all__"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(p.name)}
                    className={`cursor-pointer rounded-full border px-2.5 py-0.5 transition-colors ${
                      on
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
                    }`}
                  >
                    {p.name ?? "All projects"}
                  </button>
                );
              })}
            </span>
          )}
        </div>

        {/* ---------- the bar ---------- */}
        <div className="relative pt-7">
          {/* Hover label, clamped so it never hangs off either end. */}
          {hovered && (
            <div
              role="presentation"
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-700 dark:text-neutral-200 shadow-sm"
              style={{
                left: `clamp(4.5rem, ${pct((hovered.startMin + hovered.endMin) / 2)}, calc(100% - 4.5rem))`,
              }}
            >
              <span className="font-medium">{hovered.project}</span> · {rangeOf(hovered)} · {fmt(hovered.hours)}
            </div>
          )}

          <div
            role="group"
            aria-label={`${isToday ? "Today" : formatDayLabel(date)}, 24 hours`}
            className="relative h-12 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800"
          >
            {/* Passed with nothing logged. Sessions are drawn over it. */}
            {day.elapsedMin > 0 && (
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 bg-red-400/80 dark:bg-red-900"
                style={{ width: pct(day.elapsedMin) }}
              />
            )}
            {/* Hour lines, faint enough to read as texture rather than data. */}
            {TICKS.slice(1, -1).map((h) => (
              <div
                key={h}
                aria-hidden
                className="absolute inset-y-0 w-px bg-white/40 dark:bg-neutral-950/40"
                style={{ left: pct(h * 60) }}
              />
            ))}

            {day.sessions.map((s) => {
              const dimmed = activeFilter !== null && s.project !== activeFilter;
              const isSelected = selected?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`${s.project}, ${s.category}, ${rangeOf(s)}, ${fmt(s.hours)}${
                    s.estimated ? ", time estimated" : ""
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(isSelected ? null : s.id)}
                  onMouseEnter={() => setHoverId(s.id)}
                  onMouseLeave={() => setHoverId((h) => (h === s.id ? null : h))}
                  onFocus={() => setHoverId(s.id)}
                  onBlur={() => setHoverId((h) => (h === s.id ? null : h))}
                  // The 1px surface-coloured edge on each side leaves a 2px
                  // seam between back-to-back sessions, so a batch reads as
                  // several entries rather than one long one.
                  className={`absolute inset-y-0 min-w-1 cursor-pointer border-x border-white outline-none transition-[opacity,filter] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900 dark:border-neutral-900 dark:focus-visible:ring-white ${
                    dimmed
                      ? "bg-green-600/25 dark:bg-green-500/25"
                      : "bg-green-600 hover:brightness-110 dark:bg-green-500"
                  } ${isSelected ? "z-10 ring-2 ring-inset ring-neutral-900 dark:ring-white" : ""}`}
                  style={{ left: pct(s.startMin), width: pct(s.endMin - s.startMin) }}
                />
              );
            })}
          </div>

          {/* Now: a line through the bar and a dot above it. */}
          {isToday && (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 top-5 w-0.5 -translate-x-1/2 bg-violet-600 dark:bg-violet-400"
              style={{ left: pct(day.elapsedMin) }}
            >
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-600 dark:bg-violet-400" />
            </div>
          )}

          {/* Hour axis. */}
          <div aria-hidden className="relative mt-1 h-4 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400">
            {TICKS.map((h, i) => (
              <span
                key={h}
                className={`absolute ${h % 6 === 0 ? "" : "hidden sm:inline"} ${
                  i === 0 ? "" : i === TICKS.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
                }`}
                style={{ left: pct(h * 60) }}
              >
                {formatClockMinutes(h * 60)}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- legend ---------- */}
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-green-600 dark:bg-green-500" /> Logged
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-400/80 dark:bg-red-900" /> Nothing logged
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-800" /> Still to come
          </li>
          {isToday && (
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-0.5 bg-violet-600 dark:bg-violet-400" /> Now
            </li>
          )}
          {day.sessions.length > 0 && !selected && (
            <li className="text-neutral-500 dark:text-neutral-500">Click a session for its details</li>
          )}
        </ul>

        {/* ---------- selected session ---------- */}
        <AnimatePresence initial={false}>
          {selected && (
            <motion.div
              key={selected.id}
              variants={fadeRise(!!reduced)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 p-3 pr-9 text-sm"
            >
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close session details"
                className="absolute right-1.5 top-1.5 rounded-md p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold">{selected.project}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{selected.category}</span>
              </div>
              <div className="mt-0.5 text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
                {rangeOf(selected)} · {fmt(selected.hours)}
              </div>
              {summaryOf(selected.description) && (
                <p className="mt-1.5 line-clamp-2 text-neutral-700 dark:text-neutral-300">
                  {summaryOf(selected.description)}
                </p>
              )}
              {selected.estimated && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <InfoIcon aria-hidden className="h-3 w-3 shrink-0" />
                  Times estimated: this was logged alongside other entries or ran
                  past midnight, so where it starts is a best guess.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- what could not be drawn ---------- */}
        {day.sessions.length === 0 && day.unplaced.length === 0 && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {day.elapsedMin === 0 ? "This day has not started yet." : "Nothing logged for this day."}
          </p>
        )}
        {day.unplaced.length > 0 && (
          <p className="flex items-start gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <InfoIcon aria-hidden className="mt-px h-3 w-3 shrink-0" />
            {day.unplaced.length === 1 ? "1 entry" : `${day.unplaced.length} entries`} ({fmt(unplacedHours)})
            for this day {day.unplaced.length === 1 ? "has" : "have"} no time of day to show, usually
            because {day.unplaced.length === 1 ? "it was" : "they were"} logged on a later day.
          </p>
        )}
      </div>
    </Card>
  );
}
