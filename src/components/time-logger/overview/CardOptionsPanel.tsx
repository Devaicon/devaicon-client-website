"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcwIcon, XIcon } from "lucide-react";
import { fadeRise } from "../motion";
import { CARDS, CARD_GROUPS, type CardContext, type CardId } from "./cards";
import { placementOf, type OverviewPrefs, type Placement } from "./preferences";
import type { SyncState } from "./useOverviewPrefs";

/**
 * Three placements rather than a checkbox plus a drag handle: it says exactly
 * where a card ends up, needs no pointer gestures, and is reachable from the
 * keyboard. Order inside each lane follows the catalogue, which is already
 * arranged shortest period first.
 */
const PLACEMENTS: { value: Placement; label: string; hint: string }[] = [
  { value: "hidden", label: "Hide", hint: "Not shown at all" },
  { value: "pinned", label: "Top", hint: "Always visible" },
  { value: "extra", label: "More", hint: "Behind Show more" },
];

function syncMessage(sync: SyncState, serverBacked: boolean): string {
  if (!serverBacked) return "Saved in this browser only.";
  switch (sync) {
    case "saving":
      return "Saving to your account…";
    case "local-only":
      return "Saved on this device — your account couldn't be reached.";
    case "rejected":
      return "Your account rejected that change, so it was undone.";
    default:
      return "Saved to your account.";
  }
}

export default function CardOptionsPanel({
  prefs,
  ctx,
  sync,
  serverBacked,
  onPlace,
  onReset,
  onClose,
  titleId,
}: {
  prefs: OverviewPrefs;
  ctx: CardContext;
  sync: SyncState;
  serverBacked: boolean;
  onPlace: (id: CardId, to: Placement) => void;
  onReset: () => void;
  onClose: () => void;
  titleId: string;
}) {
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const problem = sync === "local-only" || sync === "rejected";

  return (
    <motion.div
      role="dialog"
      aria-labelledby={titleId}
      variants={fadeRise(!!reduced)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute right-0 top-full z-30 mt-2 w-80 max-w-[calc(100vw-3rem)] overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg"
    >
      <div className="flex items-start justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <div className="min-w-0">
          <h2
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
            className="text-sm font-semibold outline-none"
          >
            Overview cards
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {prefs.pinned.length} always shown · {prefs.extra.length} behind Show
            more
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close card options"
          className="-mr-1 -mt-1 rounded-md p-1.5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto px-4 py-2">
        {CARD_GROUPS.map((group) => (
          <section key={group.id} className="py-2">
            <h3 className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {group.label}
            </h3>
            <div className="mt-1.5 space-y-1">
              {CARDS.filter((c) => c.group === group.id).map((card) => {
                const current = placementOf(prefs, card.id);
                const label = card.label(ctx);
                return (
                  <div key={card.id} className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm" title={label}>
                      {label}
                    </span>
                    <div
                      role="radiogroup"
                      aria-label={`Where to show ${label}`}
                      className="flex shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800"
                    >
                      {PLACEMENTS.map((p) => {
                        const on = current === p.value;
                        return (
                          <button
                            key={p.value}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            title={p.hint}
                            onClick={() => onPlace(card.id, p.value)}
                            className={`px-2 py-1 text-[11px] font-medium transition-colors ${
                              on
                                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-neutral-200 dark:border-neutral-800 px-4 py-2.5">
        <p
          aria-live="polite"
          className={`min-w-0 flex-1 text-[11px] ${
            problem
              ? "text-amber-700 dark:text-amber-400"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {syncMessage(sync, serverBacked)}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <RotateCcwIcon className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </motion.div>
  );
}
