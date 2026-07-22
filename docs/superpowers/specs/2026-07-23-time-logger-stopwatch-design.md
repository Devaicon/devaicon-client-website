# Time Logger: Stopwatch, Tabbed Dashboard & Changelog Toasts

Date: 2026-07-23
Status: Approved, ready for implementation planning
Scope: `client/` only. No server changes.

## Problem

Filling daily time logs requires manually noting how long each task took and
then estimating hours into a form. That estimation step is the friction. The
user side of the time logger also presents every metric as three flat totals
(today / week / month) with no history or trend, and users have no way to learn
that anything in the app has changed.

Three changes address this:

1. A stopwatch that measures work as it happens and turns the measurement into
   a log entry.
2. A tabbed dashboard with real metrics and charts.
3. An in-app changelog surfaced as toasts.

All three ship to both the new client (`/dashboard`) and the legacy client
(`/legacy/dashboard`).

## Current state

- `client/` is Next.js 16, React 19, Tailwind 4, TypeScript. It is its own git
  repository; the parent directory is not.
- `server/` is Express + Mongoose. (`.claude/CLAUDE.md` describes a
  Hono/Bun/Drizzle/Postgres stack; that file is stale. It is not touched here.)
- `app/(app)/dashboard/page.tsx` (789 lines) and
  `app/(app)/legacy/dashboard/page.tsx` (796 lines) are near-identical
  copy-paste. The only differences are:
  - API base: `/api/*` vs `/api/legacy/*`
  - Login redirect: `/login` vs `/legacy/login`
  - Admin link: `/admin` vs `/legacy/admin`
  - Bulk delete: `POST /api/logs/bulk-delete` with `{ids}` body vs
    `DELETE /api/legacy/logs?ids=a,b,c`
  - Legacy has an amber "Google Sheets backend" banner
- No test framework is installed. No chart library is installed.
- Both backends validate hours as `Number.isFinite(h) && h > 0 && h <= 24`; the
  Mongoose model uses `min: 0.01`. Exact decimal hours are therefore accepted
  server-side without any server change.

## Decisions

| Decision | Choice |
|---|---|
| Duplication | Extract one shared dashboard component; pages become thin wrappers |
| Timer accuracy | Derive elapsed from timestamps; never count ticks |
| Timer recovery | Restore on load; warn when stale |
| Hours conversion | Exact decimal (`1h47m` -> `1.78`) |
| Concurrency | One timer at a time |
| Project selection | Optional before start, required at stop |
| Tabs | Overview / Log time / Entries |
| Charts | Recharts 3.x (peer-supports React 19) |
| Unsaved stop | Held as a pending session until saved or discarded |
| Changelog source | Curated `changelog.ts`, seeded from git history |
| Toast behaviour | Auto once per version, plus a persistent trigger |
| Widget scope | All four logger pages, via `app/(app)/layout.tsx` |
| Versioning | Semver in `package.json`, bumped `0.1.0` -> `1.3.0` |
| Tests | None. Verification is `next build` + `eslint` + manual |
| Package manager | `npm`, matching the checked-in `package-lock.json` |

## Architecture

### File layout

```
client/src/
  components/
    time-logger/
      config.ts                 LoggerConfig type + NEW_CONFIG / LEGACY_CONFIG
      TimeLoggerDashboard.tsx   shell: header, pinned bars, tab switcher
      useLoggerData.ts          fetch + mutate (me, projects, logs, submit, delete, bulk)
      metrics.ts                pure: totals, last-7-days, streak, gaps, breakdowns
      Tooltip.tsx               accessible tooltip primitive
      tabs/
        OverviewTab.tsx
        LogTimeTab.tsx
        EntriesTab.tsx          table + filters + pagination, lifted unchanged
      charts/
        Last7DaysChart.tsx
        BreakdownBar.tsx
        palette.ts              reads CSS custom properties for Recharts fills
      stopwatch/
        storage.ts              localStorage schema, guards, cross-tab sync
        useStopwatch.ts         state machine
        StopwatchCard.tsx       controls
        StopwatchBar.tsx        pinned bar while running
        PendingSessionStrip.tsx unsaved-session prompt
        SaveSessionDialog.tsx   stop -> collect fields -> submit
    changelog/
      ChangelogWidget.tsx       toasts + pill + history panel
  lib/
    changelog.ts                APP_VERSION + curated entries
```

