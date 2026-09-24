"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ClockIcon,
  DownloadIcon,
  HourglassIcon,
  MonitorIcon,
  MoonIcon,
  MouseIcon,
  RotateCcwIcon,
  SunIcon,
  UploadIcon,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { Theme } from "@/components/theme/theme";
import { staggerContainer, staggerItem } from "../motion";
import { useLoggerSettings } from "../SettingsProvider";
import { useTimeFormat } from "../TimeFormatProvider";
import type { TimeFormat } from "../timeFormat";
import type { LoggerConfig } from "../config";
import type { LoggerSettings } from "../settings";
import { playCue, type Cue } from "../sounds";
import { useOverviewPrefs } from "../overview/useOverviewPrefs";
import { useSectionLayout } from "../overview/useSectionLayout";
import {
  buildSetupFile,
  listParts,
  parseSetupFile,
  setupFileName,
  type ParsedSetup,
} from "../transfer";
import Dropdown, { type DropdownOption } from "../settings/Dropdown";
import SettingRow from "../settings/SettingRow";
import Toggle from "../settings/Toggle";

/**
 * Everything that used to be a pair of unlabelled icon groups in the header.
 *
 * Those controls worked only if you already knew what they did; here each one
 * gets a name and a sentence, which is the point of moving them. Grouping is by
 * what the setting affects, not by where it is stored — theme and time format
 * follow the account holder across both clients, the behaviour and sound switches
 * are this browser only, and the footnote under each group says so.
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

/** The sound switches, each with the cue it previews when switched on. */
const SOUND_ROWS: {
  key: keyof LoggerSettings;
  title: string;
  description: string;
  preview: Cue;
}[] = [
  {
    key: "clockTickSound",
    title: "Clock tick",
    description: "A soft tick-tock every second while the Overview clock is on screen.",
    preview: "tick",
  },
  {
    key: "hourlyChime",
    title: "Hourly chime",
    description: "A bell as each hour begins, whichever tab you are on — a nudge to log what you just did.",
    preview: "chime",
  },
  {
    key: "actionSounds",
    title: "Action sounds",
    description: "A short cue when an entry is saved or deleted, and when the timer starts or stops.",
    preview: "save",
  },
];

const OUTLINE_BUTTON =
  "flex cursor-pointer items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100";

export default function SettingsTab({ config }: { config: LoggerConfig }) {
  const { theme, setTheme } = useTheme();
  const { format, setFormat } = useTimeFormat();
  const { settings, setSetting, replaceAll, reset } = useLoggerSettings();
  const prefs = useOverviewPrefs(config);
  const sections = useSectionLayout(config.storageScope);
  const reduced = useReducedMotion();
  const [justReset, setJustReset] = useState(false);

  // Import is two steps: the file is read and checked first, and nothing is
  // replaced until the reader has seen what it will replace.
  const fileRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<ParsedSetup | null>(null);
  const [transferNote, setTransferNote] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);

  function onReset() {
    reset();
    setJustReset(true);
    window.setTimeout(() => setJustReset(false), 2000);
  }

  function onExport() {
    const now = new Date();
    const json = buildSetupFile(
      {
        cards: prefs.prefs,
        sections: sections.layout,
        settings,
        appearance: { theme, timeFormat: format },
      },
      config.storageScope,
      now,
    );
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = setupFileName(now);
    a.click();
    // Revoked on the next task: some browsers start the download after click()
    // returns, and would find the URL already gone.
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setStaged(null);
    setTransferNote({ tone: "ok", text: "Exported. Keep the file, or import it in another browser." });
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Cleared so picking the same file again still fires a change.
    e.target.value = "";
    if (!file) return;
    const result = parseSetupFile(await file.text());
    if (!result.ok) {
      setStaged(null);
      setTransferNote({ tone: "error", text: result.message });
      return;
    }
    setTransferNote(null);
    setStaged(result.parsed);
  }

  function onApplyImport() {
    if (!staged) return;
    const { setup, parts } = staged;
    if (setup.cards) prefs.replace(setup.cards);
    if (setup.sections) sections.replace(setup.sections);
    if (setup.settings) replaceAll(setup.settings);
    if (setup.appearance) {
      setTheme(setup.appearance.theme);
      setFormat(setup.appearance.timeFormat);
    }
    setStaged(null);
    setTransferNote({ tone: "ok", text: `Imported your ${listParts(parts)}.` });
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
        <Group
          title="Sounds"
          description="Audio from the clock, and cues for the things you do most. Switching one on plays a sample."
          footnote="Saved on this device only. Your browser plays nothing until you have clicked somewhere on the page."
        >
          {SOUND_ROWS.map((row) => (
            <SettingRow key={row.key} title={row.title} description={row.description}>
              {(describedBy) => (
                <Toggle
                  label={row.title}
                  describedBy={describedBy}
                  checked={settings[row.key]}
                  onChange={(v) => {
                    setSetting(row.key, v);
                    // The switch is itself the click the browser needs, so
                    // the sample always plays.
                    if (v) playCue(row.preview);
                  }}
                />
              )}
            </SettingRow>
          ))}
        </Group>
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <Group
          title="Back up and move"
          description="Save your whole dashboard set-up as a JSON file, or load one from another browser."
          footnote="The file holds your cards, page layout, options, theme and time format. It never contains your entries."
        >
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onExport} className={OUTLINE_BUTTON}>
              <DownloadIcon className="h-3.5 w-3.5" />
              Export set-up
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className={OUTLINE_BUTTON}>
              <UploadIcon className="h-3.5 w-3.5" />
              Import set-up
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={onPickFile}
              className="hidden"
              aria-hidden
              tabIndex={-1}
            />
          </div>

          {staged && (
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 px-3 py-2 text-xs text-violet-900 dark:text-violet-200 sm:flex-row sm:items-center">
              <p className="flex-1">
                This replaces your {listParts(staged.parts)} with the ones in the file.
              </p>
              <span className="flex gap-1.5">
                <button
                  type="button"
                  onClick={onApplyImport}
                  className="cursor-pointer rounded-md bg-violet-700 px-2.5 py-1 font-medium text-white hover:bg-violet-800 dark:bg-violet-500 dark:text-neutral-950 dark:hover:bg-violet-400"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setStaged(null)}
                  className="cursor-pointer rounded-md px-2.5 py-1 hover:bg-violet-100 dark:hover:bg-violet-900/60"
                >
                  Cancel
                </button>
              </span>
            </div>
          )}

          <p
            aria-live="polite"
            className={`mt-3 text-xs empty:hidden ${
              transferNote?.tone === "error"
                ? "text-red-700 dark:text-red-400"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            {transferNote?.text ?? ""}
          </p>
        </Group>
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onReset} className={OUTLINE_BUTTON}>
            <RotateCcwIcon className="h-3.5 w-3.5" />
            Reset logging, calendar and sound options
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
            Customise there to move, resize or hide its sections.
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
