"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer } from "../motion";
import StatTile, { type TileEdit } from "./StatTile";
import type { LoggerMetrics } from "../metrics";
import type { CardContext, CardDef } from "./cards";

/**
 * Balanced fill: the column count that leaves the fewest empty slots on the
 * last row, capped at five so a tile never grows wider than the design allows.
 * Larger counts win ties, so eight cards read 4+4 rather than 3+3+2.
 *
 * Each extra row costs as much as an empty slot. Without that term 17 cards
 * would score best at three columns — a perfectly packed band six rows deep,
 * which is far worse to look at than four rows with three gaps in it.
 */
export function columnsFor(n: number): number {
  if (n <= 5) return Math.max(1, n);
  const fewestRows = Math.ceil(n / 5);
  let best = 5;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const cols of [5, 4, 3]) {
    const empty = (cols - (n % cols)) % cols;
    const score = empty + (Math.ceil(n / cols) - fewestRows);
    if (score < bestScore) {
      bestScore = score;
      best = cols;
    }
  }
  return best;
}

// Tailwind scans for whole class names, so `lg:grid-cols-${n}` would never be
// generated. The classes have to appear literally.
const COLUMN_CLASS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export function gridClassFor(n: number): string {
  const wide = COLUMN_CLASS[columnsFor(n)] ?? COLUMN_CLASS[5];
  // A single tile shouldn't be stranded at half width on a tablet.
  const medium = n === 1 ? "" : "sm:grid-cols-2";
  return `grid grid-cols-1 gap-4 ${medium} ${wide}`.replace(/\s+/g, " ").trim();
}

export default function StatGrid({
  cards,
  metrics,
  ctx,
  className = "",
  editFor,
}: {
  cards: CardDef[];
  metrics: LoggerMetrics;
  ctx: CardContext;
  className?: string;
  /** Supplies per-tile controls while the section is being customised. */
  editFor?: (card: CardDef) => TileEdit;
}) {
  const reduced = useReducedMotion();
  if (cards.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer(!!reduced)}
      initial="initial"
      animate="animate"
      className={`${gridClassFor(cards.length)} ${className}`.trim()}
    >
      {cards.map((card) => (
        <StatTile
          key={card.id}
          card={card}
          metrics={metrics}
          ctx={ctx}
          edit={editFor?.(card)}
        />
      ))}
    </motion.div>
  );
}
