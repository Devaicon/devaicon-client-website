"use client";

import { useCallback } from "react";
import { useLoggerSettings } from "./SettingsProvider";
import type { LoggerSettings } from "./settings";

/**
 * The time logger's sounds, synthesised with the Web Audio API.
 *
 * Nothing is downloaded: each cue is a couple of oscillators and an envelope,
 * which keeps them tiny, instant, and all of a family. Volumes are low on
 * purpose — these sit under someone's work, not over it.
 *
 * Browsers will not play audio on a page the reader has not interacted with.
 * The context is created on first use and resumed when a cue needs it; once
 * the reader has clicked anything on the page, that resume succeeds. A cue
 * whose resume does not come through promptly is dropped rather than queued up
 * to blare out later, all at once.
 */

export type Cue = "tick" | "tock" | "chime" | "save" | "delete" | "start" | "stop";

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

/** Longest a cue will wait on a resume before it is no longer worth playing. */
const STALE_MS = 250;

function withRunningContext(play: (ac: AudioContext) => void): void {
  const ac = context();
  if (!ac) return;
  if (ac.state === "running") {
    play(ac);
    return;
  }
  const asked = performance.now();
  ac.resume()
    .then(() => {
      if (ac.state === "running" && performance.now() - asked < STALE_MS) play(ac);
    })
    .catch(() => {});
}

/** One enveloped tone: a fast attack and an exponential fall to silence. */
function tone(
  ac: AudioContext,
  {
    freq,
    at = 0,
    duration,
    gain,
    type = "sine",
    glideTo,
  }: {
    freq: number;
    at?: number;
    duration: number;
    gain: number;
    type?: OscillatorType;
    /** Slides the pitch to this frequency over the tone's length. */
    glideTo?: number;
  },
) {
  const t0 = ac.currentTime + at;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(env).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Plays a cue regardless of settings. For previews; everything else uses `useSound`. */
export function playCue(cue: Cue): void {
  withRunningContext((ac) => synth(ac, cue));
}

function synth(ac: AudioContext, cue: Cue): void {
  switch (cue) {
    // A mechanical tick-tock: two short, bright clicks a fifth apart.
    case "tick":
      tone(ac, { freq: 2400, duration: 0.03, gain: 0.05, type: "triangle" });
      return;
    case "tock":
      tone(ac, { freq: 1600, duration: 0.03, gain: 0.05, type: "triangle" });
      return;
    // A bell: a fundamental with an inharmonic partial, left to ring.
    case "chime":
      tone(ac, { freq: 880, duration: 1.6, gain: 0.12 });
      tone(ac, { freq: 880 * 2.76, duration: 0.9, gain: 0.03 });
      tone(ac, { freq: 1318.5, at: 0.35, duration: 1.8, gain: 0.1 });
      tone(ac, { freq: 1318.5 * 2.76, at: 0.35, duration: 0.9, gain: 0.025 });
      return;
    // Rising two-note: done, and it worked.
    case "save":
      tone(ac, { freq: 660, duration: 0.12, gain: 0.09 });
      tone(ac, { freq: 990, at: 0.09, duration: 0.2, gain: 0.09 });
      return;
    // Falling two-note: gone.
    case "delete":
      tone(ac, { freq: 520, duration: 0.12, gain: 0.08, type: "triangle" });
      tone(ac, { freq: 350, at: 0.09, duration: 0.2, gain: 0.08, type: "triangle" });
      return;
    case "start":
      tone(ac, { freq: 500, duration: 0.14, gain: 0.08, glideTo: 900 });
      return;
    case "stop":
      tone(ac, { freq: 900, duration: 0.16, gain: 0.08, glideTo: 450 });
      return;
  }
}

/** Which setting switches each cue on. */
const GATE: Record<Cue, keyof LoggerSettings> = {
  tick: "clockTickSound",
  tock: "clockTickSound",
  chime: "hourlyChime",
  save: "actionSounds",
  delete: "actionSounds",
  start: "actionSounds",
  stop: "actionSounds",
};

/** Returns a player that respects the reader's sound settings. */
export function useSound(): (cue: Cue) => void {
  const { settings } = useLoggerSettings();
  return useCallback(
    (cue: Cue) => {
      if (settings[GATE[cue]]) playCue(cue);
    },
    [settings],
  );
}
