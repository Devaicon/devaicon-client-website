"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { dropdownPanel } from "../motion";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
  /** Shown under the label in the list, e.g. a worked example of the format. */
  hint?: string;
  icon?: ReactNode;
};

/**
 * A listbox rather than a native <select>, because these options carry an icon
 * and a line of explanation each, and a native option can hold neither.
 *
 * Keyboard handling follows the listbox pattern: Up/Down move the highlight,
 * Enter or Space commits, Escape closes without changing anything.
 */
export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name; the visible label lives in the setting row. */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const selected = options[selectedIndex];

  // Opening always starts from the current choice, so Enter with no arrowing
  // is a no-op rather than a silent jump to the first option.
  function openList() {
    setActive(selectedIndex);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [open]);

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(active);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full sm:w-56">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-left text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        {selected?.icon && (
          <span className="shrink-0 text-neutral-500 dark:text-neutral-400">
            {selected.icon}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate font-medium">
          {selected?.label}
        </span>
        <ChevronDownIcon
          aria-hidden
          className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${listId}-${active}`}
            tabIndex={-1}
            variants={dropdownPanel(!!reduced)}
            initial="initial"
            animate="animate"
            exit="exit"
            onKeyDown={onKeyDown}
            className="absolute z-30 mt-1 w-full origin-top overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-1 shadow-lg"
          >
            {options.map((option, i) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => commit(i)}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                    i === active
                      ? "bg-neutral-100 dark:bg-neutral-700"
                      : "bg-transparent"
                  }`}
                >
                  {option.icon && (
                    <span className="shrink-0 text-neutral-500 dark:text-neutral-400">
                      {option.icon}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {option.label}
                    </span>
                    {option.hint && (
                      <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {option.hint}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <CheckIcon className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
