/**
 * The Overview page as an ordered list of movable blocks.
 *
 * The tile band already lets a user choose *which* figures they see; this
 * chooses where everything sits. The two are deliberately separate stores: one
 * is about content, the other about layout, and a user who has rearranged the
 * page should not lose that by resetting their cards.
 *
 * A layout is an ordered list of placements. Order is the whole of the
 * positioning model — blocks flow into a two-column grid, and a full-width
 * block takes both columns — because a free canvas of absolute coordinates
 * cannot survive a phone-width screen, and this can: on a narrow screen the
 * same list simply stacks.
 *
 * A section absent from the list is hidden, which makes hiding the absence of
 * a record. A section added in a later release is therefore never dropped into
 * the middle of a layout somebody has already settled on — it appears at the
 * end, where it can be found and moved.
 */

export type SectionId =
  | "stats"
  | "calendar"
  | "streak"
  | "last7"
  | "approval"
  | "byProject"
  | "byCategory";

export type SectionWidth = "full" | "half";

export type SectionPlacement = {
  id: SectionId;
  width: SectionWidth;
};

export type SectionLayout = SectionPlacement[];

export type SectionDef = {
  id: SectionId;
  /** Shown on the drag handle and in the hidden tray. */
  title: string;
  defaultWidth: SectionWidth;
  /** False where the block only reads well at full width. */
  resizable: boolean;
};

export const SECTIONS: SectionDef[] = [
  {
    id: "stats",
    title: "Your cards",
    defaultWidth: "full",
    // The tile band lays itself out across the page and picks its own column
    // count; boxing it into half the width would fight that.
    resizable: false,
  },
  { id: "calendar", title: "Calendar", defaultWidth: "full", resizable: true },
  { id: "streak", title: "Streak", defaultWidth: "full", resizable: false },
  { id: "last7", title: "Last 7 days", defaultWidth: "half", resizable: true },
  { id: "approval", title: "Approval", defaultWidth: "half", resizable: true },
  {
    id: "byProject",
    title: "Hours by project",
    defaultWidth: "half",
    resizable: true,
  },
  {
    id: "byCategory",
    title: "Hours by category",
    defaultWidth: "half",
    resizable: true,
  },
];

const BY_ID = new Map(SECTIONS.map((s) => [s.id, s]));

export function sectionById(id: SectionId): SectionDef | undefined {
  return BY_ID.get(id);
}

export function isSectionId(v: unknown): v is SectionId {
  return typeof v === "string" && BY_ID.has(v as SectionId);
}

/** The page as it shipped, before anybody moved anything. */
export const DEFAULT_LAYOUT: SectionLayout = SECTIONS.map((s) => ({
  id: s.id,
  width: s.defaultWidth,
}));

/* ---------------------------------------------------------------------------
 * Pure operations. Every one returns a new layout, so a caller can hand the
 * result straight to a store write.
 * ------------------------------------------------------------------------- */

export function move(layout: SectionLayout, from: number, to: number): SectionLayout {
  if (from === to || from < 0 || from >= layout.length) return layout;
  const next = layout.slice();
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, item);
  return next;
}

export function hide(layout: SectionLayout, id: SectionId): SectionLayout {
  return layout.filter((p) => p.id !== id);
}

/** Restores a hidden section at the end, where the user is looking for it. */
export function show(layout: SectionLayout, id: SectionId): SectionLayout {
  if (layout.some((p) => p.id === id)) return layout;
  const def = sectionById(id);
  if (!def) return layout;
  return [...layout, { id, width: def.defaultWidth }];
}

export function setWidth(
  layout: SectionLayout,
  id: SectionId,
  width: SectionWidth,
): SectionLayout {
  return layout.map((p) => {
    if (p.id !== id) return p;
    const def = sectionById(id);
    return { ...p, width: def?.resizable ? width : def?.defaultWidth ?? p.width };
  });
}

export function hiddenSections(layout: SectionLayout): SectionDef[] {
  const present = new Set(layout.map((p) => p.id));
  return SECTIONS.filter((s) => !present.has(s.id));
}

export function layoutsEqual(a: SectionLayout, b: SectionLayout): boolean {
  return (
    a.length === b.length &&
    a.every((p, i) => p.id === b[i].id && p.width === b[i].width)
  );
}

/**
 * Coerces untrusted input into a usable layout, or null when there is nothing
 * usable there. Unknown ids are dropped rather than rejected, and a section
 * listed twice keeps its first position.
 */
export function sanitizeLayout(raw: unknown): SectionLayout | null {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<SectionId>();
  const out: SectionLayout = [];
  for (const entry of raw.slice(0, SECTIONS.length * 2)) {
    if (typeof entry !== "object" || entry === null) continue;
    const { id, width } = entry as { id?: unknown; width?: unknown };
    if (!isSectionId(id) || seen.has(id)) continue;
    const def = sectionById(id)!;
    seen.add(id);
    out.push({
      id,
      width:
        def.resizable && (width === "full" || width === "half")
          ? width
          : def.defaultWidth,
    });
  }
  return out.length > 0 ? out : null;
}

/* ---------------------------------------------------------------------------
 * localStorage mirror, matching the card preferences store: a schema-stamped
 * envelope, a memory fallback for private browsing, and an external store so a
 * change in one tab reaches every other one.
 *
 * Layout stays browser-local even in the new client. The account preferences
 * endpoint understands card lists and nothing else, and a layout that silently
 * failed to save would be worse than one that never claimed to.
 * ------------------------------------------------------------------------- */

const SCHEMA = 1;

export type Scope = "new" | "legacy";

function layoutKey(scope: Scope) {
  return `devaicon.overview.${scope}.sections.v1`;
}

let availability: boolean | null = null;

function storageAvailable(): boolean {
  if (availability !== null) return availability;
  try {
    const probe = "__devaicon_sections_probe__";
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

function parse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { schema?: number; data?: unknown };
    return parsed?.schema === SCHEMA ? parsed.data : null;
  } catch {
    return null;
  }
}

const memory = new Map<Scope, SectionLayout>();

/* getSnapshot must be referentially stable or React re-renders forever, so the
   parsed value is cached against the raw string that produced it. */
type Cached = { raw: string | null; value: SectionLayout };
const cache = new Map<Scope, Cached>();

export function getLayout(scope: Scope): SectionLayout {
  if (!storageAvailable()) return memory.get(scope) ?? DEFAULT_LAYOUT;
  const raw = rawOf(layoutKey(scope));
  const cached = cache.get(scope);
  if (cached && cached.raw === raw) return cached.value;
  const value = sanitizeLayout(parse(raw)) ?? DEFAULT_LAYOUT;
  cache.set(scope, { raw, value });
  return value;
}

/** SSR has no localStorage; this keeps the server render stable. */
export function getServerLayout(): SectionLayout {
  return DEFAULT_LAYOUT;
}

const listeners = new Set<() => void>();

export function writeLayout(scope: Scope, layout: SectionLayout): void {
  if (storageAvailable()) {
    try {
      window.localStorage.setItem(
        layoutKey(scope),
        JSON.stringify({ schema: SCHEMA, data: layout }),
      );
    } catch {
      memory.set(scope, layout);
    }
  } else {
    memory.set(scope, layout);
  }
  listeners.forEach((l) => l());
}

/** Fires on same-tab writes and on changes made by another tab. */
export function subscribeLayout(scope: Scope, cb: () => void): () => void {
  listeners.add(cb);
  const key = layoutKey(scope);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === key) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
