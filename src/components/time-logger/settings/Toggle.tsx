"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "../motion";

/**
 * A switch, not a checkbox: every setting it fronts takes effect the moment it
 * is flipped, and a switch is the control that says so.
 */
export default function Toggle({
  checked,
  onChange,
  label,
  describedBy,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Accessible name; the visible label lives in the setting row. */
  label: string;
  describedBy?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 ${
        checked
          ? "border-violet-600 bg-violet-600"
          : "border-neutral-300 bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-700"
      }`}
    >
      <motion.span
        aria-hidden
        className="h-4.5 w-4.5 rounded-full bg-white shadow-sm"
        initial={false}
        animate={{ x: checked ? 21 : 3 }}
        transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
      />
    </button>
  );
}
