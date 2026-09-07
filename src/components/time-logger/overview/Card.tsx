import type { ReactNode } from "react";

/**
 * The panel every Overview section sits in.
 *
 * `title` is a node rather than a string so a section can put controls on its
 * heading row — the calendar's month navigation, for one — without growing a
 * second header beneath it.
 */
export default function Card({
  title,
  children,
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
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