### The seam between clients

One object carries every difference between the two clients:

```ts
export type LoggerConfig = {
  apiBase: string;                            // "/api" | "/api/legacy"
  loginPath: string;                          // "/login" | "/legacy/login"
  adminPath: string;                          // "/admin" | "/legacy/admin"
  bulkDelete: "post-body" | "delete-query";   // the one real API divergence
  storageScope: "new" | "legacy";             // separate stopwatch state per backend
  banner?: ReactNode;                         // legacy's amber Google Sheets strip
};
```

`app/(app)/dashboard/page.tsx` and `app/(app)/legacy/dashboard/page.tsx` each
reduce to roughly ten lines rendering `<TimeLoggerDashboard config={...} />`.
Every feature in this spec is written once and appears in both.

The two admin pages are not restructured. They receive only the changelog
widget, which mounts once in `app/(app)/layout.tsx` and therefore covers all
four logger pages.

### Why these boundaries

`metrics.ts` is pure data-in/data-out. Streak and gap logic is the easiest thing
here to get subtly wrong, and isolating it keeps it readable and inspectable.
`useLoggerData` owns the network so tab components stay dumb renderers.
`useStopwatch` owns time and persistence so no component touches `localStorage`
directly.

## Stopwatch

### State machine

```ts
type Snapshot =
  | { status: "idle" }
  | { status: "running"; startedAt: number; accumulatedMs: number;
      firstStartedAt: number; projectHint: string }
  | { status: "paused";  accumulatedMs: number;
      firstStartedAt: number; projectHint: string };

// Elapsed is always derived, never accumulated by a counter:
elapsedMs = status === "running"
  ? accumulatedMs + (Date.now() - startedAt)
  : accumulatedMs;
```

A one-second interval exists solely to trigger a re-render. The displayed value
always comes from `Date.now()`. Background throttling makes the display lag; it
never makes the value wrong. The hook also re-derives on `visibilitychange`.

Transitions:

- `start(projectHint?)` — idle -> running. Sets `startedAt = firstStartedAt = Date.now()`, `accumulatedMs = 0`.
- `pause()` — running -> paused. Folds `Date.now() - startedAt` into `accumulatedMs`.
- `resume()` — paused -> running. Sets `startedAt = Date.now()`, keeps `accumulatedMs`.
- `stop()` — running|paused -> idle, emitting a `PendingSession`.
- `reset()` — running|paused -> idle, discarding. Requires confirmation.

Starting while a timer already runs is refused with a prompt to stop and log the
current one first.

### Tab priority and survival

No web API can forbid a browser from discarding a tab. This design does not
pretend otherwise. What it does:

- `beforeunload` returns a value while a timer is running or a session is
  unsaved, producing the browser's native "Leave site?" confirmation.
- Screen Wake Lock (`navigator.wakeLock.request("screen")`) is requested on
  start and re-acquired when the tab becomes visible again, since locks release
  automatically when a document is hidden. Wrapped in try/catch; unsupported
  browsers silently skip it. Released on pause and stop.

The actual guarantee comes from timestamp derivation plus persistence: tab
discard, freeze, reload and full browser restart are all harmless to the
recorded duration.

### Persistence and cross-tab sync

Keys, namespaced by backend so a legacy timer never leaks into the new one:

- `devaicon.stopwatch.<scope>.v1` — the `Snapshot`
- `devaicon.stopwatch.<scope>.pending.v1` — the `PendingSession`, if any

Written on every transition, not on every tick. A `storage` event listener
rehydrates state so a second open tab shows the same running timer.

