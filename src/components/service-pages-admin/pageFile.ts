import { BLOCK_BY_TYPE, PARENTS, blockGaps, blockTitle, isSafeUrl, readBlocks } from "@/lib/service-pages/blocks";
import { DEFAULT_ICON, ICON_NAMES } from "@/lib/service-pages/icons";
import type { AdminServicePage, ServicePageContent, ServiceSeo } from "@/lib/service-pages/managed";

/**
 * Service pages as JSON files: for moving pages between sites, keeping a copy,
 * and bringing in pages an AI agent wrote from the prompt the dashboard hands
 * out (see aiPrompt.ts, which documents this same shape to the agent).
 *
 * An import always makes new drafts. Nothing in a file can publish a page or
 * overwrite one, and its URL is made unique rather than refused. What had to
 * change on the way in is reported, never silently dropped.
 *
 * Bump SERVICE_PAGE_FILE_VERSION for any change an older file would be
 * misread under, and update the prompt with it.
 */

export const SERVICE_PAGE_FILE_FORMAT = "devaicon-service-page";
export const SERVICE_PAGE_FILE_VERSION = 1;
export const MAX_PAGES_PER_IMPORT = 50;

/** One page in a file: everything it renders from, and nothing about its workflow. */
export type ServicePageFields = ServicePageContent;

export function toFields(page: AdminServicePage | ServicePageContent): ServicePageFields {
  return {
    title: page.title,
    slug: page.slug,
    label: page.label,
    icon: page.icon,
    subtitle: page.subtitle,
    heroImage: page.heroImage,
    heroButtonText: page.heroButtonText,
    heroButtonLink: page.heroButtonLink,
    parent: page.parent,
    serviceType: page.serviceType,
    areaServed: page.areaServed,
    seo: { ...page.seo, keywords: [...page.seo.keywords] },
    blocks: page.blocks,
  };
}

// ---------------------------------------------------------------- export

/** One page goes out as `page`, several as `pages`; both import the same. */
export function buildServicePagesJson(pages: ServicePageFields[], now = new Date()): string {
  const head = { format: SERVICE_PAGE_FILE_FORMAT, version: SERVICE_PAGE_FILE_VERSION, exportedAt: now.toISOString() };
  return JSON.stringify(pages.length === 1 ? { ...head, page: pages[0] } : { ...head, pages }, null, 2);
}

export function servicePagesFileName(single?: { slug: string }): string {
  return single ? `${single.slug || "service-page"}.json` : `service-pages-${new Date().toISOString().slice(0, 10)}.json`;
}

// ---------------------------------------------------------------- sample

