"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { XIcon } from "lucide-react";
import { CATEGORIES, type Project } from "@/lib/types";
import { todayLocal } from "../metrics";
import { backdrop, dialogPanel } from "../motion";
import type { MutationResult, NewLogInput } from "../useLoggerData";

/**
 * A compact entry form for the Overview, so a day's work can be logged without
 * leaving the tab and losing sight of the tiles it moves.
 *
 * Deliberately shorter than the Log time tab's form: no DescriptionBuilder, so
 * tools, areas, status and reference go up empty. Anyone who wants those is
 * already on the tab that offers them.
 */
export default function QuickLogDialog({
  projects,
  createLog,
  onLogged,
  onClose,
}: {
  projects: Project[];
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  /** Called with the project name once the entry is saved. */
  onLogged?: (project: string) => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();

  const [form, setForm] = useState({
    date: todayLocal(),
    // Prefilled only when there is no choice to get wrong.
    project: projects.length === 1 ? projects[0].name : "",
    category: "Coding",
    hours: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const hours = Number(form.hours);
    if (!form.project) {
      setError("Pick a project.");
      return;
    }
    if (!Number.isFinite(hours) || hours <= 0) {
      setError("Enter hours.");
      return;
    }
    if (hours > 24) {
      setError("Hours must be 24 or less.");
      return;
    }
    if (!form.description.trim()) {
      setError("Summary is required.");
      return;
    }

    setSaving(true);
    try {
      const result = await createLog({
        ...form,
        hours,
        tools: [],
        areas: [],
        status: "",
        reference: "",
      });
      if (!result.ok) {
        setError(result.message ?? "Could not save this entry.");
        return;
      }
      onLogged?.(form.project);
      // createLog reloads, so the tiles and calendar behind the dialog are
      // already showing this entry by the time it closes.
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm";

  return (
    <motion.div
      variants={backdrop()}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-log-title"
        variants={dialogPanel(!!reduced)}
        className="w-full max-w-lg rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-neutral-900 dark:text-neutral-100 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="quick-log-title" className="text-lg font-semibold">
              Log time
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              For more detail, use the Log time tab.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="quick-log-date"
              className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400"
            >
              Date
            </label>
            <input
              id="quick-log-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              max={todayLocal()}
              className={field}
              required
            />
          </div>
          <div>
            <label
              htmlFor="quick-log-hours"
              className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400"
            >
              Hours
            </label>
            <input
              id="quick-log-hours"
              type="number"
              min={0.25}
              max={24}
              step={0.25}
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className={field}
              autoFocus
              required
            />
          </div>
          <div>
            <label
              htmlFor="quick-log-project"
              className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400"
            >
              Project
            </label>
            <select
              id="quick-log-project"
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              className={`${field} bg-white dark:bg-neutral-900`}
              required
            >
              <option value="">Select…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="quick-log-category"
              className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400"
            >
              Category
            </label>
            <select
              id="quick-log-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`${field} bg-white dark:bg-neutral-900`}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="quick-log-summary"
              className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400"
            >
              Summary
            </label>
            <input
              id="quick-log-summary"
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What did you work on?"
              className={field}
              required
            />
          </div>

          {projects.length === 0 && (
            <p className="col-span-2 text-xs text-amber-700 dark:text-amber-400">
              No projects yet — ask your admin to add one.
            </p>
          )}
          {error && (
            <div className="col-span-2 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="col-span-2 mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50 transition-colors shadow-sm active:scale-[0.98]"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
