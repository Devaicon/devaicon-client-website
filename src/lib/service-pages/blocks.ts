import { DEFAULT_ICON, ICON_NAMES } from "./icons";

/**
 * The content blocks a dashboard-built service page is made of.
 *
 * This one catalogue drives the block editor's forms, the checks an imported
 * file goes through, and the reference the AI prompt hands to an agent, so a
 * block described here is a block every part of the feature understands. The
 * renderer (components/service-page/blocks.tsx) draws each type.
 *
 * The server keeps a copy of the types, fields and limits in
 * server/src/lib/servicePages.js. Change both together.
 */

export type FieldKind =
  | "text" // one line
  | "textarea" // plain text, line breaks kept
  | "markdown" // paragraphs, lists, ### subheadings, **bold** and [links](/path)
  | "url" // a site path (/contact-us) or an https:// link
  | "image" // the address of an image
  | "icon" // a name from ICONS
  | "select" // one of `options`
  | "strings" // a list of short texts
  | "items" // a list of small records, each with `fields`
  | "rows"; // table rows, each a list of cells

export type FieldSpec = {
  key: string;
  label: string;
  kind: FieldKind;
  max?: number;
  required?: boolean;
  minItems?: number;
  maxItems?: number;
  options?: readonly string[];
  /** Shown under the field in the editor. */
  hint?: string;
  /** What an AI agent should put here, when the label alone doesn't say. */
  ai?: string;
  /** The fields of each record, for `items`. */
  fields?: FieldSpec[];
};

export type BlockSpec = {
  type: string;
  label: string;
  /** One line for the editor's block picker. */
  description: string;
  /** When to reach for this block and how to write it, for the AI prompt. */
  ai: string;
  /** At most one per page. */
  once?: boolean;
  fields: FieldSpec[];
};

/** A block as stored and exchanged: its type, then its fields by key. */
export type Block = { type: string } & Record<string, unknown>;

export const MAX_BLOCKS = 40;
/** Cells per table row; matches the server. */
export const MAX_CELLS = 5;

export const MARKDOWN_HINT =
  "Blank line between paragraphs. Start lines with - or 1. for lists, ### for a subheading. **bold** and [link text](/page) work inside text.";

const heading = (ai = "An H2 that names what the section answers, ideally phrased the way people search."): FieldSpec => ({
  key: "heading",
  label: "Heading",
  kind: "text",
  max: 120,
  hint: "Shown as a section heading (H2) and listed in the page's contents.",
  ai,
});
const intro: FieldSpec = {
  key: "intro",
  label: "Introduction",
  kind: "markdown",
  max: 1000,
  hint: "Optional. A sentence or two above the block.",
};

