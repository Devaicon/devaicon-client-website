"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/types";
import DescriptionBuilder from "@/components/DescriptionBuilder";
import Tooltip from "../Tooltip";
import { todayLocal } from "../metrics";
import StopwatchCard from "../stopwatch/StopwatchCard";
import type { UseStopwatch } from "../stopwatch/useStopwatch";
import type { LoggerData } from "../useLoggerData";

type Mode = "manual" | "stopwatch";

function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 animate-pulse">
      <div className="md:col-span-1">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-10 mb-1"></div>
        <div className="h-9 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-800 w-full"></div>
      </div>
      <div className="md:col-span-2">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12 mb-1"></div>
        <div className="h-9 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-800 w-full"></div>
      </div>
      <div className="md:col-span-1">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mb-1"></div>
        <div className="h-9 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-800 w-full"></div>
      </div>
      <div className="md:col-span-1">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-10 mb-1"></div>
        <div className="h-9 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-800 w-full"></div>
      </div>
      <div className="md:col-span-1 flex items-end">
        <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
      </div>
      <div className="md:col-span-6">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-1 mt-2"></div>
        <div className="h-9 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-800 w-full"></div>
      </div>
    </div>
  );
}

export default function LogTimeTab({
  data,
  sw,
}: {
  data: LoggerData;
  sw: UseStopwatch;
}) {
  const { projects, loading, createLog } = data;
  const [mode, setMode] = useState<Mode>("manual");

  const [form, setForm] = useState({
    date: todayLocal(),
    project: "",
    category: "Coding",
    hours: "",
    description: "", // summary
    tools: [] as string[],
    areas: [] as string[],
    status: "",
    reference: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg(null);
    if (!form.project) {
      setSubmitMsg({ kind: "err", text: "Pick a project." });
      return;
    }
    if (!form.hours) {
      setSubmitMsg({ kind: "err", text: "Enter hours." });
      return;
    }
    if (!form.description.trim()) {
      setSubmitMsg({ kind: "err", text: "Summary is required." });
      return;
    }
    setSubmitting(true);
    try {
      const result = await createLog({ ...form, hours: Number(form.hours) });
      if (!result.ok) {
        setSubmitMsg({ kind: "err", text: result.message ?? "Failed." });
        return;
      }
      setSubmitMsg({ kind: "ok", text: "Logged." });
      setForm({
        ...form,
        hours: "",
        description: "",
        tools: [],
        areas: [],
        status: "",
        reference: "",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1">
          <button
            type="button"
            onClick={() => setMode("manual")}
            aria-pressed={mode === "manual"}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => setMode("stopwatch")}
            aria-pressed={mode === "stopwatch"}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "stopwatch"
                ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Stopwatch
          </button>
        </div>
        <Tooltip
          content={
            <>
              <strong>New</strong> — track time live instead of estimating it.
              Start the timer and we&rsquo;ll fill the hours in when you stop.
            </>
          }
        >
          <span className="rounded-full bg-green-100 dark:bg-green-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
            New
          </span>
        </Tooltip>
      </div>

      {mode === "stopwatch" ? (
        <StopwatchCard sw={sw} projects={projects} />
      ) : (
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h2 className="font-semibold mb-4">Log time</h2>
          {loading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  max={todayLocal()}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Project
                </label>
                <select
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm bg-white dark:bg-neutral-900"
                  required
                >
                  <option value="">Select…</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {!loading && projects.length === 0 && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    No projects yet — ask your admin to add one.
                  </p>
                )}
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm bg-white dark:bg-neutral-900"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  min={0.25}
                  max={24}
                  step={0.25}
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
                  required
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50 transition-colors shadow-sm active:scale-[0.98]"
                >
                  {submitting ? "Saving…" : "Save"}
                </button>
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
              {submitMsg && (
                <div
                  className={`md:col-span-6 text-sm rounded-md px-3 py-2 ${
                    submitMsg.kind === "ok"
                      ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900"
                      : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900"
                  }`}
                >
                  {submitMsg.text}
                </div>
              )}
            </form>
          )}
        </section>
      )}
    </div>
  );
}
