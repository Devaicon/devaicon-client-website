"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type Project, type TimeLog } from "@/lib/types";
import DescriptionBuilder from "@/components/DescriptionBuilder";

function todayLocal(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay(); // Sun = 0
  const diff = day === 0 ? -6 : 1 - day; // make Mon = start
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Local YYYY-MM-DD. Used to compare against stored log dates (also local
// date strings) without the UTC drift that `new Date("YYYY-MM-DD")` causes.
function isoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
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

  // filter state
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterHoursMin, setFilterHoursMin] = useState<string>("");
  const [filterHoursMax, setFilterHoursMax] = useState<string>("");

  // pagination + multi-select
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [meRes, pRes, lRes] = await Promise.all([
        fetch("/api/legacy/auth/me"),
        fetch("/api/legacy/projects"),
        fetch("/api/legacy/logs"),
      ]);
      if (meRes.status === 401) {
        router.push("/legacy/login");
        return;
      }
      const meData = await meRes.json();
      setMe(meData.user);
      if (pRes.ok) setProjects((await pRes.json()).projects ?? []);
      if (lRes.ok) setLogs((await lRes.json()).logs ?? []);
      setSelected(new Set());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
      const res = await fetch("/api/legacy/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hours: Number(form.hours) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitMsg({
          kind: "err",
          text: data?.message ?? data?.error ?? "Failed.",
        });
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
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    await fetch("/api/legacy/auth/logout", { method: "POST" });
    router.push("/legacy/login");
  }

  async function deleteLog(id: string) {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/legacy/logs?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message ?? "Could not delete this entry.");
      return;
    }
    load();
  }

  async function bulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (
      !confirm(
        `Delete ${ids.length} selected ${ids.length === 1 ? "entry" : "entries"}?`,
      )
    )
      return;
    setBulkBusy(true);
    try {
      const res = await fetch(
        `/api/legacy/logs?ids=${encodeURIComponent(ids.join(","))}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message ?? data.error ?? "Could not delete selected entries.");
        return;
      }
      load();
    } finally {
      setBulkBusy(false);
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [logs]);

  const filtered = useMemo(() => {
    const hMin = filterHoursMin === "" ? null : Number(filterHoursMin);
    const hMax = filterHoursMax === "" ? null : Number(filterHoursMax);
    return sortedLogs.filter((l) => {
      if (filterCategory && l.category !== filterCategory) return false;
      if (filterProject && l.project !== filterProject) return false;
      if (filterStatus === "approved" && !l.approvedAt) return false;
      if (filterStatus === "pending" && l.approvedAt) return false;
      if (filterDateFrom && l.date < filterDateFrom) return false;
      if (filterDateTo && l.date > filterDateTo) return false;
      if (hMin != null && !Number.isNaN(hMin) && Number(l.hours) < hMin) return false;
      if (hMax != null && !Number.isNaN(hMax) && Number(l.hours) > hMax) return false;
      return true;
    });
  }, [
    sortedLogs,
    filterCategory,
    filterProject,
    filterStatus,
    filterDateFrom,
    filterDateTo,
    filterHoursMin,
    filterHoursMax,
  ]);

  // Reset to first page whenever the filters or page size change.
  useEffect(() => {
    setPage(1);
  }, [
    filterCategory,
    filterProject,
    filterStatus,
    filterDateFrom,
    filterDateTo,
    filterHoursMin,
    filterHoursMax,
    pageSize,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  // Only un-approved entries can be deleted, so only those are selectable.
  const selectablePageIds = pageItems
    .filter((l) => !l.approvedAt)
    .map((l) => l.id);
  const allPageSelected =
    selectablePageIds.length > 0 &&
    selectablePageIds.every((id) => selected.has(id));

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) selectablePageIds.forEach((id) => next.delete(id));
      else selectablePageIds.forEach((id) => next.add(id));
      return next;
    });
  }

  const weekTotal = useMemo(() => {
    const startStr = isoLocal(startOfWeek(new Date()));
    return logs
      .filter((l) => l.date >= startStr)
      .reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  }, [logs]);

  const todayTotal = useMemo(() => {
    const t = todayLocal();
    return logs
      .filter((l) => l.date === t)
      .reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  }, [logs]);

  const monthTotal = useMemo(() => {
    const now = new Date();
    const startStr = isoLocal(new Date(now.getFullYear(), now.getMonth(), 1));
    return logs
      .filter((l) => l.date >= startStr)
      .reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  }, [logs]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-900 flex items-center justify-between gap-4">
        <span>
          <strong>Legacy backend</strong> · Google Sheets · for data migration only.
        </span>
        <a href="/dashboard" className="underline hover:text-amber-950 whitespace-nowrap">
          Go to new backend →
        </a>
      </div>
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-semibold tracking-tight">
            Devaicon · Time Tracker
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-neutral-600">
              {me?.username}{" "}
              {me?.role === "admin" && (
                <span className="text-neutral-400">(admin)</span>
              )}
            </span>
            {me?.role === "admin" && (
              <a
                href="/legacy/admin"
                className="text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
              >
                Admin
              </a>
            )}
            <button
              onClick={logout}
              className="text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm ml-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Top row: stats + form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs uppercase tracking-wide text-neutral-500">
              Today
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {todayTotal.toFixed(1)} h
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs uppercase tracking-wide text-neutral-500">
              This week
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {weekTotal.toFixed(1)} h
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs uppercase tracking-wide text-neutral-500">
              This month
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {monthTotal.toFixed(1)} h
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-semibold mb-4">Log time</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 animate-pulse">
              <div className="md:col-span-1">
                <div className="h-4 bg-neutral-200 rounded w-10 mb-1"></div>
                <div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div>
              </div>
              <div className="md:col-span-2">
                <div className="h-4 bg-neutral-200 rounded w-12 mb-1"></div>
                <div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div>
              </div>
              <div className="md:col-span-1">
                <div className="h-4 bg-neutral-200 rounded w-16 mb-1"></div>
                <div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div>
              </div>
              <div className="md:col-span-1">
                <div className="h-4 bg-neutral-200 rounded w-10 mb-1"></div>
                <div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div>
              </div>
              <div className="md:col-span-1 flex items-end">
                <div className="h-9 bg-neutral-200 rounded w-full"></div>
              </div>
              <div className="md:col-span-6">
                <div className="h-4 bg-neutral-200 rounded w-20 mb-1 mt-2"></div>
                <div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 md:grid-cols-6 gap-3"
            >
              <div className="md:col-span-1">
                <label className="block text-xs text-neutral-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  max={todayLocal()}
                  className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-neutral-600 mb-1">
                  Project
                </label>
                <select
                  value={form.project}
                  onChange={(e) =>
                    setForm({ ...form, project: e.target.value })
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
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
                  <p className="text-xs text-amber-700 mt-1">
                    No projects yet — ask your admin to add one.
                  </p>
                )}
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs text-neutral-600 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs text-neutral-600 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  min={0.25}
                  max={24}
                  step={0.25}
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
                  required
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-sm active:scale-[0.98]"
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
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitMsg.text}
                </div>
              )}
            </form>
          )}
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="p-4 border-b border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Your entries</h2>
              <span className="text-xs text-neutral-500">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
              >
                <option value="">All projects</option>
                {projects.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
              >
                <option value="">Any status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
              <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500">
                From
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
              </label>
              <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500">
                To
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
              </label>
              <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500">
                Min h
                <input
                  type="number"
                  min={0}
                  step={0.25}
                  value={filterHoursMin}
                  onChange={(e) => setFilterHoursMin(e.target.value)}
                  className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
              </label>
              <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500">
                Max h
                <input
                  type="number"
                  min={0}
                  step={0.25}
                  value={filterHoursMax}
                  onChange={(e) => setFilterHoursMax(e.target.value)}
                  className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setFilterProject("");
                  setFilterCategory("");
                  setFilterStatus("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setFilterHoursMin("");
                  setFilterHoursMax("");
                }}
                className="px-2 py-1 text-xs text-neutral-600 underline hover:text-neutral-900"
              >
                Clear
              </button>
            </div>
            {selected.size > 0 && (
              <div className="flex items-center gap-3 rounded-md bg-neutral-900 px-3 py-2 text-sm text-white">
                <span>{selected.size} selected</span>
                <button
                  type="button"
                  onClick={bulkDelete}
                  disabled={bulkBusy}
                  className="rounded bg-red-600 px-2 py-1 text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {bulkBusy ? "Deleting…" : "Delete selected"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-neutral-300 hover:text-white"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="w-10 px-4 py-2">
                    <input
                      type="checkbox"
                      aria-label="Select all on page"
                      checked={allPageSelected}
                      disabled={selectablePageIds.length === 0}
                      onChange={toggleAllOnPage}
                      className="align-middle"
                    />
                  </th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-left px-4 py-2 font-medium">Project</th>
                  <th className="text-left px-4 py-2 font-medium">Category</th>
                  <th className="text-right px-4 py-2 font-medium">Hours</th>
                  <th className="text-left px-4 py-2 font-medium">
                    Description
                  </th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <tr
                        key={`skeleton-${i}`}
                        className="border-t border-neutral-100 animate-pulse"
                      >
                        <td className="px-4 py-3">
                          <div className="h-4 w-4 bg-neutral-200 rounded"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 rounded w-20"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 rounded w-32"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 rounded w-24"></div>
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end">
                          <div className="h-4 bg-neutral-200 rounded w-8"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 rounded w-48"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 rounded w-16"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 rounded w-12"></div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-neutral-500"
                    >
                      {filtered.length === 0
                        ? "No entries match your filters."
                        : "No entries on this page."}
                    </td>
                  </tr>
                ) : (
                  pageItems.map((l) => {
                    const isApproved = !!l.approvedAt;
                    return (
                      <tr key={l.id} className="border-t border-neutral-100">
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            aria-label={`Select entry from ${l.date}`}
                            checked={selected.has(l.id)}
                            disabled={isApproved}
                            onChange={() => toggleOne(l.id)}
                            className="align-middle disabled:opacity-30"
                          />
                        </td>
                        <td className="px-4 py-2">{l.date}</td>
                        <td className="px-4 py-2">{l.project}</td>
                        <td className="px-4 py-2">{l.category}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {Number(l.hours).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-neutral-700 whitespace-pre-line">
                          {l.description}
                        </td>
                        <td className="px-4 py-2">
                          {isApproved ? (
                            <span
                              title={`Approved by ${l.approvedBy} on ${new Date(
                                l.approvedAt,
                              ).toLocaleDateString()}`}
                              className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-xs font-medium"
                            >
                              ✓ Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-medium">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {isApproved ? (
                            <span
                              className="text-xs text-neutral-400"
                              title="Approved entries are locked. Ask an admin to unapprove first."
                            >
                              Locked
                            </span>
                          ) : (
                            <button
                              onClick={() => deleteLog(l.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 p-4 text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <span>
                  {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, filtered.length)} of{" "}
                  {filtered.length}
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
                >
                  {[12, 24, 48, 96].map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-neutral-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
