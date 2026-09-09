import type { Transition, Variants } from "framer-motion";

/**
 * One motion vocabulary for the whole time logger, so timings stay consistent
 * and reduced-motion is handled in exactly one place.
 *
 * Every factory here takes `reduced` (from framer-motion's useReducedMotion).
 * When it is true the animations keep their opacity fade but drop all movement
 * and scaling — the change still registers, nothing slides.
 */

export const DURATION = {
  row: 0.18,
  base: 0.2,
  card: 0.25,
  number: 0.4,
} as const;

/** easeOutExpo-ish: quick to start, settles gently. */
export const EASE = [0.16, 1, 0.3, 1] as const;

function transition(duration: number): Transition {
  return { duration, ease: EASE };
}

/** Tab panels and other content that swaps in place. */
export function fadeRise(reduced: boolean): Variants {
  return {
    initial: { opacity: 0, y: reduced ? 0 : 4 },
    animate: { opacity: 1, y: 0, transition: transition(DURATION.base) },
    exit: { opacity: 0, y: reduced ? 0 : -4, transition: transition(DURATION.base) },
  };
}

/** Table rows entering and leaving as filters change. */
export function fadeRow(reduced: boolean): Variants {
  return {
    initial: { opacity: 0, y: reduced ? 0 : -4 },
    animate: { opacity: 1, y: 0, transition: transition(DURATION.row) },
    exit: { opacity: 0, transition: transition(DURATION.row) },
  };
}

/** Parent of a staggered group; pair with `staggerItem`. */
export function staggerContainer(reduced: boolean): Variants {
  return {
    initial: {},
    animate: {
      transition: { staggerChildren: reduced ? 0 : 0.04 },
    },
  };
}

export function staggerItem(reduced: boolean): Variants {
  return {
    initial: { opacity: 0, y: reduced ? 0 : 8 },
    animate: { opacity: 1, y: 0, transition: transition(DURATION.card) },
  };
}

/** Modal panel: scales up from just under full size. */
export function dialogPanel(reduced: boolean): Variants {
  return {
    initial: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: transition(DURATION.base) },
    exit: { opacity: 0, scale: reduced ? 1 : 0.98, transition: transition(DURATION.row) },
  };
}

export function backdrop(): Variants {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: transition(DURATION.base) },
    exit: { opacity: 0, transition: transition(DURATION.row) },
  };
}

/** Strips and banners that drop in above content. */
export function slideDown(reduced: boolean): Variants {
  return {
    initial: { opacity: 0, height: reduced ? "auto" : 0, y: reduced ? 0 : -6 },
    animate: { opacity: 1, height: "auto", y: 0, transition: transition(DURATION.base) },
    exit: { opacity: 0, height: reduced ? "auto" : 0, y: reduced ? 0 : -6, transition: transition(DURATION.row) },
  };
}

/**
 * The streak flame's flicker.
 *
 * Each layer of the flame gets its own call with a different `layer` index, and
 * the mismatched durations are the whole trick: three loops of the same length
 * read as one synchronised pulse, three of different lengths read as fire.
 * Amplitude scales with `tier` so a one-day streak barely moves and a ten-day
 * one is visibly burning.
 *
 * Returns null when motion is reduced, or at tier 0 where the flame is a dead
 * ember — callers render the layer static in both cases.
 */
export function flicker(
  reduced: boolean,
  tier: number,
  layer: 0 | 1 | 2,
): { animate: Record<string, number[]>; transition: Transition } | null {
  if (reduced || tier <= 0) return null;
  const durations = [1.15, 0.85, 0.62] as const;
  const amp = 0.03 + tier * 0.022;
  return {
    animate: {
      scaleY: [1, 1 + amp, 1 - amp * 0.6, 1 + amp * 0.4, 1],
      scaleX: [1, 1 - amp * 0.5, 1 + amp * 0.4, 1 - amp * 0.3, 1],
      y: [0, -amp * 5, amp * 2, -amp * 3, 0],
      opacity: [1, 0.92, 1, 0.95, 1],
    },
    transition: {
      duration: durations[layer],
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  };
}

/** A dropdown list unfurling from its button. */
export function dropdownPanel(reduced: boolean): Variants {
  return {
    initial: { opacity: 0, scaleY: reduced ? 1 : 0.94, y: reduced ? 0 : -4 },
    animate: { opacity: 1, scaleY: 1, y: 0, transition: transition(DURATION.row) },
    exit: { opacity: 0, scaleY: reduced ? 1 : 0.96, transition: transition(DURATION.row) },
  };
}

/**
 * The calendar swapping one month for the next.
 *
 * Direction-aware, via framer-motion's `custom`: stepping forward slides the
 * outgoing month left and brings the new one in from the right, so the gesture
 * and the movement agree. Distance is deliberately small — this is a hint that
 * the grid changed, not a carousel.
 */
export function monthSwap(reduced: boolean): Variants {
  const shift = (direction: number) => (reduced ? 0 : direction * 16);
  return {
    initial: (direction: number) => ({ opacity: 0, x: shift(direction) }),
    animate: {
      opacity: 1,
      x: 0,
      transition: transition(DURATION.base),
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: shift(-direction),
      transition: transition(DURATION.row),
    }),
  };
}
