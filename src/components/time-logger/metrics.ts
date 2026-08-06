import {
  isNonWorkingCategory,
  type NonWorkingCategory,
  type TimeLog,
} from "@/lib/types";

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
  x.setDate(x.getDate() - x.getDay()); // Sunday start (getDay: Sun = 0)
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

// A day carrying a leave or holiday entry neither breaks a streak nor counts
// as a missed log, exactly like a weekend.
function isOffDay(d: Date, offDates: Set<string>): boolean {
  return isWeekend(d) || offDates.has(isoLocal(d));
}

/** The previous day that was actually expected to be worked. */
function prevWorkday(d: Date, offDates: Set<string>): Date {
  let x = addDays(d, -1);
  // Bounded so a pathological run of off-days can't spin forever.
  for (let guard = 0; isOffDay(x, offDates) && guard < 400; guard += 1) {
    x = addDays(x, -1);
  }
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
  /** Weekend, leave or holiday — zero hours here is expected, not a gap. */
  isOff: boolean;
};

export type Breakdown = { name: string; hours: number };

/** One cell of the month calendar heatmap. */
export type CalendarDay = {
  /** Local YYYY-MM-DD. */
  date: string;
  dayOfMonth: number;
  /** Work hours only; leave and holiday entries never contribute. */
  hours: number;
  isToday: boolean;
  isWeekend: boolean;
  /** Set when the day carries a Leave or Holiday entry. */
  offKind: NonWorkingCategory | null;
  /** Id of that entry, so the marking can be undone. */
  offLogId: string | null;
  isFuture: boolean;
};

export type LoggerMetrics = {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  /** Previous calendar month, work hours only. */
  lastMonthHours: number;
  /** Month hours divided by the number of distinct days that have entries. */
  avgPerLoggedDay: number;
  last7Days: DayBucket[];
  /** Every day of the current month, for the calendar heatmap. */
  monthDays: CalendarDay[];
  byProject: Breakdown[];
  byCategory: Breakdown[];
  /** Consecutive weekdays with at least one entry. Weekends are skipped. */
  streakWeekdays: number;
  /**
   * Weekdays in the last 14 days, excluding today, with neither work logged
   * nor a leave/holiday marker.
   */
  missingWeekdays: string[];
  pendingHours: number;
  approvedHours: number;
  /** Leave and holiday days marked in the current month. */
  offDaysThisMonth: number;
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
  // Month -1 and day 0 both roll over correctly in January.
  const lastMonthStart = isoLocal(
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
  );
  const lastMonthEnd = isoLocal(new Date(now.getFullYear(), now.getMonth(), 0));

  // Leave and holiday entries mark a day off. They are real log rows, so they
  // must be kept out of every hour total, average and chart — otherwise a
  // single 8h leave entry inflates the month and skews the breakdowns.
  const offEntries = new Map<string, { kind: NonWorkingCategory; id: string }>();
  for (const l of logs) {
    const category = String(l.category);
    if (!isNonWorkingCategory(category)) continue;
    // First entry wins if a day somehow carries two markers.
    if (!offEntries.has(l.date)) {
      offEntries.set(l.date, { kind: category as NonWorkingCategory, id: l.id });
    }
  }
  const offDates = new Set(offEntries.keys());
  const workLogs = logs.filter((l) => !isNonWorkingCategory(String(l.category)));

  const monthLogs = workLogs.filter((l) => l.date >= monthStart);
  const loggedDates = new Set(
    workLogs.filter((l) => hoursOf(l) > 0).map((l) => l.date),
  );

  // Streak: walk back over working days, skipping weekends and days marked off.
  // Today not being logged yet does not break the streak — the day isn't over —
  // so start at the previous working day when today has nothing.
  let cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (isOffDay(cursor, offDates)) cursor = prevWorkday(cursor, offDates);
  if (!loggedDates.has(isoLocal(cursor))) cursor = prevWorkday(cursor, offDates);
  let streakWeekdays = 0;
  while (loggedDates.has(isoLocal(cursor))) {
    streakWeekdays += 1;
    cursor = prevWorkday(cursor, offDates);
  }

  // Gaps: working days in the last 14 days, excluding today.
  const missingWeekdays: string[] = [];
  for (let i = 14; i >= 1; i -= 1) {
    const d = addDays(now, -i);
    if (isOffDay(d, offDates)) continue;
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
      hours: sum(workLogs.filter((l) => l.date === iso)),
      isToday: iso === today,
      isOff: isOffDay(d, offDates),
    });
  }

  // Every day of the current month, for the calendar heatmap.
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const monthDays: CalendarDay[] = [];
  for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
    const iso = isoLocal(d);
    const off = offEntries.get(iso) ?? null;
    monthDays.push({
      date: iso,
      dayOfMonth,
      hours: sum(workLogs.filter((l) => l.date === iso)),
      isToday: iso === today,
      isWeekend: isWeekend(d),
      offKind: off?.kind ?? null,
      offLogId: off?.id ?? null,
      isFuture: iso > today,
    });
  }

  const distinctMonthDays = new Set(
    monthLogs.filter((l) => hoursOf(l) > 0).map((l) => l.date),
  ).size;
  const monthHours = sum(monthLogs);

  let offDaysThisMonth = 0;
  offDates.forEach((d) => {
    if (d >= monthStart) offDaysThisMonth += 1;
  });

  return {
    todayHours: sum(workLogs.filter((l) => l.date === today)),
    weekHours: sum(workLogs.filter((l) => l.date >= weekStart)),
    monthHours,
    lastMonthHours: sum(
      workLogs.filter((l) => l.date >= lastMonthStart && l.date <= lastMonthEnd),
    ),
    avgPerLoggedDay: distinctMonthDays === 0 ? 0 : monthHours / distinctMonthDays,
    last7Days,
    monthDays,
    byProject: topBreakdown(monthLogs, (l) => l.project),
    byCategory: topBreakdown(monthLogs, (l) => String(l.category)),
    streakWeekdays,
    missingWeekdays,
    pendingHours: sum(workLogs.filter((l) => !l.approvedAt)),
    approvedHours: sum(workLogs.filter((l) => !!l.approvedAt)),
    offDaysThisMonth,
  };
}
