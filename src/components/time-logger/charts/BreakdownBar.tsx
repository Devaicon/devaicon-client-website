"use client";

import { useTimeFormat } from "../TimeFormatProvider";
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
  const { fmt } = useTimeFormat();
  const max = items.reduce((m, i) => Math.max(m, i.hours), 0);

  if (items.length === 0 || max === 0) {
    return (
      <div className="flex h-full items-center justify-center py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        {emptyLabel}
      </div>
    );
  }

  /**
   * The rows share out whatever height the card has, rather than stacking at a
   * fixed pitch and leaving the rest of a maximised card empty beneath them.
   *
   * Each row is `flex-1` over a minimum, so spare space is divided equally and
   * a list too long for the card overflows downward into the scroll instead of
   * being centred and losing its top — which is what `justify-center` or
   * `my-auto` would do here.
   */
  return (
    <ul className="flex h-full min-h-0 w-full flex-col gap-2.5">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex min-h-[2.5rem] flex-1 flex-col justify-center"
        >
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-neutral-700 dark:text-neutral-300">
              {item.name}
            </span>
            <span className="tabular-nums whitespace-nowrap text-neutral-500 dark:text-neutral-400">
              {fmt(item.hours)}
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
