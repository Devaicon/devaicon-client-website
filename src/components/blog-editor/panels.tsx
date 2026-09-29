"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Check as CheckIcon, ChevronDown, Plus, Trash2, X } from "lucide-react";
import type { AdminPost, Author, Category, Cta, Faq, Seo, TocSettings } from "@/lib/blog/types";
import { collectHeadings } from "@/lib/blog/toc";
import Toggle from "@/components/time-logger/settings/Toggle";
import { ImageSourceInput } from "./ImagePicker";
import { DESCRIPTION_IDEAL, TITLE_IDEAL, seoChecks } from "./seo";

export const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm disabled:opacity-60";
const LABEL = "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";

/** A collapsible card in the editor's side column. */
export function Panel({
  title,
  badge,
  defaultOpen = true,
  children,
}: {
  title: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold"
        >
          <span className="flex-1">{title}</span>
          {badge}
          <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open ? "" : "-rotate-90"}`} aria-hidden />
        </button>
      </h2>
      {open && (
        <div id={id} className="anim-drop space-y-4 border-t border-neutral-100 dark:border-neutral-800 px-4 py-4">
          {children}
        </div>
      )}
    </section>
  );
}

function Counter({ value, ideal }: { value: string; ideal: readonly [number, number] }) {
  const n = value.length;
  const tone = n === 0 ? "text-neutral-400" : n < ideal[0] || n > ideal[1] ? "text-amber-600" : "text-green-600";
  return <span className={`text-[11px] tabular-nums ${tone}`}>{n}/{ideal[1]}</span>;
}

function Field({ label, htmlFor, hint, extra, children }: { label: string; htmlFor: string; hint?: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className={LABEL}>
          {label}
        </label>
        {extra}
      </div>
      {children}
      {hint && <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ Details */

export function DetailsPanel({
  post,
  set,
  authors,
  categories,
  disabled,
  onRegenerateSlug,
}: {
  post: AdminPost;
  set: (patch: Partial<AdminPost>) => void;
  authors: Author[];
  categories: Category[];
  disabled: boolean;
  onRegenerateSlug: () => void;
}) {
  const [tagText, setTagText] = useState(post.tags.join(", "));
  return (
    <Panel title="Details">
      <Field
        label="URL"
        htmlFor="post-slug"
        hint={
          post.publishedAt
            ? "This post has been public. If you change the URL, the old one keeps working and redirects here."
            : undefined
        }
        extra={
          !disabled && (
            <button type="button" onClick={onRegenerateSlug} className="text-[11px] text-neutral-500 underline hover:text-neutral-900 dark:hover:text-neutral-100">
              From title
            </button>
          )
        }
      >
        <div className="flex items-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-sm">
          <span className="pl-3 text-neutral-500 whitespace-nowrap">/insights/</span>
          <input
            id="post-slug"
            value={post.slug}
            disabled={disabled}
            onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
            className="min-w-0 flex-1 rounded-r-md bg-white dark:bg-neutral-900 px-2 py-2 disabled:opacity-60"
          />
        </div>
      </Field>

      <Field label="Author" htmlFor="post-author" hint={authors.length === 0 ? "Add authors in the Blog library first." : undefined}>
        <select id="post-author" value={post.authorId} disabled={disabled} onChange={(e) => set({ authorId: e.target.value })} className={INPUT}>
          <option value="">Choose an author…</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
              {a.jobTitle ? ` — ${a.jobTitle}` : ""}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Category" htmlFor="post-category">
        <select id="post-category" value={post.categoryId} disabled={disabled} onChange={(e) => set({ categoryId: e.target.value })} className={INPUT}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tags" htmlFor="post-tags" hint="Separate with commas.">
        <input
          id="post-tags"
          value={tagText}
          disabled={disabled}
          onChange={(e) => {
            setTagText(e.target.value);
            set({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) });
          }}
          placeholder="e.g. Agentic AI, Customer Experience"
          className={INPUT}
        />
      </Field>

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium">Feature this post</div>
          <div className="text-[11px] text-neutral-500">Shown in Featured on the Insights page (up to 3).</div>
        </div>
        <Toggle checked={post.featured} onChange={(v) => set({ featured: v })} label="Feature this post" disabled={disabled} />
      </div>
    </Panel>
  );
}

/* --------------------------------------------------------------- Hero image */

export function HeroPanel({ post, set, disabled }: { post: AdminPost; set: (p: Partial<AdminPost>) => void; disabled: boolean }) {
  return (
    <Panel title="Hero image">
      {disabled ? (
        post.heroImage.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.heroImage.url} alt="" className="h-36 w-full rounded-md object-cover" />
        ) : (
          <p className="text-sm text-neutral-500">None</p>
        )
      ) : (
        <ImageSourceInput value={post.heroImage.url} onChange={(url) => set({ heroImage: { ...post.heroImage, url } })} />
      )}
      <Field label="Alt text" htmlFor="hero-alt" hint="What the image shows. Required to publish when there's an image.">
        <input
          id="hero-alt"
          value={post.heroImage.alt}
          disabled={disabled}
          maxLength={200}
          onChange={(e) => set({ heroImage: { ...post.heroImage, alt: e.target.value } })}
          className={INPUT}
        />
      </Field>
    </Panel>
  );
}

/* ---------------------------------------------------------------------- SEO */

export function SeoPanel({ post, setSeo, disabled }: { post: AdminPost; setSeo: (p: Partial<Seo>) => void; disabled: boolean }) {
  const checks = seoChecks(post);
  const passed = checks.filter((c) => c.ok).length;
  const title = post.seo.metaTitle || post.title;
  const description = post.seo.metaDescription || post.subtitle;
  const tone = passed === checks.length ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300" : passed >= checks.length * 0.6 ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300";

  return (
    <Panel title="SEO" badge={<span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}>{passed}/{checks.length}</span>}>
      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3" aria-label="Search result preview">
        <div className="text-[11px] text-neutral-500">devaicon.com › insights › {post.slug}</div>
        <div className="mt-0.5 line-clamp-1 text-[15px] text-[#1a0dab] dark:text-[#8ab4f8]">{title || "Post title"}</div>
        <div className="mt-0.5 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">{description || "Add a meta description."}</div>
      </div>

      <Field label="Focus keyphrase" htmlFor="seo-key" hint="The search people should find this post with.">
        <input id="seo-key" value={post.seo.focusKeyphrase} disabled={disabled} maxLength={100} onChange={(e) => setSeo({ focusKeyphrase: e.target.value })} className={INPUT} />
      </Field>
      <Field label="Search title" htmlFor="seo-title" hint="Leave empty to use the post title." extra={<Counter value={title} ideal={TITLE_IDEAL} />}>
        <input id="seo-title" value={post.seo.metaTitle} placeholder={post.title} disabled={disabled} maxLength={120} onChange={(e) => setSeo({ metaTitle: e.target.value })} className={INPUT} />
      </Field>
      <Field label="Meta description" htmlFor="seo-desc" hint="Leave empty to use the subtitle." extra={<Counter value={description} ideal={DESCRIPTION_IDEAL} />}>
        <textarea id="seo-desc" rows={3} value={post.seo.metaDescription} placeholder={post.subtitle} disabled={disabled} maxLength={320} onChange={(e) => setSeo({ metaDescription: e.target.value })} className={INPUT} />
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

      <details className="group">
        <summary className="cursor-pointer text-xs font-medium text-neutral-600 dark:text-neutral-400">Advanced</summary>
        <div className="mt-3 space-y-4">
          <Field label="Canonical URL" htmlFor="seo-canonical" hint="Only if this post first appeared elsewhere. Leave empty otherwise.">
            <input id="seo-canonical" value={post.seo.canonicalUrl} disabled={disabled} placeholder="https://…" onChange={(e) => setSeo({ canonicalUrl: e.target.value })} className={INPUT} />
          </Field>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Hide from search engines</div>
              <div className="text-[11px] text-neutral-500">Adds noindex and leaves it out of the sitemap.</div>
            </div>
            <Toggle checked={post.seo.noindex} onChange={(v) => setSeo({ noindex: v })} label="Hide from search engines" disabled={disabled} />
          </div>
        </div>
      </details>
    </Panel>
  );
}

/* ------------------------------------------------------------------- Social */

export function SocialPanel({ post, setSeo, disabled }: { post: AdminPost; setSeo: (p: Partial<Seo>) => void; disabled: boolean }) {
  const image = post.seo.ogImage || post.heroImage.url;
  return (
    <Panel title="Social sharing" defaultOpen={false}>
      <div className="overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800" aria-label="Link preview">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-32 w-full object-cover" />
        ) : (
          <div className="flex h-32 items-center justify-center bg-neutral-100 text-xs text-neutral-500 dark:bg-neutral-800">No image</div>
        )}
        <div className="p-2.5">
          <div className="text-[11px] uppercase text-neutral-500">devaicon.com</div>
          <div className="line-clamp-1 text-sm font-semibold">{post.seo.ogTitle || post.seo.metaTitle || post.title}</div>
          <div className="line-clamp-2 text-xs text-neutral-500">{post.seo.ogDescription || post.seo.metaDescription || post.subtitle}</div>
        </div>
      </div>
      <Field label="Share title" htmlFor="og-title" hint="Leave empty to use the search title.">
        <input id="og-title" value={post.seo.ogTitle} disabled={disabled} maxLength={120} onChange={(e) => setSeo({ ogTitle: e.target.value })} className={INPUT} />
      </Field>
      <Field label="Share description" htmlFor="og-desc">
        <textarea id="og-desc" rows={2} value={post.seo.ogDescription} disabled={disabled} maxLength={320} onChange={(e) => setSeo({ ogDescription: e.target.value })} className={INPUT} />
      </Field>
      {!disabled && (
        <div>
          <div className={LABEL}>Share image (leave empty to use the hero image)</div>
          <ImageSourceInput value={post.seo.ogImage} onChange={(url) => setSeo({ ogImage: url })} />
        </div>
      )}
    </Panel>
  );
}

/* -------------------------------------------------------- Table of contents */

export function TocPanel({ post, setToc, disabled }: { post: AdminPost; setToc: (p: Partial<TocSettings>) => void; disabled: boolean }) {
  const headings = collectHeadings(post.body).filter((h) => h.level <= post.toc.depth);
  const labels = new Map(post.toc.labels.map((l) => [l.id, l.text]));

  function rename(id: string, text: string) {
    const next = post.toc.labels.filter((l) => l.id !== id);
    if (text.trim()) next.push({ id, text });
    setToc({ labels: next });
  }

  return (
    <Panel title="Table of contents" defaultOpen={false} badge={<span className="text-[11px] text-neutral-500">{post.toc.enabled ? `${headings.length} entries` : "Off"}</span>}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-medium">Show a table of contents</div>
        <Toggle checked={post.toc.enabled} onChange={(v) => setToc({ enabled: v })} label="Show a table of contents" disabled={disabled} />
      </div>
      {post.toc.enabled && (
        <>
          <Field label="Include" htmlFor="toc-depth">
            <select id="toc-depth" value={post.toc.depth} disabled={disabled} onChange={(e) => setToc({ depth: Number(e.target.value) === 2 ? 2 : 3 })} className={INPUT}>
              <option value={2}>H2 headings only</option>
              <option value={3}>H2 and H3 headings</option>
            </select>
          </Field>
          <Field label="Heading" htmlFor="toc-title">
            <input id="toc-title" value={post.toc.title} disabled={disabled} maxLength={60} onChange={(e) => setToc({ title: e.target.value })} className={INPUT} />
          </Field>
          <div>
            <div className={LABEL}>Entries (built from your headings; rename any below)</div>
            {headings.length < 2 ? (
              <p className="text-xs text-neutral-500">Add at least two headings to the post and they&apos;ll appear here. It&apos;s hidden until then.</p>
            ) : (
              <ol className="space-y-1.5">
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                    <label htmlFor={`toc-${h.id}`} className="sr-only">
                      Entry for {h.text}
                    </label>
                    <input
                      id={`toc-${h.id}`}
                      value={labels.get(h.id) ?? ""}
                      placeholder={h.text}
                      disabled={disabled}
                      maxLength={120}
                      onChange={(e) => rename(h.id, e.target.value)}
                      className="w-full rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-xs disabled:opacity-60"
                    />
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      )}
    </Panel>
  );
}

/* --------------------------------------------------------------------- FAQs */

export function FaqPanel({ faqs, setFaqs, disabled }: { faqs: Faq[]; setFaqs: (f: Faq[]) => void; disabled: boolean }) {
  const update = (i: number, patch: Partial<Faq>) => setFaqs(faqs.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...faqs];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setFaqs(next);
  };
  return (
    <Panel title="FAQs" defaultOpen={false} badge={<span className="text-[11px] text-neutral-500">{faqs.length}</span>}>
      <p className="text-[11px] text-neutral-500">Shown under the article and marked up as FAQ structured data. Unfinished pairs aren&apos;t saved.</p>
      {faqs.map((f, i) => (
        <div key={i} className="space-y-2 rounded-md border border-neutral-200 dark:border-neutral-800 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Question {i + 1}</span>
            {!disabled && (
              <span className="flex gap-0.5">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" className="rounded p-1 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" disabled={i === faqs.length - 1} onClick={() => move(i, 1)} aria-label="Move down" className="rounded p-1 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} aria-label="Remove question" className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
          </div>
          <input aria-label={`Question ${i + 1}`} value={f.question} disabled={disabled} maxLength={300} placeholder="Question" onChange={(e) => update(i, { question: e.target.value })} className={INPUT} />
          <textarea aria-label={`Answer ${i + 1}`} rows={3} value={f.answer} disabled={disabled} maxLength={2000} placeholder="Answer" onChange={(e) => update(i, { answer: e.target.value })} className={INPUT} />
        </div>
      ))}
      {!disabled && faqs.length < 30 && (
        <button type="button" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="inline-flex items-center gap-1 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800">
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add a question
        </button>
      )}
    </Panel>
  );
}

/* --------------------------------------------------------------------- CTAs */

export function CtaPanel({ post, set, ctas, disabled }: { post: AdminPost; set: (p: Partial<AdminPost>) => void; ctas: Cta[]; disabled: boolean }) {
  const chosen = ctas.find((c) => c.id === post.closingCtaId);
  return (
    <Panel title="Calls to action" defaultOpen={false}>
      <Field label="At the end of the post" htmlFor="closing-cta">
        <select id="closing-cta" value={post.closingCtaId} disabled={disabled} onChange={(e) => set({ closingCtaId: e.target.value })} className={INPUT}>
          <option value="">None</option>
          {ctas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      {chosen && (
        <div className="rounded-md bg-neutral-50 dark:bg-neutral-800/60 p-3 text-xs">
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{chosen.heading}</div>
          {chosen.body && <div className="text-neutral-600 dark:text-neutral-400">{chosen.body}</div>}
          <div className="mt-1 text-neutral-500">
            Button: {chosen.buttonLabel} → {chosen.buttonUrl}
          </div>
        </div>
      )}
      <p className="text-[11px] text-neutral-500">
        To place one inside the article, use the megaphone button in the editor&apos;s toolbar. CTAs are edited in the Blog library, and changes reach every post using them.
      </p>
    </Panel>
  );
}
