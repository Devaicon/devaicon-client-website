# Time Logger: Stopwatch, Tabbed Dashboard & Changelog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give time-logger users a live stopwatch, a tabbed dashboard with real metrics and charts, and in-app release notes — shipped to both the new and legacy clients from a single shared component.

**Architecture:** The two near-identical 800-line dashboard pages collapse into one `TimeLoggerDashboard` component parameterised by a `LoggerConfig` object that carries every difference between the clients. Network access moves into a `useLoggerData` hook, metric maths into a pure `metrics.ts`, and stopwatch time into a `useStopwatch` hook that derives elapsed from `Date.now()` rather than counting ticks, so a frozen or discarded tab cannot corrupt a measurement.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Recharts 3.x, npm.

Spec: [`docs/superpowers/specs/2026-07-23-time-logger-stopwatch-design.md`](../specs/2026-07-23-time-logger-stopwatch-design.md)

## Global Constraints

- **Working directory is `client/`.** All paths below are relative to it. It is its own git repository; the parent directory is not.
- **Package manager is `npm`.** Never `bun`, `pnpm` or `yarn`. `.claude/CLAUDE.md` mandates Bun; it is stale and was overruled by the user for this work.
- **No server changes.** Nothing under `server/` is touched. No new API routes.
- **No test framework.** Verification for every task is `npm run build`, `npm run lint`, and the named manual checks. Do not install vitest/jest/playwright.
- **Both clients, one implementation.** Any feature written into `components/time-logger/` must work unchanged for both `NEW_CONFIG` and `LEGACY_CONFIG`.
- **Dark mode is mandatory.** Every element needs `dark:` variants. The app defaults to dark (`DEFAULT_THEME = "dark"` in `src/components/theme/theme.ts`).
- **Existing behaviour is preserved.** Phase 1 is a pure refactor: no user-visible change whatsoever.
- **Hours in the stopwatch dialog are exact decimals** (`1h47m` → `1.78`) with `step={0.01} min={0.01} max={24}`. The manual form keeps its existing `step={0.25} min={0.25}`.
- **Changelog v1.3.0 is titled exactly `Quality of Life Changes`** and must **not** mention the stopwatch. This is an explicit user instruction.
- **Recharts version:** `recharts@^3.10.0`. Its React peer range includes `^19.0.0`.
- **Every component under `components/time-logger/` and `components/changelog/` needs `"use client"`** — they use hooks and browser APIs.

---

## File Structure

**Created:**

| Path | Responsibility |
|---|---|
| `src/components/time-logger/config.ts` | `LoggerConfig` type, `NEW_CONFIG`, `LEGACY_CONFIG`. Pure `.ts`, no JSX. |
| `src/components/time-logger/useLoggerData.ts` | All network I/O: load me/projects/logs, create, delete, bulk delete, logout. |
| `src/components/time-logger/TimeLoggerDashboard.tsx` | Shell: header, banner slot, pinned bars, tab switcher. |
| `src/components/time-logger/metrics.ts` | Pure date + aggregation functions. No React, no fetch. |
| `src/components/time-logger/format.ts` | `formatClock`, `formatHuman`, `msToHours`. Shared by stopwatch UI and dialog. |
| `src/components/time-logger/Tooltip.tsx` | Accessible tooltip primitive (hover, focus, tap, Escape). |
| `src/components/time-logger/tabs/OverviewTab.tsx` | Metric tiles, charts, streak card, approval card. |
| `src/components/time-logger/tabs/LogTimeTab.tsx` | Manual/Stopwatch segmented control, manual form, stopwatch card. |
| `src/components/time-logger/tabs/EntriesTab.tsx` | Filters, table, selection, bulk delete, pagination. |
| `src/components/time-logger/charts/palette.ts` | `getPalette(resolvedTheme)` — the only place chart colours are defined. |
| `src/components/time-logger/charts/Last7DaysChart.tsx` | Recharts bar chart, today accented. |
| `src/components/time-logger/charts/BreakdownBar.tsx` | Horizontal CSS bar list for project/category splits. |
| `src/components/time-logger/stopwatch/storage.ts` | localStorage schema, guards, cross-tab subscribe. |
| `src/components/time-logger/stopwatch/useStopwatch.ts` | State machine, tick, wake lock, beforeunload. |
| `src/components/time-logger/stopwatch/StopwatchCard.tsx` | Display + controls + stale banner. |
| `src/components/time-logger/stopwatch/StopwatchBar.tsx` | Pinned bar shown while running from any tab. |
| `src/components/time-logger/stopwatch/PendingSessionStrip.tsx` | Unsaved-session prompt. |
| `src/components/time-logger/stopwatch/SaveSessionDialog.tsx` | Stop → collect fields → submit. |
| `src/components/changelog/ChangelogWidget.tsx` | Toasts, pill, history panel. |
| `src/lib/changelog.ts` | `APP_VERSION`, `CHANGELOG`, `compareVersions`. |

**Modified:**

| Path | Change |
|---|---|
| `src/app/(app)/dashboard/page.tsx` | Replaced by a ~10-line wrapper. |
| `src/app/(app)/legacy/dashboard/page.tsx` | Replaced by a ~20-line wrapper with the amber banner. |
| `src/app/(app)/layout.tsx` | Mounts `<ChangelogWidget />`. |
| `package.json` | Adds `recharts`; version `0.1.0` → `1.3.0`. |

---

## Phase 1 — Extract the shared dashboard

### Task 1: Logger config and data hook

**Files:**
- Create: `src/components/time-logger/config.ts`
- Create: `src/components/time-logger/useLoggerData.ts`
- Reference (read only): `src/app/(app)/dashboard/page.tsx:73-197`, `src/app/(app)/legacy/dashboard/page.tsx:73-194`

**Interfaces:**
- Consumes: `Project`, `TimeLog` from `@/lib/types`.
- Produces: `LoggerConfig`, `NEW_CONFIG`, `LEGACY_CONFIG`, `useLoggerData(config)`, `NewLogInput`, `MutationResult`.

- [ ] **Step 1: Create the config module**

`src/components/time-logger/config.ts`:

```ts
// Every difference between the new and legacy time-logger clients lives here.
// Adding a feature to TimeLoggerDashboard ships it to both automatically.
export type LoggerConfig = {
  /** API prefix: "/api" (Express backend) or "/api/legacy" (Google Sheets). */
  apiBase: string;
  loginPath: string;
  adminPath: string;
  /**
   * The one genuine API divergence: the new backend takes
   * `POST /logs/bulk-delete` with an {ids} body, legacy takes
   * `DELETE /logs?ids=a,b,c`.
   */
  bulkDelete: "post-body" | "delete-query";
  /** Namespaces localStorage so a legacy timer never leaks into the new client. */
  storageScope: "new" | "legacy";
};

export const NEW_CONFIG: LoggerConfig = {
  apiBase: "/api",
  loginPath: "/login",
  adminPath: "/admin",
  bulkDelete: "post-body",
  storageScope: "new",
};

export const LEGACY_CONFIG: LoggerConfig = {
  apiBase: "/api/legacy",
  loginPath: "/legacy/login",
  adminPath: "/legacy/admin",
  bulkDelete: "delete-query",
  storageScope: "legacy",
};
```

- [ ] **Step 2: Create the data hook**

`src/components/time-logger/useLoggerData.ts`:

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, TimeLog } from "@/lib/types";
import type { LoggerConfig } from "./config";

export type NewLogInput = {
  date: string;
  project: string;
  category: string;
  hours: number;
  description: string;
  tools: string[];
  areas: string[];
  status: string;
  reference: string;
};

export type MutationResult = { ok: true } | { ok: false; message: string };

export type LoggerData = {
  me: { username: string; role: string } | null;
  projects: Project[];
  logs: TimeLog[];
  loading: boolean;
  loadError: string | null;
  reload: () => Promise<void>;
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  deleteLog: (id: string) => Promise<MutationResult>;
  bulkDeleteLogs: (ids: string[]) => Promise<MutationResult>;
  logout: () => Promise<void>;
};

async function messageFrom(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => ({}) as Record<string, unknown>);
  const m = data?.message ?? data?.error;
  return typeof m === "string" ? m : fallback;
}

