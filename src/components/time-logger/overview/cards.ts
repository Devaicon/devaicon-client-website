import type { LoggerMetrics } from "../metrics";

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
  { id: "targets", label: "Targets & pace" },
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
  "expectedThisWeek",
  "expectedThisMonth",
  "weekComplete",
  "weekPace",
  "monthComplete",
  "monthPace",
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

/**
 * Which colour rule a percentage is read under.
 *
 * "pace" measures against what was expected *by now*, so it sits near 100
 * whenever the work is keeping up and dropping away from 100 is the warning —
 * amber, then red. "progress" measures against a whole period's commitment, so
 * it is *supposed* to read low on the 2nd of the month; colouring that red
 * would cry wolf every month. It earns green on completion and stays neutral
 * the rest of the time.
 */
export type PercentTone = "pace" | "progress";

/** How a tile renders its figure. StatTile has a branch per kind. */
export type CardValue =
  | { kind: "hours"; hours: number }
  /** Signed difference. The tile supplies the arrow and the colour. */
  | { kind: "delta"; hours: number }
  | { kind: "count"; count: number; noun: string; nounPlural: string }
  /**
   * A share of a target, with the target itself shown inline so the figure is
   * anchored to real hours. `pct` is null when nothing was expected at all.
   */
  | { kind: "percent"; pct: number | null; of: number; tone: PercentTone }
  | { kind: "highlight"; name: string; hours: number }
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
  /**
   * Renders as a single line under the label. Every tile is exactly two rows
   * — label, figure — so a row of them lines up whatever mix it holds.
   */
  value: (m: LoggerMetrics, ctx: CardContext) => CardValue;
};

function hours(h: number): CardValue {
  return { kind: "hours", hours: h };
}

function percent(pct: number | null, of: number, tone: PercentTone): CardValue {
  return { kind: "percent", pct, of, tone };
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
  },
  {
    id: "lastWorkingDay",
    group: "periods",
    label: () => "Last working day",
    value: (m) => hours(m.lastWorkingDayHours),
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

  /* ---------- targets & pace ---------- */
  {
    id: "expectedThisWeek",
    group: "targets",
    label: () => "Expected · this week",
    value: (m) => hours(m.expectedWeekHours),
  },
  {
    id: "expectedThisMonth",
    group: "targets",
    label: () => "Expected · this month",
    value: (m) => hours(m.expectedMonthHours),
  },
  {
    id: "weekComplete",
    group: "targets",
    label: () => "Week complete",
    value: (m) =>
      percent(m.weekCompletionPct, m.expectedWeekHours, "progress"),
  },
  {
    id: "weekPace",
    group: "targets",
    label: () => "Week pace",
    value: (m) => percent(m.weekPacePct, m.expectedWeekToDateHours, "pace"),
  },
  {
    id: "monthComplete",
    group: "targets",
    label: () => "Month complete",
    value: (m) =>
      percent(m.monthCompletionPct, m.expectedMonthHours, "progress"),
  },
  {
    id: "monthPace",
    group: "targets",
    label: () => "Month pace",
    value: (m) => percent(m.monthPacePct, m.expectedMonthToDateHours, "pace"),
  },

  /* ---------- trend & consistency ---------- */
  {
    id: "weekDelta",
    group: "consistency",
    label: () => "vs last week",
    value: (m) => ({ kind: "delta", hours: m.weekDeltaHours }),
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
  },

  /* ---------- highlights ---------- */
  {
    id: "topProject",
    group: "highlights",
    label: () => "Top project",
    value: (m) =>
      m.topProject
        ? { kind: "highlight", name: m.topProject.name, hours: m.topProject.hours }
        : { kind: "text", text: "No hours yet" },
  },
  {
    id: "topCategory",
    group: "highlights",
    label: () => "Top category",
    value: (m) =>
      m.topCategory
        ? { kind: "highlight", name: m.topCategory.name, hours: m.topCategory.hours }
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

/** Shared by the tile and the picker so both round a percentage the same way. */
export function formatPercent(pct: number | null): string {
  return pct === null ? "—" : `${Math.round(pct)}%`;
}

/**
 * A card's current figure as one short line, for the picker.
 *
 * The tray used to list bare labels, which made choosing between nineteen
 * cards a guessing game. Showing each one's live value turns the picker into a
 * preview of the card you are about to add.
 */
export function summariseCard(
  card: CardDef,
  metrics: LoggerMetrics,
  ctx: CardContext,
): string {
  const v = card.value(metrics, ctx);
  switch (v.kind) {
    case "hours":
      return ctx.fmt(v.hours);
    case "delta":
      return `${v.hours < 0 ? "−" : "+"}${ctx.fmt(Math.abs(v.hours))}`;
    case "count":
      return `${v.count} ${v.count === 1 ? v.noun : v.nounPlural}`;
    case "percent":
      return formatPercent(v.pct);
    case "highlight":
      return `${v.name} · ${ctx.fmt(v.hours)}`;
    case "text":
      return v.text;
  }
}

/**
 * Splits cards into catalogue groups, dropping any group left empty. Order
 * follows CARD_GROUPS, so the picker reads the same way every time whatever
 * subset it is handed.
 */
export function byGroup(
  cards: readonly CardDef[],
): { id: CardGroupId; label: string; cards: CardDef[] }[] {
  return CARD_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    cards: cards.filter((c) => c.group === g.id),
  })).filter((g) => g.cards.length > 0);
}