Payloads carry a schema version. A payload that is corrupt, unparseable, or
from an older schema is dropped and reset rather than crashed on. If
`localStorage` is unavailable — private browsing, quota exhaustion — every
access is guarded, the stopwatch degrades to in-memory operation, and the card
displays one line: "This browser isn't saving timer state, so a reload will
lose it."

### Stale-timer guard

On restore, if elapsed exceeds 12 hours or `firstStartedAt` falls on an earlier
local date than today, the card shows an amber banner instead of resuming
silently:

```
Timer has been running since Wed 3:40 PM  [Keep running] [Stop & log] [Discard]
```

This prevents a forgotten timer from producing a thirty-hour entry.

### Stop dialog

```ts
type PendingSession = {
  id: string;
  elapsedMs: number;
  startedAtISO: string;
  endedAtISO: string;
  projectHint: string;
};
```

Fields collected:

- **Date** — defaults to the local date the timer *started*, not today, capped at today.
- **Project** — prefilled from `projectHint` if one was set; required.
- **Category** — defaults to `Coding`.
- **Hours** — its own `<input type="number" step={0.01} min={0.01} max={24}>`,
  prefilled with `elapsedMs / 3_600_000` rounded to two decimals. The manual
  form's `step={0.25}` input is left alone; a `1.78` value in a `step=0.25`
  field would fail browser validation, so the dialog carries its own. Beneath
  the field: `= 1h 47m 12s`. Once edited, a "reset to measured" link restores
  the measured value.
- **Description** — the existing `DescriptionBuilder`, unchanged, with the same
  required-summary rule.

Submitting uses the same POST path as the manual form. On success the pending
session is cleared and the entries list reloads. If elapsed rounds below
`0.01`, saving is blocked with "Timer too short to log."

Closing the dialog without saving does not discard the measurement. The session
persists and surfaces as a strip above the tabs:

```
1 unsaved session · 1h 47m   [Save] [Discard]
```

The strip survives reloads and reopens the dialog on Save.

### Entry point and the New tooltip

The Log time tab header carries a segmented control:

```
[ Manual ]  [ (stopwatch icon) Stopwatch  NEW ]
```

The NEW badge carries a real tooltip component — focusable, `aria-describedby`,
Escape to dismiss, tap-to-open on touch — not a bare `title` attribute:

> **New** — track time live instead of estimating it. Start the timer and we'll
> fill the hours in when you stop.

## Tabs and metrics

Tab state lives in a `?tab=overview|log|entries` search param so a refresh keeps
the user's place. Markup uses `role="tablist"` / `role="tab"` / `role="tabpanel"`
with arrow-key navigation.

The running-stopwatch bar and the pending-session strip pin **above** the tab
bar, so they remain visible from every tab.

### Overview tab

1. **Tile row** — Today, This week, This month, Average per logged day (this month).
2. **Last 7 days** — Recharts `BarChart`, one bar per day, today's bar accented,
   days with no entries rendered as zero rather than omitted.
3. **Streak & gaps** — current streak of consecutive **weekdays** with at least
   one entry. Weekends neither break nor extend a streak. The streak is counted
   backwards from the most recent weekday, and an unlogged *today* does not
   break it — the day is not over yet — so the walk begins at today if today has
   entries, otherwise at the previous weekday. Below it, weekday gaps from the
   last 14 days, excluding today: `Not logged: Mon 20 Jul, Tue 21 Jul`. Renders
   green when there are none.
4. **Hours by project** — horizontal bars, current month, top 6 plus "Other".
5. **Hours by category** — same treatment.
6. **Approval** — pending hours versus approved hours with a proportion bar.

Recharts cannot take Tailwind classes for fills. Chart colours are declared once
as CSS custom properties in `globals.css` and read through `charts/palette.ts`,
which keeps light and dark themes working with the existing `ThemeProvider`.

Every card renders a purposeful empty state for a user with zero logs rather
than an empty axis.

### Log time tab

The existing manual form, unchanged in behaviour, plus the Manual/Stopwatch
segmented control and the `StopwatchCard`.

### Entries tab

The existing filter bar, table, multi-select, bulk delete and pagination, lifted
without behavioural change.

## Changelog

