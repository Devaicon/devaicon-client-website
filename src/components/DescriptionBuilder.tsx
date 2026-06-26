"use client";

import { useState } from "react";
import {
  DESCRIPTION_AREAS,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_STATUSES,
  DESCRIPTION_TOOLS,
  composeDescription,
} from "@/lib/description";

type Props = {
  summary: string;
  onSummary: (v: string) => void;
  tools: string[];
  onTools: (v: string[]) => void;
  areas: string[];
  onAreas: (v: string[]) => void;
  status: string;
  onStatus: (v: string) => void;
  reference: string;
  onReference: (v: string) => void;
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
        active
          ? "border-neutral-900 dark:border-neutral-700 bg-neutral-900 dark:bg-neutral-700 text-white"
          : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
      }`}
    >
      {label}
    </button>
  );
}

export default function DescriptionBuilder({
  summary,
  onSummary,
  tools,
  onTools,
  areas,
  onAreas,
  status,
  onStatus,
  reference,
  onReference,
}: Props) {
  const [toolDraft, setToolDraft] = useState("");

  function toggle(list: string[], onChange: (v: string[]) => void, val: string) {
    const exists = list.some((x) => x.toLowerCase() === val.toLowerCase());
    if (exists) onChange(list.filter((x) => x.toLowerCase() !== val.toLowerCase()));
    else onChange([...list, val]);
  }

  function addCustomTool() {
    const v = toolDraft.trim();
    if (!v) return;
    if (!tools.some((x) => x.toLowerCase() === v.toLowerCase())) {
      onTools([...tools, v]);
    }
    setToolDraft("");
  }

  // Tools not in the preset list (user-added) so they still render as chips.
  const customTools = tools.filter(
    (t) => !DESCRIPTION_TOOLS.some((p) => p.toLowerCase() === t.toLowerCase()),
  );

  const preview = composeDescription({
    summary,
    tools,
    areas,
    status,
    reference,
  });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
          Summary <span className="text-red-500 dark:text-red-400">*</span>
          <span className="text-neutral-400 dark:text-neutral-500">
            {" "}
            — what did you work on? (min {DESCRIPTION_MIN_LENGTH} chars)
          </span>
        </label>
        <textarea
          value={summary}
          onChange={(e) => onSummary(e.target.value)}
          rows={2}
          placeholder="e.g. Implemented JWT auth and fixed the token refresh bug"
          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
          required
        />
      </div>

      <div>
        <span className="block text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
          Tools / Tech
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DESCRIPTION_TOOLS.map((t) => (
            <Chip
              key={t}
              label={t}
              active={tools.some((x) => x.toLowerCase() === t.toLowerCase())}
              onClick={() => toggle(tools, onTools, t)}
            />
          ))}
          {customTools.map((t) => (
            <Chip
              key={t}
              label={`${t} ✕`}
              active
              onClick={() => toggle(tools, onTools, t)}
            />
          ))}
          <span className="inline-flex items-center gap-1">
            <input
              value={toolDraft}
              onChange={(e) => setToolDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTool();
                }
              }}
              placeholder="add…"
              className="w-20 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 px-2.5 py-1 text-xs"
            />
            <button
              type="button"
              onClick={addCustomTool}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              +
            </button>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <div>
          <span className="block text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
            Area / Module
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DESCRIPTION_AREAS.map((a) => (
              <Chip
                key={a}
                label={a}
                active={areas.some((x) => x.toLowerCase() === a.toLowerCase())}
                onClick={() => toggle(areas, onAreas, a)}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="block text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DESCRIPTION_STATUSES.map((s) => (
              <Chip
                key={s}
                label={s}
                active={status === s}
                onClick={() => onStatus(status === s ? "" : s)}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
          Reference (ticket / PR / link)
        </label>
        <input
          value={reference}
          onChange={(e) => onReference(e.target.value)}
          placeholder="e.g. PR #142 or JIRA-321"
          className="w-full max-w-xs rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm"
        />
      </div>

      {preview && (
        <div>
          <span className="block text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
            Saved as
          </span>
          <pre className="whitespace-pre-wrap rounded-md bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
            {preview}
          </pre>
        </div>
      )}
    </div>
  );
}