export function useLoggerData(config: LoggerConfig): LoggerData {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { apiBase, loginPath, bulkDelete } = config;

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [meRes, pRes, lRes] = await Promise.all([
        fetch(`${apiBase}/auth/me`),
        fetch(`${apiBase}/projects`),
        fetch(`${apiBase}/logs`),
      ]);
      if (meRes.status === 401) {
        router.push(loginPath);
        return;
      }
      const meData = await meRes.json();
      setMe(meData.user);
      if (pRes.ok) setProjects((await pRes.json()).projects ?? []);
      if (lRes.ok) setLogs((await lRes.json()).logs ?? []);
    } catch {
      setLoadError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [apiBase, loginPath, router]);

  useEffect(() => {
    reload();
  }, [reload]);

  const createLog = useCallback(
    async (input: NewLogInput): Promise<MutationResult> => {
      try {
        const res = await fetch(`${apiBase}/logs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          return { ok: false, message: await messageFrom(res, "Failed.") };
        }
        await reload();
        return { ok: true };
      } catch {
        return { ok: false, message: "Network error. Nothing was saved." };
      }
    },
    [apiBase, reload],
  );

  const deleteLog = useCallback(
    async (id: string): Promise<MutationResult> => {
      try {
        const res = await fetch(`${apiBase}/logs?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          return {
            ok: false,
            message: await messageFrom(res, "Could not delete this entry."),
          };
        }
        await reload();
        return { ok: true };
      } catch {
        return { ok: false, message: "Network error. Nothing was deleted." };
      }
    },
    [apiBase, reload],
  );

  const bulkDeleteLogs = useCallback(
    async (ids: string[]): Promise<MutationResult> => {
      if (ids.length === 0) return { ok: true };
      try {
        const res =
          bulkDelete === "post-body"
            ? await fetch(`${apiBase}/logs/bulk-delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
              })
            : await fetch(
                `${apiBase}/logs?ids=${encodeURIComponent(ids.join(","))}`,
                { method: "DELETE" },
              );
        if (!res.ok) {
          return {
            ok: false,
            message: await messageFrom(
              res,
              "Could not delete selected entries.",
            ),
          };
        }
        await reload();
        return { ok: true };
      } catch {
        return { ok: false, message: "Network error. Nothing was deleted." };
      }
    },
    [apiBase, bulkDelete, reload],
  );

  const logout = useCallback(async () => {
    await fetch(`${apiBase}/auth/logout`, { method: "POST" }).catch(() => {});
    router.push(loginPath);
  }, [apiBase, loginPath, router]);

  return {
    me,
    projects,
    logs,
    loading,
    loadError,
    reload,
    createLog,
    deleteLog,
    bulkDeleteLogs,
    logout,
  };
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run lint`
Expected: no errors referencing `config.ts` or `useLoggerData.ts`. (Nothing imports them yet, so the build is unchanged.)

- [ ] **Step 4: Commit**

```bash
git add src/components/time-logger/config.ts src/components/time-logger/useLoggerData.ts
git commit -m "Add LoggerConfig and useLoggerData for the shared time logger"
```

---

### Task 2: Shared dashboard component; both pages become wrappers

This is a **pure refactor**. The rendered output must be identical to today.

**Files:**
- Create: `src/components/time-logger/TimeLoggerDashboard.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx` (replace entirely)
- Modify: `src/app/(app)/legacy/dashboard/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: `LoggerConfig`, `useLoggerData` from Task 1.
- Produces: `TimeLoggerDashboard({ config, banner })` — default export.

- [ ] **Step 1: Create the shared component**

Copy `src/app/(app)/dashboard/page.tsx` verbatim into `src/components/time-logger/TimeLoggerDashboard.tsx`, then apply exactly these changes:

1. Replace the import block and component signature:

```tsx
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CATEGORIES } from "@/lib/types";
import DescriptionBuilder from "@/components/DescriptionBuilder";
import ThemeToggle from "@/components/theme/ThemeToggle";
import type { LoggerConfig } from "./config";
import { useLoggerData } from "./useLoggerData";

export default function TimeLoggerDashboard({
  config,
  banner,
}: {
  config: LoggerConfig;
  banner?: ReactNode;
}) {
  const {
    me,
    projects,
    logs,
    loading,
    reload,
    createLog,
    deleteLog,
    bulkDeleteLogs,
    logout,
  } = useLoggerData(config);
```

2. Delete the local `useRouter`, `me`/`projects`/`logs`/`loading` state, the `load()` function and its `useEffect` — `useLoggerData` supplies all of them.

3. Keep `todayLocal`, `startOfWeek` and `isoLocal` as module-level functions above the component, unchanged.

4. Rewrite `onSubmit` to use `createLog`:

```tsx
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg(null);
    if (!form.project) {
      setSubmitMsg({ kind: "err", text: "Pick a project." });
      return;
    }
    if (!form.hours) {
      setSubmitMsg({ kind: "err", text: "Enter hours." });
      return;
    }
    if (!form.description.trim()) {
      setSubmitMsg({ kind: "err", text: "Summary is required." });
      return;
    }
    setSubmitting(true);
    try {
      const result = await createLog({ ...form, hours: Number(form.hours) });
      if (!result.ok) {
        setSubmitMsg({ kind: "err", text: result.message });
        return;
      }
      setSubmitMsg({ kind: "ok", text: "Logged." });
      setForm({
        ...form,
        hours: "",
        description: "",
        tools: [],
        areas: [],
        status: "",
        reference: "",
      });
    } finally {
      setSubmitting(false);
    }
  }
```

5. Replace the local `deleteLog` function body (keep the name `onDeleteLog` to avoid shadowing the hook's `deleteLog`), and update the call site in the table from `onClick={() => deleteLog(l.id)}` to `onClick={() => onDeleteLog(l.id)}`:

```tsx
  async function onDeleteLog(id: string) {
    if (!confirm("Delete this entry?")) return;
    const result = await deleteLog(id);
    if (!result.ok) alert(result.message);
  }
```

6. Replace `bulkDelete`:

```tsx
  async function onBulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (
      !confirm(
        `Delete ${ids.length} selected ${ids.length === 1 ? "entry" : "entries"}?`,
      )
    )
      return;
    setBulkBusy(true);
    try {
      const result = await bulkDeleteLogs(ids);
      if (!result.ok) alert(result.message);
      else setSelected(new Set());
    } finally {
      setBulkBusy(false);
    }
  }
```

Update the bulk button to `onClick={onBulkDelete}`.

7. `reload()` no longer clears the selection (that lived in the old `load()`), so clear it after a successful reload:

```tsx
  // The hook reloads on mount and after every mutation. Drop selections for
  // rows that no longer exist so the bulk bar can't count phantom entries.
  useEffect(() => {
    setSelected((prev) => {
      const live = new Set(logs.map((l) => l.id));
      const next = new Set([...prev].filter((id) => live.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [logs]);
```

8. Render `banner` immediately after the opening `<main>` tag, before `<header>`:

```tsx
      {banner}
```

9. Replace the two config-dependent links in the header:

```tsx
              <a
                href={config.adminPath}
                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 px-3 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Admin
              </a>
```

and the sign-out button's `onClick={logout}` (already correct — it now calls the hook's `logout`).

Everything else — the stats row, the form, the filter bar, the table, pagination — is copied unchanged.

- [ ] **Step 2: Replace the new dashboard page**

`src/app/(app)/dashboard/page.tsx` — replace the entire file:

```tsx
import TimeLoggerDashboard from "@/components/time-logger/TimeLoggerDashboard";
import { NEW_CONFIG } from "@/components/time-logger/config";

export default function DashboardPage() {
  return <TimeLoggerDashboard config={NEW_CONFIG} />;
}
```

- [ ] **Step 3: Replace the legacy dashboard page**

`src/app/(app)/legacy/dashboard/page.tsx` — replace the entire file:

```tsx
import TimeLoggerDashboard from "@/components/time-logger/TimeLoggerDashboard";
import { LEGACY_CONFIG } from "@/components/time-logger/config";

function LegacyBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900 px-6 py-2 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between gap-4">
      <span>
        <strong>Legacy backend</strong> · Google Sheets · for data migration
        only.
      </span>
      <a
        href="/dashboard"
        className="underline hover:text-amber-950 dark:hover:text-amber-200 whitespace-nowrap"
      >
        Go to new backend →
      </a>
    </div>
  );
}

export default function LegacyDashboardPage() {
  return <TimeLoggerDashboard config={LEGACY_CONFIG} banner={<LegacyBanner />} />;
}
```

- [ ] **Step 4: Build and lint**

Run: `npm run build`
Expected: `Compiled successfully`. No type errors.

Run: `npm run lint`
Expected: clean.

- [ ] **Step 5: Manual regression pass — this task's real gate**

Start the app (`npm run dev`) and, on **both** `/dashboard` and `/legacy/dashboard`, confirm each of these behaves exactly as before the refactor:

1. Page loads; Today / This week / This month tiles show the same numbers as before.
2. Submitting the form with a missing project shows "Pick a project."
3. Submitting a complete entry shows "Logged." and the row appears in the table.
4. Each filter (project, category, status, date from/to, min/max hours) narrows the table; Clear resets them.
5. Page size selector and Prev/Next paginate correctly.
6. Select-all-on-page checkbox skips approved rows.
7. Bulk delete removes the selected rows — **test on both clients**, since they use different HTTP verbs.
8. Single-row Delete works; approved rows show "Locked" instead.
9. The Admin link appears only for admin users and points to `/admin` on the new client, `/legacy/admin` on legacy.
10. The amber legacy banner appears on `/legacy/dashboard` only.
11. Sign out redirects to `/login` and `/legacy/login` respectively.
12. Theme toggle still switches light/dark.

- [ ] **Step 6: Commit**

```bash
git add src/components/time-logger/TimeLoggerDashboard.tsx "src/app/(app)/dashboard/page.tsx" "src/app/(app)/legacy/dashboard/page.tsx"
git commit -m "Extract the duplicated time logger dashboard into a shared component

Both /dashboard and /legacy/dashboard now render TimeLoggerDashboard with a
LoggerConfig carrying the API base, redirect paths and bulk-delete shape. No
user-visible change."
```

---

## Phase 2 — Tabs, metrics and charts

### Task 3: Pure metrics module

**Files:**
- Create: `src/components/time-logger/metrics.ts`

**Interfaces:**
- Consumes: `TimeLog` from `@/lib/types`.
- Produces: `todayLocal()`, `isoLocal(d)`, `startOfWeek(d)`, `addDays(d, n)`, `isWeekend(d)`, `computeMetrics(logs, now?)`, types `DayBucket`, `Breakdown`, `LoggerMetrics`.

- [ ] **Step 1: Write the module**

`src/components/time-logger/metrics.ts`:

```ts
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

/** Groups by `key`, sorts descending, and folds everything past TOP_N into "Other". */
function topBreakdown(
  logs: TimeLog[],
  key: (l: TimeLog) => string,
): Breakdown[] {
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

  const loggedDates = new Set(
    logs.filter((l) => hoursOf(l) > 0).map((l) => l.date),
  );

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
      label: d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
      }),
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
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/time-logger/metrics.ts
git commit -m "Add pure metrics module for time logger dashboard"
```

---

### Task 4: Recharts install, palette and chart components

**Files:**
- Modify: `package.json` (dependency only)
- Create: `src/components/time-logger/charts/palette.ts`
- Create: `src/components/time-logger/charts/Last7DaysChart.tsx`
- Create: `src/components/time-logger/charts/BreakdownBar.tsx`

**Interfaces:**
- Consumes: `DayBucket`, `Breakdown` from `metrics.ts`; `ResolvedTheme` from `@/components/theme/theme`; `useTheme` from `@/components/theme/ThemeProvider`.
- Produces: `getPalette(theme)`, `<Last7DaysChart days={DayBucket[]} />`, `<BreakdownBar items={Breakdown[]} emptyLabel={string} />`.

- [ ] **Step 1: Install Recharts**

Run: `npm install recharts@^3.10.0`
Expected: `package.json` gains `"recharts": "^3.10.0"` under `dependencies`; `package-lock.json` updates. Do **not** run `bun add`.

- [ ] **Step 2: Create the palette**

`src/components/time-logger/charts/palette.ts`:

```ts
import type { ResolvedTheme } from "@/components/theme/theme";

// Recharts sets fills and strokes as props, so Tailwind classes can't reach
// them. This is the single place chart colour is defined for both themes.
export type ChartPalette = {
  bar: string;
  barToday: string;
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
};

const LIGHT: ChartPalette = {
  bar: "#a3a3a3",
  barToday: "#3d234b",
  grid: "#e5e5e5",
  axis: "#737373",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e5e5e5",
  tooltipText: "#171717",
};

const DARK: ChartPalette = {
  bar: "#525252",
  barToday: "#a78bfa",
  grid: "#262626",
  axis: "#a3a3a3",
  tooltipBg: "#171717",
  tooltipBorder: "#404040",
  tooltipText: "#f5f5f5",
};

export function getPalette(theme: ResolvedTheme): ChartPalette {
  return theme === "dark" ? DARK : LIGHT;
}
```

- [ ] **Step 3: Create the last-7-days chart**

`src/components/time-logger/charts/Last7DaysChart.tsx`:

```tsx
"use client";

import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getPalette } from "./palette";
import type { DayBucket } from "../metrics";

export default function Last7DaysChart({ days }: { days: DayBucket[] }) {
  const { resolvedTheme } = useTheme();
  const palette = getPalette(resolvedTheme);
  const hasData = days.some((d) => d.hours > 0);

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        No hours logged in the last 7 days.
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={days}
          margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
઀        >
          <CartesianGrid stroke={palette.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: palette.axis, fontSize: 11 }}
            axisLine={{ stroke: palette.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: palette.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ fill: palette.grid, opacity: 0.4 }}
            contentStyle={{
              background: palette.tooltipBg,
              border: `1px solid ${palette.tooltipBorder}`,
              borderRadius: 8,
              color: palette.tooltipText,
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value.toFixed(2)} h`, "Logged"]}
          />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {days.map((d) => (
              <Cell
                key={d.date}
                fill={d.isToday ? palette.barToday : palette.bar}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

> Note for the implementer: the `margin` line above must read exactly
> `margin={{ top: 8, right: 8, bottom: 0, left: -20 }}` followed by `>`. Delete
> any stray character on the line before `>`.

- [ ] **Step 4: Create the breakdown bar list**

`src/components/time-logger/charts/BreakdownBar.tsx`:

```tsx
"use client";

import type { Breakdown } from "../metrics";

// Deliberately CSS rather than Recharts: this is a labelled proportion list,
// and a div with a width percentage reads better and costs nothing.
export default function BreakdownBar({
  items,
  emptyLabel,
}: {
  items: Breakdown[];
  emptyLabel: string;
}) {
  const max = items.reduce((m, i) => Math.max(m, i.hours), 0);

  if (items.length === 0 || max === 0) {
    return (
      <div className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.name}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-neutral-700 dark:text-neutral-300">
              {item.name}
            </span>
            <span className="tabular-nums text-neutral-500 dark:text-neutral-400">
              {item.hours.toFixed(1)} h
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-neutral-900 dark:bg-neutral-400"
              style={{ width: `${Math.max(2, (item.hours / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `Compiled successfully`. If Recharts emits a peer-dependency warning about `react-is`, it is safe; the build must still pass.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/time-logger/charts
git commit -m "Add Recharts, theme-aware chart palette and dashboard chart components"
```

---

### Task 5: Split the dashboard into tabs and add the Overview tab

**Files:**
- Create: `src/components/time-logger/tabs/EntriesTab.tsx`
- Create: `src/components/time-logger/tabs/LogTimeTab.tsx`
- Create: `src/components/time-logger/tabs/OverviewTab.tsx`
- Modify: `src/components/time-logger/TimeLoggerDashboard.tsx` (becomes the shell)

**Interfaces:**
- Consumes: `LoggerData` (Task 1), `computeMetrics` (Task 3), `Last7DaysChart`/`BreakdownBar` (Task 4).
- Produces: `<OverviewTab logs projects loading />`, `<LogTimeTab data />`, `<EntriesTab data />`, and `TabKey = "overview" | "log" | "entries"`.

- [ ] **Step 1: Move the filters + table into EntriesTab**

`src/components/time-logger/tabs/EntriesTab.tsx` — a `"use client"` component taking `{ data }: { data: LoggerData }`. Move, without behavioural change, this state and markup out of `TimeLoggerDashboard`: `filterCategory`, `filterProject`, `filterStatus`, `filterDateFrom`, `filterDateTo`, `filterHoursMin`, `filterHoursMax`, `page`, `pageSize`, `selected`, `bulkBusy`, the `sortedLogs`/`filtered`/`pageItems` memos, the reset-page effect, the stale-selection effect, `toggleOne`, `toggleAllOnPage`, `onDeleteLog`, `onBulkDelete`, and the entire `<section>` containing the filter bar, table and pagination. Read `logs`, `projects`, `loading`, `deleteLog`, `bulkDeleteLogs` off `data`.

The outer wrapper changes from the old `<section className="rounded-xl border …">` to the same markup — keep the card styling identical.

- [ ] **Step 2: Move the form into LogTimeTab**

`src/components/time-logger/tabs/LogTimeTab.tsx` — a `"use client"` component taking `{ data }: { data: LoggerData }`. Move `form`, `submitting`, `submitMsg`, `onSubmit`, the loading skeleton and the entire "Log time" `<section>`. Read `projects`, `loading`, `createLog` off `data`. Behaviour is unchanged; Task 8 adds the segmented control to this file.

- [ ] **Step 3: Create the Overview tab**

`src/components/time-logger/tabs/OverviewTab.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import type { TimeLog } from "@/lib/types";
import { computeMetrics } from "../metrics";
import Last7DaysChart from "../charts/Last7DaysChart";
import BreakdownBar from "../charts/BreakdownBar";

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 ${className}`}
    >
      <h3 className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function formatDayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function OverviewTab({
  logs,
  loading,
}: {
  logs: TimeLog[];
  loading: boolean;
}) {
  const m = useMemo(() => computeMetrics(logs), [logs]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          />
        ))}
      </div>
    );
  }

  const totalForApproval = m.pendingHours + m.approvedHours;
  const approvedPct =
    totalForApproval === 0 ? 0 : (m.approvedHours / totalForApproval) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Today" value={`${m.todayHours.toFixed(1)} h`} />
        <Tile label="This week" value={`${m.weekHours.toFixed(1)} h`} />
        <Tile label="This month" value={`${m.monthHours.toFixed(1)} h`} />
        <Tile
          label="Avg / logged day"
          value={`${m.avgPerLoggedDay.toFixed(1)} h`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Last 7 days" className="lg:col-span-2">
          <Last7DaysChart days={m.last7Days} />
        </Card>

        <Card title="Logging streak">
          <div className="text-3xl font-semibold tabular-nums">
            {m.streakWeekdays}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              {m.streakWeekdays === 1 ? "weekday" : "weekdays"}
            </span>
          </div>
          {m.missingWeekdays.length === 0 ? (
            <p className="mt-3 text-sm text-green-700 dark:text-green-400">
              You&rsquo;re fully caught up for the last two weeks.
            </p>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Not logged:
              </p>
              <ul className="mt-1 space-y-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                {m.missingWeekdays.map((d) => (
                  <li key={d}>{formatDayLabel(d)}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Hours by project · this month">
          <BreakdownBar
            items={m.byProject}
            emptyLabel="No hours logged this month yet."
          />
        </Card>
        <Card title="Hours by category · this month">
          <BreakdownBar
            items={m.byCategory}
            emptyLabel="No hours logged this month yet."
          />
        </Card>
        <Card title="Approval">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Approved
            </span>
            <span className="tabular-nums font-medium">
              {m.approvedHours.toFixed(1)} h
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Pending
            </span>
            <span className="tabular-nums font-medium">
              {m.pendingHours.toFixed(1)} h
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900">
            <div
              className="h-full rounded-full bg-green-600 dark:bg-green-500"
              style={{ width: `${approvedPct}%` }}
            />
          </div>
          {totalForApproval === 0 && (
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Nothing logged yet.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Turn TimeLoggerDashboard into the tab shell**

Replace the body of `TimeLoggerDashboard.tsx` below the header with a tab list and panel. Keep the existing `<header>` and `banner` exactly as they are.

```tsx
"use client";

import { Suspense, useCallback, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import type { LoggerConfig } from "./config";
import { useLoggerData } from "./useLoggerData";
import OverviewTab from "./tabs/OverviewTab";
import LogTimeTab from "./tabs/LogTimeTab";
import EntriesTab from "./tabs/EntriesTab";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "log", label: "Log time" },
  { key: "entries", label: "Entries" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

function isTabKey(v: string | null): v is TabKey {
  return v === "overview" || v === "log" || v === "entries";
}

function DashboardInner({
  config,
  banner,
}: {
  config: LoggerConfig;
  banner?: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = useLoggerData(config);

  const raw = searchParams.get("tab");
  const active: TabKey = isTabKey(raw) ? raw : "overview";

  // Tab lives in the URL so a refresh keeps the user's place.
  const selectTab = useCallback(
    (key: TabKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", key);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Left/Right arrows move between tabs, per the tablist pattern.
  function onTabKeyDown(e: React.KeyboardEvent) {
    const i = TABS.findIndex((t) => t.key === active);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectTab(TABS[(i + 1) % TABS.length].key);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectTab(TABS[(i - 1 + TABS.length) % TABS.length].key);
    }
  }

  return (
    <main className="min-h-screen text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-950">
      {banner}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-semibold tracking-tight">
            Devaicon · Time Tracker
          </div>
          <div className="flex itemsemcenter gap-4 text-sm">
            <ThemeToggle />
            <span className="text-neutral-600 dark:text-neutral-400">
              {data.me?.username}{" "}
              {data.me?.role === "admin" && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  (admin)
                </span>
              )}
            </span>
            {data.me?.role === "admin" && (
              <a
                href={config.adminPath}
                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 px-3 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Admin
              </a>
            )}
            <button
              onClick={data.logout}
              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm ml-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {data.loadError && (
          <div className="flex items-center justify-between gap-4 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm text-red-700 dark:text-red-400">
            <span>{data.loadError}</span>
            <button
              onClick={data.reload}
              className="underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stopwatch bar and pending-session strip mount here in Phase 3. */}

        <div
          role="tablist"
          aria-label="Time logger sections"
          onKeyDown={onTabKeyDown}
          className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800"
        >
          {TABS.map((t) => {
            const selected = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={selected}
                aria-controls={`panel-${t.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(t.key)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
        >
          {active === "overview" && (
            <OverviewTab logs={data.logs} loading={data.loading} />
          )}
          {active === "log" && <LogTimeTab data={data} />}
          {active === "entries" && <EntriesTab data={data} />}
        </div>
      </div>
    </main>
  );
}

export default function TimeLoggerDashboard(props: {
  config: LoggerConfig;
  banner?: ReactNode;
}) {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <DashboardInner {...props} />
    </Suspense>
  );
}
```

> Note for the implementer: the header `<div>` class must read
> `"flex items-center gap-4 text-sm"`. Correct any typo there.

- [ ] **Step 5: Build and lint**

Run: `npm run build`
Expected: `Compiled successfully`.

Run: `npm run lint`
Expected: clean.

- [ ] **Step 6: Manual check**

On both `/dashboard` and `/legacy/dashboard`:

1. Three tabs render; Overview is active by default.
2. Clicking a tab updates the URL to `?tab=log` / `?tab=entries`, and a browser refresh keeps that tab.
3. Left/Right arrows move between tabs when the tab list has focus.
4. Overview: four tiles, a 7-day bar chart with today's bar in a different colour, streak card, two breakdown lists, approval bar.
5. Toggle to light mode — chart axes, grid and bars remain readable.
6. Log time and Entries tabs behave exactly as in Phase 1.
7. A user with zero logs sees empty-state text in every card, not a broken chart.

- [ ] **Step 7: Commit**

```bash
git add src/components/time-logger
git commit -m "Split the time logger dashboard into Overview, Log time and Entries tabs

Overview adds 7-day hours, weekday logging streak with gap callouts, project
and category breakdowns, and an approval split."
```

---

## Phase 3 — Stopwatch

### Task 6: Stopwatch persistence layer

**Files:**
- Create: `src/components/time-logger/stopwatch/storage.ts`
- Create: `src/components/time-logger/format.ts`

**Interfaces:**
- Produces: `Snapshot`, `PendingSession`, `readSnapshot`, `writeSnapshot`, `readPending`, `writePending`, `subscribeStopwatch`, `storageAvailable`, and `formatClock`, `formatHuman`, `msToHours`.

- [ ] **Step 1: Create the format helpers**

`src/components/time-logger/format.ts`:

```ts
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
```

- [ ] **Step 2: Create the storage module**

`src/components/time-logger/stopwatch/storage.ts`:

```ts
// Persisted stopwatch state. Everything here is defensive: a user in private
// browsing, or with a payload from an older build, must degrade rather than
// crash the dashboard.

const SCHEMA = 1;

export type Snapshot =
  | { status: "idle" }
  | {
      status: "running";
      /** Epoch ms when the current running segment began. */
      startedAt: number;
      /** Time banked from previous segments, in ms. */
      accumulatedMs: number;
      /** Epoch ms of the very first start; used for the entry date and stale check. */
      firstStartedAt: number;
      projectHint: string;
    }
  | {
      status: "paused";
      accumulatedMs: number;
      firstStartedAt: number;
      projectHint: string;
    };

export type PendingSession = {
  id: string;
  elapsedMs: number;
  startedAtISO: string;
  endedAtISO: string;
  projectHint: string;
};

export const IDLE: Snapshot = { status: "idle" };

type Scope = "new" | "legacy";

function stateKey(scope: Scope) {
  return `devaicon.stopwatch.${scope}.v1`;
}
function pendingKey(scope: Scope) {
  return `devaicon.stopwatch.${scope}.pending.v1`;
}

export function storageAvailable(): boolean {
  try {
    const probe = "__devaicon_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function read<T>(key: string, validate: (v: unknown) => v is T): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { schema?: number; data?: unknown };
    if (parsed?.schema !== SCHEMA) {
      window.localStorage.removeItem(key);
      return null;
    }
    return validate(parsed.data) ? parsed.data : null;
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

function isSnapshot(v: unknown): v is Snapshot {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  if (s.status === "idle") return true;
  const common =
    typeof s.accumulatedMs === "number" &&
    typeof s.firstStartedAt === "number" &&
    typeof s.projectHint === "string";
  if (s.status === "paused") return common;
  if (s.status === "running") return common && typeof s.startedAt === "number";
  return false;
}

function isPending(v: unknown): v is PendingSession {
  if (typeof v !== "object" || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.elapsedMs === "number" &&
    typeof p.startedAtISO === "string" &&
    typeof p.endedAtISO === "string" &&
    typeof p.projectHint === "string"
  );
}

export function readSnapshot(scope: Scope): Snapshot {
  return read(stateKey(scope), isSnapshot) ?? IDLE;
}

export function writeSnapshot(scope: Scope, snapshot: Snapshot): void {
  write(stateKey(scope), snapshot);
}

export function readPending(scope: Scope): PendingSession | null {
  return read(pendingKey(scope), isPending);
}

export function writePending(
  scope: Scope,
  pending: PendingSession | null,
): void {
  if (pending === null) {
    try {
      window.localStorage.removeItem(pendingKey(scope));
    } catch {
      // ignore
    }
    return;
  }
  write(pendingKey(scope), pending);
}

/** Fires when another tab changes this scope's stopwatch state. */
export function subscribeStopwatch(scope: Scope, cb: () => void): () => void {
  const keys = new Set([stateKey(scope), pendingKey(scope)]);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || keys.has(e.key)) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/time-logger/format.ts src/components/time-logger/stopwatch/storage.ts
git commit -m "Add stopwatch persistence layer and duration formatters"
```

---

### Task 7: The stopwatch hook

**Files:**
- Create: `src/components/time-logger/stopwatch/useStopwatch.ts`

**Interfaces:**
- Consumes: everything from `storage.ts` (Task 6).
- Produces: `useStopwatch(scope)` returning `UseStopwatch` with `status`, `elapsedMs`, `firstStartedAt`, `projectHint`, `pending`, `isStale`, `persistent`, `start`, `pause`, `resume`, `stop`, `reset`, `setProjectHint`, `clearPending`, `acknowledgeStale`.

- [ ] **Step 1: Write the hook**

`src/components/time-logger/stopwatch/useStopwatch.ts`:

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IDLE,
  readPending,
  readSnapshot,
  storageAvailable,
  subscribeStopwatch,
  writePending,
  writeSnapshot,
  type PendingSession,
  type Snapshot,
} from "./storage";

/** Beyond this, a restored running timer is treated as forgotten, not real. */
const STALE_AFTER_MS = 12 * 60 * 60 * 1000;

export type UseStopwatch = {
  status: Snapshot["status"];
  elapsedMs: number;
  firstStartedAt: number | null;
  projectHint: string;
  pending: PendingSession | null;
  /** True when a restored timer looks forgotten and needs confirming. */
  isStale: boolean;
  /** False when localStorage is unavailable, so state won't survive a reload. */
  persistent: boolean;
  start: (projectHint?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  setProjectHint: (value: string) => void;
  clearPending: () => void;
  acknowledgeStale: () => void;
};

/** Elapsed is always derived from wall-clock time, never counted by a ticker. */
function elapsedOf(s: Snapshot, now: number): number {
  if (s.status === "idle") return 0;
  if (s.status === "paused") return s.accumulatedMs;
  return s.accumulatedMs + (now - s.startedAt);
}

function sameLocalDay(a: number, b: number): boolean {
  const x = new Date(a);
  const y = new Date(b);
  return (
    x.getFullYear() === y.getFullYear() &&
    x.getMonth() === y.getMonth() &&
    x.getDate() === y.getDate()
  );
}

export function useStopwatch(scope: "new" | "legacy"): UseStopwatch {
  const [snapshot, setSnapshot] = useState<Snapshot>(IDLE);
  const [pending, setPending] = useState<PendingSession | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [persistent, setPersistent] = useState(true);
  const [staleAcknowledged, setStaleAcknowledged] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Hydrate after mount only — localStorage doesn't exist during SSR.
  useEffect(() => {
    setPersistent(storageAvailable());
    setSnapshot(readSnapshot(scope));
    setPending(readPending(scope));
  }, [scope]);

  // Another tab changed the timer: pick up its state.
  useEffect(
    () =>
      subscribeStopwatch(scope, () => {
        setSnapshot(readSnapshot(scope));
        setPending(readPending(scope));
      }),
    [scope],
  );

  const commit = useCallback(
    (next: Snapshot) => {
      setSnapshot(next);
      writeSnapshot(scope, next);
    },
    [scope],
  );

  const commitPending = useCallback(
    (next: PendingSession | null) => {
      setPending(next);
      writePending(scope, next);
    },
    [scope],
  );

  // Re-render once a second while running. The displayed value comes from
  // Date.now(), so a throttled interval makes the clock lag, never drift.
  useEffect(() => {
    if (snapshot.status !== "running") return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [snapshot.status]);

  // Coming back to a backgrounded tab: resync immediately rather than waiting
  // up to a second, and re-acquire the wake lock, which auto-releases on hide.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      setNow(Date.now());
      if (snapshot.status === "running") void acquireWakeLock();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [snapshot.status]);

  async function acquireWakeLock() {
    try {
      if (wakeLockRef.current) return;
      wakeLockRef.current =
        (await navigator.wakeLock?.request("screen")) ?? null;
    } catch {
      // Unsupported, denied, or the document isn't visible. Enhancement only.
    }
  }

  function releaseWakeLock() {
    try {
      void wakeLockRef.current?.release();
    } catch {
      // ignore
    }
    wakeLockRef.current = null;
  }

  // Warn before leaving with a live timer or unsaved measurement.
  useEffect(() => {
    const risky = snapshot.status !== "idle" || pending !== null;
    if (!risky) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [snapshot.status, pending]);

  const start = useCallback(
    (projectHint = "") => {
      const t = Date.now();
      setStaleAcknowledged(false);
      commit({
        status: "running",
        startedAt: t,
        accumulatedMs: 0,
        firstStartedAt: t,
        projectHint,
      });
      void acquireWakeLock();
    },
    [commit],
  );

  const pause = useCallback(() => {
    if (snapshot.status !== "running") return;
    commit({
      status: "paused",
      accumulatedMs: snapshot.accumulatedMs + (Date.now() - snapshot.startedAt),
      firstStartedAt: snapshot.firstStartedAt,
      projectHint: snapshot.projectHint,
    });
    releaseWakeLock();
  }, [commit, snapshot]);

  const resume = useCallback(() => {
    if (snapshot.status !== "paused") return;
    commit({
      status: "running",
      startedAt: Date.now(),
      accumulatedMs: snapshot.accumulatedMs,
      firstStartedAt: snapshot.firstStartedAt,
      projectHint: snapshot.projectHint,
    });
    void acquireWakeLock();
  }, [commit, snapshot]);

  const stop = useCallback(() => {
    if (snapshot.status === "idle") return;
    const end = Date.now();
    const elapsedMs = elapsedOf(snapshot, end);
    commitPending({
      id: `${snapshot.firstStartedAt}-${end}`,
      elapsedMs,
      startedAtISO: new Date(snapshot.firstStartedAt).toISOString(),
      endedAtISO: new Date(end).toISOString(),
      projectHint: snapshot.projectHint,
    });
    commit(IDLE);
    setStaleAcknowledged(false);
    releaseWakeLock();
  }, [commit, commitPending, snapshot]);

  const reset = useCallback(() => {
    commit(IDLE);
    setStaleAcknowledged(false);
    releaseWakeLock();
  }, [commit]);

  const setProjectHint = useCallback(
    (value: string) => {
      if (snapshot.status === "idle") return;
      commit({ ...snapshot, projectHint: value });
    },
    [commit, snapshot],
  );

  const clearPending = useCallback(() => commitPending(null), [commitPending]);

  const firstStartedAt =
    snapshot.status === "idle" ? null : snapshot.firstStartedAt;

  const elapsedMs = elapsedOf(snapshot, now);

  const isStale =
    !staleAcknowledged &&
    snapshot.status !== "idle" &&
    (elapsedMs > STALE_AFTER_MS || !sameLocalDay(snapshot.firstStartedAt, now));

  return {
    status: snapshot.status,
    elapsedMs,
    firstStartedAt,
    projectHint: snapshot.status === "idle" ? "" : snapshot.projectHint,
    pending,
    isStale,
    persistent,
    start,
    pause,
    resume,
    stop,
    reset,
    setProjectHint,
    clearPending,
    acknowledgeStale: () => setStaleAcknowledged(true),
  };
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `Compiled successfully`. If TypeScript reports `WakeLockSentinel` is not defined, add `"dom"` is already in lib — instead change the ref type to `WakeLockSentinel | null` only if `typescript` resolves it; otherwise declare above the hook:

```ts
type WakeLockSentinel = { release: () => Promise<void> };
```

and use `(navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> } }).wakeLock?.request("screen")`.

- [ ] **Step 3: Commit**

```bash
git add src/components/time-logger/stopwatch/useStopwatch.ts
git commit -m "Add useStopwatch: timestamp-derived timer with persistence and wake lock"
```

---

### Task 8: Tooltip primitive, stopwatch card and the Manual/Stopwatch toggle

**Files:**
- Create: `src/components/time-logger/Tooltip.tsx`
- Create: `src/components/time-logger/stopwatch/StopwatchCard.tsx`
- Modify: `src/components/time-logger/tabs/LogTimeTab.tsx`

**Interfaces:**
- Consumes: `useStopwatch` (Task 7), `formatClock`/`formatHuman` (Task 6).
- Produces: `<Tooltip content={ReactNode}>{trigger}</Tooltip>`, `<StopwatchCard sw={UseStopwatch} projects={Project[]} />`.

- [ ] **Step 1: Create the tooltip**

`src/components/time-logger/Tooltip.tsx`:

```tsx
"use client";

import { useId, useState, type ReactNode } from "react";

// A `title` attribute is invisible to touch users and can't be styled, so this
// is a real tooltip: hover, keyboard focus, tap, and Escape to dismiss.
export default function Tooltip({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-help"
      >
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-left text-xs font-normal leading-relaxed text-neutral-700 dark:text-neutral-200 shadow-lg"
        >
          {content}
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 2: Create the stopwatch card**

`src/components/time-logger/stopwatch/StopwatchCard.tsx`:

```tsx
"use client";

import type { Project } from "@/lib/types";
import { formatClock, formatHuman } from "../format";
import type { UseStopwatch } from "./useStopwatch";

export default function StopwatchCard({
  sw,
  projects,
}: {
  sw: UseStopwatch;
  projects: Project[];
}) {
  const idle = sw.status === "idle";

  function onStart() {
    sw.start(sw.projectHint);
  }

  function onReset() {
    if (confirm("Discard this timer without logging it?")) sw.reset();
  }

  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      {sw.isStale && (
        <div className="mb-4 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 px-3 py-2 text-sm text-amber-900 dark:text-amber-300">
          <p>
            This timer has been running since{" "}
            <strong>
              {sw.firstStartedAt
                ? new Date(sw.firstStartedAt).toLocaleString(undefined, {
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "earlier"}
            </strong>
            . Still working?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={sw.acknowledgeStale}
              className="rounded border border-amber-300 dark:border-amber-800 px-2 py-1 text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              Keep running
            </button>
            <button
              type="button"
              onClick={sw.stop}
              className="rounded bg-neutral-900 dark:bg-neutral-700 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              Stop &amp; log
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded px-2 py-1 text-xs underline hover:no-underline"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-5 py-4">
        <div
          className="text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl"
          aria-live="off"
        >
          {formatClock(sw.elapsedMs)}
        </div>
        {!idle && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatHuman(sw.elapsedMs)}
            {sw.status === "paused" && " · paused"}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {idle && (
            <button
              type="button"
              onClick={onStart}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-600 active:scale-[0.98]"
            >
              Start
            </button>
          )}
          {sw.status === "running" && (
            <button
              type="button"
              onClick={sw.pause}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Pause
            </button>
          )}
          {sw.status === "paused" && (
            <button
              type="button"
              onClick={sw.resume}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              Resume
            </button>
          )}
          {!idle && (
            <>
              <button
                type="button"
                onClick={sw.stop}
                className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Stop
              </button>
              <button
                type="button"
                onClick={onReset}
                className="rounded-md px-3 py-2.5 text-sm text-neutral-500 dark:text-neutral-400 underline hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Discard
              </button>
            </>
          )}
        </div>

        <div className="w-full max-w-xs">
          <label
            htmlFor="stopwatch-project"
            className="mb-1 block text-center text-xs text-neutral-600 dark:text-neutral-400"
          >
            Project (optional — you can pick this when you stop)
          </label>
          <select
            id="stopwatch-project"
            value={sw.projectHint}
            onChange={(e) => sw.setProjectHint(e.target.value)}
            disabled={idle}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-sm disabled:opacity-50"
          >
            <option value="">Not set</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {!sw.persistent && (
          <p className="text-center text-xs text-amber-700 dark:text-amber-400">
            This browser isn&rsquo;t saving timer state, so a reload will lose
            it.
          </p>
        )}
      </div>
    </section>
  );
}
```

> The project select is disabled while idle because `setProjectHint` only
> applies to a live timer. Starting a timer then choosing a project is the
> intended flow; the label says so.

- [ ] **Step 3: Add the segmented control to LogTimeTab**

In `src/components/time-logger/tabs/LogTimeTab.tsx`, add a `mode` state and render either the existing manual form or `<StopwatchCard />`. The component now also takes the shared `sw` object so the timer survives tab switches:

```tsx
"use client";

import { useState } from "react";
import Tooltip from "../Tooltip";
import StopwatchCard from "../stopwatch/StopwatchCard";
import type { UseStopwatch } from "../stopwatch/useStopwatch";
import type { LoggerData } from "../useLoggerData";

type Mode = "manual" | "stopwatch";

export default function LogTimeTab({
  data,
  sw,
}: {
  data: LoggerData;
  sw: UseStopwatch;
}) {
  const [mode, setMode] = useState<Mode>("manual");
  // ...existing form state and onSubmit stay exactly as they are...

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1">
          <button
            type="button"
            onClick={() => setMode("manual")}
            aria-pressed={mode === "manual"}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => setMode("stopwatch")}
            aria-pressed={mode === "stopwatch"}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "stopwatch"
                ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Stopwatch
          </button>
        </div>
        <Tooltip
          content={
            <>
              <strong>New</strong> — track time live instead of estimating it.
              Start the timer and we&rsquo;ll fill the hours in when you stop.
            </>
          }
        >
          <span className="rounded-full bg-green-100 dark:bg-green-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
            New
          </span>
        </Tooltip>
      </div>

      {mode === "manual" ? (
        /* the existing "Log time" <section> unchanged */
        <ManualForm />
      ) : (
        <StopwatchCard sw={sw} projects={data.projects} />
      )}
    </div>
  );
}
```

Keep the existing form markup inline where `<ManualForm />` is shown above — do not extract it into a separate component unless the file exceeds ~250 lines, in which case put it in the same file as a local function component.

- [ ] **Step 4: Wire `sw` through the shell**

In `TimeLoggerDashboard.tsx`, inside `DashboardInner`:

```tsx
import { useStopwatch } from "./stopwatch/useStopwatch";
// ...
  const sw = useStopwatch(config.storageScope);
// ...
  {active === "log" && <LogTimeTab data={data} sw={sw} />}
```

- [ ] **Step 5: Build, lint, manual check**

Run: `npm run build` — expected `Compiled successfully`.
Run: `npm run lint` — expected clean.

Manually, on `/dashboard`:

1. Log time tab shows `[Manual] [Stopwatch]` with a green **New** badge.
2. Hovering the badge shows the tooltip; tabbing to it also shows it; Escape hides it.
3. Stopwatch mode: Start counts up from `00:00:00`.
4. Pause freezes it, Resume continues from the same value (not from zero).
5. Switch to the Overview tab and back — the timer is still running with the correct value.
6. Reload the page while running — the timer restores with the elapsed time that passed during the reload included, and the browser shows a "Leave site?" prompt first.
7. Open a second tab on the same dashboard — it shows the same running timer.
8. Discard asks for confirmation and resets to `00:00:00`.

- [ ] **Step 6: Commit**

```bash
git add src/components/time-logger
git commit -m "Add stopwatch card, accessible tooltip and Manual/Stopwatch toggle"
```

---

### Task 9: Save dialog, pinned bar and pending-session strip

**Files:**
- Create: `src/components/time-logger/stopwatch/SaveSessionDialog.tsx`
- Create: `src/components/time-logger/stopwatch/StopwatchBar.tsx`
- Create: `src/components/time-logger/stopwatch/PendingSessionStrip.tsx`
- Modify: `src/components/time-logger/TimeLoggerDashboard.tsx`

**Interfaces:**
- Consumes: `PendingSession` (Task 6), `UseStopwatch` (Task 7), `LoggerData`/`NewLogInput` (Task 1), `msToHours`/`formatClock`/`formatHuman` (Task 6), `DescriptionBuilder`, `CATEGORIES`.
- Produces: `<SaveSessionDialog session onClose onSaved projects createLog />`, `<StopwatchBar sw onOpenSave />`, `<PendingSessionStrip session onSave onDiscard />`.

- [ ] **Step 1: Create the save dialog**

`src/components/time-logger/stopwatch/SaveSessionDialog.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, type Project } from "@/lib/types";
import DescriptionBuilder from "@/components/DescriptionBuilder";
import { formatHuman, msToHours } from "../format";
import { isoLocal, todayLocal } from "../metrics";
import type { NewLogInput, MutationResult } from "../useLoggerData";
import type { PendingSession } from "./storage";

export default function SaveSessionDialog({
  session,
  projects,
  createLog,
  onClose,
  onSaved,
}: {
  session: PendingSession;
  projects: Project[];
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const measuredHours = msToHours(session.elapsedMs);

  const [form, setForm] = useState({
    // The entry belongs to the day the timer started, not the day it stopped.
    date: isoLocal(new Date(session.startedAtISO)),
    project: session.projectHint,
    category: "Coding",
    hours: String(measuredHours),
    description: "",
    tools: [] as string[],
    areas: [] as string[],
    status: "",
    reference: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const hours = Number(form.hours);
    if (!form.project) return setError("Pick a project.");
    if (!Number.isFinite(hours) || hours < 0.01)
      return setError("Timer too short to log.");
    if (hours > 24) return setError("Hours must be 24 or less.");
    if (!form.description.trim()) return setError("Summary is required.");

    setSaving(true);
    try {
      const result = await createLog({ ...form, hours });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  const edited = Number(form.hours) !== measuredHours;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-session-title"
        className="w-full max-w-2xl rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-neutral-900 dark:text-neutral-100 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="save-session-title" className="text-lg font-semibold">
              Log this session
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Measured {formatHuman(session.elapsedMs)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              max={todayLocal()}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Project
            </label>
            <select
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-sm"
              required
            >
              <option value="">Select…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Hours
            </label>
            {/* step 0.01, unlike the manual form's 0.25: the measured value is exact. */}
            <input
              type="number"
              min={0.01}
              max={24}
              step={0.01}
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
              required
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              = {formatHuman(session.elapsedMs)}
              {edited && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, hours: String(measuredHours) })
                  }
                  className="ml-2 underline hover:no-underline"
                >
                  reset to measured
                </button>
              )}
            </p>
          </div>
          <div className="md:col-span-6">
            <DescriptionBuilder
              summary={form.description}
              onSummary={(v) => setForm({ ...form, description: v })}
              tools={form.tools}
              onTools={(v) => setForm({ ...form, tools: v })}
              areas={form.areas}
              onAreas={(v) => setForm({ ...form, areas: v })}
              status={form.status}
              onStatus={(v) => setForm({ ...form, status: v })}
              reference={form.reference}
              onReference={(v) => setForm({ ...form, reference: v })}
            />
          </div>

          {error && (
            <div className="md:col-span-6 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="md:col-span-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Save for later
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Log entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the pinned bar**

`src/components/time-logger/stopwatch/StopwatchBar.tsx`:

```tsx
"use client";

import { formatClock } from "../format";
import type { UseStopwatch } from "./useStopwatch";

export default function StopwatchBar({ sw }: { sw: UseStopwatch }) {
  if (sw.status === "idle") return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          sw.status === "running"
            ? "animate-pulse bg-red-500"
            : "bg-neutral-400"
        }`}
        aria-hidden="true"
      />
      <span className="text-lg font-semibold tabular-nums">
        {formatClock(sw.elapsedMs)}
      </span>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {sw.projectHint || "No project set"}
        {sw.status === "paused" && " · paused"}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {sw.status === "running" ? (
          <button
            type="button"
            onClick={sw.pause}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={sw.resume}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Resume
          </button>
        )}
        <button
          type="button"
          onClick={sw.stop}
          className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create the pending strip**

`src/components/time-logger/stopwatch/PendingSessionStrip.tsx`:

```tsx
"use client";

import { formatHuman } from "../format";
import type { PendingSession } from "./storage";

export default function PendingSessionStrip({
  session,
  onSave,
  onDiscard,
}: {
  session: PendingSession;
  onSave: () => void;
  onDiscard: () => void;
}) {
  function discard() {
    if (confirm(`Discard ${formatHuman(session.elapsedMs)} without logging it?`))
      onDiscard();
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 px-4 py-2.5 text-sm text-amber-900 dark:text-amber-300">
      <span>
        <strong>1 unsaved session</strong> · {formatHuman(session.elapsedMs)}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-3 py-1 font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={discard}
          className="rounded-md px-2 py-1 underline hover:no-underline"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire all three into the shell**

In `TimeLoggerDashboard.tsx`'s `DashboardInner`, replace the placeholder comment `{/* Stopwatch bar and pending-session strip mount here in Phase 3. */}` with:

```tsx
        <StopwatchBar sw={sw} />
        {sw.pending && !dialogOpen && (
          <PendingSessionStrip
            session={sw.pending}
            onSave={() => setDialogOpen(true)}
            onDiscard={sw.clearPending}
          />
        )}
```

Add the state and the auto-open effect above the return:

```tsx
  const [dialogOpen, setDialogOpen] = useState(false);

  // Stopping the timer produces a pending session; open the dialog straight
  // away. Closing it leaves the session on the strip rather than losing it.
  const pendingId = sw.pending?.id ?? null;
  useEffect(() => {
    if (pendingId) setDialogOpen(true);
  }, [pendingId]);
```

And render the dialog just before the closing `</main>`:

```tsx
      {dialogOpen && sw.pending && (
        <SaveSessionDialog
          session={sw.pending}
          projects={data.projects}
          createLog={data.createLog}
          onClose={() => setDialogOpen(false)}
          onSaved={() => {
            setDialogOpen(false);
            sw.clearPending();
          }}
        />
      )}
```

Add the imports: `useEffect`, `useState` from `react`; `StopwatchBar`, `PendingSessionStrip`, `SaveSessionDialog` from `./stopwatch/…`.

- [ ] **Step 5: Build, lint, manual check**

Run: `npm run build` — expected `Compiled successfully`.
Run: `npm run lint` — expected clean.

Manually, on **both** `/dashboard` and `/legacy/dashboard`:

1. Start a timer, wait ~90 seconds, press Stop. The dialog opens with Hours prefilled as an exact decimal (e.g. `0.03`) and `= 1m 30s` beneath.
2. Date defaults to the day the timer started.
3. Saving with no project shows "Pick a project."; saving with no summary shows "Summary is required."
4. A complete save adds the entry, closes the dialog, clears the pending strip, and the row appears in the Entries tab.
5. Start and stop a timer, then close the dialog with **Save for later**. The amber "1 unsaved session" strip appears and survives a page reload.
6. Clicking Save on the strip reopens the dialog with the same measured duration.
7. Discard on the strip asks for confirmation.
8. While a timer runs, the pinned bar appears above the tabs on all three tabs, with working Pause/Resume/Stop.
9. Editing Hours shows the "reset to measured" link, which restores the measured value.
10. Escape closes the dialog; clicking the backdrop closes it.
11. A timer under one second blocks with "Timer too short to log."

- [ ] **Step 6: Commit**

```bash
git add src/components/time-logger
git commit -m "Add stopwatch save dialog, pinned running bar and unsaved-session strip

Stopping a timer opens a dialog prefilled with the exact measured hours. An
unsaved session persists across reloads instead of being discarded."
```

---

## Phase 4 — Changelog

### Task 10: Changelog data and version bump

**Files:**
- Create: `src/lib/changelog.ts`
- Modify: `package.json` (version field only)

**Interfaces:**
- Produces: `ChangelogTag`, `ChangelogEntry`, `APP_VERSION`, `CHANGELOG`, `compareVersions(a, b)`.

- [ ] **Step 1: Create the changelog module**

`src/lib/changelog.ts`:

```ts
// Curated release notes shown in-app. Written for the people filling in time
// logs, not for developers — these are deliberately not raw commit messages.
// Add a new entry at the top and bump APP_VERSION and package.json together.

export type ChangelogTag = "feature" | "improvement" | "fix";

export type ChangelogEntry = {
  /** Semver, matching package.json. */
  version: string;
  /** YYYY-MM-DD. */
  date: string;
  title: string;
  tag: ChangelogTag;
  items: string[];
};

export const APP_VERSION = "1.3.0";

/** Newest first. */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.3.0",
    date: "2026-07-23",
    title: "Quality of Life Changes",
    tag: "improvement",
    items: [
      "Your dashboard is now organised into tabs",
      "New charts and weekly metrics on the Overview tab",
      "Faster ways to log your daily hours",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-06-26",
    title: "Dark mode across the logger",
    tag: "improvement",
    items: [
      "Every logger page now follows your light or dark preference",
      "Date and number pickers match the theme too",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-06-21",
    title: "Better entry descriptions",
    tag: "improvement",
    items: [
      "Add tools, areas, status and a reference to any entry",
      "Descriptions are formatted consistently for review",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-06-11",
    title: "New backend, activity log and error handling",
    tag: "feature",
    items: [
      "Moved off Google Sheets onto a faster backend",
      "Clearer messages when something goes wrong",
      "A new Logs page for viewing recent activity",
    ],
  },
];

/** Returns a negative number if a < b, positive if a > b, 0 if equal. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x - y;
  }
  return 0;
}
```

- [ ] **Step 2: Bump the package version**

In `package.json`, change `"version": "0.1.0"` to `"version": "1.3.0"`. Change nothing else.

- [ ] **Step 3: Lint and commit**

Run: `npm run lint`
Expected: clean.

```bash
git add src/lib/changelog.ts package.json
git commit -m "Add curated in-app changelog and bump version to 1.3.0"
```

---

### Task 11: Changelog widget

**Files:**
- Create: `src/components/changelog/ChangelogWidget.tsx`
- Modify: `src/app/(app)/layout.tsx`

**Interfaces:**
- Consumes: `APP_VERSION`, `CHANGELOG`, `compareVersions`, `ChangelogEntry` from `@/lib/changelog`.
- Produces: `<ChangelogWidget />` — default export, no props.

- [ ] **Step 1: Create the widget**

`src/components/changelog/ChangelogWidget.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  APP_VERSION,
  CHANGELOG,
  compareVersions,
  type ChangelogEntry,
  type ChangelogTag,
} from "@/lib/changelog";

const SEEN_KEY = "devaicon.changelog.lastSeen";
const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 10_000;

const TAG_STYLES: Record<ChangelogTag, string> = {
  feature:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  improvement:
    "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  fix: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function readSeen(): string | null {
  try {
    return window.localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

function writeSeen(version: string): void {
  try {
    window.localStorage.setItem(SEEN_KEY, version);
  } catch {
    // Private mode: the toasts simply show again next visit.
  }
}

function EntryBody({ entry }: { entry: ChangelogEntry }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TAG_STYLES[entry.tag]}`}
        >
          {entry.tag}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          v{entry.version} · {entry.date}
        </span>
      </div>
      <h3 className="mt-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {entry.title}
      </h3>
      <ul className="mt-1.5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        {entry.items.map((item) => (
          <li key={item} className="flex gap-1.5">
            <span aria-hidden="true">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ChangelogWidget() {
  const [unseen, setUnseen] = useState<ChangelogEntry[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [paused, setPaused] = useState(false);

  // Runs after mount only: localStorage doesn't exist during SSR.
  useEffect(() => {
    const seen = readSeen();
    if (seen === null) {
      // First ever visit — don't dump the whole history on someone. Mark
      // everything as seen and start notifying from the next release.
      writeSeen(APP_VERSION);
      return;
    }
    const fresh = CHANGELOG.filter((e) => compareVersions(e.version, seen) > 0);
    if (fresh.length === 0) return;
    setUnseen(fresh.slice(0, MAX_TOASTS));
    setHasUnread(true);
  }, []);

  const markAllSeen = useCallback(() => {
    writeSeen(APP_VERSION);
    setHasUnread(false);
    setUnseen([]);
  }, []);

  // Auto-dismiss, paused while the user is hovering or focused inside.
  useEffect(() => {
    if (unseen.length === 0 || paused) return;
    const id = window.setTimeout(markAllSeen, AUTO_DISMISS_MS);
    return () => window.clearTimeout(id);
  }, [unseen, paused, markAllSeen]);

  useEffect(() => {
    if (!panelOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPanelOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  function openPanel() {
    setPanelOpen(true);
    markAllSeen();
  }

  const visibleToasts = unseen.filter((e) => !dismissed.has(e.version));

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex w-[min(22rem,calc(100vw-2rem))] flex-col items-end gap-2">
      {!panelOpen &&
        visibleToasts.map((entry) => (
          <div
            key={entry.version}
            role="status"
            aria-live="polite"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="pointer-events-auto w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-lg motion-safe:animate-fadeInScale"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <EntryBody entry={entry} />
              </div>
              <button
                type="button"
                aria-label={`Dismiss notes for version ${entry.version}`}
                onClick={() =>
                  setDismissed((prev) => new Set(prev).add(entry.version))
                }
                className="shrink-0 rounded px-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

      {panelOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="What's new"
          className="pointer-events-auto max-h-[70vh] w-full overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl"
        >
          <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3">
            <h2 className="text-sm font-semibold">What&rsquo;s new</h2>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Close"
              className="rounded px-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          </div>
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {CHANGELOG.map((entry) => (
              <li key={entry.version} className="p-4">
                <EntryBody entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => (panelOpen ? setPanelOpen(false) : openPanel())}
        aria-expanded={panelOpen}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-lg transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
      >
        {hasUnread && (
          <span
            className="h-2 w-2 rounded-full bg-violet-500"
            aria-hidden="true"
          />
        )}
        What&rsquo;s new
        <span className="text-neutral-400 dark:text-neutral-500">
          v{APP_VERSION}
        </span>
      </button>
    </div>
  );
}
```

> `motion-safe:animate-fadeInScale` reuses the existing `fadeInScale` keyframes
> in `globals.css` and is automatically skipped under `prefers-reduced-motion`.

- [ ] **Step 2: Mount it in the app layout**

`src/app/(app)/layout.tsx` — replace the entire file:

```tsx
import type { ReactNode } from "react";
import ThemeScript from "@/components/theme/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ChangelogWidget from "@/components/changelog/ChangelogWidget";

// Layout for the time-logger app pages (login / dashboard / admin, legacy and
// new). Theming is scoped here so the marketing site is unaffected, and the
// changelog widget mounts once for all four logger pages.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeScript />
      <ThemeProvider>
        {children}
        <ChangelogWidget />
      </ThemeProvider>
    </>
  );
}
```

- [ ] **Step 3: Build and lint**

Run: `npm run build` — expected `Compiled successfully`.
Run: `npm run lint` — expected clean.

- [ ] **Step 4: Manual check**

1. In devtools, run `localStorage.setItem("devaicon.changelog.lastSeen", "1.1.0")` and reload `/dashboard`. Two toasts appear bottom-right (1.3.0 and 1.2.0).
2. The 1.3.0 toast reads **"Quality of Life Changes"** and does **not** mention the stopwatch.
3. Toasts auto-dismiss after ~10s; hovering one pauses that.
4. The `What's new` pill shows a violet unread dot beforehand and loses it after dismissal.
5. Clicking the pill opens a panel listing all four versions; Escape and ✕ close it.
6. Reloading again shows no toasts — `lastSeen` is now `1.3.0`.
7. Clear the key entirely (`localStorage.removeItem(...)`) and reload: no toasts on a first-ever visit, and the pill has no unread dot.
8. The widget appears on `/dashboard`, `/admin`, `/legacy/dashboard` and `/legacy/admin`, and **not** on the marketing home page `/`.
9. It renders correctly in both light and dark themes, and does not overlap the dashboard's pagination controls at 1280px or on a 375px-wide viewport.

- [ ] **Step 5: Commit**

```bash
git add src/components/changelog "src/app/(app)/layout.tsx"
git commit -m "Add in-app changelog widget with toasts and history panel"
```

---

## Final verification

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] Full manual pass over `/dashboard` and `/legacy/dashboard` covering the Task 2 Step 5 regression list — the Phase 1 guarantee must still hold after Phases 2–4.
- [ ] Start a timer on `/dashboard`, confirm `/legacy/dashboard` shows **no** timer (scopes are separate).
- [ ] Confirm `server/` has no modifications: `git status` shows changes only under `client/`.
