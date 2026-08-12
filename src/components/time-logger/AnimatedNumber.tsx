"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "./motion";

/**
 * Rolls from the previous value to the next one, rendering each intermediate
 * step through `format`. Used by the metric cards so a filter change reads as
 * the number moving rather than silently swapping.
 *
 * Interruptions resume from wherever the roll had reached, so rapid filter
 * edits never make the figure jump back to a stale starting point.
 */
export default function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (n: number) => string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const currentRef = useRef(value);

  useEffect(() => {
    // Reduced motion renders `value` straight through, so there is no state to
    // update here — only the ref, in case the preference is turned back off.
    if (reduced) {
      currentRef.current = value;
      return;
    }
    const controls = animate(currentRef.current, value, {
      duration: DURATION.number,
      ease: EASE,
      onUpdate: (v) => {
        currentRef.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, reduced]);

  return <>{format(reduced ? value : display)}</>;
}
