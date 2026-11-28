"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import { MOVED_PAGES, RETIRED_URLS } from "@/lib/moved-pages.mjs";

/** A redirect made here. */
type Redirect = {
  id: string;
  from: string;
  to: string;
  note: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

/** A retired service page's redirect, set in its editor. */
type PageRedirect = { pageId: string; title: string; from: string; to: string; updatedAt: string; updatedBy: string };

/** A page a redirect may send visitors to. */
type Target = { path: string; title: string; kind: "code" | "dashboard" };

type Data = { redirects: Redirect[]; pageRedirects: PageRedirect[]; targets: Target[] };

const CARD = "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900";
const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm disabled:opacity-60";
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600";
const SECONDARY =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800";

// Redirects written in next.config.mjs run before the dashboard's, so one
// made here for the same address would never be used.
const CODE_REDIRECTS: Record<string, string> = { ...RETIRED_URLS, ...MOVED_PAGES };

const tidy = (path: string) => path.trim().replace(/^https?:\/\/(www\.)?devaicon\.com/i, "").replace(/(.)\/+$/, "$1").toLowerCase();

export default function RedirectsPage() {
  return (
    <SectionGate anyOf={["services.manage"]}>
      <Redirects />
    </SectionGate>
  );
}

function Redirects() {
  const { data, error, loading, reload } = useApi<Data>("/redirects");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const targets = data?.targets ?? [];
  const codeClash = from.trim() ? CODE_REDIRECTS[tidy(from)] : undefined;
  const fromTarget = targets.find((t) => t.path === tidy(from));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    if (
      fromTarget &&
      !confirm(
        `${tidy(from)} is a live page (“${fromTarget.title}”). Redirecting it takes it off the site and out of the sitemap: visitors and search engines go to ${tidy(to)} instead.\n\nMove anything worth keeping there first. Redirect it?`,
      )
    ) {
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await api<{ redirect: Redirect; repointed: number }>("/redirects", { method: "POST", body: { from, to, note } });
    setBusy(false);
    if (!res.ok || !res.data) {
      setMsg({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return;
    }
    const { redirect, repointed } = res.data;
    setFrom("");
    setTo("");
    setNote("");
    setMsg({
      kind: "ok",
      text:
        `${redirect.from} now redirects to ${redirect.to} (301).` +
        (repointed > 0 ? ` ${repointed} redirect${repointed === 1 ? " that went" : "s that went"} to ${redirect.from} now go${repointed === 1 ? "es" : ""} straight to ${redirect.to}.` : "") +
        " Update links on the site that point to the old address.",
    });
    reload();
  }

  async function remove(r: Redirect) {
    if (!confirm(`Remove the redirect from ${r.from}? That address will show whatever is there again, or “page not found”.`)) return;
    const res = await api(`/redirects/${r.id}`, { method: "DELETE" });
    setMsg(res.ok ? { kind: "ok", text: `Removed the redirect from ${r.from}.` } : { kind: "error", text: res.message ?? "Something went wrong." });
    reload();
  }

  const match = (r: { from: string; to: string }) => !q || r.from.includes(q.toLowerCase()) || r.to.includes(q.toLowerCase());
  const own = (data?.redirects ?? []).filter(match);
  const pages = (data?.pageRedirects ?? []).filter(match);
  const code = Object.entries(CODE_REDIRECTS)
    .map(([f, t]) => ({ from: f, to: t }))
    .filter(match);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Redirects"
        description="Send an old address to the page that replaced it with a permanent (301) redirect: a page written in code moving to a page built here, a renamed page, or an old URL that's still in Google."
      />

      <datalist id="redirect-targets">
        {targets.map((t) => (
          <option key={t.path} value={t.path}>
            {t.title}
          </option>
        ))}
      </datalist>

      <form onSubmit={add} className={`${CARD} space-y-4 p-5`} aria-labelledby="add-heading">
        <h2 id="add-heading" className="text-sm font-semibold">
          Add a redirect
        </h2>
        <div className="grid items-start gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <label htmlFor="r-from" className="mb-1 block text-xs font-medium">
              Old address
            </label>
            <input
              id="r-from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={busy}
              list="redirect-targets"
              placeholder="/industries/retail"
              className={INPUT}
            />
          </div>
          <ArrowRight className="mt-8 hidden h-4 w-4 text-neutral-400 md:block" aria-hidden />
          <div>
            <label htmlFor="r-to" className="mb-1 block text-xs font-medium">
              Send visitors to
            </label>
            <input
              id="r-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={busy}
              list="redirect-targets"
              placeholder="/services/retail-technology"
              className={INPUT}
            />
          </div>
        </div>
        <div>
          <label htmlFor="r-note" className="mb-1 block text-xs font-medium">
            Note (optional)
          </label>
          <input
            id="r-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={busy}
            maxLength={300}
            placeholder="Why, e.g. “Rebuilt in the dashboard; SEO report 28 Nov”"
            className={INPUT}
          />
        </div>
        {codeClash && (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {tidy(from)} already redirects to {codeClash} in the site&apos;s code, which takes priority over this list. A developer has to change that one.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Move anything worth keeping into the new page first. The target must be a live page that doesn&apos;t redirect itself. Service pages built here can
            also be redirected from their editor.
          </p>
          <button type="submit" disabled={busy || !from.trim() || !to.trim() || Boolean(codeClash)} className={PRIMARY}>
            {busy ? "Adding…" : "Add redirect"}
          </button>
        </div>
      </form>

      {(msg || error) && (
        <div
          role="status"
          className={`rounded-md border px-3 py-2 text-sm ${
            msg?.kind === "ok"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
          }`}
        >
          {msg?.text ?? error}
        </div>
      )}

      <div>
        <label htmlFor="r-search" className="sr-only">
          Filter redirects
        </label>
        <input id="r-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by address…" className={`${INPUT} max-w-sm`} />
      </div>

      <section className={CARD} aria-labelledby="own-heading">
        <h2 id="own-heading" className="border-b border-neutral-200 px-5 py-3 text-sm font-semibold dark:border-neutral-800">
          Redirects <span className="font-normal text-neutral-500">({own.length})</span>
        </h2>
        {loading ? (
          <div className="m-5 h-12 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
        ) : own.length === 0 ? (
          <p className="px-5 py-4 text-sm text-neutral-500 dark:text-neutral-400">{q ? "None match." : "No redirects yet."}</p>
        ) : (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {own.map((r) =>
              editing === r.id ? (
                <EditRow key={r.id} r={r} onDone={(text) => { setEditing(null); if (text) setMsg({ kind: "ok", text }); reload(); }} />
              ) : (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[13px]">
                      <span className="break-all">{r.from}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-label="redirects to" />
                      <a href={r.to} target="_blank" rel="noopener" className="break-all underline">
                        {r.to}
                      </a>
                    </div>
                    <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {r.note && <span>{r.note} · </span>}
                      {r.updatedBy || r.createdBy}, {new Date(r.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(r.id)} className={SECONDARY}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                      Edit
                    </button>
                    <button onClick={() => remove(r)} className={`${SECONDARY} text-red-600 dark:text-red-400`}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Remove
                    </button>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      <section className={CARD} aria-labelledby="pages-heading">
        <h2 id="pages-heading" className="border-b border-neutral-200 px-5 py-3 text-sm font-semibold dark:border-neutral-800">
          Retired service pages <span className="font-normal text-neutral-500">({pages.length})</span>
          <span className="block text-xs font-normal text-neutral-500 dark:text-neutral-400">Set in each page&apos;s editor, under Redirect.</span>
        </h2>
        {pages.length === 0 ? (
          <p className="px-5 py-4 text-sm text-neutral-500 dark:text-neutral-400">None.</p>
        ) : (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {pages.map((p) => (
              <li key={p.pageId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[13px]">
                  <span className="break-all">{p.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-label="redirects to" />
                  <span className="break-all">{p.to}</span>
                </div>
                <Link href={`/dashboard/services/${p.pageId}`} className={SECONDARY}>
                  Open page
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className={CARD}>
        <summary className="cursor-pointer px-5 py-3 text-sm font-semibold">
          In the site&apos;s code <span className="font-normal text-neutral-500">({code.length})</span>
          <span className="block text-xs font-normal text-neutral-500 dark:text-neutral-400">Older redirects in next.config.mjs. Only a developer can change these.</span>
        </summary>
        <ul className="divide-y divide-neutral-100 border-t border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {code.map((r) => (
            <li key={r.from} className="flex flex-wrap items-center gap-2 px-5 py-2.5 font-mono text-[13px]">
              <span className="break-all">{r.from}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-label="redirects to" />
              <span className="break-all">{r.to}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

/** One redirect with its target and note open for editing; the old address stays. */
function EditRow({ r, onDone }: { r: Redirect; onDone: (text?: string) => void }) {
  const [to, setTo] = useState(r.to);
  const [note, setNote] = useState(r.note);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await api<{ redirect: Redirect }>(`/redirects/${r.id}`, { method: "PATCH", body: { to, note } });
    setBusy(false);
    if (!res.ok || !res.data) {
      setErr(res.message ?? "Something went wrong.");
      return;
    }
    onDone(`${r.from} now redirects to ${res.data.redirect.to}.`);
  }

  return (
    <li className="px-5 py-3">
      <form onSubmit={save} className="space-y-2">
        <div className="font-mono text-[13px]">{r.from}</div>
        <div className="grid gap-2 md:grid-cols-2">
          <input value={to} onChange={(e) => setTo(e.target.value)} list="redirect-targets" aria-label="Send visitors to" disabled={busy} className={INPUT} />
          <input value={note} onChange={(e) => setNote(e.target.value)} aria-label="Note" maxLength={300} placeholder="Note" disabled={busy} className={INPUT} />
        </div>
        {err && <p className="text-xs text-red-600 dark:text-red-400">{err}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={busy || !to.trim()} className={SECONDARY}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={() => onDone()} disabled={busy} className={SECONDARY}>
            Cancel
          </button>
        </div>
      </form>
    </li>
  );
}
