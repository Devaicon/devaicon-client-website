import type { PostStatus } from "@/lib/blog/types";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

/** Draft, scheduled (with when) or published (with when). */
export default function StatusPill({
  status,
  publishedAt,
}: {
  status: PostStatus;
  publishedAt: string;
}) {
  const due = status === "scheduled" && publishedAt && new Date(publishedAt) <= new Date();
  if (status === "published" || due) {
    return (
      <span className="inline-flex flex-col">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden />
          Published
        </span>
        {publishedAt && <span className="text-xs text-neutral-500">{fmt(publishedAt)}</span>}
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span className="inline-flex flex-col">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden />
          Scheduled
        </span>
        <span className="text-xs text-neutral-500">{fmt(publishedAt)}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" aria-hidden />
      Draft
    </span>
  );
}
