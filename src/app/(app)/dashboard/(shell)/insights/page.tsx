"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleX,
  Download,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { can } from "@/lib/types";
import type { AdminPost, PostStatus, PostSummary } from "@/lib/blog/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import IconButton from "@/components/dashboard/IconButton";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import StatusPill from "@/components/blog-editor/StatusPill";
import {
  buildPostFile,
  downloadJson,
  loadLibrary,
  parsePostFile,
  postFileName,
} from "@/components/blog-editor/postFile";

// Generous for one post: bodies are capped well below this on save.
const MAX_FILE_BYTES = 2 * 1024 * 1024;

/** How one imported file went. */
type ImportOutcome = { file: string; id?: string; title?: string; warnings: string[]; error?: string };

const FILTERS: { key: "all" | PostStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
];

export default function PostsPage() {
  return (
    <SectionGate anyOf={["posts.write", "posts.publish", "posts.delete"]}>
      <Posts />
    </SectionGate>
  );
}

function Posts() {
  const router = useRouter();
  const { me } = useDashboardSession();
  const { data, loading, error, reload } = useApi<{ posts: PostSummary[] }>("/posts");
  const posts = data?.posts ?? [];
  const [filter, setFilter] = useState<"all" | PostStatus>("all");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<ImportOutcome[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const visible = posts.filter(
    (p) =>
      (filter === "all" || p.status === filter) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        p.slug.includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))),
  );
  const count = (k: "all" | PostStatus) =>
    k === "all" ? posts.length : posts.filter((p) => p.status === k).length;

  async function newPost() {
    setCreating(true);
    const res = await api<{ post: { id: string } }>("/posts", {
      method: "POST",
      body: { title: "Untitled post" },
    });
    setCreating(false);
    if (!res.ok) {
      setMsg(res.message);
      return;
    }
    router.push(`/dashboard/insights/${res.data.post.id}`);
  }

  /**
   * Each file becomes a new draft. One clean file opens straight in the
   * editor; otherwise the results stay on screen, since what couldn't be
   * matched is worth reading before opening anything.
   */
  async function importFiles(files: File[]) {
    if (files.length === 0) return;
    setImporting(true);
    setMsg(null);
    setImported(null);
    const lib = await loadLibrary();
    if (!lib.ok) {
      setImporting(false);
      setMsg(lib.message);
      return;
    }
    const outcomes: ImportOutcome[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        outcomes.push({ file: file.name, warnings: [], error: "It's over 2 MB." });
        continue;
      }
      const json = await file.text().catch(() => "");
      const result = parsePostFile(json, lib.library);
      if (!result.ok) {
        outcomes.push({ file: file.name, warnings: [], error: result.message });
        continue;
      }
      const res = await api<{ post: { id: string; title: string } }>("/posts", {
        method: "POST",
        body: result.parsed.fields,
      });
      outcomes.push(
        res.ok
          ? { file: file.name, id: res.data.post.id, title: res.data.post.title, warnings: result.parsed.warnings }
          : { file: file.name, warnings: [], error: res.message },
      );
    }
    setImporting(false);
    const only = outcomes[0];
    if (outcomes.length === 1 && only.id && only.warnings.length === 0) {
      router.push(`/dashboard/insights/${only.id}`);
      return;
    }
    setImported(outcomes);
    reload();
  }

  async function exportPost(p: PostSummary) {
    const [res, lib] = await Promise.all([api<{ post: AdminPost }>(`/posts/${p.id}`), loadLibrary()]);
    if (!res.ok || !lib.ok) {
      setMsg(res.message ?? lib.message);
      return;
    }
    try {
      downloadJson(postFileName(res.data.post), buildPostFile(res.data.post, lib.library));
    } catch {
      setMsg(`“${p.title}” couldn't be written to a file.`);
    }
  }

  async function remove(p: PostSummary) {
    const live = p.status !== "draft";
    if (
      !confirm(
        `Delete “${p.title}” for good?${live ? " It is live now and will disappear from the site." : ""}`,
      )
    ) {
      return;
    }
    const res = await api(`/posts/${p.id}`, { method: "DELETE" });
    if (!res.ok) setMsg(res.message);
    reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts"
        description="Articles for the Insights section of the site."
        actions={
          can(me, "posts.write") && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={importing}
                title="Bring in posts from JSON files. Each one becomes a new draft."
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" aria-hidden />
                {importing ? "Importing…" : "Import"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                multiple
                className="hidden"
                onChange={(e) => {
                  importFiles([...(e.target.files ?? [])]);
                  e.target.value = "";
                }}
              />
              <button
                onClick={newPost}
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" aria-hidden />
                {creating ? "Creating…" : "New post"}
              </button>
            </div>
          )
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
              {imported.filter((o) => o.id).length} of {imported.length} file{imported.length === 1 ? "" : "s"} imported
              as drafts
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
          <ul className="anim-stagger divide-y divide-neutral-100 dark:divide-neutral-800">
            {imported.map((o, i) => (
              <li key={i} className="flex items-start gap-2.5 px-4 py-3 text-sm">
                {o.id ? (
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Imported" />
                ) : (
                  <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-label="Not imported" />
                )}
                <div className="min-w-0 flex-1">
                  {o.id ? (
                    <Link href={`/dashboard/insights/${o.id}`} className="font-medium hover:underline">
                      {o.title}
                    </Link>
                  ) : (
                    <span className="font-medium">{o.file}</span>
                  )}
                  <p className={`text-xs ${o.id ? "text-neutral-500 dark:text-neutral-400" : "text-red-600 dark:text-red-400"}`}>
                    {o.id ? o.file : `Not imported. ${o.error}`}
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
            <label htmlFor="post-search" className="sr-only">
              Search posts
            </label>
            <input
              id="post-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, URL or tag"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pl-8 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
              <tr>
                <th scope="col" className="text-left px-4 py-2 font-medium">Post</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Status</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Author</th>
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
                    {posts.length === 0 ? "No posts yet. Start one with New post." : "No posts match."}
                  </td>
                </tr>
              ) : (
                visible.map((p) => {
                  const live = p.status === "published" || (p.status === "scheduled" && new Date(p.publishedAt) <= new Date());
                  return (
                    <tr key={p.id} className="border-t border-neutral-100 dark:border-neutral-800">
                      <td className="px-4 py-3 max-w-md">
                        <Link href={`/dashboard/insights/${p.id}`} className="font-medium hover:underline">
                          {p.featured && (
                            <Star className="mr-1 inline h-3.5 w-3.5 -translate-y-px fill-amber-400 text-amber-400" aria-label="Featured" />
                          )}
                          {p.title}
                        </Link>
                        <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                          /insights/{p.slug}
                          {p.category && <> · {p.category.name}</>}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusPill status={p.status} publishedAt={p.publishedAt} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{p.author?.name ?? <span className="text-neutral-400">None</span>}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                        {new Date(p.updatedAt).toLocaleDateString()}
                        {p.updatedBy && <span className="block text-xs">by {p.updatedBy}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <IconButton icon={Pencil} label="Edit" onClick={() => router.push(`/dashboard/insights/${p.id}`)} />
                          <IconButton icon={Download} label="Export as JSON" onClick={() => exportPost(p)} />
                          <IconButton
                            icon={ExternalLink}
                            label="View on site"
                            onClick={() => window.open(`/insights/${p.slug}`, "_blank", "noopener")}
                            disabled={!live}
                            disabledReason="Not live yet"
                          />
                          {can(me, "posts.delete") && (
                            <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => remove(p)} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
