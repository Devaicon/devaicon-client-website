"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CATEGORIES } from "@/lib/types";
import { formatHoursHuman } from "../format";
import { summariseEntries, todayLocal } from "../metrics";
import { downloadCsv, toCsv } from "../csv";
import { useTimeFormat } from "../TimeFormatProvider";
import { fadeRow } from "../motion";
import EntriesSummaryCards from "./EntriesSummaryCards";
import type { LoggerData } from "../useLoggerData";

export default function EntriesTab({ data }: { data: LoggerData }) {
  const { logs, projects, loading, deleteLog, bulkDeleteLogs, me } = data;
  const { fmt } = useTimeFormat();
  const reduced = useReducedMotion();

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

  // The data hook reloads after every mutation. Drop selections for rows that
  // no longer exist so the bulk bar can't count phantom entries.
  useEffect(() => {
    setSelected((prev) => {
      if (prev.size === 0) return prev;
      const live = new Set(logs.map((l) => l.id));
      const next = new Set([...prev].filter((id) => live.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [logs]);

  async function onDeleteLog(id: string) {
    if (!confirm("Delete this entry?")) return;
    const result = await deleteLog(id);
    if (!result.ok) alert(result.message ?? "Could not delete this entry.");
  }

  async function onBulkDelete() {
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
      const result = await bulkDeleteLogs(ids);
      if (!result.ok) alert(result.message ?? "Could not delete selected entries.");
      else setSelected(new Set());
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

  const summary = useMemo(() => summariseEntries(filtered), [filtered]);

  /**
   * Exports every row matching the current filters, not just the visible page,
   * so the file always agrees with the summary cards above the table. Hours go
   * out twice: the decimal column is what spreadsheets can add up, the duration
   * column is what a person can read.
   */
  function exportCsv() {
    if (filtered.length === 0) return;
    const csv = toCsv(
      [
        "Date",
        "Project",
        "Category",
        "Hours",
        "Duration",
        "Description",
        "Status",
        "Approved By",
        "Approved At",
      ],
      filtered.map((l) => [
        l.date,
        l.project,
        l.category,
        Number(l.hours).toFixed(2),
        formatHoursHuman(Number(l.hours)),
        l.description,
        l.approvedAt ? "Approved" : "Pending",
        l.approvedBy,
        l.approvedAt,
      ]),
    );
    const who = me?.username ? `-${me.username}` : "";
    downloadCsv(`devaicon-entries${who}-${todayLocal()}.csv`, csv);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  // Only un-approved entries can be deleted, so only those are selectable.
  const selectablePageIds = pageItems.filter((l) => !l.approvedAt).map((l) => l.id);
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

  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Your entries</h2>
          {/* The matched count lives in the summary cards below, so the header
              carries the action instead of repeating the number. */}
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            title={
              filtered.length === 0
                ? "Nothing to export"
                : `Export all ${filtered.length} matching ${
                    filtered.length === 1 ? "entry" : "entries"
                  }`
            }
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            Export CSV
          </button>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm bg-white dark:bg-neutral-900"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm bg-white dark:bg-neutral-900"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm bg-white dark:bg-neutral-900"
          >
            <option value="">Any status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            From
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            To
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Min h
            <input
              type="number"
              min={0}
              step={0.25}
              value={filterHoursMin}
              onChange={(e) => setFilterHoursMin(e.target.value)}
              className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Max h
            <input
              type="number"
              min={0}
              step={0.25}
              value={filterHoursMax}
              onChange={(e) => setFilterHoursMax(e.target.value)}
              className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm"
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
            className="px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 underline hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Clear
          </button>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-3 rounded-md bg-neutral-900 dark:bg-neutral-700 px-3 py-2 text-sm text-white">
            <span>{selected.size} selected</span>
            <button
              type="button"
              onClick={onBulkDelete}
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

        {!loading && <EntriesSummaryCards summary={summary} />}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
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
              <th className="text-left px-4 py-2 font-medium">Description</th>
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
                    className="border-t border-neutral-100 dark:border-neutral-800 animate-pulse"
                  >
                    <td className="px-4 py-3">
                      <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
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
                    <td className="px-4 py-3">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
                >
                  {filtered.length === 0
                    ? "No entries match your filters."
                    : "No entries on this page."}
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {pageItems.map((l) => {
                  const isApproved = !!l.approvedAt;
                  return (
                    // No `layout` prop: transforms on <tr> reflow unreliably
                    // across browsers, and a fade is all the row change needs.
                    <motion.tr
                      key={l.id}
                      variants={fadeRow(!!reduced)}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="border-t border-neutral-100 dark:border-neutral-800"
                    >
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
                      <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">
                        {fmt(Number(l.hours), { decimals: 2, unit: false })}
                      </td>
                      <td className="px-4 py-2 text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                        {l.description}
                      </td>
                      <td className="px-4 py-2">
                        {isApproved ? (
                          <span
                            title={`Approved by ${l.approvedBy} on ${new Date(
                              l.approvedAt,
                            ).toLocaleDateString()}`}
                            className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900 px-2 py-0.5 text-xs font-medium"
                          >
                            ✓ Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 px-2 py-0.5 text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {isApproved ? (
                          <span
                            className="text-xs text-neutral-400 dark:text-neutral-500"
                            title="Approved entries are locked. Ask an admin to unapprove first."
                          >
                            Locked
                          </span>
                        ) : (
                          <button
                            onClick={() => onDeleteLog(l.id)}
                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 dark:border-neutral-800 p-4 text-sm">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <span>
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm bg-white dark:bg-neutral-900"
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
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-neutral-600 dark:text-neutral-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
