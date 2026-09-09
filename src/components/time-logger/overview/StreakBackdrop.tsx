"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The fire behind the streak card.
 *
 * Unlike the flame icon, which snaps between five named tiers, this is a
 * continuous function of the streak itself: there is no top tier to reach and
 * then sit at. Every extra day makes the fire measurably hotter — further up
 * the card, redder then whiter at the core, faster and denser with embers — so
 * a 40-day streak looks like more than a 20-day one, and a 200-day streak looks
 * like more again.
 *
 * The curve is logarithmic rather than linear. Heat has to keep climbing
 * forever without the first fortnight being invisible next to a year, and a
 * log does both: the early days move it a lot, later ones keep moving it a
 * little, and nothing ever tops out.
 *
 * Purely decorative, so it is aria-hidden and never intercepts a pointer. Under
 * reduced motion the wash stays and the embers simply do not appear — the
 * colour still carries the signal, nothing drifts.
 */

/**
 * Streak length as heat. 1.0 lands at a month of unbroken weekdays, which is
 * where the fire is fully red; past that it keeps rising without limit.
 */
export function heatOf(streakWeekdays: number): number {
  if (streakWeekdays <= 0) return 0;
  return Math.log1p(streakWeekdays) / Math.log1p(30);
}

/**
 * The fire's colour at a given heat.
 *
 * Hue runs amber → red across the first month and then has nowhere further to
 * go, so beyond that the heat is spent on the core instead: it keeps
 * brightening towards white, which is what a fire actually does when it gets
 * hotter than red.
 */
function paletteFor(heat: number) {
  if (heat <= 0) {
    return { glow: "hsl(0 0% 55%)", body: "hsl(0 0% 45%)", core: "hsl(0 0% 65%)" };
  }
  const toRed = Math.min(1, heat);
  const beyondRed = Math.max(0, heat - 1);
  const hue = 48 - 48 * toRed;
  return {
    glow: `hsl(${hue} 96% ${46 + 8 * toRed}%)`,
    body: `hsl(${hue + 8} 90% ${40 + 6 * toRed}%)`,
    // Saturation bleeds out of the core as it passes red, which is what turns
    // it white rather than merely pale pink.
    core: `hsl(${Math.max(0, hue - 12)} ${100 - 55 * Math.min(1, beyondRed)}% ${Math.min(96, 60 + 20 * toRed + 14 * beyondRed)}%)`,
  };
}

/**
 * Embers on screen at once. Grows with heat and is only bounded by what is
 * sane to animate — every other quality of the fire keeps scaling past here.
 */
const EMBER_BUDGET = 34;

function emberCount(heat: number): number {
  if (heat <= 0) return 0;
  return Math.min(EMBER_BUDGET, Math.round(3 + 11 * heat));
}

/**
 * Deterministic pseudo-random, seeded by the ember's index.
 *
 * Math.random would give the server and the client different layouts and
 * hydration would complain; this gives the same scatter every render while
 * still looking unplanned.
 */
function scatter(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function StreakBackdrop({
  streakWeekdays,
}: {
  streakWeekdays: number;
}) {
  const reduced = useReducedMotion();
  const heat = heatOf(streakWeekdays);
  const { glow, body, core } = paletteFor(heat);
  const embers = reduced ? 0 : emberCount(heat);

  // How far up the card the glow reaches, and how strongly it prints. Reach is
  // unbounded; opacity is not, because the card still has to be readable at a
  // thousand-day streak.
  const reach = 34 + 62 * heat;
  const washOpacity = Math.min(0.9, 0.34 + 0.3 * heat);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* The bed of the fire: brightest along the bottom edge, fading out at a
          height the streak decides. */}
      <div
        className="absolute inset-0"
        style={{
          opacity: washOpacity,
          background: `radial-gradient(125% ${reach}% at 15% 116%, ${glow} 0%, ${body}55 30%, transparent 72%)`,
        }}
      />
      {/* A tighter core under the flame itself, so the hottest part of the card
          is where the icon and the number are. */}
      {heat > 0 && (
        <div
          className="absolute inset-0"
          style={{
            opacity: Math.min(0.75, 0.28 + 0.3 * heat),
            background: `radial-gradient(48% ${reach * 0.72}% at 8% 106%, ${core} 0%, transparent 68%)`,
          }}
        />
      )}

      {Array.from({ length: embers }, (_, i) => {
        // Spread across the left two thirds, where the flame is; the right of
        // the card carries text and stays legible.
        const left = scatter(i, 1) * 66;
        const size = 3 + scatter(i, 2) * 4 + heat * 1.6;
        // A hotter fire throws its embers further and faster.
        const rise = 90 + scatter(i, 3) * 70 + heat * 70;
        const duration = Math.max(1.6, (3.8 + scatter(i, 4) * 3.2) / (0.75 + heat * 0.5));
        const delay = scatter(i, 5) * duration;
        const drift = (scatter(i, 6) - 0.5) * 44;

        return (
          <motion.span
            key={i}
            className="absolute bottom-0 rounded-full blur-[1px]"
            style={{
              left: `${left}%`,
              height: size,
              width: size,
              backgroundColor: i % 3 === 0 ? core : glow,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [0, -rise],
              x: [0, drift * 0.4, drift],
              opacity: [0, Math.min(0.9, 0.5 + 0.35 * heat), 0],
              scale: [1, 0.9, 0.4],
            }}
            transition={{
              duration,
              delay,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        );
      })}
    </div>
  );
}