export const BLOCKS: BlockSpec[] = [
  {
    type: "richText",
    label: "Text section",
    description: "A heading with paragraphs, lists and subheadings.",
    ai: "The workhorse. Use it for explanations, definitions and anything that reads as prose. Open the page with one that answers the main question in its first two sentences.",
    fields: [
      heading(),
      { key: "body", label: "Text", kind: "markdown", max: 8000, required: true, hint: MARKDOWN_HINT },
    ],
  },
  {
    type: "featureGrid",
    label: "Feature grid",
    description: "Cards with an icon, a title and a short description.",
    ai: "For what the service includes, its capabilities or its benefits: parallel items that each fit in one or two sentences.",
    fields: [
      heading(),
      intro,
      { key: "columns", label: "Columns on wide screens", kind: "select", options: ["2", "3"] },
      {
        key: "items",
        label: "Cards",
        kind: "items",
        required: true,
        minItems: 2,
        maxItems: 12,
        fields: [
          { key: "icon", label: "Icon", kind: "icon" },
          { key: "title", label: "Title", kind: "text", max: 100, required: true },
          { key: "text", label: "Description", kind: "textarea", max: 400 },
        ],
      },
    ],
  },
  {
    type: "steps",
    label: "Process steps",
    description: "A numbered sequence: how an engagement or a project runs.",
    ai: "For any ordered process: how an engagement works, delivery phases, an implementation plan. Each step's title starts with a verb.",
    fields: [
      heading(),
      intro,
      {
        key: "items",
        label: "Steps",
        kind: "items",
        required: true,
        minItems: 2,
        maxItems: 10,
        fields: [
          { key: "title", label: "Title", kind: "text", max: 100, required: true },
          { key: "text", label: "Description", kind: "textarea", max: 600 },
        ],
      },
    ],
  },
  {
    type: "stats",
    label: "Key figures",
    description: "Two to four large numbers with a label each.",
    ai: "Only for figures that are true and provided in the brief. Never invent statistics, client counts or results.",
    fields: [
      { ...heading("Optional."), hint: "Optional." },
      {
        key: "items",
        label: "Figures",
        kind: "items",
        required: true,
        minItems: 2,
        maxItems: 4,
        fields: [
          { key: "value", label: "Figure", kind: "text", max: 20, required: true, hint: "e.g. 40%, 3x, 24/7" },
          { key: "label", label: "What it measures", kind: "text", max: 100, required: true },
        ],
      },
      { key: "note", label: "Source or note", kind: "text", max: 200, hint: "Where the figures come from." },
    ],
  },
  {
    type: "checklist",
    label: "Checklist",
    description: "A list with tick marks: what's included, or what to have ready.",
    ai: "For inclusions, readiness checks or requirements, where each item is a short statement.",
    fields: [
      heading(),
      intro,
      { key: "items", label: "Items", kind: "strings", max: 300, required: true, minItems: 1, maxItems: 20, hint: "One item per line." },
    ],
  },
  {
    type: "comparisonTable",
    label: "Comparison table",
    description: "A table comparing options side by side.",
    ai: "For comparing options, tiers, approaches or before/after. Search engines and AI answers quote tables well. Every row has one cell per column.",
    fields: [
      heading(),
      intro,
      { key: "columns", label: "Column headings", kind: "strings", max: 80, required: true, minItems: 2, maxItems: MAX_CELLS, hint: "One heading per line, 2 to 5." },
      {
        key: "rows",
        label: "Rows",
        kind: "rows",
        max: 300,
        required: true,
        minItems: 1,
        maxItems: 20,
        hint: "One row per line, with | between cells.",
        ai: "An array of rows; each row is an array of strings, one per column.",
      },
      { key: "caption", label: "Caption", kind: "text", max: 200 },
    ],
  },
  {
    type: "callout",
    label: "Callout",
    description: "A shaded box that stands out from the text around it.",
    ai: "For one point a skimming reader must not miss: a short direct answer, a key consideration or a next step. Use sparingly.",
    fields: [
      { ...heading("Optional. A short heading for the box."), hint: "Optional." },
      { key: "body", label: "Text", kind: "markdown", max: 2000, required: true, hint: MARKDOWN_HINT },
    ],
  },
  {
    type: "imageText",
    label: "Image and text",
    description: "Text beside an image, on the left or the right.",
    ai: "Only when the brief gives an image address to use. Otherwise use a Text section.",
    fields: [
      heading(),
      { key: "body", label: "Text", kind: "markdown", max: 3000, required: true, hint: MARKDOWN_HINT },
      { key: "image", label: "Image", kind: "image", required: true },
      { key: "imageAlt", label: "Image description (alt text)", kind: "text", max: 200, required: true, hint: "What the image shows, for screen readers and search." },
      { key: "imagePosition", label: "Image side", kind: "select", options: ["right", "left"] },
    ],
  },
  {
    type: "image",
    label: "Image",
    description: "A full-width image or diagram with an optional caption.",
    ai: "Only when the brief gives an image address to use.",
    fields: [
      { key: "src", label: "Image", kind: "image", required: true },
      { key: "alt", label: "Image description (alt text)", kind: "text", max: 200, required: true, hint: "What the image shows, for screen readers and search." },
      { key: "caption", label: "Caption", kind: "text", max: 200 },
    ],
  },
  {
    type: "quote",
    label: "Quote",
    description: "A pull quote or client testimonial.",
    ai: "Only for a real quote given in the brief, attributed as given. Never invent testimonials.",
    fields: [
      { key: "quote", label: "Quote", kind: "textarea", max: 600, required: true },
      { key: "name", label: "Who said it", kind: "text", max: 80 },
      { key: "role", label: "Their role and organisation", kind: "text", max: 120 },
    ],
  },
  {
    type: "techStack",
    label: "Technologies",
    description: "Tags naming the platforms and tools the service uses.",
    ai: "For the platforms, languages and tools the service is delivered with. Short names only.",
    fields: [
      heading(),
      intro,
      { key: "items", label: "Technologies", kind: "strings", max: 40, required: true, minItems: 1, maxItems: 30, hint: "One per line." },
    ],
  },
  {
    type: "cta",
    label: "Call to action",
    description: "A card with a heading, a sentence and a button.",
    ai: "Use one mid-page and one to close the page. Point the button at /contact-us unless the brief says otherwise.",
    fields: [
      { key: "heading", label: "Heading", kind: "text", max: 120, required: true },
      { key: "body", label: "Text", kind: "textarea", max: 400 },
      { key: "buttonLabel", label: "Button label", kind: "text", max: 40, required: true },
      { key: "buttonUrl", label: "Button link", kind: "url", required: true, hint: "e.g. /contact-us" },
      {
        key: "style",
        label: "Style",
        kind: "select",
        options: ["panel", "banner", "inline"],
        ai: "panel: a light card; banner: a dark full card, best to close a page; inline: a slim strip, best mid-page.",
      },
    ],
  },
  {
    type: "faq",
    label: "FAQs",
    description: "Questions and answers. Adds FAQ structured data for search.",
    ai: "Five to eight questions people actually search for about this service, each answered in two to four sentences that stand on their own. Place it near the end.",
    once: true,
    fields: [
      {
        key: "items",
        label: "Questions",
        kind: "items",
        required: true,
        minItems: 1,
        maxItems: 20,
        fields: [
          { key: "question", label: "Question", kind: "text", max: 200, required: true },
          { key: "answer", label: "Answer", kind: "textarea", max: 1500, required: true },
        ],
      },
    ],
  },
  {
    type: "related",
    label: "Related pages",
    description: "Cards linking to other pages on the site.",
    ai: "Two or three cards linking to related pages on this site, from the list of site pages. Usually the last block.",
    fields: [
      heading("e.g. Related services"),
      {
        key: "items",
        label: "Cards",
        kind: "items",
        required: true,
        minItems: 1,
        maxItems: 6,
        fields: [
          { key: "title", label: "Title", kind: "text", max: 100, required: true },
          { key: "description", label: "Description", kind: "textarea", max: 200 },
          { key: "path", label: "Link", kind: "url", required: true, hint: "A page on this site, e.g. /engagement-models" },
          { key: "image", label: "Image", kind: "image" },
        ],
      },
    ],
  },
];

