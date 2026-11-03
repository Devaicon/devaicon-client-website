"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleX,
  Download,
  Eye,
  ExternalLink,
  FileDown,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import type { AdminServicePage, ServicePageStatus, ServicePageSummary } from "@/lib/service-pages/managed";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import IconButton from "@/components/dashboard/IconButton";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import { downloadFile } from "@/components/careers-admin/jobFile";
import { ServicePageStatusPill } from "@/components/service-pages-admin/ServicePageEditor";
import AiPromptDialog from "@/components/service-pages-admin/AiPromptDialog";
import {
  buildServicePagesJson,
  parseServicePagesFile,
  sampleServicePageJson,
  servicePagesFileName,
  toFields,
} from "@/components/service-pages-admin/pageFile";

// Far more than a file of pages needs; anything bigger is the wrong file.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const JSON_TYPE = "application/json";

/** How one imported page, or a file that couldn't be read, went. */
type ImportOutcome = { file: string; id?: string; title?: string; warnings: string[]; error?: string };

const FILTERS: { key: "all" | ServicePageStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Live" },
  { key: "draft", label: "Drafts" },
];

export default function ServicePagesPage() {
  return (
    <SectionGate anyOf={["services.manage"]}>
      <ServicePages />
    </SectionGate>
  );
}