export const SAMPLE_PAGE: ServicePageFields = {
  title: "Cloud Migration Services",
  slug: "cloud-migration-services",
  label: "Cloud & Infrastructure",
  icon: "cloud",
  subtitle:
    "Move applications and data to AWS or Azure with a plan your team agrees to first: assessed, sequenced, tested and supported after go-live.",
  heroImage: "",
  heroButtonText: "Plan your migration",
  heroButtonLink: "/contact-us",
  parent: "/capabilities/infrastructure-enterprise-systems",
  serviceType: "Cloud migration",
  areaServed: "United Arab Emirates",
  seo: {
    metaTitle: "Cloud Migration Services for AWS and Azure",
    metaDescription:
      "Cloud migration services for AWS and Azure: assessment, migration planning, data transfer, testing and post-migration support, with UAE data residency.",
    focusKeyphrase: "cloud migration services",
    keywords: ["cloud migration services", "aws migration", "azure migration", "cloud migration uae", "data migration"],
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    noindex: false,
  },
  blocks: [
    {
      type: "richText",
      heading: "What are cloud migration services?",
      body:
        "**Cloud migration services** move your applications, databases and files from your own servers to a cloud platform such as AWS or Azure, without losing data or disrupting the people who use them.\n\nA migration is more than copying servers. It starts with knowing what you run, decides what should move and how, and ends with systems that cost less to run and are easier to change. See our [infrastructure services](/capabilities/infrastructure-enterprise-systems) for the wider picture.",
    },
    {
      type: "featureGrid",
      heading: "What our cloud migration service includes",
      intro: "",
      columns: "2",
      items: [
        { icon: "search", title: "Discovery and assessment", text: "An inventory of your applications, data and dependencies, and which of them are ready to move." },
        { icon: "map-pin", title: "Migration plan", text: "The order systems move in, the approach for each, and the maintenance windows you can expect." },
        { icon: "database", title: "Data migration", text: "Databases and files transferred and checked, with a rollback plan for every step." },
        { icon: "shield-check", title: "Security and compliance", text: "Access, encryption and logging set up to your policies, including UAE data residency." },
      ],
    },
    {
      type: "steps",
      heading: "How a cloud migration runs",
      intro: "",
      items: [
        { title: "Assess what you run", text: "We map applications, data flows and dependencies, and agree what success looks like." },
        { title: "Plan each move", text: "Each system gets an approach (rehost, replatform or rebuild) and a slot in the schedule." },
        { title: "Migrate and test", text: "Systems move in waves; each is tested against agreed checks before users switch over." },
        { title: "Optimise and support", text: "We right-size resources, set up monitoring and support your team after go-live." },
      ],
    },
    {
      type: "comparisonTable",
      heading: "Rehost, replatform or rebuild: which approach fits?",
      intro: "",
      columns: ["Approach", "What changes", "Best for"],
      rows: [
        ["Rehost", "The server moves as it is", "Moving quickly, with change to follow later"],
        ["Replatform", "Managed services replace parts you run yourself", "Cutting running effort without a rewrite"],
        ["Rebuild", "The application is redesigned for the cloud", "Systems that must scale or change often"],
      ],
      caption: "",
    },
    {
      type: "cta",
      heading: "Not sure where to start?",
      body: "Tell us what you run today and we will outline a migration plan with its costs.",
      buttonLabel: "Talk to a cloud engineer",
      buttonUrl: "/contact-us",
      style: "inline",
    },
    {
      type: "faq",
      items: [
        {
          question: "How long does a cloud migration take?",
          answer: "A handful of applications can move in a few weeks; a full data centre usually takes several months, moved in planned waves.",
        },
        {
          question: "Can our data stay in the UAE?",
          answer: "Yes. Both AWS and Azure have UAE regions, and we can keep your data and backups inside the country.",
        },
      ],
    },
    {
      type: "related",
      heading: "Related services",
      items: [
        {
          title: "Infrastructure & Enterprise Systems",
          description: "Scalable infrastructure, ERP systems and automation with ongoing support.",
          path: "/capabilities/infrastructure-enterprise-systems",
          image: "/managed-services.webp",
        },
        {
          title: "Engagement Models",
          description: "Fixed-scope projects, dedicated teams or managed services.",
          path: "/engagement-models",
          image: "",
        },
      ],
    },
  ],
};

export const sampleServicePageJson = () => buildServicePagesJson([SAMPLE_PAGE]);

// ---------------------------------------------------------------- import

