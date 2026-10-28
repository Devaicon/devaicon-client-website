"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleX,
  Download,
  ExternalLink,
  FileDown,
  Inbox,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { can } from "@/lib/types";
import type { AdminJob, JobStatus, JobSummary } from "@/lib/careers/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import IconButton from "@/components/dashboard/IconButton";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import MenuButton from "@/components/dashboard/MenuButton";
import { JobStatusPill } from "@/components/careers-admin/pills";
import {
  buildJobsCsv,
  buildJobsJson,
  downloadFile,
  exportJobs,
  jobsFileName,
  parseJobsFile,
  sampleJobsCsv,
  sampleJobsJson,
} from "@/components/careers-admin/jobFile";

// Far more than a file of roles needs; anything bigger is the wrong file.
const MAX_FILE_BYTES = 2 * 1024 * 1024;

const CSV = "text/csv;charset=utf-8";
const JSON_TYPE = "application/json";

/** How one imported role, or a file that couldn't be read, went. */
type ImportOutcome = { file: string; id?: string; title?: string; warnings: string[]; error?: string };

const FILTERS: { key: "all" | JobStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Open" },
  { key: "draft", label: "Drafts" },
  { key: "closed", label: "Closed" },
];

export default function JobPostingsPage() {
  return (
    <SectionGate anyOf={["careers.manage"]}>
      <JobPostings />
    </SectionGate>
  );
}

