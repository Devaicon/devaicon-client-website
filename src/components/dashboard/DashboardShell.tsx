"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { nameOf, type Me, type Permission } from "@/lib/types";
import { DashboardSessionProvider, useDashboardSession } from "./DashboardSession";
import { visibleGroups } from "./sections";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <DashboardSessionProvider>
      <Frame>{children}</Frame>
    </DashboardSessionProvider>
  );
}

function isActive(pathname: string, href: string): boolean {
  // Home is the root of every other section, so it only matches exactly.
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The grouped section links, shared by the desktop sidebar and the phone
 * menu. `place` keeps their sliding highlights apart.
 */
function SectionLinks({
  me,
  pathname,
  place,
}: {
  me: Me | null;
  pathname: string;
  place: "sidebar" | "menu";
}) {
  const groups = visibleGroups(me);
  // One item lights up: the most specific match, so Posts isn't also lit on
  // the Blog library page it contains.
  const activeHref = groups
    .flatMap((g) => g.sections.map((s) => s.href))
    .filter((href) => isActive(pathname, href))
    .sort((a, b) => b.length - a.length)[0];

  if (!me) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-full rounded-md bg-neutral-200/70 dark:bg-neutral-800 animate-pulse" />
        ))}
      </>
    );
  }
  return (
    <>
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && (
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              {group.label}
            </div>
          )}
          {group.sections.map((s) => {
            const active = s.href === activeHref;
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                  active
                    ? "text-white"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
                }`}
              >
                {/* One highlight per list, which glides to the new item. */}
                {active && (
                  <motion.span
                    layoutId={`nav-active-${place}`}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="absolute inset-0 rounded-md bg-neutral-900 dark:bg-neutral-700"
                    aria-hidden
                  />
                )}
                <Icon className="relative w-4 h-4" aria-hidden />
                <span className="relative">{s.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { me, logout } = useDashboardSession();
  const pathname = usePathname();
  // The phone menu remembers the page it was opened on, so following a link
  // in it closes it without an effect.
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuOpen = menuFor === pathname;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuFor(null);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <main className="dashboard-shell min-h-screen text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuFor(pathname)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="dashboard-menu"
              className="-ml-2 rounded-md p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
            >
              <MenuIcon className="h-5 w-5" aria-hidden />
            </button>
            <Link href="/dashboard" className="font-semibold tracking-tight whitespace-nowrap">
              <span className="hidden sm:inline">Devaicon · </span>Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-sm whitespace-nowrap">
            {me && (
              <span className="hidden sm:inline text-neutral-600 dark:text-neutral-400">
                {nameOf(me)}{" "}
                <span className="text-neutral-400 dark:text-neutral-500">({me.role.name})</span>
              </span>
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

      {/* Phones: the sections live in a drawer behind the menu button. */}
      <AnimatePresence>
        {menuOpen && (
          <div key="menu" className="fixed inset-0 z-50 md:hidden print:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setMenuFor(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px]"
            />
            <motion.div
              id="dashboard-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard sections"
              initial={reduced ? { opacity: 0 } : { x: "-100%" }}
              animate={reduced ? { opacity: 1 } : { x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: 0.22, ease: EASE }}
              className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{me ? nameOf(me) : "Dashboard"}</p>
                  {me && (
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{me.role.name}</p>
                  )}
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setMenuFor(null)}
                  aria-label="Close menu"
                  className="-mr-2 rounded-md p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <XIcon className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <nav aria-label="Dashboard sections" className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-3">
                <SectionLinks me={me} pathname={pathname} place="menu" />
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 md:flex md:gap-8">
        {/* Sticky on wide screens so the sections stay in reach on long pages;
            it scrolls on its own if the list is taller than the window.
            overflow-y:auto would silently make overflow-x auto as well, and
            the gliding highlight can poke past the edge mid-animation, so
            sideways scrolling is switched off explicitly. */}
        <nav
          aria-label="Dashboard sections"
          className="hidden print:hidden md:flex md:w-52 md:shrink-0 md:sticky md:top-6 md:self-start md:max-h-[calc(100vh-3rem)] md:overflow-y-auto md:overflow-x-hidden flex-col gap-4"
        >
          <SectionLinks me={me} pathname={pathname} place="sidebar" />
        </nav>

        {/* Keyed on the path so each page rises in as it opens. */}
        <div key={pathname} className="anim-rise flex-1 min-w-0">
          {children}
        </div>
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
  const { me } = useDashboardSession();
  if (!me) {
    return (
      <div className="h-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse" />
    );
  }
  if (anyOf.length > 0 && !anyOf.some((p) => me.permissions.includes(p))) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center">
        <h1 className="font-semibold">You don’t have access to this section</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          It isn’t part of your access. Ask an admin if you need it.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

/** Page heading used by every dashboard section. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
