import type { ReactNode } from "react";

/**
 * The panel every Overview section sits in.
 *
 * `title` is a node rather than a string so a section can put controls on its
 * heading row — the calendar's month navigation, for one — without growing a
 * second header beneath it.
 *
 * The card fills its grid slot rather than sizing to its content, because the
 * layout hands it a slot of a chosen size and a card that ignored it would
 * leave the grid ragged. Anything taller than the slot scrolls inside the body.
 */
export default function Card({
  title,
  children,
  className = "",
  backdrop,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  /** Decoration painted behind the content, edge to edge. */
  backdrop?: ReactNode;
}) {
  return (
    <section
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 ${className}`}
    >
      {backdrop}
      <h3 className="relative text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {title}
      </h3>
      <div className="relative mt-3 min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
    </section>
  );
}