function JobPostings() {
  const router = useRouter();
  const { me } = useDashboardSession();
  const { data, loading, error, reload } = useApi<{ jobs: JobSummary[] }>("/jobs");
  const jobs = data?.jobs ?? [];
  const [filter, setFilter] = useState<"all" | JobStatus>("all");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<"import" | "export" | null>(null);
  const [imported, setImported] = useState<ImportOutcome[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const reviews = can(me, "careers.applications");

  const q = query.trim().toLowerCase();
  const visible = jobs.filter(
    (j) =>
      (filter === "all" || j.status === filter) &&
      (!q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.slug.includes(q)),
  );
  const count = (k: "all" | JobStatus) => (k === "all" ? jobs.length : jobs.filter((j) => j.status === k).length);

  /** Every role in `ids`, in full, in the order the list shows them. */
  async function fullJobs(ids: string[]): Promise<AdminJob[] | null> {
    const res = await api<{ jobs: AdminJob[] }>("/jobs?full=1");
    if (!res.ok || !res.data) {
      setMsg(res.message ?? "The roles couldn't be read for export.");
      return null;
    }
    const byId = new Map(res.data.jobs.map((j) => [j.id, j]));
    return ids.map((id) => byId.get(id)).filter((j): j is AdminJob => Boolean(j));
  }

  /** The roles on screen (the filter and search apply), as one file. */
  async function exportVisible(ext: "csv" | "json") {
    setBusy("export");
    setMsg(null);
    const full = await fullJobs(visible.map((j) => j.id));
    setBusy(null);
    if (!full) return;
    const fields = exportJobs(full);
    if (ext === "csv") downloadFile(jobsFileName("csv"), buildJobsCsv(fields), CSV);
    else downloadFile(jobsFileName("json"), buildJobsJson(fields), JSON_TYPE);
  }

  async function exportOne(j: JobSummary) {
    const res = await api<{ job: AdminJob }>(`/jobs/${j.id}`);
    if (!res.ok || !res.data) {
      setMsg(res.message ?? null);
      return;
    }
    downloadFile(jobsFileName("json", j), buildJobsJson(exportJobs([res.data.job])), JSON_TYPE);
  }

  /**
   * Every role in every file becomes a new draft. The results stay on
   * screen, since what had to change is worth reading before publishing.
   */
  async function importFiles(files: File[]) {
    if (files.length === 0) return;
    setBusy("import");
    setMsg(null);
    setImported(null);
    const outcomes: ImportOutcome[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        outcomes.push({ file: file.name, warnings: [], error: "It's over 2 MB." });
        continue;
      }
      const text = await file.text().catch(() => "");
      const result = parseJobsFile(file.name, text);
      if (!result.ok || !result.jobs) {
        outcomes.push({ file: file.name, warnings: [], error: result.message });
        continue;
      }
      for (const [i, parsed] of result.jobs.entries()) {
        const res = await api<{ job: AdminJob }>("/jobs", { method: "POST", body: parsed.fields });
        // File-wide notes (skipped rows, unknown columns) go with its first role.
        const warnings = i === 0 ? [...(result.warnings ?? []), ...parsed.warnings] : parsed.warnings;
        outcomes.push(
          res.ok && res.data
            ? { file: file.name, id: res.data.job.id, title: res.data.job.title, warnings }
            : { file: file.name, title: parsed.fields.title, warnings: [], error: res.message },
        );
      }
    }
    setBusy(null);
    setImported(outcomes);
    reload();
  }

  async function remove(j: JobSummary) {
    const notes = [
      j.status !== "draft" ? "Its page will disappear from the site." : "",
      j.applications.total > 0
        ? `Its ${j.applications.total} application${j.applications.total === 1 ? "" : "s"} will stay in Applications.`
        : "",
    ].filter(Boolean);
    if (!confirm(`Delete “${j.title}” for good?${notes.length ? ` ${notes.join(" ")}` : ""}`)) return;
    const res = await api(`/jobs/${j.id}`, { method: "DELETE" });
    if (!res.ok) setMsg(res.message ?? null);
    reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job postings"
        description="The roles on the careers page. Only open roles are listed there and take applications."
        actions={
          <div className="flex flex-wrap gap-2">
            <MenuButton
              icon={FileDown}
              label="Sample file"
              title="The layout an import expects, with two example roles"
              items={[
                {
                  label: "Sample CSV",
                  hint: "For Excel or Google Sheets. Put one list item per line in a cell.",
                  onSelect: () => downloadFile("job-postings-sample.csv", sampleJobsCsv(), CSV),
                },
                {
                  label: "Sample JSON",
                  hint: "The same roles in the format Export writes.",
                  onSelect: () => downloadFile("job-postings-sample.json", sampleJobsJson(), JSON_TYPE),
                },
              ]}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy !== null}
              title="Bring in roles from CSV or JSON files. Each one becomes a new draft."
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" aria-hidden />
              {busy === "import" ? "Importing…" : "Import"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              multiple
              className="hidden"
              onChange={(e) => {
                importFiles([...(e.target.files ?? [])]);
                e.target.value = "";
              }}
            />
            <MenuButton
              icon={Download}
              label={busy === "export" ? "Exporting…" : "Export"}
              disabled={busy !== null || visible.length === 0}
              title={visible.length === 0 ? "No roles to export" : undefined}
              items={[
                {
                  label: `${visible.length} role${visible.length === 1 ? "" : "s"} as CSV`,
                  hint: filter === "all" && !q ? "Every role." : "The roles the filter and search show.",
                  onSelect: () => exportVisible("csv"),
                },
                {
                  label: `${visible.length} role${visible.length === 1 ? "" : "s"} as JSON`,
                  hint: "Can be imported here or on another site.",
                  onSelect: () => exportVisible("json"),
                },
              ]}
            />
            <Link
              href="/dashboard/careers/new"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              <Plus className="h-4 w-4" aria-hidden />
              New role
            </Link>
          </div>
        }
      />

      {(msg || error) && (
        <div role="status" className="anim-drop text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
          {msg || error}
        </div>
      )}

      {imported && (
        <section
          aria-labelledby="import-results"
          className="anim-drop rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <h2 id="import-results" className="text-sm font-semibold">
              {imported.filter((o) => o.id).length} role{imported.filter((o) => o.id).length === 1 ? "" : "s"} imported as drafts
              {imported.some((o) => !o.id) && `, ${imported.filter((o) => !o.id).length} not imported`}
            </h2>
            <button
              type="button"
              onClick={() => setImported(null)}
              aria-label="Dismiss import results"
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <ul className="anim-stagger max-h-96 divide-y divide-neutral-100 overflow-y-auto dark:divide-neutral-800">
            {imported.map((o, i) => (
              <li key={i} className="flex items-start gap-2.5 px-4 py-3 text-sm">
                {o.id ? (
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Imported" />
                ) : (
                  <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-label="Not imported" />
                )}
                <div className="min-w-0 flex-1">
                  {o.id ? (
                    <Link href={`/dashboard/careers/${o.id}`} className="font-medium hover:underline">
                      {o.title}
                    </Link>
                  ) : (
                    <span className="font-medium">{o.title ?? o.file}</span>
                  )}
                  <p className={`text-xs ${o.id ? "text-neutral-500 dark:text-neutral-400" : "text-red-600 dark:text-red-400"}`}>
                    {o.id ? o.file : `Not imported. ${o.error ?? ""}`}
                  </p>
                  {o.warnings.length > 0 && (
                    <ul className="mt-1.5 space-y-1 text-xs text-amber-700 dark:text-amber-400">
                      {o.warnings.map((w, j) => (
                        <li key={j} className="flex gap-1.5">
                          <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                          {w}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
          <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  filter === f.key
                    ? "bg-neutral-900 text-white dark:bg-neutral-700"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs opacity-70">{count(f.key)}</span>
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
            <label htmlFor="job-search" className="sr-only">
              Search roles
            </label>
            <input
              id="job-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, team or URL"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pl-8 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
              <tr>
                <th scope="col" className="text-left px-4 py-2 font-medium">Role</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Status</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Applications</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Last edited</th>
                <th scope="col" className="px-4 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody key={`${filter}-${loading}`} className="anim-fade">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800 animate-pulse">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                    </td>
                  </tr>
                ))
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400">
                    {jobs.length === 0 ? "No roles yet. Add one with New role." : "No roles match."}
                  </td>
                </tr>
              ) : (
                visible.map((j) => (
                  <tr key={j.id} className="border-t border-neutral-100 dark:border-neutral-800">
                    <td className="px-4 py-3 max-w-md">
                      <Link href={`/dashboard/careers/${j.id}`} className="font-medium hover:underline">
                        {j.title}
                      </Link>
                      <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        /careers/{j.slug}
                        {j.department && <> · {j.department}</>}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <JobStatusPill status={j.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {j.applications.total === 0 ? (
                        <span className="text-neutral-400">None</span>
                      ) : reviews ? (
                        <Link href={`/dashboard/careers/applications?jobId=${j.id}`} className="hover:underline">
                          {j.applications.total}
                          {j.applications.new > 0 && (
                            <span className="ml-1.5 rounded-full bg-sky-100 px-1.5 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                              {j.applications.new} new
                            </span>
                          )}
                        </Link>
                      ) : (
                        j.applications.total
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                      {new Date(j.updatedAt).toLocaleDateString()}
                      {j.updatedBy && <span className="block text-xs">by {j.updatedBy}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconButton icon={Pencil} label="Edit" onClick={() => router.push(`/dashboard/careers/${j.id}`)} />
                        <IconButton icon={Download} label="Export as JSON" onClick={() => exportOne(j)} />
                        {reviews && (
                          <IconButton
                            icon={Inbox}
                            label="Applications"
                            onClick={() => router.push(`/dashboard/careers/applications?jobId=${j.id}`)}
                          />
                        )}
                        <IconButton
                          icon={ExternalLink}
                          label="View on site"
                          onClick={() => window.open(`/careers/${j.slug}`, "_blank", "noopener")}
                          disabled={j.status === "draft"}
                          disabledReason="Not on the site yet"
                        />
                        <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => remove(j)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
