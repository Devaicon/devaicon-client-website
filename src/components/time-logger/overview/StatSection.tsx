"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { slideDown } from "../motion";
import { useTimeFormat } from "../TimeFormatProvider";
import StatGrid, { gridClassFor } from "./StatGrid";
import {
  CARDS,
  cardById,
  type CardContext,
  type CardDef,
  type CardId,
} from "./cards";
import { placementOf, type Lane } from "./preferences";
import { useOverviewPrefs, type SyncState } from "./useOverviewPrefs";
import type { LoggerConfig } from "../config";
import type { LoggerMetrics } from "../metrics";

/**
 * The tile band at the top of the Overview tab.
 *
 * Customising happens on the tiles themselves rather than through a list of
 * switches: you remove the card you are looking at, and drop a hidden one back
 * in from the tray. Both lanes stay on screen throughout, so the layout being
 * built is the layout being previewed.
 */

function syncMessage(sync: SyncState, serverBacked: boolean): string {
  if (!serverBacked) return "Saved in this browser.";
  switch (sync) {
    case "saving":
      return "Saving...";
    case "local-only":
      return "Saved on this device — your account could not be reached.";
    case "rejected":
      return "Your account rejected that change, so it was undone.";
    default:
      return "Saved to your account.";
  }
}

function LaneHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {children}
      </span>
      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
}

function EmptyLane({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 px-5 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  );
}

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
  const [editing, setEditing] = useState(false);
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();
  const extraId = useId();

  // `now` is captured once per format change rather than per render, so the
  // month and year labels cannot shift underneath a re-render.
  const ctx = useMemo<CardContext>(() => ({ now: new Date(), fmt }), [fmt]);

  const resolve = (ids: readonly string[]): CardDef[] =>
    ids.map((id) => cardById(id as CardId)).filter((c): c is CardDef => !!c);

  const pinnedCards = resolve(prefs.pinned);
  const extraCards = resolve(prefs.extra);
  const hiddenCards = CARDS.filter((c) => placementOf(prefs, c.id) === "hidden");
  const serverBacked = config.preferenceSync === "server";

  const editFor = (lane: Lane) => (card: CardDef) => ({
    lane,
    onHide: () => setPlacement(card.id, "hidden"),
    onMove: () => setPlacement(card.id, lane === "pinned" ? "extra" : "pinned"),
  });

  const ghostButton =
    "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors";

  const header = (
    <div className="flex items-center justify-end gap-1">
      <h2 className="sr-only">Overview cards</h2>
      {editing && (
        <button type="button" onClick={reset} className={ghostButton}>
          <RotateCcwIcon className="h-3.5 w-3.5" />
          Reset
        </button>
      )}
      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        aria-pressed={editing}
        className={
          editing
            ? "flex items-center gap-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 px-2 py-1 text-xs text-white dark:text-neutral-900 transition-colors"
            : ghostButton
        }
      >
        {editing ? (
          <>
            <CheckIcon className="h-3.5 w-3.5" />
            Done
          </>
        ) : (
          <>
            <SlidersHorizontalIcon className="h-3.5 w-3.5" />
            Customise
          </>
        )}
      </button>
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

  /* ---------- customising: both lanes on screen, hidden tray underneath ---------- */
  if (editing) {
    return (
      <div className="space-y-3">
        {header}

        <LaneHeading>Always shown</LaneHeading>
        {pinnedCards.length === 0 ? (
          <EmptyLane>Nothing in the top row yet — add a card below.</EmptyLane>
        ) : (
          <StatGrid
            cards={pinnedCards}
            metrics={metrics}
            ctx={ctx}
            editFor={editFor("pinned")}
          />
        )}

        <LaneHeading>Behind Show more</LaneHeading>
        {extraCards.length === 0 ? (
          <EmptyLane>
            Nothing here yet — send a card down with its arrow button.
          </EmptyLane>
        ) : (
          <StatGrid
            cards={extraCards}
            metrics={metrics}
            ctx={ctx}
            editFor={editFor("extra")}
          />
        )}

        {hiddenCards.length > 0 && (
          <>
            <LaneHeading>Hidden — tap to add</LaneHeading>
            <div className="flex flex-wrap gap-2">
              {hiddenCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setPlacement(card.id, "pinned")}
                  className="flex items-center gap-1 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:border-solid hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  <PlusIcon className="h-3 w-3" />
                  {card.label(ctx)}
                </button>
              ))}
            </div>
          </>
        )}

        <p
          aria-live="polite"
          className={`text-[11px] ${
            sync === "local-only" || sync === "rejected"
              ? "text-amber-700 dark:text-amber-400"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {syncMessage(sync, serverBacked)}
        </p>
      </div>
    );
  }

  /* ---------- normal ---------- */
  return (
    <div className="space-y-3">
      {header}

      {pinnedCards.length === 0 && extraCards.length === 0 ? (
        <EmptyLane>
          Every card is hidden. Use Customise above to bring some back.
        </EmptyLane>
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
              {expanded ? "Show less" : `Show ${extraCards.length} more`}
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