function ServicePages() {
  const router = useRouter();
  const { data, loading, error, reload } = useApi<{ pages: ServicePageSummary[] }>("/service-pages");
  const pages = data?.pages ?? [];
  const [filter, setFilter] = useState<"all" | ServicePageStatus>("all");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<"import" | "export" | null>(null);
  const [imported, setImported] = useState<ImportOutcome[] | null>(null);
  const [prompting, setPrompting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const visible = pages.filter(
    (p) => (filter === "all" || p.status === filter) && (!q || p.title.toLowerCase().includes(q) || p.slug.includes(q)),
  );
  const count = (k: "all" | ServicePageStatus) => (k === "all" ? pages.length : pages.filter((p) => p.status === k).length);

  /** The pages on screen (the filter and search apply), as one file. */
  async function exportVisible() {
    setBusy("export");
    setMsg(null);
    const res = await api<{ pages: AdminServicePage[] }>("/service-pages?full=1");
    setBusy(null);
    if (!res.ok || !res.data) {
      setMsg(res.message ?? "The pages couldn't be read for export.");
      return;
    }
    const byId = new Map(res.data.pages.map((p) => [p.id, p]));
    const full = visible.map((p) => byId.get(p.id)).filter((p): p is AdminServicePage => Boolean(p));
    downloadFile(servicePagesFileName(), buildServicePagesJson(full.map(toFields)), JSON_TYPE);
  }

  async function exportOne(p: ServicePageSummary) {
    const res = await api<{ page: AdminServicePage }>(`/service-pages/${p.id}`);
    if (!res.ok || !res.data) {
      setMsg(res.message ?? null);
      return;
    }
    downloadFile(servicePagesFileName(p), buildServicePagesJson([toFields(res.data.page)]), JSON_TYPE);
  }

  /**
   * Every page in every file becomes a new draft. The results stay on screen,
   * since what had to change is worth reading before publishing.
   */
  async function importFiles(files: File[]) {
    if (files.length === 0) return;
    setBusy("import");
    setMsg(null);
    setImported(null);
    const outcomes: ImportOutcome[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        outcomes.push({ file: file.name, warnings: [], error: "It's over 4 MB." });
        continue;
      }
      const text = await file.text().catch(() => "");
      const result = parseServicePagesFile(file.name, text);
      if (!result.ok || !result.pages) {
        outcomes.push({ file: file.name, warnings: [], error: result.message });
        continue;
      }
      for (const [i, parsed] of result.pages.entries()) {
        const res = await api<{ page: AdminServicePage }>("/service-pages", { method: "POST", body: parsed.fields });
        // File-wide notes (skipped pages) go with its first page.
        const warnings = i === 0 ? [...(result.warnings ?? []), ...parsed.warnings] : parsed.warnings;
        outcomes.push(
          res.ok && res.data
            ? { file: file.name, id: res.data.page.id, title: res.data.page.title, warnings }
            : { file: file.name, title: parsed.fields.title, warnings: [], error: res.message },
        );
      }
    }
    setBusy(null);
    setImported(outcomes);
    reload();
  }

  async function remove(p: ServicePageSummary) {
    const live = p.status === "published" ? " It will disappear from the site, and its address will stop working." : "";
    if (!confirm(`Delete “${p.title}” for good?${live}`)) return;
    const res = await api(`/service-pages/${p.id}`, { method: "DELETE" });
    if (!res.ok) setMsg(res.message ?? null);
    reload();
  }

  const ok = imported?.filter((o) => o.id).length ?? 0;
  const failed = imported?.filter((o) => !o.id).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service pages"
        description="Pages about what we offer, built from content blocks and published at /services/…"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPrompting(true)}
              title="A prompt for your own AI agent that writes a page file you can import"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
              AI prompt
            </button>
            <button
              onClick={() => downloadFile("service-page-sample.json", sampleServicePageJson(), JSON_TYPE)}
              title="An example page in the format Import expects"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              Sample file
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy !== null}
              title="Bring in pages from JSON files. Each one becomes a new draft."
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" aria-hidden />
              {busy === "import" ? "Importing…" : "Import"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              multiple
              className="hidden"
              onChange={(e) => {
                importFiles([...(e.target.files ?? [])]);
                e.target.value = "";
              }}
            />
            <button
              onClick={exportVisible}
              disabled={busy !== null || visible.length === 0}
              title={visible.length === 0 ? "No pages to export" : "The pages the filter and search show, as one JSON file"}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden />
              {busy === "export" ? "Exporting…" : `Export ${visible.length || ""}`.trim()}
            </button>
            <Link
              href="/dashboard/services/new"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
            >
              <Plus className="h-4 w-4" aria-hidden />
              New page
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
              {ok} page{ok === 1 ? "" : "s"} imported as drafts
              {failed > 0 && `, ${failed} not imported`}
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
                    <Link href={`/dashboard/services/${o.id}`} className="font-medium hover:underline">
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
            <label htmlFor="service-search" className="sr-only">
              Search service pages
            </label>
            <input
              id="service-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or URL"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pl-8 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
              <tr>
                <th scope="col" className="text-left px-4 py-2 font-medium">Page</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Status</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Blocks</th>
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
                    {pages.length === 0
                      ? "No service pages yet. Start one with New page, or use AI prompt and Import."
                      : "No pages match."}
                  </td>
                </tr>
              ) : (
                visible.map((p) => (
                  <tr key={p.id} className="border-t border-neutral-100 dark:border-neutral-800">
                    <td className="px-4 py-3 max-w-md">
                      <Link href={`/dashboard/services/${p.id}`} className="font-medium hover:underline">
                        {p.title}
                      </Link>
                      <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">/services/{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ServicePageStatusPill status={p.status} noindex={p.noindex} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-400">{p.blockCount}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                      {new Date(p.updatedAt).toLocaleDateString()}
                      {p.updatedBy && <span className="block text-xs">by {p.updatedBy}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconButton icon={Pencil} label="Edit" onClick={() => router.push(`/dashboard/services/${p.id}`)} />
                        <IconButton icon={Eye} label="Preview" onClick={() => window.open(`/services/preview/${p.id}`, "_blank", "noopener")} />
                        <IconButton icon={Download} label="Export as JSON" onClick={() => exportOne(p)} />
                        <IconButton
                          icon={ExternalLink}
                          label="View on site"
                          onClick={() => window.open(`/services/${p.slug}`, "_blank", "noopener")}
                          disabled={p.status !== "published"}
                          disabledReason="Not on the site yet"
                        />
                        <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => remove(p)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {prompting && (
        <AiPromptDialog
          livePages={pages.filter((p) => p.status === "published" && !p.noindex)}
          onClose={() => setPrompting(false)}
        />
      )}
    </div>
  );
}
