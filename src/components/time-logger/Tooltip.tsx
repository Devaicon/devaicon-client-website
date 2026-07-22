"use client";

import { useId, useState, type ReactNode } from "react";

// A `title` attribute is invisible to touch users and can't be styled, so this
// is a real tooltip: hover, keyboard focus, tap, and Escape to dismiss.
export default function Tooltip({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-help"
      >
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-left text-xs font-normal leading-relaxed text-neutral-700 dark:text-neutral-200 shadow-lg"
        >
          {content}
        </span>
      )}
    </span>
  );
}
