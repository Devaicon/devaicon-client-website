"use client";

import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import { can, nameOf } from "@/lib/types";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import { visibleGroups } from "@/components/dashboard/sections";

const CARD =
  "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900";

/**
 * Everyone's landing page. What it offers follows from their permissions:
 * the Time Logger for anyone who logs time, and a shortcut to every other
 * section their access opens.
 */
export default function DashboardHome() {
  const { me } = useDashboardSession();

  if (!me) {
    return <div className={`h-64 animate-pulse ${CARD}`} />;
  }

  const shortcuts = visibleGroups(me)
    .flatMap((g) => g.sections)
    .filter((s) => s.href !== "/dashboard" && s.href !== "/dashboard/settings");
  const logsTime = can(me, "timelogs.log");

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Hi, ${nameOf(me)}`}
        description="Everything your access opens, in one place."
      />

      {logsTime && (
        <section aria-labelledby="apps-heading" className="space-y-3">
          <h2 id="apps-heading" className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Apps
          </h2>
          <div className={`${CARD} anim-pop p-6 flex flex-col gap-4 sm:flex-row sm:items-center`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              <Timer className="h-6 w-6" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">Time Logger</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Log your hours, run the stopwatch, and see your day, week and month at a glance.
              </p>
            </div>
            <Link
              href="/dashboard/time-logger"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              Open Time Logger
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {shortcuts.length > 0 && (
        <section aria-labelledby="sections-heading" className="space-y-3">
          <h2 id="sections-heading" className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Your sections
          </h2>
          <ul className="anim-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shortcuts.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className={`${CARD} lift group flex h-full items-start gap-3 p-4 hover:border-neutral-300 dark:hover:border-neutral-700`}
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" aria-hidden />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1 font-medium">
                        {s.label}
                        <ArrowRight
                          className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0"
                          aria-hidden
                        />
                      </span>
                      <span className="block text-sm text-neutral-500 dark:text-neutral-400">{s.blurb}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {!logsTime && shortcuts.length === 0 && (
        <div className={`${CARD} p-8 text-center`}>
          <p className="font-medium">Nothing is switched on for your account yet.</p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Ask an admin to give you access. Your own settings are always in Settings.
          </p>
        </div>
      )}
    </div>
  );
}
