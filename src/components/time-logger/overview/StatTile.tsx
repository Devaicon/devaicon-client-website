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
import type { CardContext, CardDef, CardValue } from "./cards";
import type { Lane } from "./preferences";

/** Controls shown on the tile itself while the section is being customised. */
export type TileEdit = {
  lane: Lane;
  onHide: () => void;
  onMove: () => void;
};

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
        <Figure value={card.value(metrics, ctx)} fmt={fmt} />
      </div>
    </motion.div>
  );
}
