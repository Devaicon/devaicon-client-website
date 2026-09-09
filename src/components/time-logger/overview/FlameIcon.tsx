"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { flicker } from "../motion";

/**
 * The streak flame.
 *
 * The animation is not decoration: the tier is read off the streak length, so
 * the flame's size, colour and how hard it flickers all say the same thing the
 * number says. A dead streak gets a grey ember that doesn't move at all, which
 * is a far blunter signal than a "0" ever is.
 *
 * Three concentric copies of one flame silhouette stand in for outer flame,
 * inner flame and hot core. Each gets its own loop from `flicker` at a
 * different duration — matched durations would read as a synchronised pulse.
 */

/** 0 dead · 1 ember · 2 catching · 3 burning · 4 blazing. */
export type FlameTier = 0 | 1 | 2 | 3 | 4;

export function tierOf(streakWeekdays: number): FlameTier {
  if (streakWeekdays <= 0) return 0;
  if (streakWeekdays <= 2) return 1;
  if (streakWeekdays <= 4) return 2;
  if (streakWeekdays <= 9) return 3;
  return 4;
}

/**
 * Per tier: the outer flame's gradient, then the inner flame and hot core.
 * Written as literal hex rather than Tailwind classes because two of the three
 * layers are gradient stops, which classes cannot express.
 */
const PALETTE: Record<
  FlameTier,
  { from: string; to: string; inner: string; core: string }
> = {
  0: { from: "#a3a3a3", to: "#737373", inner: "#8a8a8a", core: "#9ca3af" },
  1: { from: "#fbbf24", to: "#d97706", inner: "#fcd34d", core: "#fef3c7" },
  2: { from: "#fb923c", to: "#ea580c", inner: "#fbbf24", core: "#fef3c7" },
  3: { from: "#f97316", to: "#dc2626", inner: "#fb923c", core: "#fde68a" },
  4: { from: "#ef4444", to: "#b91c1c", inner: "#f97316", core: "#fde047" },
};

/** Lucide's flame silhouette, in a 24x24 box with its base around (12, 22). */
const FLAME =
  "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z";

/** Scales the silhouette about the flame's base, so layers nest rather than drift. */
function about(scale: number): string {
  return `translate(12 22) scale(${scale}) translate(-12 -22)`;
}

export default function FlameIcon({
  streakWeekdays,
  className = "",
  sizeClass = "h-11 w-11 sm:h-12 sm:w-12",
}: {
  streakWeekdays: number;
  className?: string;
  /** The svg's own size, so a taller card can carry a bigger flame. */
  sizeClass?: string;
}) {
  const reduced = useReducedMotion();
  const gradientId = useId();
  const tier = tierOf(streakWeekdays);
  const c = PALETTE[tier];

  const layer = (i: 0 | 1 | 2) => {
    const f = flicker(!!reduced, tier, i);
    return f ? { animate: f.animate, transition: f.transition } : {};
  };

  const originStyle = { transformOrigin: "12px 22px" } as const;

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      {/* No heat haze here any more. The icon used to carry its own blurred
          disc of glow, which now reads as a second light source with a visible
          circular edge sitting on top of the card's fire. The card owns the
          glow; the icon owns the flame. */}
      <svg
        viewBox="0 0 24 24"
        className={`relative overflow-visible ${sizeClass}`}
        role="img"
        aria-label={
          tier === 0
            ? "Streak is out"
            : `Streak flame, intensity ${tier} of 4`
        }
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={c.to} />
            <stop offset="100%" stopColor={c.from} />
          </linearGradient>
        </defs>

        <motion.path
          d={FLAME}
          fill={`url(#${gradientId})`}
          style={originStyle}
          {...layer(0)}
        />

        {/* The cores only exist once there is something to burn. */}
        {tier > 0 && (
          <g transform={about(0.62)}>
            <motion.path
              d={FLAME}
              fill={c.inner}
              opacity={0.9}
              style={originStyle}
              {...layer(1)}
            />
          </g>
        )}
        {tier >= 2 && (
          <g transform={about(0.32)}>
            <motion.path
              d={FLAME}
              fill={c.core}
              opacity={0.95}
              style={originStyle}
              {...layer(2)}
            />
          </g>
        )}
      </svg>
    </span>
  );
}
