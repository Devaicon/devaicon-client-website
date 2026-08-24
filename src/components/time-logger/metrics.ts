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

/** "Fri 15 Aug" from a local YYYY-MM-DD, without the UTC drift of `new Date(iso)`. */
export function formatDayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
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

/** The leading entry of a breakdown, with its share of the total, 0–100. */
export type Highlight = { name: string; hours: number; share: number };

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
  /** The previous calendar day, whether or not it was a working one. */
  yesterdayHours: number;
  /** The most recent day work was expected: skips weekends, leave and holidays. */
  lastWorkingDayHours: number;
  /** Local YYYY-MM-DD of that day, so a tile can name it. */
  lastWorkingDayISO: string;
  weekHours: number;
  /** The previous Sunday–Saturday week, work hours only. */
  lastWeekHours: number;
  /** weekHours - lastWeekHours. Signed: negative means this week is behind. */
  weekDeltaHours: number;
  monthHours: number;
  /** Previous calendar month, work hours only. */
  lastMonthHours: number;
  /** Calendar year to date, work hours only. */
  yearHours: number;
  /** Month hours divided by the number of distinct days that have entries. */
  avgPerLoggedDay: number;
  /**
   * Month hours divided by the working days elapsed so far this month. Unlike
   * avgPerLoggedDay this counts days that were expected but never logged, so
   * gaps drag it down instead of hiding.
   */
  avgPerWorkingDay: number;
  /** Highest single-day work total in the current month. */
  longestDayHours: number;
  /** Local YYYY-MM-DD of that day; null when the month has no work yet. */
  longestDayISO: string | null;
  /** Work rows dated in the current month. Leave and holiday rows never count. */
  entriesThisMonth: number;
  /** Most recent date carrying work hours; null when nothing is logged at all. */
  lastLoggedISO: string | null;
  /** Whole days from that date to today; null when nothing is logged at all. */
  daysSinceLastLog: number | null;
  /** Leading project this month, or null when the month has no work yet. */
  topProject: Highlight | null;
  /** Leading category this month, or null when the month has no work yet. */
  topCategory: Highlight | null;
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

/**
 * The leading row of a breakdown, as a share of `total`.
 *
 * topBreakdown sorts descending but folds its tail into an "Other" bucket —
 * which is a group, not a real name, so it can never lead.
 */
function leaderOf(items: Breakdown[], total: number): Highlight | null {
  const leader = items.find((b) => b.name !== "Other");
  if (!leader || leader.hours <= 0) return null;
  return {
    name: leader.name,
    hours: leader.hours,
    share: total === 0 ? 0 : (leader.hours / total) * 100,
  };
}

/** Whole days from `fromISO` to `toISO`. Rounded, so DST shifts can't skew it. */
function daysBetween(fromISO: string, toISO: string): number {
  const [fy, fm, fd] = fromISO.split("-").map(Number);
  const [ty, tm, td] = toISO.split("-").map(Number);
  const from = new Date(fy, fm - 1, fd).getTime();
  const to = new Date(ty, tm - 1, td).getTime();
  return Math.round((to - from) / 86_400_000);
}

/* ---------- entries-tab summary ---------- */

export type EntriesSummary = {
  /** Work hours only — leave and holiday rows never count. */
  totalHours: number;
  /** Every row in the filtered set, including any leave/holiday markers. */
  entryCount: number;
  /** Rows that actually carry work, i.e. the divisor for avgPerEntry. */
  workEntryCount: number;
  avgPerEntry: number;
  /** Distinct dates carrying work hours. */
  daysCovered: number;
  avgPerDay: number;
  approvedHours: number;
  pendingHours: number;
  /** Approved share of total hours, 0–100. */
  approvedPct: number;
  topProject: Highlight | null;
  /** Leave/holiday rows present but excluded from the hour figures. */
  nonWorkingCount: number;
};

/**
 * Summarises whatever the Entries tab is currently showing.
 *
 * Hour figures exclude leave and holiday rows, exactly as computeMetrics does —
 * a day marked off carries nominal hours only because the backends demand
 * `hours > 0`, and letting those into a total would overstate the work done.
 * The entry count deliberately does not exclude them: it describes the table,
 * and those rows are visible in it.
 */
