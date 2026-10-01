"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, Download, Eye, Lock, Send, Trash2, Undo2 } from "lucide-react";
import { can } from "@/lib/types";
import type { AdminPost, Author, Category, Cta, Seo, TocSettings } from "@/lib/blog/types";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import RichEditor from "./RichEditor";
import StatusPill from "./StatusPill";
import { buildPostFile, downloadJson, postFileName } from "./postFile";
import { CtaPanel, DetailsPanel, FaqPanel, HeroPanel, INPUT, Panel, SeoPanel, SocialPanel, TocPanel } from "./panels";

// The fields the editor owns and sends on save.
const EDITABLE = [
  "title",
  "subtitle",
  "slug",
  "categoryId",
  "tags",
  "authorId",
  "heroImage",
  "body",
  "faqs",
  "closingCtaId",
  "toc",
  "seo",
  "featured",
] as const;

function slugify(v: string) {
  return v
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** `YYYY-MM-DDTHH:mm` in local time, for a datetime-local input. */
function toLocalInput(iso: string) {
  const d = iso ? new Date(iso) : new Date(Date.now() + 24 * 3600 * 1000);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export default function PostEditor({ id }: { id: string }) {
  const router = useRouter();
  const { me } = useDashboardSession();
  const postRes = useApi<{ post: AdminPost }>(`/posts/${id}`);
  const authors = useApi<{ items: Author[] }>("/authors").data?.items ?? [];
  const categories = useApi<{ items: Category[] }>("/categories").data?.items ?? [];
  const ctas = useApi<{ items: Cta[] }>("/ctas").data?.items ?? [];

  const [draft, setDraft] = useState<AdminPost | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [scheduleAt, setScheduleAt] = useState("");
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Take the server's copy once per post; later reloads must not clobber
  // edits. (Adjusting state while rendering, as React documents for this.)
  const serverPost = postRes.data?.post ?? null;
  if (serverPost && loadedFor !== serverPost.id) {
    setLoadedFor(serverPost.id);
    setDraft(serverPost);
    setScheduleAt(toLocalInput(serverPost.status === "scheduled" ? serverPost.publishedAt : ""));
  }

  const canWrite = can(me, "posts.write");
  const canPublish = can(me, "posts.publish");
  const canDelete = can(me, "posts.delete");
  // A live or scheduled post is what readers see (or will): editing it is publishing.
  const readOnly = !draft || !canWrite || (draft.status !== "draft" && !canPublish);

  const set = useCallback((patch: Partial<AdminPost>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setDirty(true);
  }, []);
  const setSeo = (patch: Partial<Seo>) => draft && set({ seo: { ...draft.seo, ...patch } });
  const setToc = (patch: Partial<TocSettings>) => draft && set({ toc: { ...draft.toc, ...patch } });

  const save = useCallback(async (): Promise<boolean> => {
    if (!draft) return false;
    setBusy("save");
    setNote(null);
    const body = Object.fromEntries(EDITABLE.map((k) => [k, draft[k]]));
    const res = await api<{ post: AdminPost }>(`/posts/${draft.id}`, { method: "PATCH", body });
    setBusy(null);
    if (!res.ok) {
      setNote({ kind: "error", text: res.message });
      return false;
    }
    // Keep the editor's own document; take everything else from the server
    // (normalised slug, tags, reading time).
    setDraft((d) => (d ? { ...res.data.post, body: d.body } : res.data.post));
    setDirty(false);
    setNote({ kind: "ok", text: "Saved." });
    return true;
  }, [draft]);

  async function transition(action: "publish" | "unpublish", publishAt?: string) {
    if (!draft) return;
    if (dirty && !readOnly && !(await save())) return;
    setBusy(action);
    const res = await api<{ post: AdminPost }>(`/posts/${draft.id}/${action}`, {
      method: "POST",
      body: publishAt ? { publishAt } : {},
    });
    setBusy(null);
    if (!res.ok) {
      setNote({ kind: "error", text: res.message });
      return;
    }
    setDraft((d) => (d ? { ...d, status: res.data.post.status, publishedAt: res.data.post.publishedAt } : d));
    setNote({
      kind: "ok",
      text:
        res.data.post.status === "scheduled"
          ? `Scheduled for ${new Date(res.data.post.publishedAt).toLocaleString()}.`
          : action === "publish"
            ? "Published. It's live on the site."
            : "Unpublished. It's back to a draft and off the site.",
    });
  }

  async function remove() {
    if (!draft || !confirm(`Delete “${draft.title}” for good?`)) return;
    const res = await api(`/posts/${draft.id}`, { method: "DELETE" });
    if (!res.ok) {
      setNote({ kind: "error", text: res.message });
      return;
    }
    router.push("/dashboard/insights");
  }

  async function preview() {
    if (!draft) return;
    // Opened first, while this still counts as the click, so it isn't blocked.
    const win = window.open("", "_blank");
    if (dirty && !readOnly && !(await save())) {
      win?.close();
      return;
    }
    if (win) win.location.href = `/insights/preview/${draft.id}`;
  }

  // What's on screen, unsaved edits included.
  function exportFile() {
    if (!draft) return;
    try {
      downloadJson(postFileName(draft), buildPostFile(draft, { authors, categories, ctas }));
    } catch {
      setNote({ kind: "error", text: "This post couldn't be written to a file." });
    }
  }

  // Ctrl/Cmd+S saves; leaving with unsaved changes asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !readOnly) save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, readOnly, save]);

  if (postRes.error) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center">
        <p className="font-medium">{postRes.error}</p>
        <Link href="/dashboard/insights" className="mt-3 inline-block text-sm underline">
          Back to posts
        </Link>
      </div>
    );
  }
  if (!draft) {
    return <div className="h-96 animate-pulse rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />;
  }

  const live = draft.status === "published" || (draft.status === "scheduled" && new Date(draft.publishedAt) <= new Date());
  const scheduleDate = scheduleAt ? new Date(scheduleAt) : null;
  const scheduleInFuture = Boolean(scheduleDate && scheduleDate > new Date());

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 px-3 py-2 backdrop-blur">
        <Link href="/dashboard/insights" className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Posts
        </Link>
        <StatusPill status={draft.status} publishedAt={draft.publishedAt} />
        <span aria-live="polite" className="text-xs text-neutral-500">
          {busy === "save" ? "Saving…" : dirty ? "Unsaved changes" : note?.kind === "ok" ? note.text : ""}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportFile}
            title="Download this post as a JSON file, unsaved changes included"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export
          </button>
          <button type="button" onClick={preview} className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <Eye className="h-4 w-4" aria-hidden />
            Preview
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={save}
              disabled={!dirty || busy !== null}
              className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-1.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-40"
            >
              {live ? "Update" : "Save draft"}
            </button>
          )}
        </div>
      </div>

      {note?.kind === "error" && (
        <div role="alert" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
          {note.text}
        </div>
      )}
      {readOnly && (
        <p className="flex items-center gap-2 rounded-md bg-neutral-100 dark:bg-neutral-800/60 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Lock className="h-4 w-4 shrink-0" aria-hidden />
          {!canWrite
            ? "You can view this post but not edit it."
            : "This post is live or scheduled. Only someone who can publish may edit it."}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        {/* Writing column */}
        <div className="min-w-0 space-y-4">
          <div className="space-y-2">
            <label htmlFor="post-title" className="sr-only">
              Title
            </label>
            <textarea
              id="post-title"
              rows={1}
              value={draft.title}
              disabled={readOnly}
              maxLength={200}
              placeholder="Post title"
              onChange={(e) => set({ title: e.target.value.replace(/\n/g, " ") })}
              className="w-full resize-none bg-transparent text-3xl font-bold leading-tight tracking-tight focus:outline-none [field-sizing:content] disabled:opacity-80"
            />
            <label htmlFor="post-subtitle" className="sr-only">
              Subtitle
            </label>
            <textarea
              id="post-subtitle"
              rows={2}
              value={draft.subtitle}
              disabled={readOnly}
              maxLength={600}
              placeholder="Subtitle: one or two sentences on what the reader gets"
              onChange={(e) => set({ subtitle: e.target.value })}
              className="w-full resize-none bg-transparent text-lg text-neutral-600 dark:text-neutral-400 focus:outline-none [field-sizing:content] disabled:opacity-80"
            />
          </div>
          <RichEditor
            key={draft.id}
            content={draft.body}
            ctas={ctas}
            editable={!readOnly}
            onChange={(body) => set({ body })}
          />
        </div>

        {/* Settings column */}
        <div className="space-y-3">
          <Panel title="Publish">
            <dl className="grid grid-cols-[6rem_1fr] gap-y-1 text-xs">
              <dt className="text-neutral-500">Status</dt>
              <dd>
                <StatusPill status={draft.status} publishedAt={draft.publishedAt} />
              </dd>
              <dt className="text-neutral-500">Reading time</dt>
              <dd>{draft.readingMinutes} min (updates on save)</dd>
              <dt className="text-neutral-500">Last edit</dt>
              <dd>
                {new Date(draft.updatedAt).toLocaleString()}
                {draft.updatedBy && ` by ${draft.updatedBy}`}
              </dd>
            </dl>

            {canPublish ? (
              <div className="space-y-2">
                {!live && (
                  <button
                    type="button"
                    onClick={() => transition("publish")}
                    disabled={busy !== null}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" aria-hidden />
                    {busy === "publish" ? "Publishing…" : "Publish now"}
                  </button>
                )}
                {!live && (
                  <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-2.5 space-y-2">
                    <label htmlFor="schedule-at" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {draft.status === "scheduled" ? "Change the scheduled time" : "Or schedule it for"}
                    </label>
                    <input id="schedule-at" type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className={INPUT} />
                    <button
                      type="button"
                      onClick={() => scheduleDate && transition("publish", scheduleDate.toISOString())}
                      disabled={busy !== null || !scheduleInFuture}
                      title={!scheduleInFuture ? "Pick a time in the future" : undefined}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40"
                    >
                      <CalendarClock className="h-4 w-4" aria-hidden />
                      {draft.status === "scheduled" ? "Reschedule" : "Schedule"}
                    </button>
                  </div>
                )}
                {draft.status !== "draft" && (
                  <button
                    type="button"
                    onClick={() => transition("unpublish")}
                    disabled={busy !== null}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                  >
                    <Undo2 className="h-4 w-4" aria-hidden />
                    {draft.status === "scheduled" && !live ? "Cancel schedule" : "Unpublish"}
                  </button>
                )}
                {live && (
                  <a href={`/insights/${draft.slug}`} target="_blank" rel="noopener" className="block text-center text-xs text-neutral-600 underline dark:text-neutral-400">
                    View on the site
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Someone who can publish will need to put this live.</p>
            )}

            {canDelete && (
              <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:underline">
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Delete post
              </button>
            )}
          </Panel>

          <DetailsPanel post={draft} set={set} authors={authors} categories={categories} disabled={readOnly} onRegenerateSlug={() => set({ slug: slugify(draft.title) })} />
          <HeroPanel post={draft} set={set} disabled={readOnly} />
          <SeoPanel post={draft} setSeo={setSeo} disabled={readOnly} />
          <SocialPanel post={draft} setSeo={setSeo} disabled={readOnly} />
          <TocPanel post={draft} setToc={setToc} disabled={readOnly} />
          <FaqPanel faqs={draft.faqs} setFaqs={(faqs) => set({ faqs })} disabled={readOnly} />
          <CtaPanel post={draft} set={set} ctas={ctas} disabled={readOnly} />
        </div>
      </div>
    </div>
  );
}
