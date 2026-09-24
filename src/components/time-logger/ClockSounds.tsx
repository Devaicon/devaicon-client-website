"use client";

import { useEffect, useRef } from "react";
import { useLoggerSettings } from "./SettingsProvider";
import { useSound, type Cue } from "./sounds";
import { useNow } from "./useNow";

/**
 * The clock's audible side: a tick-tock each second and a chime as each hour
 * begins. Renders nothing.
 *
 * Mounted by the dashboard rather than by the clock, so the chime is heard on
 * every tab. The tick is only wanted while the clock itself is on screen, so
 * the dashboard says when that is.
 */
export default function ClockSounds({ clockVisible }: { clockVisible: boolean }) {
  const { settings } = useLoggerSettings();
  const ticking = clockVisible && settings.clockTickSound;
  const chiming = settings.hourlyChime;
  // With both off there is no reason to keep a one-second timer running.
  if (!ticking && !chiming) return null;
  return <Ticker ticking={ticking} chiming={chiming} />;
}

function Ticker({ ticking, chiming }: { ticking: boolean; chiming: boolean }) {
  const now = useNow(1000);
  const play = useSound();
  const lastHour = useRef<number | null>(null);
  const lastSecond = useRef<number | null>(null);

  useEffect(() => {
    if (!now) return;
    const stamp = Math.floor(now.getTime() / 1000);
    // A settings change re-runs this for the same second; play it once only.
    if (lastSecond.current === stamp) return;
    lastSecond.current = stamp;

    const hour = now.getHours();
    // Compared against the last hour seen rather than checking for :00:00,
    // because a background tab's timers are throttled and may skip that exact
    // second. The first reading only sets the baseline, so opening the page
    // never chimes.
    const newHour = lastHour.current !== null && hour !== lastHour.current;
    lastHour.current = hour;

    if (chiming && newHour) {
      play("chime");
      return;
    }
    // Nobody is looking at a hidden tab's clock.
    if (ticking && !document.hidden) {
      const cue: Cue = now.getSeconds() % 2 === 0 ? "tick" : "tock";
      play(cue);
    }
  }, [now, ticking, chiming, play]);

  return null;
}
