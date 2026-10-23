import { generateHTML, generateJSON, getSchema, type JSONContent } from "@tiptap/core";
import { api } from "@/components/dashboard/api";
import { collectHeadings } from "@/lib/blog/toc";
import type { AdminPost, Author, Category, Cta, DocNode, Faq, Seo } from "@/lib/blog/types";
import { editorExtensions } from "./extensions";

/**
 * A post as a JSON file, for moving it between sites or for bringing in posts
 * written elsewhere (for example by a content pipeline).
 *
 * The file is written for people and tools rather than for this database:
 * the body is HTML, and the author, category and calls to action are named
 * instead of given by id. Importing turns names back into ids from this
 * site's Blog library, and says plainly about anything it could not match,
 * rather than refusing the file.
 *
 * An import always makes a new draft. Nothing in a file can publish, feature
 * or overwrite a post.
 *
 * Tools outside this repo write these files to a shared format guide, so a
 * change to the shape here is a change to that guide: bump POST_FILE_VERSION
 * for anything an older file would be misread under.
 */

export const POST_FILE_FORMAT = "devaicon-post";
export const POST_FILE_VERSION = 1;

/** The Blog library the names in a file are matched against. */
export type Library = { authors: Author[]; categories: Category[]; ctas: Cta[] };

export type PostFile = {
  format: typeof POST_FILE_FORMAT;
  version: number;
  exportedAt?: string;
  title: string;
  subtitle: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  heroImage: { url: string; alt: string };
  /** HTML in the tags the editor knows; anything else is dropped on import. */
  body: string;
  faqs: Faq[];
  closingCta: string;
  toc: {
    enabled: boolean;
    depth: 2 | 3;
    title: string;
    /** Shorter wording for a heading's contents entry, by the heading's text. */
    labels: { heading: string; text: string }[];
  };
  seo: Seo;
};

/** What an import sends to create the draft: the editor's fields, with ids. */
export type ImportFields = Pick<
  AdminPost,
  | "title"
  | "subtitle"
  | "slug"
  | "authorId"
  | "categoryId"
  | "tags"
  | "heroImage"
  | "body"
  | "faqs"
  | "closingCtaId"
  | "toc"
  | "seo"
>;

const FIELDS = [
  "title",
  "subtitle",
  "slug",
  "author",
  "category",
  "tags",
  "heroImage",
  "body",
  "faqs",
  "closingCta",
  "toc",
  "seo",
] as const;
const KNOWN = new Set<string>(["format", "version", "exportedAt", ...FIELDS]);

const MAX_FAQS = 30;

const SEO_TEXT = [
  "metaTitle",
  "metaDescription",
  "focusKeyphrase",
  "canonicalUrl",
  "ogTitle",
  "ogDescription",
  "ogImage",
] as const;

export async function loadLibrary(): Promise<{ ok: boolean; library?: Library; message?: string }> {
  const [authors, categories, ctas] = await Promise.all([
    api<{ items: Author[] }>("/authors"),
    api<{ items: Category[] }>("/categories"),
    api<{ items: Cta[] }>("/ctas"),
  ]);
  const failed = [authors, categories, ctas].find((r) => !r.ok);
  if (failed) return { ok: false, message: failed.message };
  return {
    ok: true,
    library: { authors: authors.data.items, categories: categories.data.items, ctas: ctas.data.items },
  };
}

// ---------------------------------------------------------------- export

/** The body as HTML, one top-level block per line, with each CTA named. */
function docToHtml(doc: DocNode, library: Library): string {
  const tpl = document.createElement("template");
  tpl.innerHTML = generateHTML(doc as JSONContent, editorExtensions);
  // Named as well as numbered, so the file still reads right on a site whose
  // CTAs have different ids.
  tpl.content.querySelectorAll<HTMLElement>("[data-cta-id]").forEach((el) => {
    const cta = library.ctas.find((c) => c.id === el.dataset.ctaId);
    if (cta) el.setAttribute("data-cta", cta.name);
  });
  return [...tpl.content.childNodes]
    .map((n) => (n instanceof Element ? n.outerHTML : (n.textContent ?? "")))
    .join("\n");
}

export function buildPostFile(post: AdminPost, library: Library, now = new Date()): string {
  const nameOf = (list: { id: string; name: string }[], id: string) =>
    list.find((x) => x.id === id)?.name ?? "";
  const headings = collectHeadings(post.body);
  const file: PostFile = {
    format: POST_FILE_FORMAT,
    version: POST_FILE_VERSION,
    exportedAt: now.toISOString(),
    title: post.title,
    subtitle: post.subtitle,
    slug: post.slug,
    author: nameOf(library.authors, post.authorId),
    category: nameOf(library.categories, post.categoryId),
    tags: post.tags,
    heroImage: post.heroImage,
    body: docToHtml(post.body, library),
    faqs: post.faqs,
    closingCta: nameOf(library.ctas, post.closingCtaId),
    toc: {
      enabled: post.toc.enabled,
      depth: post.toc.depth,
      title: post.toc.title,
      labels: post.toc.labels
        .map((l) => ({ heading: headings.find((h) => h.id === l.id)?.text ?? "", text: l.text }))
        .filter((l) => l.heading),
    },
    seo: post.seo,
  };
  return JSON.stringify(file, null, 2);
}

