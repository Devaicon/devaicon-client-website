import type { Metadata } from "next";
import { anchorFor, type Heading } from "@/lib/blog/toc";
import { brandedTitle, metaDescription } from "@/lib/seo";
import { BLOCK_BY_TYPE, PARENTS, type Block, type FieldSpec } from "./blocks";
import { markdownWords } from "./markdown";
import { servicePath, type ServicePageContent } from "./managed";

// Search: the page's outline, its metadata, and the checks the editor shows.

export const TITLE_IDEAL = [30, 60] as const;
export const DESCRIPTION_IDEAL = [120, 160] as const;
/** Service pages compete with long guides; thin ones rarely rank. */
export const WORDS_IDEAL = 800;

/** Blocks whose heading is a section of the page, and so in its contents. */
const SECTION_TYPES = new Set([
  "richText",
  "featureGrid",
  "steps",
  "stats",
  "checklist",
  "comparisonTable",
  "imageText",
  "techStack",
]);
export const FAQ_ANCHOR = "faq-heading";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * The anchor of each block's H2 (undefined for blocks without one), and the
 * page's contents in order. The renderer and the editor's checks both read
 * this, so every contents link lands on its heading.
 */
export function pageOutline(blocks: Block[]): { anchors: (string | undefined)[]; toc: Heading[] } {
  const seen = new Map<string, number>([[FAQ_ANCHOR, 1]]);
  const toc: Heading[] = [];
  const anchors = blocks.map((b) => {
    if (b.type === "faq") {
      toc.push({ id: FAQ_ANCHOR, text: "FAQs", level: 2 });
      return FAQ_ANCHOR;
    }
    const text = str(b.heading);
    if (!SECTION_TYPES.has(b.type) || !text) return undefined;
    const base = anchorFor(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    toc.push({ id, text, level: 2 });
    return id;
  });
  return { anchors, toc };
}

/** Home, any section above the parent, the parent, then the page itself. */
export function breadcrumbTrail(page: Pick<ServicePageContent, "title" | "slug" | "parent">) {
  const trail = [{ name: "Home", path: "/" }];
  const parent = PARENTS.find((p) => p.path && p.path === page.parent);
  if (parent?.path.startsWith("/capabilities/")) trail.push({ name: "Capabilities", path: "/whatwedo" });
  if (parent) trail.push({ name: parent.name, path: parent.path });
  trail.push({ name: page.title, path: servicePath(page.slug) });
  return trail;
}

export const searchTitle = (p: ServicePageContent) => p.seo.metaTitle || p.title;
export const searchDescription = (p: ServicePageContent) => p.seo.metaDescription || p.subtitle;
export const shareImage = (p: ServicePageContent) => p.seo.ogImage || p.heroImage;

/** Route metadata: title, description, canonical, robots, Open Graph and Twitter. */
export function serviceMetadata(page: ServicePageContent & { publishedAt?: string; updatedAt?: string }): Metadata {
  const path = servicePath(page.slug);
  const description = metaDescription(searchDescription(page));
  const shareTitle = page.seo.ogTitle || searchTitle(page);
  const shareDescription = metaDescription(page.seo.ogDescription || description);
  const image = shareImage(page);
  const images = image ? [{ url: image, alt: page.title }] : undefined;
  return {
    title: brandedTitle(searchTitle(page)),
    description,
    keywords: page.seo.keywords.length ? page.seo.keywords : undefined,
    alternates: { canonical: page.seo.canonicalUrl || path },
    robots: page.seo.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: path,
      title: shareTitle,
      description: shareDescription,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: shareTitle,
      description: shareDescription,
      images: image ? [image] : undefined,
    },
  };
}

// ---------------------------------------------------------------- checks

export type Check = { ok: boolean; label: string };

/** Every piece of text a block holds, by field kind. */
function blockTexts(block: Block): { prose: string[]; links: string[] } {
  const prose: string[] = [];
  const links: string[] = [];
  const visit = (fields: FieldSpec[], values: Record<string, unknown>) => {
    for (const f of fields) {
      const v = values[f.key];
      if (f.kind === "text" || f.kind === "textarea" || f.kind === "markdown") {
        const s = str(v);
        if (s) prose.push(s);
        for (const m of s.matchAll(/\]\((.+?)\)/g)) links.push(m[1]);
      } else if (f.kind === "url") {
        if (str(v)) links.push(str(v));
      } else if (f.kind === "strings" && Array.isArray(v)) {
        prose.push(...v.map(str));
      } else if (f.kind === "rows" && Array.isArray(v)) {
        prose.push(...v.flatMap((r) => (Array.isArray(r) ? r.map(str) : [])));
      } else if (f.kind === "items" && Array.isArray(v)) {
        for (const item of v) visit(f.fields ?? [], item as Record<string, unknown>);
      }
    }
  };
  visit(BLOCK_BY_TYPE[block.type]?.fields ?? [], block);
  return { prose, links };
}

