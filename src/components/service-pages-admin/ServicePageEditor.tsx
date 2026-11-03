"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check as CheckIcon, Download, ExternalLink, Eye, Lock, Plus, Send, Trash2, Undo2, X } from "lucide-react";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import { Panel } from "@/components/blog-editor/panels";
import { ImageSourceInput } from "@/components/blog-editor/ImagePicker";
import Toggle from "@/components/time-logger/settings/Toggle";
import { downloadFile } from "@/components/careers-admin/jobFile";
import { BLOCK_BY_TYPE, PARENTS, blankBlock, blockGaps, isSafeUrl, type Block } from "@/lib/service-pages/blocks";
import type { AdminServicePage, ServicePageContent, ServicePageStatus, ServiceSeo } from "@/lib/service-pages/managed";
import { DESCRIPTION_IDEAL, TITLE_IDEAL, searchDescription, searchTitle, seoChecks, shareImage } from "@/lib/service-pages/seo";
import { BlockCard, BlockPicker, Field, FieldInput, INPUT } from "./BlockFields";
import { buildServicePagesJson, servicePagesFileName, toFields } from "./pageFile";

const CARD = "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900";

const BLANK_SEO: ServiceSeo = {
  metaTitle: "",
  metaDescription: "",
  focusKeyphrase: "",
  keywords: [],
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  noindex: false,
};

const BLANK: ServicePageContent = {
  title: "",
  slug: "",
  label: "",
  icon: "sparkles",
  subtitle: "",
  heroImage: "",
  heroButtonText: "Talk to an expert",
  heroButtonLink: "/contact-us",
  parent: "/whatwedo",
  serviceType: "",
  areaServed: "",
  seo: BLANK_SEO,
  blocks: [blankBlock("richText")],
};

const newKey = () => crypto.randomUUID();

/** Draft, or Live; a live page hidden from search says so. */
export function ServicePageStatusPill({ status, noindex = false }: { status: ServicePageStatus; noindex?: boolean }) {
  const live = status === "published";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${live ? "text-green-700 dark:text-green-400" : "text-neutral-600 dark:text-neutral-400"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-green-500" : "bg-neutral-400"}`} aria-hidden />
      {live ? "Live" : "Draft"}
      {noindex && <span className="font-normal text-amber-700 dark:text-amber-400">· noindex</span>}
    </span>
  );
}

function Counter({ value, ideal }: { value: string; ideal: readonly [number, number] }) {
  const n = value.length;
  const tone = n === 0 ? "text-neutral-400" : n < ideal[0] || n > ideal[1] ? "text-amber-600" : "text-green-600";
  return <span className={`text-[11px] tabular-nums ${tone}`}>{n}/{ideal[1]}</span>;
}

/** Keywords typed as a comma-separated line; the text is kept as typed. */
function KeywordsInput({ value, onChange, disabled }: { value: string[]; onChange: (v: string[]) => void; disabled: boolean }) {
  const [text, setText] = useState(value.join(", "));
  return (
    <input
      id="seo-keywords"
      value={text}
      disabled={disabled}
      placeholder="cloud migration, aws migration, …"
      onChange={(e) => {
        setText(e.target.value);
        onChange([...new Set(e.target.value.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean))].slice(0, 20));
      }}
      className={INPUT}
    />
  );
}

/** `/dashboard/services/new` starts a blank page; any other id loads one. */
export default function ServicePageEditorPage({ id }: { id: string }) {
  if (id === "new") return <ServicePageEditor page={null} />;
  return <LoadPage id={id} />;
}

function LoadPage({ id }: { id: string }) {
  const { data, error } = useApi<{ page: AdminServicePage }>(`/service-pages/${id}`);
  if (error) {
    return (
      <div className={`${CARD} p-8 text-center`}>
        <p className="font-medium">{error}</p>
        <Link href="/dashboard/services" className="mt-3 inline-block text-sm underline">
          Back to service pages
        </Link>
      </div>
    );
  }
  if (!data) return <div className={`h-96 animate-pulse ${CARD}`} />;
  return <ServicePageEditor key={data.page.id} page={data.page} />;
}

