"use client";

import { Suspense, useCallback, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import type { LoggerConfig } from "./config";
import { useLoggerData } from "./useLoggerData";
import OverviewTab from "./tabs/OverviewTab";
import LogTimeTab from "./tabs/LogTimeTab";
import EntriesTab from "./tabs/EntriesTab";
import { useStopwatch } from "./stopwatch/useStopwatch";
import StopwatchBar from "./stopwatch/StopwatchBar";
import PendingSessionStrip from "./stopwatch/PendingSessionStrip";
import SaveSessionDialog from "./stopwatch/SaveSessionDialog";

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
  const sw = useStopwatch(config.storageScope);

  // Stopping the timer produces a pending session, and the dialog is simply
  // "there is a pending session the user hasn't dismissed". Deriving it beats
  // an effect that pushes state: a brand-new session id is never dismissed, so
  // the dialog opens on its own, and closing only hides that specific one.
  const [dismissedPendingId, setDismissedPendingId] = useState<string | null>(
    null,
  );
  const dialogOpen = !!sw.pending && sw.pending.id !== dismissedPendingId;

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
          <div className="flex items-center gap-4 text-sm">
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
            <button onClick={data.reload} className="underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        <StopwatchBar sw={sw} />
        {sw.pending && !dialogOpen && (
          <PendingSessionStrip
            session={sw.pending}
            onSave={() => setDismissedPendingId(null)}
            onDiscard={sw.clearPending}
          />
        )}

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

        <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
          {active === "overview" && (
            <OverviewTab logs={data.logs} loading={data.loading} />
          )}
          {active === "log" && <LogTimeTab data={data} sw={sw} />}
          {active === "entries" && <EntriesTab data={data} />}
        </div>
      </div>

      {dialogOpen && sw.pending && (
        <SaveSessionDialog
          session={sw.pending}
          projects={data.projects}
          createLog={data.createLog}
          onClose={() => setDismissedPendingId(sw.pending!.id)}
          onSaved={sw.clearPending}
        />
      )}
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
