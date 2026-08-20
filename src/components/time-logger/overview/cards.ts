import { formatDayLabel, type LoggerMetrics } from "../metrics";

/**
 * The overview tile catalogue.
 *
 * Every card is a pure descriptor: an id that outlives releases, a label, and
 * a function pulling its figure out of LoggerMetrics. Nothing here renders —
 * StatTile owns that — so adding a metric is a data change, not a UI one.
 *
 * Ids are persisted in user preferences. Renaming one silently drops that card
 * from every saved layout, so treat them as a stable wire format: add freely,
 * rename never.
 */

export const CARD_GROUPS = [
  { id: "periods", label: "Time periods" },
  { id: "consistency", label: "Trend & consistency" },
  { id: "volume", label: "Approval & volume" },
  { id: "highlights", label: "Highlights" },
] as const;

export type CardGroupId = (typeof CARD_GROUPS)[number]["id"];

export const CARD_IDS = [
  "today",
  "yesterday",
  "lastWorkingDay",
  "thisWeek",
  "lastWeek",
  "thisMonth",
  "lastMonth",
  "thisYear",
  "weekDelta",
  "avgLoggedDay",
  "avgWorkingDay",
  "streak",
  "daysOff",
  "lastLogged",
  "pendingApproval",
  "entriesThisMonth",
  "longestDay",
  "topProject",
  "topCategory",
] as const;

export type CardId = (typeof CARD_IDS)[number];

const CARD_ID_SET: ReadonlySet<string> = new Set(CARD_IDS);

export function isCardId(v: unknown): v is CardId {
  return typeof v === "string" && CARD_ID_SET.has(v);
}

/** How a tile renders its figure. StatTile has a branch per kind. */
export type CardValue =
  | { kind: "hours"; hours: number }
  /** Signed difference. The tile supplies the arrow and the colour. */
  | { kind: "delta"; hours: number }
  | { kind: "count"; count: number; noun: string; nounPlural: string }
  | { kind: "highlight"; name: string; hours: number; share: number }
  /** A figure that isn't a quantity, or a "nothing yet" stand-in. */
  | { kind: "text"; text: string };

export type CardContext = {
  now: Date;
  /** Hour rendering in the user's chosen format, from TimeFormatProvider. */
  fmt: (hours: number) => string;
};

export type CardDef = {
  id: CardId;
  group: CardGroupId;
  label: (ctx: CardContext) => string;
  value: (m: LoggerMetrics, ctx: CardContext) => CardValue;
  /** Optional line under the figure, giving it something to sit against. */
  hint?: (m: LoggerMetrics, ctx: CardContext) => string | null;
};

function hours(h: number): CardValue {
  return { kind: "hours", hours: h };
}