function ServicePageEditor({ page: initial }: { page: AdminServicePage | null }) {
  const router = useRouter();
  const [page, setPage] = useState<AdminServicePage | null>(initial);
  const [form, setForm] = useState<ServicePageContent>(initial ? toFields(initial) : BLANK);
  // Keys for the blocks, in step with form.blocks, so each keeps its inputs
  // when the list is reordered. A save renews them: the server may have
  // tidied what was typed, and every input then starts from what it kept.
  const [keys, setKeys] = useState<string[]>(() => form.blocks.map(newKey));
  const [open, setOpen] = useState<Set<string>>(() => new Set(initial ? [] : keys));
  const [picker, setPicker] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const status: ServicePageStatus = page?.status ?? "draft";
  const slugLocked = Boolean(page?.publishedAt);
  const disabled = busy !== null;

  const set = (patch: Partial<ServicePageContent>) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  };
  const setSeo = (patch: Partial<ServiceSeo>) => {
    setForm((f) => ({ ...f, seo: { ...f.seo, ...patch } }));
    setDirty(true);
  };
  const setBlocks = (blocks: Block[], nextKeys: string[]) => {
    setForm((f) => ({ ...f, blocks }));
    setKeys(nextKeys);
    setDirty(true);
  };
  const toggle = (key: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  function insert(type: string, at: number) {
    const key = newKey();
    const blocks = [...form.blocks];
    const nextKeys = [...keys];
    blocks.splice(at, 0, blankBlock(type));
    nextKeys.splice(at, 0, key);
    setBlocks(blocks, nextKeys);
    setOpen((s) => new Set(s).add(key));
    setPicker(null);
  }
  function moveBlock(from: number, to: number) {
    const blocks = [...form.blocks];
    const nextKeys = [...keys];
    blocks.splice(to, 0, blocks.splice(from, 1)[0]);
    nextKeys.splice(to, 0, nextKeys.splice(from, 1)[0]);
    setBlocks(blocks, nextKeys);
  }
  function duplicate(i: number) {
    const key = newKey();
    setBlocks(
      [...form.blocks.slice(0, i + 1), structuredClone(form.blocks[i]), ...form.blocks.slice(i + 1)],
      [...keys.slice(0, i + 1), key, ...keys.slice(i + 1)],
    );
    setOpen((s) => new Set(s).add(key));
  }
  function removeBlock(i: number) {
    const label = BLOCK_BY_TYPE[form.blocks[i].type]?.label ?? "block";
    if (!confirm(`Delete this ${label} block?`)) return;
    setBlocks(
      form.blocks.filter((_, j) => j !== i),
      keys.filter((_, j) => j !== i),
    );
  }

  /** Saves, creating the page on its first save. Returns the saved page. */
  const save = useCallback(async (): Promise<AdminServicePage | null> => {
    setBusy("save");
    setNote(null);
    const body = toFields(form);
    const res = page
      ? await api<{ page: AdminServicePage }>(`/service-pages/${page.id}`, { method: "PATCH", body })
      : await api<{ page: AdminServicePage }>("/service-pages", { method: "POST", body });
    setBusy(null);
    if (!res.ok || !res.data) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return null;
    }
    const saved = res.data.page;
    const savedKeys = saved.blocks.map(newKey);
    setPage(saved);
    setForm(toFields(saved));
    setKeys(savedKeys);
    // Keep open the blocks that were open, by position.
    setOpen((s) => new Set(savedKeys.filter((_, i) => s.has(keys[i]))));
    setDirty(false);
    setNote({ kind: "ok", text: page ? (saved.status === "published" ? "Saved. The live page is updated." : "Saved.") : "Saved as a draft." });
    if (!page) router.replace(`/dashboard/services/${saved.id}`);
    return saved;
  }, [form, page, keys, router]);

  async function transition(action: "publish" | "unpublish") {
    let target = page;
    if (!target || dirty) target = await save();
    if (!target) return;
    setBusy(action);
    const res = await api<{ page: AdminServicePage }>(`/service-pages/${target.id}/${action}`, { method: "POST", body: {} });
    setBusy(null);
    if (!res.ok || !res.data) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return;
    }
    setPage(res.data.page);
    setNote({
      kind: "ok",
      text:
        action === "publish"
          ? `Published at /services/${res.data.page.slug}. It's in the sitemap unless it's hidden from search.`
          : "Unpublished. It's back to a draft and off the site.",
    });
  }

  async function preview() {
    // Opened before saving, so the browser treats it as the click's own window.
    const win = window.open("", "_blank");
    let target = page;
    if (!target || dirty) target = await save();
    if (!target) {
      win?.close();
      return;
    }
    if (win) win.location.href = `/services/preview/${target.id}`;
  }

  async function remove() {
    if (!page) return;
    const live = page.status === "published" ? " It will disappear from the site." : "";
    if (!confirm(`Delete “${page.title}” for good?${live}`)) return;
    const res = await api(`/service-pages/${page.id}`, { method: "DELETE" });
    if (!res.ok) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return;
    }
    router.push("/dashboard/services");
  }

  // Ctrl/Cmd+S saves; leaving with unsaved changes asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !busy) save();
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
  }, [dirty, busy, save]);

  const checks = seoChecks(form);
  const passed = checks.filter((c) => c.ok).length;
  const scoreTone =
    passed === checks.length
      ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
      : passed >= checks.length * 0.6
        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
        : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300";
  const blocksNeedingWork = form.blocks.filter((b) => blockGaps(b).length > 0).length;
  const used = new Set(form.blocks.map((b) => b.type));

  const button = "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50";
  const secondary = `${button} border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/services" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Service pages
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <ServicePageStatusPill status={status} noindex={form.seo.noindex} />
          {dirty && <span className="text-amber-700 dark:text-amber-400">Unsaved changes</span>}
        </div>
      </div>

      {note && (
        <div
          role="status"
          className={`anim-drop rounded-md border px-3 py-2 text-sm ${
            note.kind === "ok"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
          }`}
        >
          {note.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <section className={`${CARD} space-y-4 p-5`} aria-labelledby="hero-heading">
            <h2 id="hero-heading" className="text-sm font-semibold">
              Hero
            </h2>
            <Field label="Page title (H1)" htmlFor="page-title" extra={<span className="text-[11px] tabular-nums text-neutral-400">{form.title.length}/120</span>}>
              <input
                id="page-title"
                value={form.title}
                onChange={(e) => set({ title: e.target.value })}
                disabled={disabled}
                maxLength={120}
                placeholder="e.g. Cloud Migration Services"
                className={`${INPUT} text-base font-semibold`}
              />
            </Field>
            <Field label="Subtitle" htmlFor="page-subtitle" hint="One or two sentences under the title. Also the meta description when that's left empty.">
              <textarea id="page-subtitle" value={form.subtitle} onChange={(e) => set({ subtitle: e.target.value })} disabled={disabled} maxLength={400} rows={2} className={INPUT} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Label (optional)" htmlFor="page-label" hint="Small text above the title.">
                <input id="page-label" value={form.label} onChange={(e) => set({ label: e.target.value })} disabled={disabled} maxLength={60} placeholder="e.g. Cloud & Infrastructure" className={INPUT} />
              </Field>
              <FieldInput field={{ key: "icon", label: "Icon", kind: "icon" }} value={form.icon} onChange={(v) => set({ icon: String(v) })} disabled={disabled} />
              <Field label="Button text" htmlFor="page-button">
                <input id="page-button" value={form.heroButtonText} onChange={(e) => set({ heroButtonText: e.target.value })} disabled={disabled} maxLength={40} className={INPUT} />
              </Field>
              <FieldInput
                field={{ key: "heroButtonLink", label: "Button link", kind: "url", required: true }}
                value={form.heroButtonLink}
                onChange={(v) => set({ heroButtonLink: String(v) })}
                disabled={disabled}
              />
            </div>
            <FieldInput
              field={{ key: "heroImage", label: "Background image", kind: "image", hint: "Shown faintly behind the hero, and shared on social media unless a share image is set." }}
              value={form.heroImage}
              onChange={(v) => set({ heroImage: String(v) })}
              disabled={disabled}
            />
          </section>

          <section aria-labelledby="blocks-heading" className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="blocks-heading" className="text-sm font-semibold">
                Content blocks <span className="font-normal text-neutral-500">({form.blocks.length})</span>
              </h2>
              <div className="flex gap-3 text-xs">
                <button type="button" className="text-neutral-600 hover:underline dark:text-neutral-400" onClick={() => setOpen(new Set(keys))}>
                  Expand all
                </button>
                <button type="button" className="text-neutral-600 hover:underline dark:text-neutral-400" onClick={() => setOpen(new Set())}>
                  Collapse all
                </button>
              </div>
            </div>
            {form.blocks.map((block, i) => (
              <BlockCard
                key={keys[i]}
                block={block}
                index={i}
                total={form.blocks.length}
                open={open.has(keys[i])}
                onToggle={() => toggle(keys[i])}
                onChange={(b) => setBlocks(form.blocks.map((x, j) => (j === i ? b : x)), keys)}
                onMove={(to) => moveBlock(i, to)}
                onDuplicate={() => duplicate(i)}
                onInsertBelow={() => setPicker(i + 1)}
                onRemove={() => removeBlock(i)}
                disabled={disabled}
              />
            ))}
            <button
              type="button"
              onClick={() => setPicker(form.blocks.length)}
              disabled={disabled}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 py-4 text-sm font-medium text-neutral-600 hover:border-violet-400 hover:bg-violet-50/40 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-violet-950/20"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add a block
            </button>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <section className={`${CARD} space-y-3 p-4`}>
            <button
              onClick={() => save()}
              disabled={disabled || (!dirty && Boolean(page))}
              className={`${button} w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600`}
            >
              {busy === "save" ? "Saving…" : page ? "Save" : "Save draft"}
            </button>
            {status === "draft" ? (
              <button onClick={() => transition("publish")} disabled={disabled} className={`${secondary} w-full`}>
                <Send className="h-4 w-4" aria-hidden />
                {busy === "publish" ? "Publishing…" : "Publish"}
              </button>
            ) : (
              <button onClick={() => transition("unpublish")} disabled={disabled} className={`${secondary} w-full`}>
                <Undo2 className="h-4 w-4" aria-hidden />
                {busy === "unpublish" ? "Unpublishing…" : "Unpublish"}
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={preview} disabled={disabled} className={secondary}>
                <Eye className="h-4 w-4" aria-hidden />
                Preview
              </button>
              <button
                onClick={() => downloadFile(servicePagesFileName(form), buildServicePagesJson([form]), "application/json")}
                disabled={disabled}
                title="Download this page, as it is in the editor, as a JSON file"
                className={secondary}
              >
                <Download className="h-4 w-4" aria-hidden />
                Export
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {status === "published"
                ? `Live since ${new Date(page!.publishedAt).toLocaleDateString()}. Saving updates the live page straight away.`
                : blocksNeedingWork > 0
                  ? `${blocksNeedingWork} block${blocksNeedingWork === 1 ? " needs" : "s need"} finishing before publishing (marked ⚠).`
                  : "Only people with dashboard access can see a draft. Preview shows it with the real template."}
            </p>
            {page && status === "published" && (
              <a href={`/services/${page.slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm hover:underline">
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                View on site
              </a>
            )}
          </section>

          <Panel title="Address">
            <Field
              label="Page address"
              htmlFor="page-slug"
              hint={slugLocked ? undefined : page ? "Lowercase letters, numbers and hyphens. Put the focus keyphrase in it." : "Made from the title when left empty."}
            >
              <div className="flex items-center gap-1 text-sm">
                <span className="shrink-0 text-neutral-500">/services/</span>
                <input
                  id="page-slug"
                  value={form.slug}
                  onChange={(e) => set({ slug: e.target.value.toLowerCase() })}
                  disabled={disabled || slugLocked}
                  maxLength={100}
                  className={INPUT}
                />
              </div>
            </Field>
            {slugLocked && (
              <p className="flex gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Lock className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                Fixed now that the page has been published, so links and search results keep working.
              </p>
            )}
            <Field label="Breadcrumb parent" htmlFor="page-parent" hint="Where the page sits in the trail above its title and in search results' breadcrumbs.">
              <select id="page-parent" value={form.parent} onChange={(e) => set({ parent: e.target.value })} disabled={disabled} className={INPUT}>
                {PARENTS.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </Panel>

          <Panel title="SEO" badge={<span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${scoreTone}`}>{passed}/{checks.length}</span>}>
            <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3" aria-label="Search result preview">
              <div className="text-[11px] text-neutral-500">devaicon.com › services › {form.slug || "…"}</div>
              <div className="mt-0.5 line-clamp-1 text-[15px] text-[#1a0dab] dark:text-[#8ab4f8]">{searchTitle(form) || "Page title"}</div>
              <div className="mt-0.5 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">{searchDescription(form) || "Add a meta description."}</div>
            </div>
            <Field label="Focus keyphrase" htmlFor="seo-key" hint="The search people should find this page with.">
              <input id="seo-key" value={form.seo.focusKeyphrase} disabled={disabled} maxLength={100} onChange={(e) => setSeo({ focusKeyphrase: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Search title (meta title)" htmlFor="seo-title" hint="Leave empty to use the page title. The brand is added when it fits." extra={<Counter value={searchTitle(form)} ideal={TITLE_IDEAL} />}>
              <input id="seo-title" value={form.seo.metaTitle} placeholder={form.title} disabled={disabled} maxLength={120} onChange={(e) => setSeo({ metaTitle: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Meta description" htmlFor="seo-desc" hint="Leave empty to use the subtitle." extra={<Counter value={searchDescription(form)} ideal={DESCRIPTION_IDEAL} />}>
              <textarea id="seo-desc" rows={3} value={form.seo.metaDescription} placeholder={form.subtitle} disabled={disabled} maxLength={320} onChange={(e) => setSeo({ metaDescription: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Keywords" htmlFor="seo-keywords" hint="Separated by commas. Sent as the keywords meta tag.">
              <KeywordsInput key={page?.updatedAt ?? "new"} value={form.seo.keywords} disabled={disabled} onChange={(keywords) => setSeo({ keywords })} />
            </Field>

            <ul className="space-y-1.5" aria-label="SEO checks">
              {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-xs">
                  {c.ok ? (
                    <CheckIcon className="mt-px h-3.5 w-3.5 shrink-0 text-green-600" aria-label="Done" />
                  ) : (
                    <X className="mt-px h-3.5 w-3.5 shrink-0 text-amber-600" aria-label="To do" />
                  )}
                  <span className={c.ok ? "text-neutral-500" : "text-neutral-800 dark:text-neutral-200"}>{c.label}</span>
                </li>
              ))}
            </ul>

            <details className="group" open={Boolean(form.seo.canonicalUrl || form.seo.noindex)}>
              <summary className="cursor-pointer text-xs font-medium text-neutral-600 dark:text-neutral-400">Advanced</summary>
              <div className="mt-3 space-y-4">
                <Field
                  label="Canonical URL"
                  htmlFor="seo-canonical"
                  hint={
                    isSafeUrl(form.seo.canonicalUrl)
                      ? `Leave empty to use this page's own address (/services/${form.slug || "…"}). Set it only when the same content lives at another address that should rank instead.`
                      : "Start with / for a page on this site, or https:// for another site."
                  }
                >
                  <input
                    id="seo-canonical"
                    value={form.seo.canonicalUrl}
                    disabled={disabled}
                    placeholder={`/services/${form.slug || "…"}`}
                    onChange={(e) => setSeo({ canonicalUrl: e.target.value.trim() })}
                    className={`${INPUT} ${isSafeUrl(form.seo.canonicalUrl) ? "" : "border-red-400 dark:border-red-700"}`}
                  />
                </Field>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">Hide from search engines</div>
                    <div className="text-[11px] text-neutral-500">Adds noindex, follow and leaves it out of the sitemap and llms.txt.</div>
                  </div>
                  <Toggle checked={form.seo.noindex} onChange={(v) => setSeo({ noindex: v })} label="Hide from search engines" disabled={disabled} />
                </div>
              </div>
            </details>
          </Panel>

          <Panel title="Social sharing" defaultOpen={false}>
            <div className="overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800" aria-label="Link preview">
              {shareImage(form) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shareImage(form)} alt="" className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center bg-neutral-100 text-xs text-neutral-500 dark:bg-neutral-800">No image</div>
              )}
              <div className="p-2.5">
                <div className="text-[11px] uppercase text-neutral-500">devaicon.com</div>
                <div className="line-clamp-1 text-sm font-semibold">{form.seo.ogTitle || searchTitle(form)}</div>
                <div className="line-clamp-2 text-xs text-neutral-500">{form.seo.ogDescription || searchDescription(form)}</div>
              </div>
            </div>
            <Field label="Share title (og:title)" htmlFor="og-title" hint="Leave empty to use the search title.">
              <input id="og-title" value={form.seo.ogTitle} disabled={disabled} maxLength={120} onChange={(e) => setSeo({ ogTitle: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Share description (og:description)" htmlFor="og-desc" hint="Leave empty to use the meta description.">
              <textarea id="og-desc" rows={2} value={form.seo.ogDescription} disabled={disabled} maxLength={320} onChange={(e) => setSeo({ ogDescription: e.target.value })} className={INPUT} />
            </Field>
            {!disabled && (
              <Field label="Share image (og:image)" hint="1200 × 630 works everywhere. Leave empty to use the hero image.">
                <ImageSourceInput value={form.seo.ogImage} onChange={(url) => setSeo({ ogImage: url })} />
              </Field>
            )}
          </Panel>

          <Panel title="Structured data" defaultOpen={false}>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Service, BreadcrumbList and (with an FAQs block) FAQPage data are added to the page for search engines.
            </p>
            <Field label="Service type" htmlFor="sd-type" hint="What the service is, in a few words, e.g. Cloud migration.">
              <input id="sd-type" value={form.serviceType} disabled={disabled} maxLength={120} onChange={(e) => set({ serviceType: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Area served" htmlFor="sd-area" hint="Where the service is offered. Leave empty for the UAE.">
              <input id="sd-area" value={form.areaServed} disabled={disabled} maxLength={80} placeholder="United Arab Emirates" onChange={(e) => set({ areaServed: e.target.value })} className={INPUT} />
            </Field>
          </Panel>

          {page && (
            <button onClick={remove} disabled={disabled} className={`${button} w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50`}>
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete page
            </button>
          )}
        </aside>
      </div>

      {picker !== null && <BlockPicker used={used} onPick={(type) => insert(type, picker)} onClose={() => setPicker(null)} />}
    </div>
  );
}
