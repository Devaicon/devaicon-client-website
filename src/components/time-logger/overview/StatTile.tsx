"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  XIcon,
} from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";
import { staggerItem } from "../motion";
import { useTimeFormat } from "../TimeFormatProvider";
import type { LoggerMetrics } from "../metrics";
import {
  formatPercent,
  type CardContext,
  type CardDef,
  type CardValue,
  type PercentTone,
} from "./cards";
import type { Lane } from "./preferences";

/** Controls shown on the tile itself while the section is being customised. */
export type TileEdit = {
  lane: Lane;
  onHide: () => void;
  onMove: () => void;
};

/**
 * Text and bar colours for a percentage, in one place so a tile's figure and
 * its bar can never disagree.
 *
 * Below 100 the two tones diverge: falling behind the pace you should already
 * be at is worth flagging, whereas a part-finished month is simply a
 * part-finished month. See PercentTone in cards.ts.
 */
function percentTone(
  pct: number | null,
  tone: PercentTone,
): { text: string; bar: string } {
  const neutralBar = "bg-neutral-900 dark:bg-neutral-100";
  if (pct === null) {
    return { text: "text-neutral-500 dark:text-neutral-400", bar: neutralBar };
  }
  if (pct >= 100) {
    return {
      text: "text-green-700 dark:text-green-400",
      bar: "bg-green-600 dark:bg-green-500",
    };
  }
  if (tone === "progress" || pct >= 90) return { text: "", bar: neutralBar };
  if (pct >= 70) {
    return {
      text: "text-amber-700 dark:text-amber-400",
      bar: "bg-amber-500 dark:bg-amber-400",
    };
  }
  return {
    text: "text-red-700 dark:text-red-400",
    bar: "bg-red-600 dark:bg-red-500",
  };
}

/**
 * Every branch renders exactly one line, so a row of tiles lines up whatever
 * mix of figures it holds. Anything secondary — a unit, a name's hours — sits
 * inline in muted type rather than on a line of its own.
 */
function Figure({ value, fmt }: { value: CardValue; fmt: (h: number) => string }) {
  const muted =
    "text-base font-normal text-neutral-500 dark:text-neutral-400 tabular-nums";

  switch (value.kind) {
    case "hours":
      return (
        <div className="text-2xl font-semibold tabular-nums">
          <AnimatedNumber value={value.hours} format={fmt} />
        </div>
      );

    case "delta": {
      const up = value.hours > 0;
      const flat = value.hours === 0;
      const tone = flat
        ? ""
        : up
          ? "text-green-700 dark:text-green-400"
          : "text-amber-700 dark:text-amber-400";
      const Icon = up ? TrendingUpIcon : TrendingDownIcon;
      return (
        <div
          className={`flex items-center gap-1.5 text-2xl font-semibold tabular-nums ${tone}`}
        >
          {!flat && <Icon aria-hidden className="h-5 w-5 shrink-0" />}
          {/* formatHoursHuman clamps negatives to zero, so the magnitude is
              formatted and the icon carries the direction. */}
          <AnimatedNumber value={Math.abs(value.hours)} format={fmt} />
          <span className="sr-only">{up ? "more than" : "less than"} last week</span>
        </div>
      );
    }

    case "percent": {
      const p = value.pct;
      const tone = percentTone(p, value.tone).text;
      return (
        <div
          className={`flex items-baseline gap-1.5 text-2xl font-semibold tabular-nums ${tone}`}
        >
          {p === null ? (
            <span>—</span>
          ) : (
            <AnimatedNumber value={p} format={(n) => formatPercent(n)} />
          )}
          <span className={`shrink-0 truncate ${muted}`}>
            {p === null ? "nothing expected" : `of ${fmt(value.of)}`}
          </span>
        </div>
      );
    }

    case "count":
      return (
        <div className="truncate text-2xl font-semibold tabular-nums">
          <AnimatedNumber value={value.count} format={(n) => String(Math.round(n))} />
          <span className={`ml-1 ${muted}`}>
            {value.count === 1 ? value.noun : value.nounPlural}
          </span>
        </div>
      );

    case "highlight":
      return (
        <div className="flex items-baseline gap-1.5 text-2xl font-semibold">
          <span className="truncate" title={value.name}>
            {value.name}
          </span>
          <span className={`shrink-0 ${muted}`}>{fmt(value.hours)}</span>
        </div>
      );

    case "text":
      return <div className="truncate text-2xl font-semibold">{value.text}</div>;
  }
}

export default function StatTile({
  card,
  metrics,
  ctx,
  edit,
}: {
  card: CardDef;
  metrics: LoggerMetrics;
  ctx: CardContext;
  edit?: TileEdit;
}) {
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();
  const label = card.label(ctx);
  const value = card.value(metrics, ctx);
  const toTop = edit?.lane === "extra";
  const MoveIcon = toTop ? ArrowUpIcon : ArrowDownIcon;
  const moveLabel = toTop
    ? `Move ${label} to the top row`
    : `Move ${label} behind Show more`;

  const control =
    "rounded-md p-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors";

  return (
    <motion.div
      variants={staggerItem(!!reduced)}
      className={`relative flex h-full flex-col rounded-xl border bg-white dark:bg-neutral-900 p-5 ${
        edit
          ? "border-dashed border-neutral-300 dark:border-neutral-700"
          : "border-neutral-200 dark:border-neutral-800"
      }`}
    >
      {edit && (
        <div className="absolute right-1.5 top-1.5 flex gap-0.5">
          <button type="button" onClick={edit.onMove} aria-label={moveLabel} title={moveLabel} className={control}>
            <MoveIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={edit.onHide}
            aria-label={`Hide ${label}`}
            title={`Hide ${label}`}
            className={control}
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div
        className={`truncate text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 ${
          edit ? "pr-14" : ""
        }`}
      >
        {label}
      </div>
      <div className="mt-1 min-w-0">
        <Figure value={value} fmt={fmt} />
      </div>
      {/* Pinned to the foot of the tile rather than tucked under the figure,
          so the bars line up across a row whatever height the row settles at.
          A null percentage has no bar to draw — the "—" already says so. */}
      {value.kind === "percent" && value.pct !== null && (
        <div className="mt-auto pt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <motion.div
              className={`h-full rounded-full ${percentTone(value.pct, value.tone).bar}`}
              initial={false}
              // The figure may read past 100; the bar simply fills.
              animate={{ width: `${Math.min(100, Math.max(0, value.pct))}%` }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
