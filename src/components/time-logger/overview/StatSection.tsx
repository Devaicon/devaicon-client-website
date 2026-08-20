"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDownIcon, SlidersHorizontalIcon } from "lucide-react";
import { slideDown } from "../motion";
import { useTimeFormat } from "../TimeFormatProvider";
import StatGrid, { gridClassFor } from "./StatGrid";
import CardOptionsPanel from "./CardOptionsPanel";
import { cardById, type CardContext, type CardDef } from "./cards";
import { useOverviewPrefs } from "./useOverviewPrefs";
import type { LoggerConfig } from "../config";
import type { LoggerMetrics } from "../metrics";

/**
 * The tile band at the top of the Overview tab: an always-visible lane, an
 * optional second lane behind a disclosure, and the panel that decides which
 * cards sit where. Both lanes size their own grid to their own card count.
 */
export default function StatSection({
  config,
  metrics,
  loading,
}: {
  config: LoggerConfig;
  metrics: LoggerMetrics;
  loading: boolean;
}) {
  const { prefs, expanded, setExpanded, setPlacement, reset, sync } =
    useOverviewPrefs(config);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();

  const panelId = useId();
  const extraId = useId();

  // `now` is captured once per format change rather than per render, so the
  // month and year labels can't shift underneath a re-render.
  const ctx = useMemo<CardContext>(() => ({ now: new Date(), fmt }), [fmt]);

  const resolve = (ids: readonly string[]): CardDef[] =>
    ids
      .map((id) => cardById(id as CardDef["id"]))
      .filter((c): c is CardDef => !!c);

  const pinnedCards = resolve(prefs.pinned);
  const extraCards = resolve(prefs.extra);

  // The trigger lives inside wrapRef, so clicking it closes the panel through
  // its own onClick rather than being treated as an outside click and reopened.
  useEffect(() => {
    if (!optionsOpen) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOptionsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [optionsOpen]);

  const header = (
    <div className="flex items-center justify-between gap-3">
      <h2 className="sr-only">Overview cards</h2>
      <div ref={wrapRef} className="relative ml-auto">
        <button
          type="button"
          onClick={() => setOptionsOpen((v) => !v)}
          aria-expanded={optionsOpen}
          aria-haspopup="dialog"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <SlidersHorizontalIcon className="h-3.5 w-3.5" />
          Cards
        </button>
        <AnimatePresence>
          {optionsOpen && (
            <CardOptionsPanel
              prefs={prefs}
              ctx={ctx}
              sync={sync}
              serverBacked={config.preferenceSync === "server"}
              onPlace={setPlacement}
              onReset={reset}
              onClose={() => setOptionsOpen(false)}
              titleId={panelId}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (loading) {
    const n = Math.max(1, pinnedCards.length);
    return (
      <div className="space-y-3">
        {header}
        <div className={gridClassFor(n)}>
          {Array.from({ length: n }, (_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            />
          ))}
        </div>
      </div>
    );
  }

  const nothingShown = pinnedCards.length === 0 && extraCards.length === 0;

  return (
    <div className="space-y-3">
      {header}

      {nothingShown ? (
        <p className="rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 px-5 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Every card is hidden. Use <strong className="font-medium">Cards</strong>{" "}
          above to bring some back.
        </p>
      ) : (
        <StatGrid cards={pinnedCards} metrics={metrics} ctx={ctx} />
      )}

      {extraCards.length > 0 && (
        <>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls={extraId}
              className="flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <ChevronDownIcon
                aria-hidden
                className={`h-4 w-4 transition-transform motion-reduce:transition-none ${
                  expanded ? "rotate-180" : ""
                }`}
              />
              {expanded
                ? "Show less"
                : `Show ${extraCards.length} more`}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="extra"
                id={extraId}
                variants={slideDown(!!reduced)}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <StatGrid cards={extraCards} metrics={metrics} ctx={ctx} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
