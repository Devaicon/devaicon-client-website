"use client";

import { useId } from "react";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon, type LucideIcon } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { Theme } from "@/components/theme/theme";
import Group from "@/components/time-logger/settings/Group";

const OPTIONS: { value: Theme; label: string; hint: string; Icon: LucideIcon }[] = [
  { value: "light", label: "Light", hint: "Always light", Icon: SunIcon },
  { value: "dark", label: "Dark", hint: "Always dark", Icon: MoonIcon },
  { value: "system", label: "System", hint: "Matches your device", Icon: MonitorIcon },
];

/**
 * A thumbnail of the dashboard in one palette. Its colours are fixed rather
 * than following the current theme, so each tile shows what picking it gives.
 */
function Mock({ dark }: { dark: boolean }) {
  const c = dark
    ? { bg: "bg-neutral-950", bar: "bg-neutral-900", line: "bg-neutral-700", card: "bg-neutral-800", accent: "bg-violet-400" }
    : { bg: "bg-neutral-100", bar: "bg-white", line: "bg-neutral-300", card: "bg-white", accent: "bg-violet-500" };
  return (
    <div className={`flex h-full w-full flex-col ${c.bg}`}>
      <div className={`flex h-3 items-center px-1.5 ${c.bar}`}>
        <span className={`h-1 w-6 rounded-full ${c.line}`} />
      </div>
      <div className="flex flex-1 gap-1.5 p-1.5">
        <div className="flex w-1/4 flex-col gap-1">
          <span className={`h-1 rounded-full ${c.accent}`} />
          <span className={`h-1 rounded-full ${c.line}`} />
          <span className={`h-1 rounded-full ${c.line}`} />
        </div>
        <div className={`flex flex-1 flex-col gap-1 rounded p-1.5 ${c.card}`}>
          <span className={`h-1.5 w-1/2 rounded-full ${c.line}`} />
          <span className={`h-1 w-3/4 rounded-full ${c.line}`} />
          <span className={`h-1 w-2/3 rounded-full ${c.line}`} />
        </div>
      </div>
    </div>
  );
}

function Preview({ theme }: { theme: Theme }) {
  if (theme !== "system") return <Mock dark={theme === "dark"} />;
  // Half and half, split on the diagonal.
  return (
    <div className="relative h-full w-full">
      <Mock dark={false} />
      <div className="absolute inset-0" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}>
        <Mock dark />
      </div>
    </div>
  );
}

/**
 * The colour theme for the whole signed-in area: the dashboard and every app
 * opened from it read the same preference, so this is the only place it is
 * set.
 */
export default function AppearanceSettings() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const name = useId();

  return (
    <Group
      title="Appearance"
      description="The colour theme for your dashboard and every app in it, including the Time Logger."
      footnote="Saved in this browser."
    >
      <fieldset>
        <legend className="sr-only">Theme</legend>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {OPTIONS.map(({ value, label, hint, Icon }) => {
            const checked = theme === value;
            return (
              <label
                key={value}
                className={`cursor-pointer rounded-lg border p-1.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-500 ${
                  checked
                    ? "border-violet-500 ring-1 ring-violet-500"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={value}
                  checked={checked}
                  onChange={() => setTheme(value)}
                  className="sr-only"
                />
                <div
                  aria-hidden
                  className="aspect-[16/10] overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800"
                >
                  <Preview theme={value} />
                </div>
                <div className="mt-2 flex items-center gap-1.5 px-0.5 text-sm font-medium">
                  <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  {label}
                  {checked && (
                    <CheckIcon
                      aria-hidden
                      className="ml-auto h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400"
                    />
                  )}
                </div>
                <p className="px-0.5 pb-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {value === "system" && checked ? `${hint}: ${resolvedTheme} now` : hint}
                </p>
              </label>
            );
          })}
        </div>
      </fieldset>
    </Group>
  );
}
