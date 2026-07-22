import type { TimeLog } from "@/lib/types";

/* ---------- date helpers (all local-time; log dates are local YYYY-MM-DD) ---------- */

/** Local YYYY-MM-DD. Avoids the UTC drift of `new Date("YYYY-MM-DD")`. */
export function isoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayLocal(): string {
  return isoLocal(new Date());
}

export function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay(); // Sun = 0
  x.setDate(x.getDate() + (day === 0 ? -6 : 1 - day)); // Monday start
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function prevWeekday(d: Date): Date {
  let x = addDays(d, -1);
  while (isWeekend(x)) x = addDays(x, -1);
  return x;
}

/* ---------- types ---------- */

export type DayBucket = {
  /** Local YYYY-MM-DD. */
  date: string;
  /** Short axis label, e.g. "Mon 21". */
  label: string;
  hours: number;
  isToday: boolean;
};

export type Breakdown = { name: string; hours: number };

export type LoggerMetrics = {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  /** Month hours divided by the number of distinct days that have entries. */
  avgPerLoggedDay: number;
  last7Days: DayBucket[];
  byProject: Breakdown[];
  byCategory: Breakdown[];
  /** Consecutive weekdays with at least one entry. Weekends are skipped. */
  streakWeekdays: number;
  /** Weekdays in the last 14 days, excluding today, with no entries. */
  missingWeekdays: string[];
  pendingHours: number;
  approvedHours: number;
};

/* ---------- aggregation ---------- */

const TOP_N = 6;

function hoursOf(l: TimeLog): number {
  const n = Number(l.hours);
  return Number.isFinite(n) ? n : 0;
}

function sum(logs: TimeLog[]): number {
  return logs.reduce((t, l) => t + hoursOf(l), 0);
}

/** Groups by `key`, sorts descending, folds everything past TOP_N into "Other". */
function topBreakdown(logs: TimeLog[], key: (l: TimeLog) => string): Breakdown[] {
  const totals = new Map<string, number>();
  for (const l of logs) {
    const k = key(l) || "Uncategorised";
    totals.set(k, (totals.get(k) ?? 0) + hoursOf(l));
  }
  const sorted = [...totals.entries()]
    .map(([name, hours]) => ({ name, hours }))
    .sort((a, b) => b.hours - a.hours);
  if (sorted.length <= TOP_N) return sorted;
  const head = sorted.slice(0, TOP_N);
  const tail = sorted.slice(TOP_N).reduce((t, b) => t + b.hours, 0);
  return [...head, { name: "Other", hours: tail }];
}

export function computeMetrics(
  logs: TimeLog[],
  now: Date = new Date(),
): LoggerMetrics {
  const today = isoLocal(now);
  const weekStart = isoLocal(startOfWeek(now));
  const monthStart = isoLocal(new Date(now.getFullYear(), now.getMonth(), 1));

  const monthLogs = logs.filter((l) => l.date >= monthStart);
  const loggedDates = new Set(logs.filter((l) => hoursOf(l) > 0).map((l) => l.date));

  // Streak: walk back over weekdays only. Today not being logged yet does not
  // break the streak — the day isn't over — so start at the previous weekday
  // when today has nothing.
  let cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  while (isWeekend(cursor)) cursor = addDays(cursor, -1);
  if (!loggedDates.has(isoLocal(cursor))) cursor = prevWeekday(cursor);
  let streakWeekdays = 0;
  while (loggedDates.has(isoLocal(cursor))) {
    streakWeekdays += 1;
    cursor = prevWeekday(cursor);
  }

  // Gaps: weekdays in the last 14 days, excluding today.
  const missingWeekdays: string[] = [];
  for (let i = 14; i >= 1; i -= 1) {
    const d = addDays(now, -i);
    if (isWeekend(d)) continue;
    const iso = isoLocal(d);
    if (!loggedDates.has(iso)) missingWeekdays.push(iso);
  }

  // Last 7 days, oldest first, zero-filled.
  const last7Days: DayBucket[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = addDays(now, -i);
    const iso = isoLocal(d);
    last7Days.push({
      date: iso,
      label: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" }),
      hours: sum(logs.filter((l) => l.date === iso)),
      isToday: iso === today,
    });
  }

  const distinctMonthDays = new Set(
    monthLogs.filter((l) => hoursOf(l) > 0).map((l) => l.date),
  ).size;
  const monthHours = sum(monthLogs);

  return {
    todayHours: sum(logs.filter((l) => l.date === today)),
    weekHours: sum(logs.filter((l) => l.date >= weekStart)),
    monthHours,
    avgPerLoggedDay: distinctMonthDays === 0 ? 0 : monthHours / distinctMonthDays,
    last7Days,
    byProject: topBreakdown(monthLogs, (l) => l.project),
    byCategory: topBreakdown(monthLogs, (l) => String(l.category)),
    streakWeekdays,
    missingWeekdays,
    pendingHours: sum(logs.filter((l) => !l.approvedAt)),
    approvedHours: sum(logs.filter((l) => !!l.approvedAt)),
  };
}
