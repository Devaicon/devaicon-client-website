"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  type ApplicationSummary,
  type JobSummary,
} from "@/lib/careers/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { useApi } from "@/components/dashboard/useApi";
import { ApplicationStatusPill } from "@/components/careers-admin/pills";

const INPUT = "rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 text-sm";

export default function ApplicationsPage() {
  return (
    <SectionGate anyOf={["careers.applications"]}>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />}>
        <FromLink />
      </Suspense>
    </SectionGate>
  );
}

/** `?jobId=` (from a role's Applications link) sets the starting role filter. */
function FromLink() {
  const jobId = useSearchParams().get("jobId") ?? "";
  return <Applications key={jobId} initialJobId={jobId} />;
}

function Applications({ initialJobId }: { initialJobId: string }) {
  const [jobId, setJobId] = useState(initialJobId);
  const [status, setStatus] = useState<"all" | ApplicationStatus>("all");
  const [query, setQuery] = useState("");

  const jobs = useApi<{ jobs: JobSummary[] }>("/jobs").data?.jobs ?? [];
  const { data, loading, error } = useApi<{ applications: ApplicationSummary[] }>(
    `/applications${jobId ? `?jobId=${encodeURIComponent(jobId)}` : ""}`,
  );
  const all = data?.applications ?? [];

  const q = query.trim().toLowerCase();
  const matching = all.filter(
    (a) => !q || `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) || a.email.includes(q),
  );
  const visible = status === "all" ? matching : matching.filter((a) => a.status === status);
  const count = (s: "all" | ApplicationStatus) => (s === "all" ? matching.length : matching.filter((a) => a.status === s).length);

  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="What people send from the careers page, newest first." />

      {error && (
        <div role="status" className="anim-drop text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
          <label htmlFor="application-role" className="sr-only">
            Role
          </label>
          <select id="application-role" value={jobId} onChange={(e) => setJobId(e.target.value)} className={`${INPUT} px-3 w-full sm:w-64`}>
            <option value="">Every role</option>
            <option value="general">General résumés</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
                {j.status !== "published" ? ` (${j.status === "draft" ? "draft" : "closed"})` : ""}
              </option>
            ))}
          </select>
          <div className="relative ml-auto w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
            <label htmlFor="application-search" className="sr-only">
              Search applicants
            </label>
            <input
              id="application-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email"
              className={`${INPUT} w-full pl-8 pr-3`}
            />
          </div>
          <div role="tablist" aria-label="Filter by status" className="flex w-full flex-wrap gap-1">
            {(["all", ...APPLICATION_STATUSES] as const).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={status === s}
                onClick={() => setStatus(s)}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  status === s
                    ? "bg-neutral-900 text-white dark:bg-neutral-700"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {s === "all" ? "All" : APPLICATION_STATUS_LABELS[s]}
                <span className="ml-1.5 text-xs opacity-70">{count(s)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
              <tr>
                <th scope="col" className="text-left px-4 py-2 font-medium">Applicant</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Applied for</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Status</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Received</th>
              </tr>
            </thead>
            <tbody key={`${jobId}-${status}-${loading}`} className="anim-fade">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800 animate-pulse">
                    <td colSpan={4} className="px-4 py-4">
                      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                    </td>
                  </tr>
                ))
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400">
                    {all.length === 0
                      ? "No applications yet. They appear here as soon as someone applies on the careers page."
                      : "No applications match."}
                  </td>
                </tr>
              ) : (
                visible.map((a) => (
                  <tr key={a.id} className="border-t border-neutral-100 dark:border-neutral-800">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/careers/applications/${a.id}`} className="font-medium hover:underline">
                        {a.firstName} {a.lastName}
                      </Link>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{a.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {a.jobTitle || (
                        <span className="text-neutral-600 dark:text-neutral-400">General résumé{a.areaOfInterest && `: ${a.areaOfInterest}`}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ApplicationStatusPill status={a.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                      {new Date(a.submittedAt).toLocaleDateString()}
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
