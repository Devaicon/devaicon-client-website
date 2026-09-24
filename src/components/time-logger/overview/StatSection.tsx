"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { LayoutGridIcon } from "lucide-react";
import { useTimeFormat } from "../TimeFormatProvider";
import CardPicker from "./CardPicker";
import MoreCardsDialog from "./MoreCardsDialog";
import StatGrid, { gridClassFor } from "./StatGrid";
import {
  CARDS,
  cardById,
  type CardContext,
  type CardDef,
  type CardId,
} from "./cards";
import { placementOf, type Lane } from "./preferences";
import { type OverviewPrefsApi, type SyncState } from "./useOverviewPrefs";
import type { LoggerConfig } from "../config";
import type { LoggerMetrics } from "../metrics";

/**
 * The tile band at the top of the Overview tab.
 *
 * Customising happens on the tiles themselves rather than through a list of
 * switches: you remove the card you are looking at, and drop a hidden one back
 * in from the tray. Both lanes stay on screen throughout, so the layout being
 * built is the layout being previewed.
 *
 * The mode is not this component's to own. Editing tiles and rearranging the
 * page are one act as far as a user is concerned, so the Overview holds a
 * single "customising" flag and both this and the section canvas obey it.
 *
 * Only the top row is ever on the page. The second lane opens in a window over
 * it — from the "more figures" button, or by clicking anywhere on the band —
 * so the dashboard keeps one height however it was last left.
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
  editing = false,
  compact = false,
  onCustomise,
  prefsApi,
}: {
  config: LoggerConfig;
  metrics: LoggerMetrics;
  loading: boolean;
  /** Driven by the Overview's single Customise toggle. */
  editing?: boolean;
  /** The band is minimised into a half-width square: two cards to a row. */
  compact?: boolean;
  /** Offered from the More figures window, for changing what is in it. */
  onCustomise?: () => void;
  prefsApi: OverviewPrefsApi;
}) {
  const { prefs, setPlacement, sync } = prefsApi;
  const { fmt } = useTimeFormat();
  const [moreOpen, setMoreOpen] = useState(false);

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

  const header = <h2 className="sr-only">Overview cards</h2>;

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

        <LaneHeading>On the dashboard</LaneHeading>
        {pinnedCards.length === 0 ? (
          <EmptyLane>Nothing in the top row yet — add a card below.</EmptyLane>
        ) : (
          <StatGrid
            cards={pinnedCards}
            metrics={metrics}
            ctx={ctx}
            compact={compact}
            editFor={editFor("pinned")}
          />
        )}

        <LaneHeading>In More figures</LaneHeading>
        {extraCards.length === 0 ? (
          <EmptyLane>
            Nothing here yet — send a card down with its arrow button.
          </EmptyLane>
        ) : (
          <StatGrid
            cards={extraCards}
            metrics={metrics}
            ctx={ctx}
            compact={compact}
            editFor={editFor("extra")}
          />
        )}

        <LaneHeading>Not shown</LaneHeading>
        {hiddenCards.length === 0 ? (
          <EmptyLane>Every card is already on the dashboard.</EmptyLane>
        ) : (
          <CardPicker
            cards={hiddenCards}
            metrics={metrics}
            ctx={ctx}
            onAdd={setPlacement}
          />
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
  const openMore = extraCards.length > 0 ? () => setMoreOpen(true) : undefined;

  return (
    <div className="flex h-full flex-col gap-3">
      {header}

      {pinnedCards.length === 0 && extraCards.length === 0 ? (
        <EmptyLane>
          Every card is hidden. Use Customise above to bring some back.
        </EmptyLane>
      ) : (
        pinnedCards.length > 0 && (
          // The whole band is a way into the window, for a pointer. The
          // button beneath is the same thing for a keyboard or screen reader,
          // which is why this one is not focusable itself.
          <div
            onClick={openMore}
            title={openMore ? "Show more figures" : undefined}
            className={`${compact ? "min-h-0 flex-1" : ""} ${
              openMore ? "cursor-pointer" : ""
            }`}
          >
            <StatGrid
              cards={pinnedCards}
              metrics={metrics}
              ctx={ctx}
              compact={compact}
            />
          </div>
        )
      )}

      {openMore && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openMore}
            aria-haspopup="dialog"
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <LayoutGridIcon aria-hidden className="h-3.5 w-3.5" />
            {extraCards.length} more {extraCards.length === 1 ? "figure" : "figures"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {moreOpen && (
          <MoreCardsDialog
            cards={extraCards}
            metrics={metrics}
            ctx={ctx}
            onCustomise={() => {
              setMoreOpen(false);
              onCustomise?.();
            }}
            onClose={() => setMoreOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