export function summariseEntries(logs: TimeLog[]): EntriesSummary {
  const workLogs = logs.filter((l) => !isNonWorkingCategory(String(l.category)));
  const totalHours = sum(workLogs);
  const daysCovered = new Set(
    workLogs.filter((l) => hoursOf(l) > 0).map((l) => l.date),
  ).size;
  const approvedHours = sum(workLogs.filter((l) => !!l.approvedAt));
  const pendingHours = totalHours - approvedHours;

  const byProject = topBreakdown(workLogs, (l) => l.project);

  return {
    totalHours,
    entryCount: logs.length,
    workEntryCount: workLogs.length,
    avgPerEntry: workLogs.length === 0 ? 0 : totalHours / workLogs.length,
    daysCovered,
    avgPerDay: daysCovered === 0 ? 0 : totalHours / daysCovered,
    approvedHours,
    pendingHours,
    approvedPct: totalHours === 0 ? 0 : (approvedHours / totalHours) * 100,
    topProject: leaderOf(byProject, totalHours),
    nonWorkingCount: logs.length - workLogs.length,
  };
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
  const yesterday = isoLocal(addDays(now, -1));
  const lastWeekStart = isoLocal(addDays(startOfWeek(now), -7));
  const lastWeekEnd = isoLocal(addDays(startOfWeek(now), -1));
  const yearStart = isoLocal(new Date(now.getFullYear(), 0, 1));

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

  // One pass over the work rows, rather than re-filtering the whole list once
  // per day. The daily figures below all read from here.
  const hoursByDate = new Map<string, number>();
  for (const l of workLogs) {
    hoursByDate.set(l.date, (hoursByDate.get(l.date) ?? 0) + hoursOf(l));
  }
  const hoursOn = (iso: string): number => hoursByDate.get(iso) ?? 0;

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
      hours: hoursOn(iso),
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
      hours: hoursOn(iso),
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

  // Working days elapsed this month, today included: the divisor that makes a
  // missed day visible rather than simply absent from the average.
  let workingDaysElapsed = 0;
  for (let dayOfMonth = 1; dayOfMonth <= now.getDate(); dayOfMonth += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
    if (!isOffDay(d, offDates)) workingDaysElapsed += 1;
  }

  // The month's busiest day. monthDays is already built and month-scoped, so
  // the peak comes straight off it.
  let longestDay: CalendarDay | null = null;
  for (const d of monthDays) {
    if (d.hours > 0 && (!longestDay || d.hours > longestDay.hours)) longestDay = d;
  }

  // loggedDates holds only dates carrying work hours, and ISO dates sort
  // lexicographically, so the maximum is the most recent one.
  const lastLoggedISO = [...loggedDates].reduce<string | null>(
    (latest, d) => (latest === null || d > latest ? d : latest),
    null,
  );

  const weekHours = sum(workLogs.filter((l) => l.date >= weekStart));
  const lastWeekHours = sum(
    workLogs.filter((l) => l.date >= lastWeekStart && l.date <= lastWeekEnd),
  );
  const lastWorkingDayISO = isoLocal(prevWorkday(now, offDates));
  const byProject = topBreakdown(monthLogs, (l) => l.project);
  const byCategory = topBreakdown(monthLogs, (l) => String(l.category));

  return {
    todayHours: hoursOn(today),
    yesterdayHours: hoursOn(yesterday),
    lastWorkingDayHours: hoursOn(lastWorkingDayISO),
    lastWorkingDayISO,
    weekHours,
    lastWeekHours,
    weekDeltaHours: weekHours - lastWeekHours,
    monthHours,
    lastMonthHours: sum(
      workLogs.filter((l) => l.date >= lastMonthStart && l.date <= lastMonthEnd),
    ),
    yearHours: sum(workLogs.filter((l) => l.date >= yearStart)),
    avgPerLoggedDay: distinctMonthDays === 0 ? 0 : monthHours / distinctMonthDays,
    avgPerWorkingDay:
      workingDaysElapsed === 0 ? 0 : monthHours / workingDaysElapsed,
    longestDayHours: longestDay?.hours ?? 0,
    longestDayISO: longestDay?.date ?? null,
    entriesThisMonth: monthLogs.length,
    lastLoggedISO,
    daysSinceLastLog:
      lastLoggedISO === null ? null : daysBetween(lastLoggedISO, today),
    topProject: leaderOf(byProject, monthHours),
    topCategory: leaderOf(byCategory, monthHours),
    last7Days,
    monthDays,
    byProject,
    byCategory,
    streakWeekdays,
    missingWeekdays,
    pendingHours: sum(workLogs.filter((l) => !l.approvedAt)),
    approvedHours: sum(workLogs.filter((l) => !!l.approvedAt)),
    offDaysThisMonth,
  };
}
