"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

export type MenuItem = { label: string; hint?: string; onSelect: () => void; disabled?: boolean };

/**
 * A toolbar button that opens a short list of actions, e.g. Export → as
 * CSV / as JSON. Closes on a choice, a click elsewhere or Escape.
 */
export default function MenuButton({
  icon: Icon,
  label,
  items,
  disabled = false,
  title,
}: {
  icon: LucideIcon;
  label: string;
  items: MenuItem[];
  disabled?: boolean;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        title={title}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
      >
        <Icon className="h-4 w-4" aria-hidden />
        {label}
        <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="anim-drop absolute right-0 z-20 mt-1 w-64 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <span className="block font-medium">{item.label}</span>
              {item.hint && <span className="block text-xs text-neutral-500 dark:text-neutral-400">{item.hint}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