export const BLOCK_BY_TYPE: Record<string, BlockSpec> = Object.fromEntries(BLOCKS.map((b) => [b.type, b]));

/** Breadcrumb parents a page may sit under; matches PARENTS on the server. */
export const PARENTS: { path: string; name: string }[] = [
  { path: "/whatwedo", name: "Capabilities" },
  { path: "/capabilities/intelligent-systems-data", name: "Intelligent Systems & Data" },
  { path: "/capabilities/application-software-development", name: "Application & Software Development" },
  { path: "/capabilities/infrastructure-enterprise-systems", name: "Infrastructure & Enterprise Systems" },
  { path: "/capabilities/consulting-transformation", name: "Strategic Consulting & Transformation" },
  { path: "/capabilities/open-edx-services", name: "Open edX Services" },
  { path: "/industries", name: "Industries" },
  { path: "/engagement-models", name: "Engagement Models" },
  { path: "", name: "None (straight under Home)" },
];

// ---------------------------------------------------------------- values

function emptyValue(field: FieldSpec): unknown {
  switch (field.kind) {
    case "icon":
      return DEFAULT_ICON;
    case "select":
      return field.options?.[0] ?? "";
    case "strings":
    case "items":
    case "rows":
      return [];
    default:
      return "";
  }
}

export function blankItem(fields: FieldSpec[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((f) => [f.key, emptyValue(f)]));
}

/** A new block of `type`, with sensible starting values. */
export function blankBlock(type: string): Block {
  const spec = BLOCK_BY_TYPE[type];
  const block: Block = { type, ...blankItem(spec.fields) };
  for (const f of spec.fields) {
    if (f.kind === "items") block[f.key] = Array.from({ length: f.minItems ?? 1 }, () => blankItem(f.fields ?? []));
  }
  if (type === "cta") Object.assign(block, { buttonLabel: "Talk to an expert", buttonUrl: "/contact-us" });
  return block;
}

