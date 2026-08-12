"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CATEGORIES, type Project } from "@/lib/types";
import DescriptionBuilder from "@/components/DescriptionBuilder";
import { formatHuman, msToHours } from "../format";
import { backdrop, dialogPanel } from "../motion";
import { isoLocal, todayLocal } from "../metrics";
import type { MutationResult, NewLogInput } from "../useLoggerData";
import type { PendingSession } from "./storage";

export default function SaveSessionDialog({
  session,
  projects,
  createLog,
  onClose,
  onSaved,
}: {
  session: PendingSession;
  projects: Project[];
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const measuredHours = msToHours(session.elapsedMs);
  const reduced = useReducedMotion();

  const [form, setForm] = useState({
    // The entry belongs to the day the timer started, not the day it stopped.
    date: isoLocal(new Date(session.startedAtISO)),
    project: session.projectHint,
    category: "Coding",
    hours: String(measuredHours),
    description: "",
    tools: [] as string[],
    areas: [] as string[],
    status: "",
    reference: "",
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
    if (!Number.isFinite(hours) || hours < 0.01) {
      setError("Timer too short to log.");
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
      const result = await createLog({ ...form, hours });
      if (!result.ok) {
        setError(result.message ?? "Could not save this entry.");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  const edited = Number(form.hours) !== measuredHours;

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
        aria-labelledby="save-session-title"
        variants={dialogPanel(!!reduced)}
        className="w-full max-w-2xl rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-neutral-900 dark:text-neutral-100 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="save-session-title" className="text-lg font-semibold">
              Log this session
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Measured {formatHuman(session.elapsedMs)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-6"
        >
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              max={todayLocal()}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Project
            </label>
            <select
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-sm"
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
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
              Hours
            </label>
            {/* step 0.01, unlike the manual form's 0.25: the measured value is exact. */}
            <input
              type="number"
              min={0.01}
              max={24}
              step={0.01}
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
              required
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              = {formatHuman(session.elapsedMs)}
              {edited && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, hours: String(measuredHours) })}
                  className="ml-2 underline hover:no-underline"
                >
                  reset to measured
                </button>
              )}
            </p>
          </div>
          <div className="md:col-span-6">
            <DescriptionBuilder
              summary={form.description}
              onSummary={(v) => setForm({ ...form, description: v })}
              tools={form.tools}
              onTools={(v) => setForm({ ...form, tools: v })}
              areas={form.areas}
              onAreas={(v) => setForm({ ...form, areas: v })}
              status={form.status}
              onStatus={(v) => setForm({ ...form, status: v })}
              reference={form.reference}
              onReference={(v) => setForm({ ...form, reference: v })}
            />
          </div>

          {error && (
            <div className="md:col-span-6 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="md:col-span-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Save for later
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Log entry"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
