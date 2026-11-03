"use client";

import { useState } from "react";
import { Check, Copy, Download, Sparkles, X } from "lucide-react";
import Portal from "@/components/Portal";
import { downloadFile } from "@/components/careers-admin/jobFile";
import { EMPTY_BRIEF, buildAiPrompt, type AiBrief } from "./aiPrompt";

const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm";
const LABEL = "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";

const FIELDS: { key: keyof AiBrief; label: string; placeholder: string; rows?: number }[] = [
  { key: "service", label: "Service", placeholder: "e.g. Cloud migration to AWS and Azure" },
  { key: "keyphrase", label: "Focus keyphrase", placeholder: "e.g. cloud migration services uae" },
  { key: "market", label: "Market or location", placeholder: "e.g. United Arab Emirates" },
  { key: "audience", label: "Audience", placeholder: "e.g. IT directors at mid-sized organisations" },
  {
    key: "facts",
    label: "What we offer, and facts to use",
    placeholder: "Offerings, real figures, technologies, differentiators. The agent is told to invent nothing beyond this.",
    rows: 5,
  },
  { key: "links", label: "Extra pages to link to (optional)", placeholder: "/insights/some-guide: why it's relevant", rows: 2 },
  { key: "images", label: "Image URLs it may use (optional)", placeholder: "https://… or /image-on-this-site.webp, one per line", rows: 2 },
];

/**
 * Builds the prompt an admin gives their own AI agent. The agent replies
 * with a service page file, which Import turns into a draft here.
 */
export default function AiPromptDialog({
  livePages,
  onClose,
}: {
  livePages: { title: string; slug: string }[];
  onClose: () => void;
}) {
  const [brief, setBrief] = useState<AiBrief>(EMPTY_BRIEF);
  const [copied, setCopied] = useState(false);
  const prompt = buildAiPrompt(brief, livePages);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      downloadFile("service-page-prompt.md", prompt, "text/markdown;charset=utf-8");
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
                Write a service page with your AI agent
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Fill in what you know, copy the prompt into ChatGPT, Claude or any agent, save its reply as a .json file, then
                use Import. The page arrives as a draft for you to check before publishing.
              </p>
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
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`brief-${f.key}`} className={LABEL}>
                    {f.label}
                  </label>
                  {f.rows ? (
                    <textarea
                      id={`brief-${f.key}`}
                      rows={f.rows}
                      value={brief[f.key]}
                      placeholder={f.placeholder}
                      onChange={(e) => setBrief((b) => ({ ...b, [f.key]: e.target.value }))}
                      className={INPUT}
                    />
                  ) : (
                    <input
                      id={`brief-${f.key}`}
                      value={brief[f.key]}
                      placeholder={f.placeholder}
                      onChange={(e) => setBrief((b) => ({ ...b, [f.key]: e.target.value }))}
                      className={INPUT}
                    />
                  )}
                </div>
              ))}
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
            <button
              type="button"
              onClick={() => downloadFile("service-page-prompt.md", prompt, "text/markdown;charset=utf-8")}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
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
