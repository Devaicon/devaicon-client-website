import type { TimeFormat } from "./timeFormat";

/** "01:47:12" — always HH:MM:SS, zero-padded. */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/** "1h 47m 12s", dropping leading zero units. */
export function formatHuman(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (h > 0 || m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

/** Exact decimal hours, rounded to 2dp. 1h47m12s -> 1.79. */
export function msToHours(ms: number): number {
  return Math.round((ms / 3_600_000) * 100) / 100;
}

/* ---------- logged hour quantities (see timeFormat.ts) ---------- */

/**
 * "7h 30m" — hours and minutes, dropping empty units: 3 -> "3h", 0.25 -> "15m",
 * 0 -> "0m". Rounded to the nearest minute, so seconds never surface here;
 * logged hours are an estimate to the quarter-hour, not a stopwatch reading.
 */
export function formatHoursHuman(hours: number): string {
  const safe = Number.isFinite(hours) ? Math.max(0, hours) : 0;
  const totalMinutes = Math.round(safe * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "7.5 h", or "7.50" with `unit: false` for a right-aligned Hours column. */
export function formatHoursDecimal(
  hours: number,
  { decimals = 1, unit = true }: { decimals?: number; unit?: boolean } = {},
): string {
  const safe = Number.isFinite(hours) ? hours : 0;
  return unit ? `${safe.toFixed(decimals)} h` : safe.toFixed(decimals);
}

/**
 * Renders an hour quantity in the user's chosen format. `decimals` and `unit`
 * only apply to the decimal format — "7h 30m" carries its own units and its
 * precision is fixed at one minute.
 */
export function formatHours(
  hours: number,
  format: TimeFormat,
  opts: { decimals?: number; unit?: boolean } = {},
): string {
  return format === "human"
    ? formatHoursHuman(hours)
    : formatHoursDecimal(hours, opts);
}
