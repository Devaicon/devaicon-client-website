import { BLOCKS, MARKDOWN_HINT, MAX_BLOCKS, PARENTS, type FieldSpec } from "@/lib/service-pages/blocks";
import { ICON_NAMES } from "@/lib/service-pages/icons";
import { DESCRIPTION_IDEAL, TITLE_IDEAL, WORDS_IDEAL } from "@/lib/service-pages/seo";
import { SAMPLE_PAGE, SERVICE_PAGE_FILE_FORMAT, SERVICE_PAGE_FILE_VERSION, buildServicePagesJson } from "./pageFile";

/**
 * The prompt an admin hands to their own AI agent so it writes a service page
 * file this site can import. Everything the agent needs is inside it: the
 * file shape, every block with its fields and limits, the icons, the pages
 * it may link to and the SEO rules. It is built from the same catalogue the
 * importer checks against, so the two can't drift apart.
 */

export type AiBrief = {
  service: string;
  keyphrase: string;
  market: string;
  audience: string;
  facts: string;
  links: string;
  images: string;
};

export const EMPTY_BRIEF: AiBrief = { service: "", keyphrase: "", market: "", audience: "", facts: "", links: "", images: "" };

/** Pages on the site an agent may link to. Live dashboard pages are added. */
const SITE_PAGES = [
  ["/whatwedo", "What We Do: every capability"],
  ["/capabilities/intelligent-systems-data", "Intelligent Systems & Data (AI, ML, analytics)"],
  ["/services/capabilities-application-software-development", "Application & Software Development"],
  ["/capabilities/infrastructure-enterprise-systems", "Infrastructure & Enterprise Systems"],
  ["/capabilities/consulting-transformation", "Strategic Consulting & Transformation"],
  ["/capabilities/open-edx-services", "Open edX Services"],
  ["/capabilities/open-edx-services/open-edx-hosting", "Managed Open edX Hosting"],
  ["/capabilities/open-edx-services/open-edx-development", "Open edX Development & Customization"],
  ["/services/ai-automation-services-pakistan", "AI Automation Services in Pakistan"],
  ["/industries", "Industries we serve"],
  ["/services/engagement-models", "Engagement models: projects, dedicated teams, managed services"],
  ["/insights", "Insights: articles and guides"],
  ["/about-devaicon", "About Devaicon"],
  ["/contact-us", "Contact us (the default for buttons)"],
];

function kindOf(f: FieldSpec): string {
  const len = f.max ? `, at most ${f.max} characters` : "";
  const count = (noun: string) =>
    f.minItems || f.maxItems ? `${noun}, ${f.minItems ?? 0} to ${f.maxItems ?? "any"}` : noun;
  switch (f.kind) {
    case "text":
      return `string, one line${len}`;
    case "textarea":
      return `string, plain text${len}`;
    case "markdown":
      return `string, light Markdown${len}`;
    case "url":
      return 'string, a site path such as "/contact-us" or an https:// URL';
    case "image":
      return 'string, an image URL, or "" when you have none';
    case "icon":
      return "string, an icon name from the list below";
    case "select":
      return `one of ${(f.options ?? []).map((o) => `"${o}"`).join(" | ")}`;
    case "strings":
      return `${count("array of strings")}${f.max ? `, each at most ${f.max} characters` : ""}`;
    case "rows":
      return `${count("array of rows")}; each row is an array of strings, one per column${f.max ? `, each at most ${f.max} characters` : ""}`;
    case "items":
      return `${count("array of objects")} with these fields:`;
  }
}

function fieldLines(fields: FieldSpec[], indent = ""): string[] {
  return fields.flatMap((f) => {
    const notes = [kindOf(f), f.required ? "REQUIRED" : "optional", f.ai].filter(Boolean).join("; ");
    const line = `${indent}- \`${f.key}\`: ${notes}`;
    return f.kind === "items" ? [line, ...fieldLines(f.fields ?? [], `${indent}  `)] : [line];
  });
}

function blockReference(): string[] {
  return BLOCKS.flatMap((b) => [
    `### \`${b.type}\`: ${b.label}${b.once ? " (at most one per page)" : ""}`,
    "",
    `${b.description} ${b.ai}`,
    "",
    ...fieldLines(b.fields),
    "",
  ]);
}

const orPlaceholder = (v: string, placeholder: string) => v.trim() || placeholder;

