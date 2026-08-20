import { isCardId, sortByCatalogue, type CardId } from "./cards";

/**
 * Which overview tiles a user sees, and in which lane.
 *
 * Two lanes rather than one ordered list: the split has to be deterministic,
 * and "whatever overflows the first row" is not — the row holds five tiles on
 * a desktop and one on a phone, so the same preference would hide different
 * cards on different screens.
 *
 * Anything in neither lane is simply off. That makes "hidden" the absence of a
 * record, so a card added in a later release can never rearrange a layout
 * somebody has already settled on.
 */
export type OverviewPrefs = {
  /** Always visible, above the fold. */
  pinned: CardId[];
  /** Behind the "Show more" disclosure. */
  extra: CardId[];
};

/** The five tiles the overview shipped with, plus Yesterday one click away. */
export const DEFAULT_PREFS: OverviewPrefs = {
  pinned: ["today", "thisWeek", "thisMonth", "lastMonth", "avgLoggedDay"],
  extra: ["yesterday"],
};

/** Belt and braces against a corrupted or hand-edited payload. */
const MAX_CARDS = 40;

export type Lane = "pinned" | "extra";
/** A card is in one lane, or nowhere at all. */
export type Placement = Lane | "hidden";

export function placementOf(prefs: OverviewPrefs, id: CardId): Placement {
  if (prefs.pinned.includes(id)) return "pinned";
  if (prefs.extra.includes(id)) return "extra";
  return "hidden";
}

/** Moves one card to `to`, removing it from wherever it was. */
export function withPlacement(
  prefs: OverviewPrefs,
  id: CardId,
  to: Placement,
): OverviewPrefs {
  const pinned = prefs.pinned.filter((c) => c !== id);
  const extra = prefs.extra.filter((c) => c !== id);
  if (to === "pinned") pinned.push(id);
  if (to === "extra") extra.push(id);
  return { pinned: sortByCatalogue(pinned), extra: sortByCatalogue(extra) };
}

/**
 * Coerces untrusted input into usable preferences, or null when there is
 * nothing usable there at all.
 *
 * Unknown ids are dropped rather than rejected: a card retired in a later
 * release must not invalidate a whole saved layout. A card appearing in both
 * lanes is kept in `pinned`, so the visible lane wins.
 */
export function sanitizePrefs(raw: unknown): OverviewPrefs | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.pinned) && !Array.isArray(r.extra)) return null;

  const take = (v: unknown): CardId[] =>
    Array.isArray(v) ? v.filter(isCardId).slice(0, MAX_CARDS) : [];

  const pinned = [...new Set(take(r.pinned))];
  const pinnedSet = new Set(pinned);
  const extra = [...new Set(take(r.extra))].filter((id) => !pinnedSet.has(id));

  return { pinned: sortByCatalogue(pinned), extra: sortByCatalogue(extra) };
}

export function prefsEqual(a: OverviewPrefs, b: OverviewPrefs): boolean {
  const same = (x: CardId[], y: CardId[]) =>
    x.length === y.length && x.every((v, i) => v === y[i]);
  return same(a.pinned, b.pinned) && same(a.extra, b.extra);
}

/* ---------------------------------------------------------------------------
 * localStorage mirror.
 *
 * Same shape as the stopwatch store: a schema-stamped envelope, a memory
 * fallback for private browsing, and an external store so a change in one tab
 * reaches every other one. The mirror exists so the first paint has the real
 * layout — waiting on a fetch would show five default tiles and then reflow.
 * ------------------------------------------------------------------------- */

const SCHEMA = 1;

export type Scope = "new" | "legacy";

function prefsKey(scope: Scope) {
  return `devaicon.overview.${scope}.v1`;
}
/** Disclosure state is this-browser-only, never worth a network round trip. */
function expandedKey(scope: Scope) {
  return `devaicon.overview.${scope}.expanded.v1`;
}

let availability: boolean | null = null;

function storageAvailable(): boolean {
  if (availability !== null) return availability;
  try {
    const probe = "__devaicon_prefs_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    availability = true;
  } catch {
    availability = false;
  }
  return availability;
}

function rawOf(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, data: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ schema: SCHEMA, data }));
  } catch {
    // Quota or private mode. The hook keeps working in memory.
  }
}

function parse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { schema?: number; data?: unknown };
    return parsed?.schema === SCHEMA ? parsed.data : null;
  } catch {
    return null;
  }
}

const memPrefs = new Map<Scope, OverviewPrefs>();
const memExpanded = new Map<Scope, boolean>();

/* getSnapshot must be referentially stable or React re-renders forever, so the
   parsed value is cached against the raw string that produced it. */
type Cached<T> = { raw: string | null; value: T };
const prefsCache = new Map<Scope, Cached<OverviewPrefs>>();

export function getPrefs(scope: Scope): OverviewPrefs {
  if (!storageAvailable()) return memPrefs.get(scope) ?? DEFAULT_PREFS;
  const raw = rawOf(prefsKey(scope));
  const cached = prefsCache.get(scope);
  if (cached && cached.raw === raw) return cached.value;
  const value = sanitizePrefs(parse(raw)) ?? DEFAULT_PREFS;
  prefsCache.set(scope, { raw, value });
  return value;
}

export function getExpanded(scope: Scope): boolean {
  if (!storageAvailable()) return memExpanded.get(scope) ?? false;
  return parse(rawOf(expandedKey(scope))) === true;
}

/** SSR has no localStorage; these keep the server render stable. */
export function getServerPrefs(): OverviewPrefs {
  return DEFAULT_PREFS;
}
export function getServerExpanded(): boolean {
  return false;
}

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function writePrefs(scope: Scope, prefs: OverviewPrefs): void {
  if (storageAvailable()) write(prefsKey(scope), prefs);
  else memPrefs.set(scope, prefs);
  emit();
}

export function writeExpanded(scope: Scope, expanded: boolean): void {
  if (storageAvailable()) write(expandedKey(scope), expanded);
  else memExpanded.set(scope, expanded);
  emit();
}

/** Fires on same-tab writes and on changes made by another tab. */
export function subscribePrefs(scope: Scope, cb: () => void): () => void {
  listeners.add(cb);
  const keys = new Set([prefsKey(scope), expandedKey(scope)]);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || keys.has(e.key)) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
