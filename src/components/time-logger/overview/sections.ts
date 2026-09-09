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

/**
 * Two sizes, and only two.
 *
 * "min" is half the columns and two rows deep — near enough a square at the
 * widths this page is read at. "max" is every column, at the same two rows,
 * which is why maximising a block widens it rather than growing it in both
 * directions. The streak is the one exception: maximised it takes a single
 * row, because it is a strip of ten small squares and a number, and stretched
 * to a square it would be mostly empty.
 *
 * "Rows" here are a unit of height, not grid tracks — see `gridClassOf`.
 */
export type SectionSize = "min" | "max";

export type SectionPlacement = {
  id: SectionId;
  size: SectionSize;
};

export type SectionLayout = SectionPlacement[];

export type SectionDef = {
  id: SectionId;
  /** Shown on the drag handle and in the hidden tray. */
  title: string;
  defaultSize: SectionSize;
  /** False where the block lays itself out and must not be boxed. */
  resizable: boolean;
  /** Row depth when maximised. One row is the short strip; two is the norm. */
  maxRows: 1 | 2;
  /**
   * True for a block with editing controls of its own, which must keep
   * responding while the page is being customised. Everything else goes inert
   * so that a drag can start anywhere on it.
   */
  keepsInteractive: boolean;
};

export const SECTIONS: SectionDef[] = [
  {
    id: "stats",
    title: "Your cards",
    defaultSize: "max",
    // The tile band picks its own column count and grows to however many cards
    // are showing. Boxing it into a fixed two rows would fight that, so it is
    // the one block that always spans the page and always sizes to itself.
    resizable: false,
    maxRows: 2,
    // The tile band's own hide, move and add controls live inside it, and
    // Customise is exactly when they are wanted.
    keepsInteractive: true,
  },
  {
    id: "calendar",
    title: "Calendar",
    defaultSize: "max",
    resizable: true,
    maxRows: 2,
    keepsInteractive: false,
  },
  {
    id: "streak",
    title: "Streak",
    defaultSize: "max",
    resizable: true,
    maxRows: 1,
    keepsInteractive: false,
  },
  {
    id: "last7",
    title: "Last 7 days",
    defaultSize: "min",
    resizable: true,
    maxRows: 2,
    keepsInteractive: false,
  },
  {
    id: "approval",
    title: "Approval",
    defaultSize: "min",
    resizable: true,
    maxRows: 2,
    keepsInteractive: false,
  },
  {
    id: "byProject",
    title: "Hours by project",
    defaultSize: "min",
    resizable: true,
    maxRows: 2,
    keepsInteractive: false,
  },
  {
    id: "byCategory",
    title: "Hours by category",
    defaultSize: "min",
    resizable: true,
    maxRows: 2,
    keepsInteractive: false,
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
  size: s.defaultSize,
}));

/**
 * The grid classes one placement resolves to.
 *
 * Height is a minimum on the block itself rather than a row span over a sized
 * track. Both express the same two-row geometry, but a shared row track imposes
 * its minimum on every block in the row — including the tile band, which has no
 * fixed height and was left sitting above a strip of empty grid whenever its
 * cards did not reach the minimum. A per-block minimum lets that one size to
 * its content while the rest keep their slots.
 *
 * The numbers are one row of 13rem and two of them plus the 1rem gap between,
 * written out because Tailwind scans for whole class names and would never
 * generate a size built at runtime.
 */
export function gridClassOf(def: SectionDef, size: SectionSize): string {
  if (!def.resizable) return "lg:col-span-2";
  if (size === "min") return "lg:col-span-1 lg:min-h-[27rem]";
  return def.maxRows === 1
    ? "lg:col-span-2 lg:min-h-[13rem]"
    : "lg:col-span-2 lg:min-h-[27rem]";
}

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
  return [...layout, { id, size: def.defaultSize }];
}

export function setSize(
  layout: SectionLayout,
  id: SectionId,
  size: SectionSize,
): SectionLayout {
  return layout.map((p) => {
    if (p.id !== id) return p;
    const def = sectionById(id);
    return { ...p, size: def?.resizable ? size : def?.defaultSize ?? p.size };
  });
}

export function hiddenSections(layout: SectionLayout): SectionDef[] {
  const present = new Set(layout.map((p) => p.id));
  return SECTIONS.filter((s) => !present.has(s.id));
}

export function layoutsEqual(a: SectionLayout, b: SectionLayout): boolean {
  return (
    a.length === b.length &&
    a.every((p, i) => p.id === b[i].id && p.size === b[i].size)
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
    const { id, size } = entry as { id?: unknown; size?: unknown };
    if (!isSectionId(id) || seen.has(id)) continue;
    const def = sectionById(id)!;
    seen.add(id);
    out.push({
      id,
      size:
        def.resizable && (size === "min" || size === "max")
          ? size
          : def.defaultSize,
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
