"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";
import { staggerItem } from "../motion";
import { useTimeFormat } from "../TimeFormatProvider";
import type { LoggerMetrics } from "../metrics";
import type { CardContext, CardDef, CardValue } from "./cards";

function Figure({ value, fmt }: { value: CardValue; fmt: (h: number) => string }) {
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
        ? "text-neutral-500 dark:text-neutral-400"
        : up
          ? "text-green-700 dark:text-green-400"
          : "text-amber-700 dark:text-amber-400";
      const Icon = up ? TrendingUpIcon : TrendingDownIcon;
      return (
        <div
          className={`flex items-center gap-1.5 text-2xl font-semibold tabular-nums ${tone}`}
        >
          {!flat && <Icon aria-hidden className="h-5 w-5 shrink-0" />}
          <span>
            {/* formatHoursHuman clamps negatives to zero, so the magnitude is
                formatted and the direction is carried by the icon. */}
            <AnimatedNumber value={Math.abs(value.hours)} format={fmt} />
          </span>
          <span className="sr-only">{up ? "more than" : "less than"} last week</span>
        </div>
      );
    }

    case "count":
      return (
        <div className="text-2xl font-semibold tabular-nums">
          <AnimatedNumber
            value={value.count}
            format={(n) => String(Math.round(n))}
          />
          <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
            {value.count === 1 ? value.noun : value.nounPlural}
          </span>
        </div>
      );

    case "highlight":
      return (
        <div>
          <div className="truncate text-xl font-semibold" title={value.name}>
            {value.name}
          </div>
          <div className="mt-0.5 text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
            {fmt(value.hours)} · {Math.round(value.share)}%
          </div>
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
}: {
  card: CardDef;
  metrics: LoggerMetrics;
  ctx: CardContext;
}) {
  const reduced = useReducedMotion();
  const { fmt } = useTimeFormat();
  const hint = card.hint?.(metrics, ctx) ?? null;

  return (
    <motion.div
      variants={staggerItem(!!reduced)}
      className="flex h-full flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
    >
      <div className="truncate text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {card.label(ctx)}
      </div>
      <div className="mt-1">
        <Figure value={card.value(metrics, ctx)} fmt={fmt} />
      </div>
      {hint && (
        // Pushed to the bottom so hint lines sit on one baseline across a row,
        // however tall the tallest tile in it happens to be.
        <div className="mt-auto truncate pt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {hint}
        </div>
      )}
    </motion.div>
  );
}
