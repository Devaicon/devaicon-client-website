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
