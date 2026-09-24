import { isNonWorkingCategory, type TimeLog } from "@/lib/types";
import { isoLocal } from "./metrics";

/**
 * Where on the clock a day's entries sit.
 *
 * Neither backend records when work started, only when it was logged
 * (`loggedAt`, stamped by the server on save). A session is therefore
 * reconstructed backwards: it ends when it was logged and started `hours`
 * before that. That holds for anyone who logs as they finish, and fails in two
 * predictable ways, both handled here rather than drawn wrong:
 *
 * - Several entries saved in one sitting all end at the same moment. They are
 *   laid end to end instead, latest first, so a batch reads as the stretch of
 *   work it was rather than a pile of overlapping bars. Any entry moved this
 *   way is marked `estimated`.
 * - An entry logged on a later day than the one it is for has no position on
 *   that day at all. It is returned in `unplaced` so the timeline can say it
 *   exists instead of silently dropping its hours.
 */

export const MINUTES_PER_DAY = 24 * 60;

export type TimelineSession = {
  id: string;
  project: string;
  category: string;
  hours: number;
  description: string;
  /** Minutes after local midnight of the day shown, 0–1440. */
  startMin: number;
  endMin: number;
  /**
   * True when the position is a guess beyond "ended when it was logged": moved
   * earlier to clear a later entry, or cut off at midnight.
   */
  estimated: boolean;
};

export type DayTimeline = {
  /** Local YYYY-MM-DD. */
  date: string;
  /** Oldest first. Never overlapping. */
  sessions: TimelineSession[];
  /** Work entries for this date that could not be given a position. */
  unplaced: TimeLog[];
  /**
   * How much of the day has passed, in minutes: 0 for a future day, the whole
   * day for a past one. Everything before it that is not a session is time
   * with nothing logged; everything after it is still to come.
   */
  elapsedMin: number;
};

function minutesIntoDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

export function buildDayTimeline(
  logs: TimeLog[],
  date: string,
  now: Date,
): DayTimeline {
  const today = isoLocal(now);
  const elapsedMin =
    date < today ? MINUTES_PER_DAY : date > today ? 0 : minutesIntoDay(now);

  const placeable: { log: TimeLog; loggedMin: number }[] = [];
  const unplaced: TimeLog[] = [];

  for (const log of logs) {
    if (log.date !== date) continue;
    // Leave and holiday markers carry nominal hours only because the backends
    // demand hours > 0. They are a day off, not a stretch of work.
    if (isNonWorkingCategory(String(log.category))) continue;
    const hours = Number(log.hours);
    if (!Number.isFinite(hours) || hours <= 0) continue;

    const logged = log.loggedAt ? new Date(log.loggedAt) : null;
    if (!logged || Number.isNaN(logged.getTime()) || isoLocal(logged) !== date) {
      unplaced.push(log);
      continue;
    }
    placeable.push({ log, loggedMin: minutesIntoDay(logged) });
  }

  // Latest first, each ending no later than the one after it began.
  placeable.sort((a, b) => b.loggedMin - a.loggedMin);
  const sessions: TimelineSession[] = [];
  let cursor = Number.POSITIVE_INFINITY;
  for (const { log, loggedMin } of placeable) {
    const endMin = Math.min(loggedMin, cursor);
    const wantedStart = endMin - Number(log.hours) * 60;
    if (endMin <= 0) {
      // Pushed back past midnight by the entries after it: nowhere left today.
      unplaced.push(log);
      continue;
    }
    const startMin = Math.max(0, wantedStart);
    sessions.push({
      id: log.id,
      project: log.project,
      category: String(log.category),
      hours: Number(log.hours),
      description: log.description ?? "",
      startMin,
      endMin,
      estimated: endMin < loggedMin || wantedStart < 0,
    });
    cursor = startMin;
  }
  sessions.reverse();

  return { date, sessions, unplaced, elapsedMin };
}

/** "09:05" from minutes after midnight; 1440 reads as "24:00", not "00:00". */
export function formatClockMinutes(min: number): string {
  const whole = Math.round(min);
  const h = Math.floor(whole / 60);
  const m = whole % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