/** Renders "2 days ago" style prose for a whole-day offset. */
function agoLabel(days: number): string {
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export const CARDS: readonly CardDef[] = [
  /* ---------- time periods ---------- */
  {
    id: "today",
    group: "periods",
    label: () => "Today",
    value: (m) => hours(m.todayHours),
  },
  {
    id: "yesterday",
    group: "periods",
    label: () => "Yesterday",
    value: (m) => hours(m.yesterdayHours),
    // The calendar day before today, weekend or not — so a Monday morning
    // reads 0h. "Last working day" is the card that skips those.
    hint: (_m, ctx) => {
      const d = new Date(ctx.now);
      d.setDate(d.getDate() - 1);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return formatDayLabel(iso);
    },
  },
  {
    id: "lastWorkingDay",
    group: "periods",
    label: () => "Last working day",
    value: (m) => hours(m.lastWorkingDayHours),
    hint: (m) => formatDayLabel(m.lastWorkingDayISO),
  },
  {
    id: "thisWeek",
    group: "periods",
    label: () => "This week",
    value: (m) => hours(m.weekHours),
  },
  {
    id: "lastWeek",
    group: "periods",
    label: () => "Last week",
    value: (m) => hours(m.lastWeekHours),
  },
  {
    id: "thisMonth",
    group: "periods",
    label: () => "This month",
    value: (m) => hours(m.monthHours),
  },
  {
    id: "lastMonth",
    group: "periods",
    // A settled historical figure, so name the month outright rather than
    // leaving the reader to work out which one "last" means.
    label: (ctx) =>
      new Date(ctx.now.getFullYear(), ctx.now.getMonth() - 1, 1).toLocaleDateString(
        undefined,
        { month: "long" },
      ),
    value: (m) => hours(m.lastMonthHours),
  },
  {
    id: "thisYear",
    group: "periods",
    label: (ctx) => String(ctx.now.getFullYear()),
    value: (m) => hours(m.yearHours),
  },

  /* ---------- trend & consistency ---------- */
  {
    id: "weekDelta",
    group: "consistency",
    label: () => "vs last week",
    value: (m) => ({ kind: "delta", hours: m.weekDeltaHours }),
    hint: (m, ctx) => `${ctx.fmt(m.lastWeekHours)} last week`,
  },
  {
    id: "avgLoggedDay",
    group: "consistency",
    label: () => "Avg / logged day",
    value: (m) => hours(m.avgPerLoggedDay),
  },
  {
    id: "avgWorkingDay",
    group: "consistency",
    label: () => "Avg / working day",
    value: (m) => hours(m.avgPerWorkingDay),
    hint: () => "Counts days you didn't log",
  },
  {
    id: "streak",
    group: "consistency",
    label: () => "Logging streak",
    value: (m) => ({
      kind: "count",
      count: m.streakWeekdays,
      noun: "weekday",
      nounPlural: "weekdays",
    }),
  },
  {
    id: "daysOff",
    group: "consistency",
    label: () => "Days off · this month",
    value: (m) => ({
      kind: "count",
      count: m.offDaysThisMonth,
      noun: "day",
      nounPlural: "days",
    }),
  },
  {
    id: "lastLogged",
    group: "consistency",
    label: () => "Last logged",
    value: (m) => ({
      kind: "text",
      text: m.daysSinceLastLog === null ? "Never" : agoLabel(m.daysSinceLastLog),
    }),
    hint: (m) => (m.lastLoggedISO ? formatDayLabel(m.lastLoggedISO) : null),
  },

  /* ---------- approval & volume ---------- */
  {
    id: "pendingApproval",
    group: "volume",
    label: () => "Pending approval",
    value: (m) => hours(m.pendingHours),
  },
  {
    id: "entriesThisMonth",
    group: "volume",
    label: () => "Entries · this month",
    value: (m) => ({
      kind: "count",
      count: m.entriesThisMonth,
      noun: "entry",
      nounPlural: "entries",
    }),
  },
  {
    id: "longestDay",
    group: "volume",
    label: () => "Longest day",
    value: (m) => hours(m.longestDayHours),
    hint: (m) => (m.longestDayISO ? formatDayLabel(m.longestDayISO) : null),
  },

  /* ---------- highlights ---------- */
  {
    id: "topProject",
    group: "highlights",
    label: () => "Top project",
    value: (m) =>
      m.topProject
        ? { kind: "highlight", ...m.topProject }
        : { kind: "text", text: "No hours yet" },
  },
  {
    id: "topCategory",
    group: "highlights",
    label: () => "Top category",
    value: (m) =>
      m.topCategory
        ? { kind: "highlight", ...m.topCategory }
        : { kind: "text", text: "No hours yet" },
  },
];

const BY_ID = new Map<CardId, CardDef>(CARDS.map((c) => [c.id, c]));

export function cardById(id: CardId): CardDef | undefined {
  return BY_ID.get(id);
}

/** Catalogue order, used to keep each lane reading sensibly without drag-and-drop. */
export function sortByCatalogue(ids: readonly CardId[]): CardId[] {
  const rank = new Map(CARD_IDS.map((id, i) => [id, i]));
  return [...ids].sort((a, b) => (rank.get(a) ?? 0) - (rank.get(b) ?? 0));
}