export function postFileName(post: Pick<AdminPost, "slug">): string {
  return `${post.slug || "post"}.json`;
}

export function downloadJson(name: string, json: string): void {
  const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  // Revoked on the next task: some browsers start the download after click()
  // returns, and would find the URL already gone.
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

// ---------------------------------------------------------------- import

// Flat rather than a discriminated union: this project compiles with
// `strict: false`, where a boolean-literal discriminant does not narrow.
export type ParsedPost = { fields: ImportFields; warnings: string[] };
export type ParseResult = { ok: boolean; parsed?: ParsedPost; message?: string };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const quote = (v: string) => `“${v}”`;

/** A library entry by id, name, or (for categories) slug. */
function find<T extends { id: string; name: string; slug?: string }>(list: T[], ref: unknown): T | undefined {
  const v = text(ref);
  if (!v) return undefined;
  return list.find((x) => x.id === v || same(x.name, v) || (x.slug !== undefined && same(x.slug, v)));
}

/** An address the site will show: http(s), or a path on this site. */
const usableSrc = (v: unknown) => /^https?:\/\//i.test(text(v)) || /^\/(?!\/)/.test(text(v));

/**
 * Prepare a file's HTML for the editor's parser: headings brought into the
 * range a post uses, and each CTA placeholder pointed at a library CTA.
 */
function prepareHtml(html: string, library: Library, warnings: string[]): string {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const root = tpl.content;

  // The post title is the page's only H1, and the body goes no deeper than H4.
  const outOfRange = root.querySelectorAll("h1, h5, h6");
  outOfRange.forEach((h) => {
    const next = document.createElement(h.tagName === "H1" ? "h2" : "h4");
    next.append(...h.childNodes);
    h.replaceWith(next);
  });
  if (outOfRange.length > 0) {
    warnings.push(
      `${outOfRange.length} heading${outOfRange.length === 1 ? " was" : "s were"} moved into the H2–H4 range the body uses (the title is the page's H1).`,
    );
  }

  root.querySelectorAll("[data-cta], [data-cta-id]").forEach((el) => {
    const cta = find(library.ctas, el.getAttribute("data-cta-id")) ?? find(library.ctas, el.getAttribute("data-cta"));
    if (!cta) {
      const name = el.getAttribute("data-cta") || el.getAttribute("data-cta-id") || "";
      warnings.push(`Call to action ${quote(name)} isn't in the Blog library, so it was left out of the body.`);
      el.remove();
      return;
    }
    const block = document.createElement("div");
    block.setAttribute("data-cta-id", cta.id);
    el.replaceWith(block);
  });

  return tpl.innerHTML;
}

/** The document without the nodes `drop` picks out. */
function without(node: DocNode, drop: (n: DocNode) => boolean): DocNode {
  if (!node.content) return node;
  return { ...node, content: node.content.filter((c) => !drop(c)).map((c) => without(c, drop)) };
}

function walk(node: DocNode, visit: (n: DocNode) => void) {
  visit(node);
  for (const c of node.content ?? []) walk(c, visit);
}

/** The body as an editor document, from HTML or (for older tools) editor JSON. */
function parseBody(value: unknown, library: Library, warnings: string[]): DocNode | null {
  let doc: DocNode;
  try {
    if (typeof value === "string" && value.trim()) {
      doc = generateJSON(prepareHtml(value, library, warnings), editorExtensions) as DocNode;
    } else if (isObj(value) && value.type === "doc") {
      // Through the schema, which drops anything the editor doesn't know.
      doc = getSchema(editorExtensions).nodeFromJSON(value).toJSON() as DocNode;
    } else {
      return null;
    }
  } catch {
    return null;
  }

  let badImages = 0;
  let unknownCtas = 0;
  doc = without(doc, (n) => {
    if (n.type === "image" && !usableSrc(n.attrs?.src)) {
      badImages += 1;
      return true;
    }
    if (n.type === "ctaBlock" && !library.ctas.some((c) => c.id === n.attrs?.ctaId)) {
      unknownCtas += 1;
      return true;
    }
    return false;
  });
  if (badImages > 0) {
    warnings.push(
      `${badImages} image${badImages === 1 ? " was" : "s were"} left out: an image address must start with https:// or /.`,
    );
  }
  if (unknownCtas > 0) {
    warnings.push(`${unknownCtas} call${unknownCtas === 1 ? "" : "s"} to action in the body aren't in the Blog library and were left out.`);
  }

  let noAlt = 0;
  walk(doc, (n) => {
    if (n.type === "image" && !text(n.attrs?.alt)) noAlt += 1;
  });
  if (noAlt > 0) {
    warnings.push(`${noAlt} image${noAlt === 1 ? " has" : "s have"} no alt text. Select ${noAlt === 1 ? "it" : "each"} in the editor to add one.`);
  }

  const hasText = (() => {
    let found = false;
    walk(doc, (n) => {
      if ((n.type === "text" && text(n.text)) || n.type === "image" || n.type === "ctaBlock") found = true;
    });
    return found;
  })();
  return hasText ? doc : null;
}

export function parsePostFile(json: string, library: Library): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, message: "It isn't valid JSON." };
  }
  if (!isObj(raw)) return { ok: false, message: "It doesn't hold a post." };
  if (raw.format !== undefined && raw.format !== POST_FILE_FORMAT) {
    return { ok: false, message: `It isn't a post file (its format is ${quote(String(raw.format))}).` };
  }
  if (typeof raw.version === "number" && raw.version > POST_FILE_VERSION) {
    return { ok: false, message: "It was made for a newer version of the site. Update the site, then import it again." };
  }

  const title = text(raw.title);
  if (!title) return { ok: false, message: "It has no title." };

  const warnings: string[] = [];
  const body = parseBody(raw.body, library, warnings);
  if (!body) return { ok: false, message: "Its body is missing or empty, or isn't HTML the editor can read." };

  const ignored = Object.keys(raw).filter((k) => !KNOWN.has(k));
  if (ignored.length > 0) {
    warnings.push(
      `Ignored ${ignored.map(quote).join(", ")}: not part of a post file. Imported posts always start as unfeatured drafts.`,
    );
  }

  const author = find(library.authors, raw.author);
  if (text(raw.author) && !author) {
    warnings.push(`Author ${quote(text(raw.author))} isn't in the Blog library, so the post has no author yet.`);
  }
  const category = find(library.categories, raw.category);
  if (text(raw.category) && !category) {
    warnings.push(`Category ${quote(text(raw.category))} isn't in the Blog library, so the post has no category yet.`);
  }
  const closing = find(library.ctas, raw.closingCta);
  if (text(raw.closingCta) && !closing) {
    warnings.push(`Closing call to action ${quote(text(raw.closingCta))} isn't in the Blog library, so it was left off.`);
  }

  const tags = (
    Array.isArray(raw.tags) ? raw.tags.map(text) : typeof raw.tags === "string" ? raw.tags.split(",").map(text) : []
  ).filter(Boolean);

  const hero: Obj = isObj(raw.heroImage) ? raw.heroImage : { url: raw.heroImage };
  let heroImage = { url: text(hero.url), alt: text(hero.alt) };
  if (heroImage.url && !usableSrc(heroImage.url)) {
    warnings.push("The hero image was left out: its address must start with https:// or /.");
    heroImage = { url: "", alt: "" };
  } else if (heroImage.url && !heroImage.alt) {
    warnings.push("The hero image has no alt text. Add one before publishing.");
  }

  const rawFaqs = Array.isArray(raw.faqs) ? raw.faqs : [];
  let faqs = rawFaqs
    .map((f) => (isObj(f) ? { question: text(f.question), answer: text(f.answer) } : { question: "", answer: "" }))
    .filter((f) => f.question && f.answer);
  if (faqs.length < rawFaqs.length) {
    const n = rawFaqs.length - faqs.length;
    warnings.push(`${n} FAQ${n === 1 ? " was" : "s were"} left out for missing a question or an answer.`);
  }
  if (faqs.length > MAX_FAQS) {
    warnings.push(`Only the first ${MAX_FAQS} FAQs were kept; a post holds at most ${MAX_FAQS}.`);
    faqs = faqs.slice(0, MAX_FAQS);
  }

  const toc = isObj(raw.toc) ? raw.toc : {};
  const headings = collectHeadings(body);
  const labels: { id: string; text: string }[] = [];
  for (const l of Array.isArray(toc.labels) ? toc.labels : []) {
    if (!isObj(l) || !text(l.text)) continue;
    const heading = headings.find((h) => same(h.text, text(l.heading)));
    if (heading) labels.push({ id: heading.id, text: text(l.text) });
    else warnings.push(`No heading reads ${quote(text(l.heading))}, so its contents label was left out.`);
  }

  const rawSeo = isObj(raw.seo) ? raw.seo : {};
  const seo = {
    ...(Object.fromEntries(SEO_TEXT.map((k) => [k, text(rawSeo[k])])) as Omit<Seo, "noindex">),
    noindex: rawSeo.noindex === true,
  };
  // The server refuses a post with a bad link here, which would lose the
  // whole import over one field.
  for (const [key, label] of [
    ["canonicalUrl", "canonical URL"],
    ["ogImage", "social image"],
  ] as const) {
    if (seo[key] && !usableSrc(seo[key])) {
      warnings.push(`The ${label} was left out: it must start with https:// or /.`);
      seo[key] = "";
    }
  }

  return {
    ok: true,
    parsed: {
      warnings,
      fields: {
        title,
        subtitle: text(raw.subtitle),
        slug: text(raw.slug),
        authorId: author?.id ?? "",
        categoryId: category?.id ?? "",
        tags,
        heroImage,
        body,
        faqs,
        closingCtaId: closing?.id ?? "",
        toc: {
          enabled: toc.enabled !== false,
          depth: toc.depth === 2 ? 2 : 3,
          title: text(toc.title) || "On this page",
          labels,
        },
        seo,
      },
    },
  };
}
