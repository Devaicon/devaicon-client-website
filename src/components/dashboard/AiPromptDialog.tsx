"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy, Download, Sparkles, X } from "lucide-react";
import Portal from "@/components/Portal";
import { downloadFile } from "@/components/careers-admin/jobFile";

const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm";
const LABEL = "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";

export type BriefField<B> = { key: keyof B & string; label: string; placeholder: string; rows?: number };

/**
 * A brief on the left, the prompt it builds on the right. An admin copies the
 * prompt into their own AI agent, saves its reply as a .json file and imports
 * it. Each importer (service pages, posts) supplies its own brief and prompt.
 */
export default function AiPromptDialog<B extends Record<string, string>>({
  title,
  intro,
  fields,
  initialBrief,
  build,
  promptFileName,
  actions,
  onClose,
}: {
  title: string;
  intro: ReactNode;
  fields: BriefField<B>[];
  initialBrief: B;
  build: (brief: B) => string;
  /** The name the prompt downloads under, e.g. "post-prompt.md". */
  promptFileName: string;
  /** Extra buttons for the footer, left of the download and copy buttons. */
  actions?: ReactNode;
  onClose: () => void;
}) {
  const [brief, setBrief] = useState<B>(initialBrief);
  const [copied, setCopied] = useState(false);
  const prompt = build(brief);
  const download = () => downloadFile(promptFileName, prompt, "text/markdown;charset=utf-8");

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      download();
    }
  }

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-prompt-title"
        className="anim-fade fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="anim-pop flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <div>
              <h2 id="ai-prompt-title" className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
                {title}
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{intro}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                All optional. Anything left empty becomes a placeholder you can fill in inside your agent.
              </p>
              {fields.map((f) => {
                const props = {
                  id: `brief-${f.key}`,
                  value: brief[f.key],
                  placeholder: f.placeholder,
                  className: INPUT,
                  onChange: (e: { target: { value: string } }) => setBrief((b) => ({ ...b, [f.key]: e.target.value })),
                };
                return (
                  <div key={f.key}>
                    <label htmlFor={props.id} className={LABEL}>
                      {f.label}
                    </label>
                    {f.rows ? <textarea rows={f.rows} {...props} /> : <input {...props} />}
                  </div>
                );
              })}
            </div>
            <div className="flex min-h-[20rem] flex-col">
              <label htmlFor="ai-prompt-text" className={LABEL}>
                The prompt ({prompt.length.toLocaleString()} characters)
              </label>
              <textarea
                id="ai-prompt-text"
                readOnly
                value={prompt}
                onFocus={(e) => e.target.select()}
                className={`${INPUT} flex-1 font-mono text-[11px] leading-5`}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
            {actions}
            <button type="button" onClick={download} className={SECONDARY_BUTTON}>
              <Download className="h-4 w-4" aria-hidden />
              Download .md
            </button>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied ? "Copied" : "Copy prompt"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/** The footer's outlined button, for callers adding their own actions. */
export const SECONDARY_BUTTON =
  "inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800";
