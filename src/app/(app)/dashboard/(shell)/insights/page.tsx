"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { can } from "@/lib/types";
import type { PostStatus, PostSummary } from "@/lib/blog/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import IconButton from "@/components/dashboard/IconButton";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import StatusPill from "@/components/blog-editor/StatusPill";

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
            <button
              onClick={newPost}
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
              {creating ? "Creating…" : "New post"}
            </button>
          )
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
