"use client";

import { formatHuman } from "../format";
import type { PendingSession } from "./storage";

export default function PendingSessionStrip({
  session,
  onSave,
  onDiscard,
}: {
  session: PendingSession;
  onSave: () => void;
  onDiscard: () => void;
}) {
  function discard() {
    if (confirm(`Discard ${formatHuman(session.elapsedMs)} without logging it?`))
      onDiscard();
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 px-4 py-2.5 text-sm text-amber-900 dark:text-amber-300">
      <span>
        <strong>1 unsaved session</strong> · {formatHuman(session.elapsedMs)}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-3 py-1 font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={discard}
          className="rounded-md px-2 py-1 underline hover:no-underline"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