/** The whole prompt, as Markdown. */
export function buildAiPrompt(brief: AiBrief, livePages: { title: string; slug: string }[] = []): string {
  const pages = [
    ...SITE_PAGES,
    ...livePages.map((p) => [`/services/${p.slug}`, p.title] as const),
  ];
  const block = (lines: string[]) => lines.join("\n");

  return block([
    "# Write a Devaicon service page as an importable JSON file",
    "",
    "You are writing a service page for **Devaicon** (https://devaicon.com), a technology company based in Sharjah, UAE, that builds AI, automation, cloud and enterprise software for organisations in banking, retail, manufacturing, education and the public sector. The page will be imported into the website's admin panel, reviewed, and published at `https://devaicon.com/services/<slug>`.",
    "",
    "Your output is **one JSON file** in the exact format described below. The page is assembled from Devaicon's predefined content blocks; you choose which blocks to use, in what order, and write their content.",
    "",
    "## The brief",
    "",
    `- **Service:** ${orPlaceholder(brief.service, "[describe the service the page is about]")}`,
    `- **Focus keyphrase:** ${orPlaceholder(brief.keyphrase, "[the main search phrase the page should rank for]")}`,
    `- **Market / location:** ${orPlaceholder(brief.market, "[e.g. United Arab Emirates, Pakistan, GCC]")}`,
    `- **Audience:** ${orPlaceholder(brief.audience, "[who reads it, e.g. IT directors at mid-sized banks]")}`,
    "",
    "**Facts, offerings and points to cover** (use only these for any specific claims):",
    "",
    orPlaceholder(brief.facts, "[list what Devaicon actually offers, real figures, differentiators, technologies used]"),
    "",
    "**Pages to link to, beyond the list below:**",
    "",
    orPlaceholder(brief.links, "None."),
    "",
    "**Images you may use** (URLs):",
    "",
    orPlaceholder(brief.images, 'None. Leave every image field as "" and do not use the `image` or `imageText` blocks.'),
    "",
    "## Research and accuracy",
    "",
    "- Before writing, look at what currently ranks for the focus keyphrase and the questions people ask about it, and cover those questions better.",
    "- **Never invent** statistics, prices, client names, case studies, certifications, awards, partnerships or testimonials. Only use figures and claims given in the brief. When something would need a number you don't have, describe it qualitatively instead.",
    "- If the brief leaves out something you need, write it in general terms that are true of any competent provider; do not guess specifics.",
    "",
    "## SEO rules",
    "",
    `- \`seo.metaTitle\`: ${TITLE_IDEAL[0]}–${TITLE_IDEAL[1]} characters, starting with or containing the focus keyphrase. The brand name is added by the site, so leave it out.`,
    `- \`seo.metaDescription\`: ${DESCRIPTION_IDEAL[0]}–${DESCRIPTION_IDEAL[1]} characters, containing the focus keyphrase and saying what the reader gets.`,
    "- `seo.focusKeyphrase`: the keyphrase from the brief, lower case.",
    "- `seo.keywords`: 5 to 10 lower-case phrases: the focus keyphrase, close variants and related searches.",
    '- `seo.canonicalUrl`: always "". The site sets it to the page\'s own URL.',
    '- `seo.ogTitle`, `seo.ogDescription`, `seo.ogImage`: "" unless the brief asks for different social wording; the search title and description are used instead.',
    "- `seo.noindex`: always false.",
    "- `slug`: lower-case words joined by hyphens, built from the focus keyphrase, at most 100 characters, e.g. `cloud-migration-services-uae`.",
    "- `title` is the H1: include the focus keyphrase naturally.",
    "- The first `richText` block answers the page's main question directly in its first two sentences and uses the focus keyphrase in bold once.",
    "- Each block `heading` becomes an H2 and an entry in the page's contents. Phrase most of them as the questions people search for. Use the focus keyphrase or a close variant in at least one.",
    `- Aim for ${WORDS_IDEAL}–1,500 words across the page, in at least 5 sections. Useful and specific beats long.`,
    "- Link to at least two other pages on the site from within text, using `[link text](/path)`, chosen from the list below. Link text describes the destination; never \"click here\".",
    "- Include one `faq` block with 5 to 8 real questions; answers are 2 to 4 sentences and make sense on their own (they become FAQ rich results).",
    "- `serviceType`: a short Schema.org service type, e.g. \"Cloud migration\". `areaServed`: the market from the brief, e.g. \"United Arab Emirates\".",
    "",
    "## Writing style",
    "",
    "- British English spelling (organisation, optimise, programme), plain words, short sentences, active voice.",
    "- Write for a busy decision-maker: lead with outcomes, then explain how. No hype words (cutting-edge, world-class, revolutionary, seamless, unlock, leverage).",
    "- Use \"we\" for Devaicon and \"you\" for the reader.",
    `- Markdown fields accept only this: ${MARKDOWN_HINT} No other Markdown (no ## headings, tables, images or HTML).`,
    "",
    "## Page structure that works",
    "",
    "1. `richText`: the direct answer: what the service is and who it is for.",
    "2. `featureGrid` or `checklist`: what the service includes.",
    "3. `steps`: how an engagement runs.",
    "4. `comparisonTable`: options or approaches compared, where there is a real choice to make.",
    "5. `cta` with style `inline`.",
    "6. One or two further `richText` sections: costs and what drives them, how to choose a provider, or sector-specific detail.",
    "7. `techStack`, when the technologies matter to the reader.",
    "8. `faq`.",
    "9. `cta` with style `banner` to close.",
    "10. `related`: two or three cards to related pages.",
    "",
    `Adapt it to the topic; use between 6 and ${Math.min(MAX_BLOCKS, 16)} blocks.`,
    "",
    "## The file",
    "",
    "Return a single JSON object shaped like this:",
    "",
    "```json",
    block([
      "{",
      `  "format": "${SERVICE_PAGE_FILE_FORMAT}",`,
      `  "version": ${SERVICE_PAGE_FILE_VERSION},`,
      '  "page": {',
      '    "title": "…",            // H1, at most 120 characters, REQUIRED',
      '    "slug": "…",             // URL slug',
      '    "label": "…",            // small label above the H1, at most 60 characters, e.g. "Cloud & Infrastructure"',
      '    "icon": "…",             // icon beside the label, from the list below',
      '    "subtitle": "…",         // hero text under the H1, 1–2 sentences, at most 400 characters, REQUIRED',
      '    "heroImage": "",         // image URL from the brief, or ""',
      '    "heroButtonText": "…",   // at most 40 characters, e.g. "Talk to an expert"',
      '    "heroButtonLink": "/contact-us",',
      '    "parent": "…",           // breadcrumb parent, from the list below',
      '    "serviceType": "…",',
      '    "areaServed": "…",',
      '    "seo": { "metaTitle": "…", "metaDescription": "…", "focusKeyphrase": "…", "keywords": ["…"],',
      '             "canonicalUrl": "", "ogTitle": "", "ogDescription": "", "ogImage": "", "noindex": false },',
      '    "blocks": [ { "type": "richText", "heading": "…", "body": "…" }, … ]',
      "  }",
      "}",
    ]),
    "```",
    "",
    "(The comments above are explanations only. Your file must be plain JSON with no comments.)",
    "",
    "### Breadcrumb parents (`parent`)",
    "",
    ...PARENTS.map((p) => `- \`"${p.path}"\`: ${p.name}`),
    "",
    "### Icons (`icon`, and `icon` on feature grid cards)",
    "",
    ICON_NAMES.map((n) => `\`${n}\``).join(", "),
    "",
    "### Pages on the site you may link to",
    "",
    ...pages.map(([path, name]) => `- \`${path}\`: ${name}`),
    "",
    "## Content blocks",
    "",
    "Each block is an object with a `type` and the fields listed for that type. Use only these types and these fields; anything else is dropped on import.",
    "",
    ...blockReference(),
    "## A complete example",
    "",
    "This shows the format only. Do not copy its wording or claims.",
    "",
    "```json",
    buildServicePagesJson([SAMPLE_PAGE], new Date("2026-01-01T00:00:00Z")),
    "```",
    "",
    "## Before you answer",
    "",
    "Check that: the JSON parses; every block `type` is one listed above; every REQUIRED field is filled; text fits its limits; every link is a site path from the list or an https:// URL; the search title and meta description are within their lengths; there are no invented facts.",
    "",
    "Reply with **only the JSON**, with no explanation before or after it, so it can be saved as `<slug>.json` and uploaded to the Devaicon admin panel.",
  ]);
}