const has = (text: string, phrase: string) => phrase.length > 0 && text.toLowerCase().includes(phrase.toLowerCase());
const isInternal = (href: string) => (href.startsWith("/") && !href.startsWith("//")) || /devaicon\.com/i.test(href);

/**
 * Plain checks an editor can act on. They're advice, not gates: what stops a
 * page going live is the server's publishProblems.
 */
export function seoChecks(page: ServicePageContent): Check[] {
  const title = searchTitle(page);
  const description = searchDescription(page);
  const key = page.seo.focusKeyphrase.trim();
  const { toc } = pageOutline(page.blocks);
  const sections = toc.filter((h) => h.id !== FAQ_ANCHOR);
  const texts = page.blocks.map(blockTexts);
  const words = texts.reduce((n, t) => n + t.prose.reduce((m, s) => m + markdownWords(s), 0), 0);
  const internalLinks = texts.flatMap((t) => t.links).filter((l) => isInternal(l) && l !== "/contact-us");
  const firstText = str(page.blocks.find((b) => b.type === "richText" || b.type === "callout")?.body);
  const missingAlt = page.blocks.filter(
    (b) => (b.type === "image" && !str(b.alt)) || (b.type === "imageText" && !str(b.imageAlt)),
  ).length;
  const canonical = page.seo.canonicalUrl.trim();
  const elsewhere = canonical && canonical !== servicePath(page.slug) && !canonical.endsWith(servicePath(page.slug));

  const checks: Check[] = [
    {
      ok: title.length >= TITLE_IDEAL[0] && title.length <= TITLE_IDEAL[1],
      label: `Search title is ${title.length} characters (aim for ${TITLE_IDEAL[0]}–${TITLE_IDEAL[1]})`,
    },
    {
      ok: description.length >= DESCRIPTION_IDEAL[0] && description.length <= DESCRIPTION_IDEAL[1],
      label: page.seo.metaDescription
        ? `Meta description is ${description.length} characters (aim for ${DESCRIPTION_IDEAL[0]}–${DESCRIPTION_IDEAL[1]})`
        : "No meta description; the subtitle is used instead",
    },
    { ok: words >= WORDS_IDEAL, label: `${words} words on the page (aim for ${WORDS_IDEAL} or more)` },
    { ok: sections.length >= 3, label: `${sections.length} H2 sections (aim for 3 or more)` },
    { ok: internalLinks.length > 0, label: "Links to at least one other page on the site" },
    { ok: page.blocks.some((b) => b.type === "faq"), label: "Has an FAQs block (adds FAQ structured data)" },
    { ok: page.seo.keywords.length >= 3, label: `${page.seo.keywords.length} keywords set (aim for 3 or more)` },
    { ok: Boolean(page.serviceType.trim()), label: "Service type set for structured data" },
    { ok: Boolean(shareImage(page)), label: "Has an image for social sharing" },
    {
      ok: missingAlt === 0,
      label: missingAlt ? `${missingAlt} image block(s) have no alt text` : "Every image has alt text",
    },
  ];
  if (elsewhere) {
    checks.push({ ok: false, label: "Canonical URL points to another page, so this one is left out of the sitemap" });
  }
  if (page.seo.noindex) checks.push({ ok: false, label: "Hidden from search engines (noindex)" });

  if (!key) {
    checks.unshift({ ok: false, label: "Set a focus keyphrase to check keyword use" });
  } else {
    checks.unshift(
      { ok: has(title, key), label: "Focus keyphrase is in the search title" },
      { ok: has(description, key), label: "Focus keyphrase is in the meta description" },
      { ok: has(page.slug.replace(/-/g, " "), key), label: "Focus keyphrase is in the URL" },
      { ok: has(page.title, key), label: "Focus keyphrase is in the H1" },
      { ok: has(firstText, key), label: "Focus keyphrase is in the first text section" },
      { ok: sections.some((h) => has(h.text, key)), label: "Focus keyphrase is in an H2" },
    );
  }
  return checks;
}
