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
