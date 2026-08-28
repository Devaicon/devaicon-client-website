"use client";

import { useMemo, useState } from "react";
import { ArrowDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import { byGroup, summariseCard, type CardContext, type CardDef, type CardId } from "./cards";
import type { Lane } from "./preferences";
import type { LoggerMetrics } from "../metrics";

/**
 * The tray of cards that are currently off the dashboard.
 *
 * It started as a flat wrap of labelled pills, which stopped working once the
 * catalogue passed a dozen entries: a name alone doesn't tell you whether a
 * card is worth a slot. So every row now carries its live figure — the tray is
 * a preview of what you are about to add — and the rows are grouped and
 * filterable so a long catalogue stays scannable.
 *
 * Each row offers both lanes rather than only the top one. Adding a card you
 * are curious about shouldn't force it above the fold first.
 */
export default function CardPicker({
  cards,
  metrics,
  ctx,
  onAdd,
}: {
  cards: CardDef[];
  metrics: LoggerMetrics;
  ctx: CardContext;
  onAdd: (id: CardId, lane: Lane) => void;
}) {
  const [query, setQuery] = useState("");

  // Matching on the group label too, so "pace" surfaces the whole family even
  // though no single card is called that.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = byGroup(cards);
    if (!q) return all;
    return all
      .map((g) => ({
        ...g,
        cards: g.cards.filter(
          (c) =>
            c.label(ctx).toLowerCase().includes(q) ||
            g.label.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.cards.length > 0);
  }, [cards, ctx, query]);

  // The filter only earns its space once there is enough to sift through.
  const searchable = cards.length > 8;

  return (
    <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {cards.length} card{cards.length === 1 ? "" : "s"} available
        </span>

        {searchable && (
          <div className="relative">
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter cards"
              aria-label="Filter available cards"
              className="w-48 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-1 pl-8 pr-2 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-400 dark:focus:border-neutral-600 focus:outline-none"
            />
          </div>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No card matches “{query}”.
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id}>
              <div className="mb-1.5 text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                {group.label}
              </div>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
                {group.cards.map((card) => (
                  <Row
                    key={card.id}
                    card={card}
                    metrics={metrics}
                    ctx={ctx}
                    onAdd={onAdd}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({
  card,
  metrics,
  ctx,
  onAdd,
}: {
  card: CardDef;
  metrics: LoggerMetrics;
  ctx: CardContext;
  onAdd: (id: CardId, lane: Lane) => void;
}) {
  const label = card.label(ctx);
  const summary = summariseCard(card, metrics, ctx);

  return (
    // The whole row is the "add to the top row" button; the lane button sits
    // beside it rather than inside it, since a button cannot nest another.
    <div className="group flex items-stretch gap-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pr-1 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
      <button
        type="button"
        onClick={() => onAdd(card.id, "pinned")}
        title={`Add ${label} to the top row`}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-l-lg px-2.5 py-2 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
      >
        <PlusIcon
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200"
        />
        <span className="min-w-0 flex-1 truncate text-xs text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
        <span className="shrink-0 text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400">
          {summary}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onAdd(card.id, "extra")}
        aria-label={`Add ${label} behind Show more`}
        title={`Add ${label} behind Show more`}
        className="my-1 shrink-0 self-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <ArrowDownIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
