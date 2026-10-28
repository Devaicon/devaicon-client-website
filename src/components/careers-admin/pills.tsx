import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  type JobStatus,
} from "@/lib/careers/types";

const JOB: Record<JobStatus, { label: string; dot: string; text: string }> = {
  draft: { label: "Draft", dot: "bg-neutral-400", text: "text-neutral-600 dark:text-neutral-400" },
  published: { label: "Open", dot: "bg-green-500", text: "text-green-700 dark:text-green-400" },
  closed: { label: "Closed", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
};

/** Draft, Open (published and taking applications) or Closed. */
export function JobStatusPill({ status }: { status: JobStatus }) {
  const s = JOB[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  );
}

const APPLICATION: Record<ApplicationStatus, string> = {
  new: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  reviewing: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  shortlisted: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  rejected: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  hired: "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300",
};

export function ApplicationStatusPill({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${APPLICATION[status]}`}>
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
