"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  isNonWorkingCategory,
  type Project,
  type TimeLog,
} from "@/lib/types";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { ArrowRightIcon } from "lucide-react";

function todayLocal(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

// Local YYYY-MM-DD. Avoid toISOString() here: it converts to UTC and can
// shift the calendar date by a day depending on timezone / time-of-day.
function isoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return isoLocal(d);
}

function startOfWeekIso(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Mon = start
  d.setDate(d.getDate() + diff);
  return isoLocal(d);
}

function startOfMonthIso(): string {
  const d = new Date();
  d.setDate(1);
  return isoLocal(d);
}

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState("");
  const [pMsg, setPMsg] = useState<string | null>(null);

  // filters
  const [fUser, setFUser] = useState("");
  const [fProject, setFProject] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [fStatus, setFStatus] = useState<"all" | "pending" | "approved">("all");
  const [activePreset, setActivePreset] = useState<string>("all");

  // selection (for bulk approve)
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [approvalBusy, setApprovalBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [meRes, pRes, lRes] = await Promise.all([
        fetch("/api/legacy/auth/me"),
        fetch("/api/legacy/projects"),
        fetch("/api/legacy/logs?all=1"),
      ]);
      if (meRes.status === 401) {
        router.push("/legacy/login");
        return;
      }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") {
        router.push("/legacy/dashboard");
        return;
      }
      setMe(meData.user);
      if (pRes.ok) setProjects((await pRes.json()).projects ?? []);
      if (lRes.ok) setLogs((await lRes.json()).logs ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setPMsg(null);
    const name = newProject.trim();
    if (!name) return;
    const res = await fetch("/api/legacy/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPMsg(
        data.error === "duplicate_project"
          ? "Project already exists."
          : "Failed to add project.",
      );
      return;
    }
    setNewProject("");
    load();
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project? Existing logs are not removed.")) return;
    await fetch(`/api/legacy/projects?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    load();
  }

  async function deleteLog(id: string) {
    if (!confirm("Delete this entry permanently?")) return;
    await fetch(`/api/legacy/logs?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    load();
  }

  async function setApproval(ids: string[], approved: boolean) {
    if (ids.length === 0) return;
    setApprovalBusy(true);
    try {
      const res = await fetch("/api/legacy/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, approved }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message ?? "Approval update failed.");
        return;
      }
      setSelected(new Set());
      load();
    } finally {
      setApprovalBusy(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function logout() {
    await fetch("/api/legacy/auth/logout", { method: "POST" });
    router.push("/legacy/login");
  }

  /* ---------------- presets ---------------- */
  function applyPreset(preset: string) {
    setActivePreset(preset);
    const today = todayLocal();
    switch (preset) {
      case "today":
        setFFrom(today);
        setFTo(today);
        break;
      case "week":
        setFFrom(startOfWeekIso());
        setFTo(today);
        break;
      case "month":
        setFFrom(startOfMonthIso());
        setFTo(today);
        break;
      case "last7":
        setFFrom(shiftDays(today, -6));
        setFTo(today);
        break;
      case "last30":
        setFFrom(shiftDays(today, -29));
        setFTo(today);
        break;
      case "all":
      default:
        setFFrom("");
        setFTo("");
    }
  }

  /* ---------------- derived ---------------- */
  const allUsers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.username));
    return [...set].sort();
  }, [logs]);

  const filtered = useMemo(() => {
    return logs
      .filter((l) => {
        if (fUser && l.username !== fUser) return false;
        if (fProject && l.project !== fProject) return false;
        if (fCategory && l.category !== fCategory) return false;
        if (fFrom && l.date < fFrom) return false;
        if (fTo && l.date > fTo) return false;
        if (fStatus === "pending" && l.approvedAt) return false;
        if (fStatus === "approved" && !l.approvedAt) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [logs, fUser, fProject, fCategory, fFrom, fTo, fStatus]);

  const pendingInView = useMemo(
    () => filtered.filter((l) => !l.approvedAt).map((l) => l.id),
    [filtered],
  );

  const selectedPendingIds = useMemo(
    () =>
      filtered
        .filter((l) => selected.has(l.id) && !l.approvedAt)
        .map((l) => l.id),
    [filtered, selected],
  );

  const selectedApprovedIds = useMemo(
    () =>
      filtered
        .filter((l) => selected.has(l.id) && l.approvedAt)
        .map((l) => l.id),
    [filtered, selected],
  );

  const totals = useMemo(() => {
    // Leave and holiday entries carry nominal hours only because the backend
    // requires hours > 0. They are days off, not worked time, so they stay out
    // of every hour total and are counted separately.
    const work = filtered.filter(
      (l) => !isNonWorkingCategory(String(l.category)),
    );
    const total = work.reduce((s, l) => s + (Number(l.hours) || 0), 0);
    const offDays = filtered.length - work.length;
    const byUser = new Map<string, number>();
    const byProject = new Map<string, number>();
    const byCategory = new Map<string, number>();
    for (const l of work) {
      const h = Number(l.hours) || 0;
      byUser.set(l.username, (byUser.get(l.username) ?? 0) + h);
      byProject.set(l.project, (byProject.get(l.project) ?? 0) + h);
      byCategory.set(l.category, (byCategory.get(l.category) ?? 0) + h);
    }
    return { total, offDays, byUser, byProject, byCategory };
  }, [filtered]);

  function clearFilters() {
    setFUser("");
    setFProject("");
    setFCategory("");
    setFFrom("");
    setFTo("");
    setFStatus("all");
    setActivePreset("all");
    setSelected(new Set());
  }

  function downloadFilteredCsv() {
    const headers = [
      "Date",
      "User",
      "Project",
      "Category",
      "Hours",
      "Description",
      "Status",
      "Approved By",
      "Approved At",
    ];
    const rows = filtered.map((l) => [
      l.date,
      l.username,
      l.project,
      l.category,
      Number(l.hours).toFixed(2),
      l.description,
      l.approvedAt ? "Approved" : "Pending",
      l.approvedBy,
      l.approvedAt,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devaicon-timelogs-${todayLocal()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const presets = [
    { id: "today", label: "Today" },
    { id: "week", label: "This week" },
    { id: "month", label: "This month" },
    { id: "last7", label: "Last 7 days" },
    { id: "last30", label: "Last 30 days" },
    { id: "all", label: "All time" },
  ];

  return (
    <main className="min-h-screen text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-grey-50 dark:bg-grey-950/50 border-b border-grey-200 dark:border-grey-900 px-6 py-2 text-xs text-grey-900 dark:text-grey-300 flex items-center justify-between gap-4 print:hidden">
        <span>
          <strong>Legacy backend</strong> · Google Sheets · for data migration
          only.
        </span>
        <a
          href="/admin"
          className="underline hover:text-grey-950 dark:hover:text-grey-200 whitespace-nowrap"
        >
          Go to new backend{" "}
          <ArrowRightIcon className="inline-block w-3 h-3 ml-1" />
        </a>
      </div>
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Devaicon · Admin</div>
          <div className="flex items-center gap-4 text-sm">
            <ThemeToggle />
            <span className="text-neutral-600 dark:text-neutral-400">
              {me?.username}
            </span>
            <a
              href="/legacy/dashboard"
              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              My dashboard
            </a>
            <button
              onClick={logout}
              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Projects */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 print:hidden">
          <h2 className="font-semibold mb-4">Projects</h2>
          <form onSubmit={addProject} className="flex gap-2 mb-4">
            <input
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="New project name"
              className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              Add
            </button>
          </form>
          {pMsg && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              {pMsg}
            </p>
          )}

          {loading ? (
            <div className="space-y-2 animate-pulse mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={`pskel-${i}`}
                  className="h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-md"
                ></div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
              No projects yet.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-md mt-4">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between px-4 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Added {new Date(p.addedAt).toLocaleDateString()} by{" "}
                      {p.addedBy}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Filters */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 print:hidden">
          {/* Date presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`text-xs rounded-md px-3 py-1.5 border ${
                  activePreset === p.id
                    ? "bg-neutral-900 dark:bg-neutral-700 text-white border-neutral-900 dark:border-neutral-700"
                    : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            <select
              value={fUser}
              onChange={(e) => setFUser(e.target.value)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm bg-white dark:bg-neutral-900"
            >
              <option value="">All users</option>
              {allUsers.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <select
              value={fProject}
              onChange={(e) => setFProject(e.target.value)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm bg-white dark:bg-neutral-900"
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              value={fCategory}
              onChange={(e) => setFCategory(e.target.value)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm bg-white dark:bg-neutral-900"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value as typeof fStatus)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm bg-white dark:bg-neutral-900"
            >
              <option value="all">All status</option>
              <option value="pending">Pending only</option>
              <option value="approved">Approved only</option>
            </select>
            <input
              type="date"
              value={fFrom}
              onChange={(e) => {
                setFFrom(e.target.value);
                setActivePreset("custom");
              }}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
            />
            <input
              type="date"
              value={fTo}
              onChange={(e) => {
                setFTo(e.target.value);
                setActivePreset("custom");
              }}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-2 text-sm"
            />
            <button
              onClick={clearFilters}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-sm">
            <button
              onClick={() => window.print()}
              className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-3 py-1.5 text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              Print / Save PDF
            </button>
            <button
              onClick={downloadFilteredCsv}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Download filtered CSV
            </button>
            <a
              href="/api/legacy/admin/export"
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Download full .xlsx
            </a>
            <span className="text-neutral-500 dark:text-neutral-400 ml-auto">
              {filtered.length} entries · {totals.total.toFixed(1)} hours worked
              {totals.offDays > 0 &&
                ` · ${totals.offDays} leave/holiday day${totals.offDays === 1 ? "" : "s"}`}
            </span>
          </div>
        </section>

        {/* Print header */}
        <div className="hidden print:block mb-4">
          <h1 className="text-xl font-bold">Devaicon — Time Log Report</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Generated {new Date().toLocaleString()} · {filtered.length} entries
            · {totals.total.toFixed(1)}h total
          </p>
          {(fUser || fProject || fCategory || fFrom || fTo) && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Filters:
              {fUser && ` user=${fUser}`}
              {fProject && ` project=${fProject}`}
              {fCategory && ` category=${fCategory}`}
              {fFrom && ` from=${fFrom}`}
              {fTo && ` to=${fTo}`}
            </p>
          )}
        </div>

        {/* Logs table */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden print:border-0">
          {/* Bulk action bar */}
          {(selected.size > 0 || pendingInView.length > 0) && (
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm print:hidden">
              {selected.size > 0 ? (
                <>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {selected.size} selected
                  </span>
                  {selectedPendingIds.length > 0 && (
                    <button
                      disabled={approvalBusy}
                      onClick={() => setApproval(selectedPendingIds, true)}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve {selectedPendingIds.length}
                    </button>
                  )}
                  {selectedApprovedIds.length > 0 && (
                    <button
                      disabled={approvalBusy}
                      onClick={() => setApproval(selectedApprovedIds, false)}
                      className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                    >
                      Unapprove {selectedApprovedIds.length}
                    </button>
                  )}
                  <button
                    onClick={() => setSelected(new Set())}
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 ml-auto"
                  >
                    Clear selection
                  </button>
                </>
              ) : (
                <>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {pendingInView.length} pending entr
                    {pendingInView.length === 1 ? "y" : "ies"} in view
                  </span>
                  <button
                    disabled={approvalBusy}
                    onClick={() => setApproval(pendingInView, true)}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve all pending in view
                  </button>
                </>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
                <tr>
                  <th className="px-3 py-2 print:hidden w-8">
                    <input
                      type="checkbox"
                      checked={
                        pendingInView.length > 0 &&
                        pendingInView.every((id) => selected.has(id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            pendingInView.forEach((id) => next.add(id));
                            return next;
                          });
                        } else {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            pendingInView.forEach((id) => next.delete(id));
                            return next;
                          });
                        }
                      }}
                      title="Select all pending in view"
                    />
                  </th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-left px-4 py-2 font-medium">User</th>
                  <th className="text-left px-4 py-2 font-medium">Project</th>
                  <th className="text-left px-4 py-2 font-medium">Category</th>
                  <th className="text-right px-4 py-2 font-medium">Hours</th>
                  <th className="text-left px-4 py-2 font-medium">
                    Description
                  </th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-right px-4 py-2 font-medium print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr
                        key={`skeleton-${i}`}
                        className="border-t border-neutral-100 dark:border-neutral-800 animate-pulse"
                      >
                        <td className="px-3 py-3 w-8">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-48"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                        </td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    ))}
                  </>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
                    >
                      No entries match these filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => {
                    const isApproved = !!l.approvedAt;
                    return (
                      <tr
                        key={l.id}
                        className="border-t border-neutral-100 dark:border-neutral-800"
                      >
                        <td className="px-3 py-2 print:hidden">
                          <input
                            type="checkbox"
                            checked={selected.has(l.id)}
                            onChange={() => toggleSelect(l.id)}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {l.date}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {l.username}
                        </td>
                        <td className="px-4 py-2">{l.project}</td>
                        <td className="px-4 py-2">{l.category}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {Number(l.hours).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-neutral-700 dark:text-neutral-300">
                          {l.description}
                        </td>
                        <td className="px-4 py-2">
                          {isApproved ? (
                            <button
                              onClick={() => setApproval([l.id], false)}
                              title={`Approved by ${l.approvedBy} on ${new Date(
                                l.approvedAt,
                              ).toLocaleString()} — click to unapprove`}
                              className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900 px-2 py-0.5 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/40 print:hover:bg-green-50"
                            >
                              ✓ Approved
                            </button>
                          ) : (
                            <button
                              onClick={() => setApproval([l.id], true)}
                              title="Click to approve"
                              className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 px-2 py-0.5 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 print:hover:bg-amber-50"
                            >
                              Pending
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right print:hidden">
                          <button
                            onClick={() => deleteLog(l.id)}
                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            title="Delete entry"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot className="bg-neutral-50 dark:bg-neutral-950 font-medium">
                  <tr>
                    <td className="print:hidden" />
                    <td colSpan={4} className="px-4 py-2 text-right">
                      Total
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {totals.total.toFixed(2)}
                    </td>
                    <td colSpan={2} />
                    <td className="print:hidden" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>

        {/* Summary breakdowns — clickable to filter */}
        {filtered.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 print:break-inside-avoid">
            <SummaryCard
              title="Hours by user"
              entries={[...totals.byUser.entries()]}
              activeKey={fUser}
              onClick={(k) => setFUser(fUser === k ? "" : k)}
            />
            <SummaryCard
              title="Hours by project"
              entries={[...totals.byProject.entries()]}
              activeKey={fProject}
              onClick={(k) => setFProject(fProject === k ? "" : k)}
            />
            <SummaryCard
              title="Hours by category"
              entries={[...totals.byCategory.entries()]}
              activeKey={fCategory}
              onClick={(k) => setFCategory(fCategory === k ? "" : k)}
            />
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  entries,
  activeKey,
  onClick,
}: {
  title: string;
  entries: [string, number][];
  activeKey?: string;
  onClick?: (key: string) => void;
}) {
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 print:hidden">
        Click a row to filter the table.
      </p>
      <ul className="space-y-2">
        {sorted.map(([k, v]) => {
          const isActive = activeKey === k;
          return (
            <li key={k}>
              <button
                onClick={() => onClick?.(k)}
                className={`w-full text-left rounded-md px-2 py-1 -mx-2 transition ${
                  isActive
                    ? "bg-neutral-900/5 dark:bg-neutral-100/10"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex justify-between text-sm">
                  <span
                    className={
                      isActive
                        ? "font-semibold"
                        : "text-neutral-700 dark:text-neutral-300"
                    }
                  >
                    {k}
                  </span>
                  <span className="tabular-nums font-medium">
                    {v.toFixed(1)}h
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                  <div
                    className={`h-1.5 rounded ${
                      isActive
                        ? "bg-neutral-900 dark:bg-neutral-700"
                        : "bg-neutral-700 dark:bg-neutral-600"
                    }`}
                    style={{ width: total ? `${(v / total) * 100}%` : "0%" }}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
