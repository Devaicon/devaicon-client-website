"use client";

import { useId, type ReactNode } from "react";

/**
 * One setting: a name, a line saying what it actually does, and its control.
 *
 * The description is not decoration — every setting here changes behaviour the
 * user would otherwise have to discover by accident, so each one gets a
 * sentence, and the control is wired to it with aria-describedby.
 */
export default function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  /** Receives the description's id, for aria-describedby on the control. */
  children: (describedBy: string) => ReactNode;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-3 border-b border-neutral-100 dark:border-neutral-800 py-4 last:border-b-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </p>
        <p id={id} className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
      <div className="shrink-0 sm:flex sm:justify-end">{children(id)}</div>
    </div>
  );
}