`lib/changelog.ts`:

```ts
export type ChangelogTag = "feature" | "improvement" | "fix";

export type ChangelogEntry = {
  version: string;   // semver
  date: string;      // YYYY-MM-DD
  title: string;
  tag: ChangelogTag;
  items: string[];
};

export const APP_VERSION = "1.3.0";
export const CHANGELOG: ChangelogEntry[] = [ /* newest first */ ];
```

`client/package.json` moves from `0.1.0` to `1.3.0`. Seeded entries, written in
end-user language rather than commit messages:

| Version | Date | Title | Tag |
|---|---|---|---|
| 1.3.0 | 2026-07-23 | Quality of Life Changes | improvement |
| 1.2.0 | 2026-06-26 | Dark mode across the logger | improvement |
| 1.1.0 | 2026-06-21 | Better entry descriptions | improvement |
| 1.0.0 | 2026-06-11 | New backend, activity log, error handling | feature |

The 1.3.0 entry deliberately does **not** call out the stopwatch. Its items are:

- Your dashboard is now organised into tabs
- New charts and weekly metrics on the Overview tab
- Faster ways to log your daily hours

### Widget behaviour

Mounted once in `app/(app)/layout.tsx`, so it appears on `/dashboard`,
`/admin`, `/legacy/dashboard` and `/legacy/admin`. The marketing site is
unaffected.

`devaicon.changelog.lastSeen` stores the highest version the user has seen. On
mount, a semver comparison selects unseen entries; up to three stack in the
bottom-right corner as toasts that auto-dismiss after ten seconds, with hover
and focus pausing the timer. Dismissing or opening the panel writes
`lastSeen = APP_VERSION`.

A `What's new` pill sits permanently in the bottom-right corner with an unread
dot, and opens a panel listing the full version history on click.

Animations respect `prefers-reduced-motion`. Toasts are rendered in an
`aria-live="polite"` region and are keyboard-dismissible.

## Error handling

- Network failures in `useLoggerData` surface through the existing `submitMsg`
  pattern for writes, and through a per-tab error state with a retry action for
  reads. A 401 on any call redirects to `config.loginPath`, as today.
- Any `localStorage` read or write is wrapped; failure degrades a feature rather
  than throwing.
- Corrupt or old-schema persisted payloads are discarded and reset.
- Wake Lock rejection is swallowed silently; it is an enhancement, not a
  requirement.
- The save dialog blocks submission for durations below `0.01` hours and for
  durations above 24 hours, matching both backends' validation, with a clear
  message rather than a server error.

## Verification

No test framework is being added, per decision. Each phase is verified by:

1. `npm run build` completes with no errors or new warnings.
2. `npm run lint` is clean.
3. Manual pass over `/dashboard` and `/legacy/dashboard`.

Phase 1 carries a specific requirement: after the extraction, both dashboards
must behave identically to their pre-refactor state. Logging, filtering,
pagination, selection, single delete, bulk delete on both API shapes, the admin
link, the legacy banner and sign-out are each exercised before Phase 2 begins.

## Implementation phases

1. **Extract the shared dashboard.** Create `components/time-logger/`, move the
   existing UI into `TimeLoggerDashboard` behind `LoggerConfig`, reduce both
   pages to wrappers. No behavioural change. Verify both clients.
2. **Tabs, metrics and charts.** Install Recharts. Add `metrics.ts`, the tab
   shell, the Overview tab and the chart components. Split the existing form and
   table into `LogTimeTab` and `EntriesTab`.
3. **Stopwatch.** `storage.ts`, `useStopwatch.ts`, the card, the pinned bar, the
   pending-session strip, the save dialog, the segmented control and the New
   tooltip.
4. **Changelog.** `lib/changelog.ts`, the widget, the `package.json` version
   bump, mount in `app/(app)/layout.tsx`.

## Out of scope

- Any server change.
- Restructuring the admin dashboards.
- Multiple concurrent timers.
- Idle detection or automatic timer pausing.
- Generating changelog entries from git at build time.
- Editing existing log entries.
