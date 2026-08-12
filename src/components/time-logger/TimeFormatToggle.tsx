"use client";

import { useTimeFormat } from "./TimeFormatProvider";
import type { TimeFormat } from "./timeFormat";

// The labels are worked examples rather than words: "7.5h" / "7h 30m" shows
// exactly what the button does, which no amount of naming would.
const OPTIONS: { value: TimeFormat; sample: string; label: string }[] = [
  { value: "decimal", sample: "7.5h", label: "Decimal hours" },
  { value: "human", sample: "7h 30m", label: "Hours and minutes" },
];

export default function TimeFormatToggle() {
  const { format, setFormat } = useTimeFormat();

  return (
    <div
      role="group"
      aria-label="Time format"
      className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-0.5"
    >
      {OPTIONS.map(({ value, sample, label }) => {
        const active = format === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setFormat(value)}
            title={label}
            aria-pressed={active}
            className={`rounded-md px-2 py-1 text-xs font-medium tabular-nums transition-colors ${
              active
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            }`}
          >
            {sample}
            <span className="sr-only"> — {label}</span>
          </button>
        );
      })}
    </div>
  );
}
