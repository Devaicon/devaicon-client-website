"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { XIcon } from "lucide-react";
import { backdrop, dialogPanel } from "../motion";
import StatGrid from "./StatGrid";
import type { LoggerMetrics } from "../metrics";
import type { CardContext, CardDef } from "./cards";

/**
 * The cards a user keeps off the page but still wants within reach.
 *
 * These used to open in place beneath the tile band, which pushed every
 * section below it down the page and left the Overview a different height
 * depending on whether it had last been opened. A window over the page keeps
 * the dashboard exactly as it was arranged.
 */
export default function MoreCardsDialog({
  cards,
  metrics,
  ctx,
  onCustomise,
  onClose,
}: {
  cards: CardDef[];
  metrics: LoggerMetrics;
  ctx: CardContext;
  /** Switches the page into Customise, where cards are moved between lanes. */
  onCustomise: () => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus lands inside the window once, on opening. Kept apart from the key
  // listener so a parent re-render cannot yank focus back to Close.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      variants={backdrop()}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-cards-title"
        variants={dialogPanel(!!reduced)}
        className="w-full max-w-4xl rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-6 text-neutral-900 dark:text-neutral-100 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="more-cards-title" className="text-lg font-semibold">
              More figures
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Cards you keep off the dashboard.{" "}
              <button
                type="button"
                onClick={onCustomise}
                className="cursor-pointer underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Choose which
              </button>
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <StatGrid cards={cards} metrics={metrics} ctx={ctx} className="mt-5" />
      </motion.div>
    </motion.div>
  );
}
