"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ClockIcon,
  HourglassIcon,
  MonitorIcon,
  MoonIcon,
  MouseIcon,
  RotateCcwIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { Theme } from "@/components/theme/theme";
import { staggerContainer, staggerItem } from "../motion";
import { useLoggerSettings } from "../SettingsProvider";
import { useTimeFormat } from "../TimeFormatProvider";
import type { TimeFormat } from "../timeFormat";
import Dropdown, { type DropdownOption } from "../settings/Dropdown";
import SettingRow from "../settings/SettingRow";
import Toggle from "../settings/Toggle";

/**
 * Everything that used to be a pair of unlabelled icon groups in the header.
 *
 * Those controls worked only if you already knew what they did; here each one
 * gets a name and a sentence, which is the point of moving them. Grouping is by
 * what the setting affects, not by where it is stored — theme and time format
 * follow the account holder across both clients, the two behaviour switches are
 * this browser only, and the footnote under each group says so.
 */

const THEME_OPTIONS: DropdownOption<Theme>[] = [
  {
    value: "light",
    label: "Light",
    hint: "Always the light palette",
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    value: "dark",
    label: "Dark",
    hint: "Always the dark palette",
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    value: "system",
    label: "Match my device",
    hint: "Follows your operating system",
    icon: <MonitorIcon className="h-4 w-4" />,
  },
];

// The hints are worked examples rather than definitions: "7h 30m" shows exactly
// what the option does, which no amount of naming would.
const FORMAT_OPTIONS: DropdownOption<TimeFormat>[] = [
  {
    value: "decimal",
    label: "Decimal hours",
    hint: "7.5h",
    icon: <ClockIcon className="h-4 w-4" />,
  },
  {
    value: "human",
    label: "Hours and minutes",
    hint: "7h 30m",
    icon: <HourglassIcon className="h-4 w-4" />,
  },
];

function Group({
  title,
  description,
  footnote,
  children,
}: {
  title: string;
  description: string;
  footnote?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      <div className="mt-4">{children}</div>
      {footnote && (
        <p className="mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3 text-[11px] text-neutral-400 dark:text-neutral-500">
          {footnote}
        </p>
      )}
    </section>
  );
}

export default function SettingsTab() {
  const { theme, setTheme } = useTheme();
  const { format, setFormat } = useTimeFormat();
  const { settings, setSetting, reset } = useLoggerSettings();
  const reduced = useReducedMotion();
  const [justReset, setJustReset] = useState(false);

  function onReset() {
    reset();
    setJustReset(true);
    window.setTimeout(() => setJustReset(false), 2000);
  }

  return (
    <motion.div
      variants={staggerContainer(!!reduced)}
      initial="initial"
      animate="animate"
      className="max-w-2xl space-y-4"
    >
      <motion.div variants={staggerItem(!!reduced)}>
        <Group
          title="Appearance"
          description="How the tracker looks, and how hours are written."
          footnote="Saved in this browser, and shared with the legacy tracker."
        >
          <SettingRow
            title="Theme"
            description="Light, dark, or whatever your device is set to."
          >
            {() => (
              <Dropdown
                label="Theme"
                value={theme}
                options={THEME_OPTIONS}
                onChange={setTheme}
              />
            )}
          </SettingRow>

          <SettingRow
            title="Time format"
            description="Whether half an hour reads as 0.5h or 30m, everywhere in the app."
          >
            {() => (
              <Dropdown
                label="Time format"
                value={format}
                options={FORMAT_OPTIONS}
                onChange={setFormat}
              />
            )}
          </SettingRow>
        </Group>
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <Group
          title="Logging"
          description="What happens when you save an entry."
          footnote="Saved on this device only."
        >
          <SettingRow
            title="Start the timer after logging"
            description="Saving an entry starts the stopwatch on the same project, so the next stretch of work is already being counted."
          >
            {(describedBy) => (
              <Toggle
                label="Start the timer after logging"
                describedBy={describedBy}
                checked={settings.autoStartStopwatch}
                onChange={(v) => setSetting("autoStartStopwatch", v)}
              />
            )}
          </SettingRow>
        </Group>
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <Group
          title="Calendar"
          description="How you move between months."
          footnote="Saved on this device only."
        >
          <SettingRow
            title="Scroll to change month"
            description="Turn this off if a scroll over the calendar should move the page instead of the month. The arrows and swiping keep working either way."
          >
            {(describedBy) => (
              <Toggle
                label="Scroll to change month"
                describedBy={describedBy}
                checked={settings.calendarWheelScroll}
                onChange={(v) => setSetting("calendarWheelScroll", v)}
              />
            )}
          </SettingRow>
        </Group>
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Reset logging and calendar options
          </button>
          <span
            aria-live="polite"
            className="text-xs text-neutral-500 dark:text-neutral-400"
          >
            {justReset ? "Back to the defaults." : ""}
          </span>
        </div>
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <p className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <MouseIcon aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            The Overview page&rsquo;s own layout is set on that page — use
            Arrange page there to move, resize or hide its sections.
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
