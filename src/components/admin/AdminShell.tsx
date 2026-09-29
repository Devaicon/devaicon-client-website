"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { can, nameOf, type Permission } from "@/lib/types";
import { AdminSessionProvider, useAdminSession } from "./AdminSession";
import { ADMIN_SECTIONS } from "./sections";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <Frame>{children}</Frame>
    </AdminSessionProvider>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { me, logout } = useAdminSession();
  const pathname = usePathname();
  const sections = ADMIN_SECTIONS.filter((s) => s.anyOf.some((p) => can(me, p)));

  return (
    <main className="min-h-screen text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="font-semibold tracking-tight whitespace-nowrap">
            <span className="hidden sm:inline">Devaicon · </span>Admin
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-sm whitespace-nowrap">
            <ThemeToggle />
            {me && (
              <span className="hidden sm:inline text-neutral-600 dark:text-neutral-400">
                {nameOf(me)}{" "}
                <span className="text-neutral-400 dark:text-neutral-500">({me.role.name})</span>
              </span>
            )}
            {can(me, "timelogs.log") && (
              <Link
                href="/dashboard"
                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                My dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 md:flex md:gap-8">
        <nav
          aria-label="Admin sections"
          className="print:hidden md:w-48 md:shrink-0 mb-6 md:mb-0 flex md:flex-col gap-1 overflow-x-auto"
        >
          {!me
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 w-28 md:w-full rounded-md bg-neutral-200/70 dark:bg-neutral-800 animate-pulse"
                />
              ))
            : sections.map((s) => {
                const active = pathname === s.href || pathname.startsWith(`${s.href}/`);
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-neutral-900 text-white dark:bg-neutral-700"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden />
                    {s.label}
                  </Link>
                );
              })}
        </nav>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </main>
  );
}

/**
 * Renders a section only for users holding one of `anyOf`. Hiding is a
 * courtesy — Express refuses the requests regardless.
 */
export function SectionGate({
  anyOf,
  children,
}: {
  anyOf: Permission[];
  children: ReactNode;
}) {
  const { me } = useAdminSession();
  if (!me) {
    return (
      <div className="h-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse" />
    );
  }
  if (!anyOf.some((p) => can(me, p))) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center">
        <h1 className="font-semibold">You don’t have access to this section</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Your role ({me.role.name}) doesn’t include it. Ask an Owner if you need it.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
