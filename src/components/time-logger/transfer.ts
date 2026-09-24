import { THEMES, type Theme } from "@/components/theme/theme";
import { APP_VERSION } from "@/lib/changelog";
import { sanitizePrefs, type OverviewPrefs } from "./overview/preferences";
import { sanitizeLayout, type SectionLayout } from "./overview/sections";
import { sanitizeSettings, type LoggerSettings } from "./settings";
import { TIME_FORMATS, type TimeFormat } from "./timeFormat";

/**
 * Moving a dashboard set-up between browsers, or keeping a copy of it, as a
 * JSON file.
 *
 * Only what the reader chose travels: the cards and where the sections sit,
 * the behaviour switches, and the theme and time format. No entries, no
 * account details, no stopwatch state — a set-up file is safe to hand to a
 * colleague who wants the same dashboard.
 *
 * Reading is as defensive as every other store here. Each part goes through
 * the same sanitiser its own store uses, so a hand-edited or older file loses
 * only the parts that no longer make sense, and a part that is missing is left
 * alone rather than reset.
 */

const MARKER = "devaicon-time-logger";
const FORMAT_VERSION = 1;

export type DashboardSetup = {
  cards: OverviewPrefs;
  sections: SectionLayout;
  settings: LoggerSettings;
  appearance: { theme: Theme; timeFormat: TimeFormat };
};

type SetupFile = {
  app: typeof MARKER;
  format: typeof FORMAT_VERSION;
  appVersion: string;
  exportedAt: string;
  /** Which tracker it came from. Informational: either one can import it. */
  client: "new" | "legacy";
} & DashboardSetup;

export function buildSetupFile(
  setup: DashboardSetup,
  client: "new" | "legacy",
  now: Date,
): string {
  const file: SetupFile = {
    app: MARKER,
    format: FORMAT_VERSION,
    appVersion: APP_VERSION,
    exportedAt: now.toISOString(),
    client,
    ...setup,
  };
  return JSON.stringify(file, null, 2);
}

export function setupFileName(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `devaicon-dashboard-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`;
}

export type ParsedSetup = {
  /** Only the parts the file carried in a usable shape. */
  setup: Partial<DashboardSetup>;
  /** Plain-language names of those parts, for the confirmation line. */
  parts: string[];
};

// Flat rather than a discriminated union: this project compiles with
// `strict: false`, where a boolean-literal discriminant does not narrow.
export type ParseResult = { ok: boolean; parsed?: ParsedSetup; message?: string };

export function parseSetupFile(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, message: "That file is not valid JSON." };
  }
  if (typeof raw !== "object" || raw === null || (raw as { app?: unknown }).app !== MARKER) {
    return { ok: false, message: "That file is not a Devaicon dashboard export." };
  }
  const r = raw as Record<string, unknown>;
  if (typeof r.format === "number" && r.format > FORMAT_VERSION) {
    return {
      ok: false,
      message: "That file came from a newer version of the tracker. Refresh this page and try again.",
    };
  }

  const setup: Partial<DashboardSetup> = {};
  const parts: string[] = [];

  const cards = sanitizePrefs(r.cards);
  if (cards) {
    setup.cards = cards;
    parts.push("cards");
  }
  const sections = sanitizeLayout(r.sections);
  if (sections) {
    setup.sections = sections;
    parts.push("page layout");
  }
  if (typeof r.settings === "object" && r.settings !== null) {
    setup.settings = sanitizeSettings(r.settings);
    parts.push("options");
  }
  const a = r.appearance as { theme?: unknown; timeFormat?: unknown } | undefined;
  if (
    a &&
    THEMES.includes(a.theme as Theme) &&
    TIME_FORMATS.includes(a.timeFormat as TimeFormat)
  ) {
    setup.appearance = {
      theme: a.theme as Theme,
      timeFormat: a.timeFormat as TimeFormat,
    };
    parts.push("appearance");
  }

  if (parts.length === 0) {
    return { ok: false, message: "That file has nothing in it this tracker can use." };
  }
  return { ok: true, parsed: { setup, parts } };
}

/** "a, b and c". */
export function listParts(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}