/** The text an editor would recognise a block by. */
export function blockTitle(block: Block): string {
  for (const key of ["heading", "quote", "caption", "alt"]) {
    const v = block[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/** A link that's safe on the page: a site path or http(s), as the server allows. */
export function isSafeUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- reading

const text = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "").trim();
const quote = (v: string) => `“${v}”`;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** One field's value from a file, tidied, with notes on anything changed. */
function readValue(field: FieldSpec, raw: unknown, where: string, warnings: string[]): unknown {
  const cap = (s: string) => {
    if (field.max && s.length > field.max) {
      warnings.push(`${where}: ${field.label} was cut to ${field.max} characters.`);
      return s.slice(0, field.max);
    }
    return s;
  };
  switch (field.kind) {
    case "text":
    case "textarea":
    case "markdown":
      return cap(text(raw));
    case "url":
    case "image": {
      const v = text(raw);
      if (isSafeUrl(v)) return v;
      warnings.push(`${where}: ${field.label} ${quote(v)} isn't a site path or https:// link, so it was left empty.`);
      return "";
    }
    case "icon": {
      const v = text(raw).toLowerCase();
      if (!v || ICON_NAMES.includes(v)) return v || DEFAULT_ICON;
      warnings.push(`${where}: there's no icon called ${quote(v)}, so ${DEFAULT_ICON} was used.`);
      return DEFAULT_ICON;
    }
    case "select": {
      const options = field.options ?? [];
      const v = text(raw).toLowerCase();
      if (options.includes(v)) return v;
      if (v) warnings.push(`${where}: ${field.label} ${quote(v)} isn't one of ${options.join(", ")}, so ${options[0]} was used.`);
      return options[0] ?? "";
    }
    case "strings": {
      const list = (Array.isArray(raw) ? raw.map(text) : text(raw).split(/\r?\n/)).map(cap).filter(Boolean);
      if (field.maxItems && list.length > field.maxItems) {
        warnings.push(`${where}: only the first ${field.maxItems} ${field.label.toLowerCase()} were kept.`);
      }
      return list.slice(0, field.maxItems);
    }
    case "rows": {
      const rows = (Array.isArray(raw) ? raw : [])
        .map((r) => (Array.isArray(r) ? r.map((c) => cap(text(c))) : text(r).split("|").map((c) => cap(c.trim()))))
        .filter((r) => r.some(Boolean));
      if (rows.some((r) => r.length > MAX_CELLS)) warnings.push(`${where}: table rows were cut to ${MAX_CELLS} cells.`);
      if (field.maxItems && rows.length > field.maxItems) warnings.push(`${where}: only the first ${field.maxItems} rows were kept.`);
      return rows.slice(0, field.maxItems).map((r) => r.slice(0, MAX_CELLS));
    }
    case "items": {
      const list = Array.isArray(raw) ? raw : [];
      if (field.maxItems && list.length > field.maxItems) {
        warnings.push(`${where}: only the first ${field.maxItems} ${field.label.toLowerCase()} were kept.`);
      }
      return list
        .slice(0, field.maxItems)
        .filter(isObj)
        .map((item) =>
          Object.fromEntries((field.fields ?? []).map((f) => [f.key, readValue(f, item[f.key], where, warnings)])),
        );
    }
  }
}

/**
 * A block from a file: unknown fields dropped, values tidied and capped.
 * A block of a type this site doesn't have can't be read.
 */
export function readBlock(raw: unknown, where: string): { block?: Block; warnings: string[]; error?: string } {
  const warnings: string[] = [];
  if (!isObj(raw)) return { warnings, error: `${where} isn't a block.` };
  const type = text(raw.type);
  const spec = BLOCK_BY_TYPE[type];
  if (!spec) return { warnings, error: `${where} is of a kind this site doesn't have (${quote(type || "no type")}).` };
  const block: Block = { type };
  const named = `${where} (${spec.label})`;
  for (const f of spec.fields) block[f.key] = readValue(f, raw[f.key], named, warnings);
  const extra = Object.keys(raw).filter((k) => k !== "type" && !spec.fields.some((f) => f.key === k));
  if (extra.length) warnings.push(`${named}: ignored ${extra.map(quote).join(", ")}, which this block doesn't have.`);
  return { block, warnings };
}

/** Every readable block in a list; anything unreadable is skipped with a note. */
export function readBlocks(raw: unknown): { blocks: Block[]; warnings: string[] } {
  const warnings: string[] = [];
  const blocks: Block[] = [];
  const list = Array.isArray(raw) ? raw : [];
  for (const [i, b] of list.entries()) {
    const r = readBlock(b, `Block ${i + 1}`);
    warnings.push(...r.warnings);
    if (r.error) warnings.push(`${r.error} It was skipped.`);
    else if (r.block) blocks.push(r.block);
  }
  for (const spec of BLOCKS.filter((b) => b.once)) {
    const same = blocks.filter((b) => b.type === spec.type);
    if (same.length > 1) {
      warnings.push(`Only the first ${spec.label} block was kept; a page can have one.`);
      for (const extra of same.slice(1)) blocks.splice(blocks.indexOf(extra), 1);
    }
  }
  if (blocks.length > MAX_BLOCKS) {
    warnings.push(`Only the first ${MAX_BLOCKS} blocks were kept.`);
    blocks.length = MAX_BLOCKS;
  }
  return { blocks, warnings };
}

/** What a block still needs before the page can be published. */
export function blockGaps(block: Block): string[] {
  const spec = BLOCK_BY_TYPE[block.type];
  if (!spec) return [];
  const gaps: string[] = [];
  for (const f of spec.fields) {
    const v = block[f.key];
    if (f.kind === "items" || f.kind === "strings" || f.kind === "rows") {
      const list = Array.isArray(v) ? v : [];
      const min = f.minItems ?? 1;
      if (f.required && list.length < min) gaps.push(`at least ${min} ${f.label.toLowerCase()}`);
      for (const sub of f.fields ?? []) {
        if (sub.required && list.some((item) => !text((item as Record<string, unknown>)[sub.key]))) {
          gaps.push(`${sub.label.toLowerCase()} on every ${f.label.toLowerCase().replace(/s$/, "")}`);
        }
      }
    } else if (f.required && !text(v)) {
      gaps.push(f.label.toLowerCase());
    }
  }
  return gaps;
}
