"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Project, TimeLog } from "@/lib/types";
import MonthCalendar from "./MonthCalendar";
import { buildCalendarDays } from "./metrics";
import Card from "./overview/Card";
import type { MutationResult, NewLogInput } from "./useLoggerData";

/**
 * The calendar's shell: it owns which month is on screen and how you move
 * between them, and hands the grid a ready-made list of days. MonthCalendar
 * stays a dumb renderer, so a week or board view can later be dropped in
 * beside it without touching either.
 */

/** Wheel distance that adds up to one month step. */
const WHEEL_STEP_PX = 60;
/** Swipe distance that counts as one month step. */
const SWIPE_PX = 40;
/** Gestures are ignored for this long after a step, so one flick moves one month. */
const STEP_COOLDOWN_MS = 250;

type Cursor = { year: number; month: number };

function cursorOf(d: Date): Cursor {
  return { year: d.getFullYear(), month: d.getMonth() };
}

export default function CalendarPanel({
  logs,
  projects,
  createLog,
  deleteLog,
  className = "",
}: {
  logs: TimeLog[];
  projects: Project[];
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  deleteLog: (id: string) => Promise<MutationResult>;
  className?: string;
}) {
  // Captured once, so "today" cannot shift underneath a re-render mid-session.
  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState<Cursor>(() => cursorOf(now));

  const days = useMemo(
    () => buildCalendarDays(logs, cursor.year, cursor.month, now),
    [logs, cursor, now],
  );

  // Day 1 of month ± n rolls over the year correctly in either direction.
  const stepMonths = useCallback((delta: number) => {
    setCursor((c) => cursorOf(new Date(c.year, c.month + delta, 1)));
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);
  const accum = useRef(0);
  const lastStep = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Re-runs on every cursor change: the grid remounts to clear the old month's
  // selection, so the listeners must move to the new node with it.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    function step(delta: number) {
      lastStep.current = Date.now();
      accum.current = 0;
      stepMonths(delta);
    }

    function onWheel(e: WheelEvent) {
      // The grid consumes the gesture outright: without this the page would
      // scroll as well as the month changing. Only the grid is covered, so
      // there is still panel around it to scroll the page from.
      e.preventDefault();
      if (Date.now() - lastStep.current < STEP_COOLDOWN_MS) return;
      accum.current += e.deltaY + e.deltaX;
      if (Math.abs(accum.current) >= WHEEL_STEP_PX) {
        step(accum.current > 0 ? 1 : -1);
      }
    }

    function onTouchStart(e: TouchEvent) {
      const t = e.changedTouches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    }

    function onTouchEnd(e: TouchEvent) {
      const from = touchStart.current;
      touchStart.current = null;
      if (!from) return;
      if (Date.now() - lastStep.current < STEP_COOLDOWN_MS) return;
      const t = e.changedTouches[0];
      // Measured as content travel: dragging up or left moves time forward,
      // the same direction a wheel-down does.
      const dx = from.x - t.clientX;
      const dy = from.y - t.clientY;
      const primary = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(primary) >= SWIPE_PX) step(primary > 0 ? 1 : -1);
    }

    // Non-passive, or preventDefault above would be ignored.
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [stepMonths, cursor]);

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" },
  );
  const isCurrentMonth =
    cursor.year === now.getFullYear() && cursor.month === now.getMonth();

  const navButton =
    "rounded-md p-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors";

  const header = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => stepMonths(-1)}
        aria-label="Previous month"
        title="Previous month"
        className={navButton}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <span aria-live="polite" className="min-w-0 truncate">
        {monthLabel}
      </span>
      <button
        type="button"
        onClick={() => stepMonths(1)}
        aria-label="Next month"
        title="Next month"
        className={navButton}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>

      {/* Right-hand slot: "Today", and where a view switcher will sit. */}
      <span className="ml-auto flex items-center gap-1">
        {!isCurrentMonth && (
          <button
            type="button"
            onClick={() => setCursor(cursorOf(now))}
            className="rounded-md px-2 py-1 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Today
          </button>
        )}
      </span>
    </div>
  );

  return (
    <Card title={header} className={className}>
      <MonthCalendar
        // Remounting on a month change drops any day selected in the old month.
        key={`${cursor.year}-${cursor.month}`}
        days={days}
        projects={projects}
        createLog={createLog}
        deleteLog={deleteLog}
        gridRef={gridRef}
      />
    </Card>
  );
}
