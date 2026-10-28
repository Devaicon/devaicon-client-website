"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Inbox, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { can } from "@/lib/types";
import type { JobStatus, JobSummary } from "@/lib/careers/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import IconButton from "@/components/dashboard/IconButton";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import { JobStatusPill } from "@/components/careers-admin/pills";

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
  const reviews = can(me, "careers.applications");

  const q = query.trim().toLowerCase();
  const visible = jobs.filter(
    (j) =>
      (filter === "all" || j.status === filter) &&
      (!q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.slug.includes(q)),
  );
  const count = (k: "all" | JobStatus) => (k === "all" ? jobs.length : jobs.filter((j) => j.status === k).length);

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
          <Link
            href="/dashboard/careers/new"
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New role
          </Link>
        }
      />

      {(msg || error) && (
        <div role="status" className="anim-drop text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
          {msg || error}
        </div>
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