export type ParsedPage = { fields: ServicePageFields; warnings: string[] };
export type PageFileResult = { ok: boolean; pages?: ParsedPage[]; warnings?: string[]; message?: string };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const quote = (v: string) => `“${v}”`;
const text = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "").trim();
/** "a, b and c" */
const andList = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`);

/** One page from a file, with what had to change. */
function readPage(raw: Obj, label: string): { page?: ParsedPage; error?: string } {
  const warnings: string[] = [];
  const capped = (v: unknown, max: number, name: string) => {
    const s = text(v);
    if (s.length <= max) return s;
    warnings.push(`The ${name} was cut to ${max} characters.`);
    return s.slice(0, max);
  };
  const link = (v: unknown, name: string) => {
    const s = text(v);
    if (isSafeUrl(s)) return s;
    warnings.push(`The ${name} ${quote(s)} isn't a site path or https:// link, so it was left empty.`);
    return "";
  };

  const title = capped(raw.title, 120, "title");
  if (!title) return { error: `${label} has no title.` };

  const icon = text(raw.icon).toLowerCase();
  if (icon && !ICON_NAMES.includes(icon)) warnings.push(`There's no icon called ${quote(icon)}, so ${DEFAULT_ICON} was used.`);

  const parentRaw = raw.parent === undefined ? "/whatwedo" : text(raw.parent);
  const parent = PARENTS.some((p) => p.path === parentRaw) ? parentRaw : "/whatwedo";
  if (parent !== parentRaw) warnings.push(`The breadcrumb parent ${quote(parentRaw)} isn't one this site offers, so it was set to Capabilities.`);

  const s: Obj = isObj(raw.seo) ? raw.seo : {};
  const keywordsRaw = Array.isArray(s.keywords) ? s.keywords.map(text) : text(s.keywords).split(",");
  const keywords = [...new Set(keywordsRaw.map((k) => k.trim().toLowerCase().slice(0, 60)).filter(Boolean))];
  if (keywords.length > 20) warnings.push("Only the first 20 keywords were kept.");
  const seo: ServiceSeo = {
    metaTitle: capped(s.metaTitle, 120, "search title"),
    metaDescription: capped(s.metaDescription, 320, "meta description"),
    focusKeyphrase: capped(s.focusKeyphrase, 100, "focus keyphrase"),
    keywords: keywords.slice(0, 20),
    canonicalUrl: link(s.canonicalUrl, "canonical URL"),
    ogTitle: capped(s.ogTitle, 120, "share title"),
    ogDescription: capped(s.ogDescription, 320, "share description"),
    ogImage: link(s.ogImage, "share image"),
    noindex: s.noindex === true,
  };

  const { blocks, warnings: blockWarnings } = readBlocks(raw.blocks);
  warnings.push(...blockWarnings);

  const fields: ServicePageFields = {
    title,
    slug: text(raw.slug).toLowerCase(),
    label: capped(raw.label, 60, "label"),
    icon: ICON_NAMES.includes(icon) ? icon : DEFAULT_ICON,
    subtitle: capped(raw.subtitle, 400, "subtitle"),
    heroImage: link(raw.heroImage, "hero image"),
    heroButtonText: capped(raw.heroButtonText, 40, "hero button text"),
    heroButtonLink: link(raw.heroButtonLink, "hero button link"),
    parent,
    serviceType: capped(raw.serviceType, 120, "service type"),
    areaServed: capped(raw.areaServed, 80, "area served"),
    seo,
    blocks,
  };

  const todo = [
    !fields.subtitle && "a subtitle",
    !seo.metaDescription && "a meta description",
    blocks.length === 0 && "content blocks",
  ].filter(Boolean);
  if (todo.length) warnings.push(`Add ${andList(todo as string[])} before publishing.`);
  // Named rather than numbered: numbers above count the file's blocks,
  // including any that were skipped.
  for (const b of blocks) {
    const gaps = blockGaps(b);
    const title = blockTitle(b);
    if (gaps.length) {
      warnings.push(`The ${BLOCK_BY_TYPE[b.type].label} block${title ? ` ${quote(title)}` : ""} still needs ${andList(gaps)}.`);
    }
  }

  return { page: { fields, warnings } };
}

/** An agent's reply saved as-is may wrap the JSON in a ``` fence; it's unwrapped. */
function unfence(input: string): string {
  const t = input.replace(/^﻿/, "").trim();
  const m = /^```[a-z]*\s*\n([\s\S]*?)\n```\s*$/i.exec(t);
  return m ? m[1] : t;
}

/** Read a .json file of one or more pages. */
export function parseServicePagesFile(name: string, input: string): PageFileResult {
  if (!/\.json$/i.test(name)) return { ok: false, message: "It must be a .json file." };
  let raw: unknown;
  try {
    raw = JSON.parse(unfence(input));
  } catch {
    return { ok: false, message: "It isn't valid JSON. If an AI agent wrote it, ask it to return only the JSON." };
  }
  if (isObj(raw) && raw.format !== undefined && raw.format !== SERVICE_PAGE_FILE_FORMAT) {
    return { ok: false, message: `It isn't a service page file (its format is ${quote(String(raw.format))}).` };
  }
  if (isObj(raw) && typeof raw.version === "number" && raw.version > SERVICE_PAGE_FILE_VERSION) {
    return { ok: false, message: "It was made for a newer version of the site. Update the site, then import it again." };
  }
  // A file of pages, a file of one page, a bare list, or one page on its own.
  const list = Array.isArray(raw)
    ? raw
    : isObj(raw) && Array.isArray(raw.pages)
      ? raw.pages
      : isObj(raw) && isObj(raw.page)
        ? [raw.page]
        : isObj(raw) && "title" in raw
          ? [raw]
          : null;
  if (!list) return { ok: false, message: "It doesn't hold any service pages." };
  if (list.length > MAX_PAGES_PER_IMPORT) {
    return { ok: false, message: `It holds ${list.length} pages; import at most ${MAX_PAGES_PER_IMPORT} at a time.` };
  }

  const pages: ParsedPage[] = [];
  const warnings: string[] = [];
  for (const [i, item] of list.entries()) {
    const label = `Page ${i + 1}`;
    if (!isObj(item)) {
      warnings.push(`${label} isn't a page, so it was skipped.`);
      continue;
    }
    const { page, error } = readPage(item, label);
    if (error) warnings.push(`${error} It was skipped.`);
    else if (page) pages.push(page);
  }
  if (pages.length === 0) return { ok: false, message: warnings.join(" ") || "It doesn't hold any service pages." };
  return { ok: true, pages, warnings };
}
