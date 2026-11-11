import { SITE_PAGES } from "@/components/service-pages-admin/aiPrompt";
import { IMAGE_SIZES } from "@/lib/blog/images";
import { DESCRIPTION_IDEAL, TITLE_IDEAL } from "./seo";
import { POST_FILE_FORMAT, POST_FILE_VERSION, samplePostFile, type Library } from "./postFile";

/**
 * The prompt an admin hands to their own AI agent so it writes a post file
 * this site can import. It carries the file shape, the HTML the editor reads,
 * this site's authors, categories and calls to action by name, the pages it
 * may link to and the SEO checks the editor runs, so a reply imports as a
 * draft that already passes them. Its rules follow parsePostFile in
 * postFile.ts: a change to what that accepts belongs here too.
 */

export type PostBrief = {
  topic: string;
  keyphrase: string;
  audience: string;
  market: string;
  points: string;
  links: string;
  images: string;
};

export const EMPTY_POST_BRIEF: PostBrief = {
  topic: "",
  keyphrase: "",
  audience: "",
  market: "",
  points: "",
  links: "",
  images: "",
};

const orPlaceholder = (v: string, placeholder: string) => v.trim() || placeholder;
const names = (list: { name: string }[]) => list.map((x) => `- "${x.name}"`);

/** The whole prompt, as Markdown. */
export function buildPostPrompt(
  brief: PostBrief,
  library: Library | undefined,
  livePosts: { title: string; slug: string }[] = [],
): string {
  const pages = [...SITE_PAGES, ...livePosts.map((p) => [`/insights/${p.slug}`, p.title] as const)];
  const block = (lines: string[]) => lines.join("\n");
  const authors = library?.authors ?? [];
  const categories = library?.categories ?? [];
  const ctas = library?.ctas ?? [];

  return block([
    "# Write a Devaicon Insights article as an importable JSON file",
    "",
    "You are writing an article for the Insights section of **Devaicon** (https://devaicon.com), a technology company based in Sharjah, UAE, that builds AI, automation, cloud and enterprise software for organisations in banking, retail, manufacturing, education and the public sector. The article will be imported into the website's admin panel as a draft, reviewed, and published at `https://devaicon.com/insights/<slug>`.",
    "",
    "Your output is **one JSON file** in the exact format described below. The article body is HTML.",
    "",
    "## The brief",
    "",
    `- **Topic or working title:** ${orPlaceholder(brief.topic, "[what the article is about]")}`,
    `- **Focus keyphrase:** ${orPlaceholder(brief.keyphrase, "[the main search phrase the article should rank for]")}`,
    `- **Audience:** ${orPlaceholder(brief.audience, "[who reads it, e.g. operations managers at mid-sized retailers]")}`,
    `- **Market / location:** ${orPlaceholder(brief.market, "Not specific to one market.")}`,
    "",
    "**Points to cover, facts and sources:**",
    "",
    orPlaceholder(brief.points, "[the angle, the points to make, real figures and the sources they come from]"),
    "",
    "**Pages to link to, beyond the list below:**",
    "",
    orPlaceholder(brief.links, "None."),
    "",
    "**Images you may use** (URLs):",
    "",
    orPlaceholder(
      brief.images,
      'None. Set `heroImage` to { "url": "", "alt": "" } and put no images in the body.',
    ),
    "",
    "## Research and accuracy",
    "",
    "- Before writing, look at what currently ranks for the focus keyphrase and the questions people ask about it, and answer those questions better: more specific, more practical, more current.",
    "- **Never invent** statistics, prices, dates, quotes, client names, case studies or studies. Use a figure only if it is in the brief, or you have read it at its original source; then link to that source in the sentence that uses it.",
    "- If you cannot check something, say it in qualitative terms instead of guessing a number.",
    "- Do not claim Devaicon has done, built or achieved anything the brief does not say.",
    "",
    "## SEO rules",
    "",
    "The admin panel checks each of these before publishing:",
    "",
    `- \`seo.metaTitle\`: ${TITLE_IDEAL[0]}–${TITLE_IDEAL[1]} characters, containing the focus keyphrase. The brand name is added by the site, so leave it out.`,
    `- \`seo.metaDescription\`: ${DESCRIPTION_IDEAL[0]}–${DESCRIPTION_IDEAL[1]} characters, containing the focus keyphrase and saying what the reader gets.`,
    "- `seo.focusKeyphrase`: the keyphrase from the brief, lower case.",
    "- `slug`: lower-case words joined by hyphens, containing the focus keyphrase, at most 100 characters, e.g. `cloud-migration-without-downtime`.",
    "- `title` is the page's H1 (at most 200 characters): include the focus keyphrase naturally.",
    "- The first paragraph answers the article's main question directly and contains the focus keyphrase.",
    "- At least one H2 or H3 contains the focus keyphrase or a close variant.",
    "- At least four `<h2>` sections; use `<h3>` under them where it helps. Phrase most headings as the questions people search for.",
    "- 1,200 to 2,000 words in the body. Useful and specific beats long.",
    "- Link to at least two other pages on the site from within the text, chosen from the list below, using root-relative paths such as `/contact-us`. Link text describes the destination; never \"click here\".",
    "- Every image has alt text describing what it shows.",
    '- `seo.canonicalUrl`, `seo.ogTitle`, `seo.ogDescription`, `seo.ogImage`: always "". The site fills them from the post itself.',
    "- `seo.noindex`: always false.",
    "",
    "## Writing style",
    "",
    "- British English spelling (organisation, optimise, programme), plain words, short sentences, active voice.",
    "- Write for a busy decision-maker: lead with the answer, then explain how and why. No hype words (cutting-edge, world-class, revolutionary, seamless, unlock, leverage, game-changer, in today's fast-paced world).",
    '- Use "we" for Devaicon and "you" for the reader. Mention Devaicon only where it helps the reader, typically once near the end.',
    "- `subtitle`: one or two sentences (at most 600 characters) saying what the reader will learn. It shows under the title and in post listings.",
    "",
    "## The body",
    "",
    "`body` is one string of HTML. Use only these tags; anything else is dropped on import:",
    "",
    "- `<p>`, `<h2>`, `<h3>`, `<h4>`. No `<h1>`: the title is the page's only H1.",
    "- `<strong>`, `<em>`, `<u>`, `<s>`, `<code>`, `<br>`, and `<a href=\"…\">`. Links are https:// URLs or site paths starting with /.",
    "- `<ul>` and `<ol>` with `<li><p>…</p></li>` items.",
    "- `<blockquote><p>…</p></blockquote>` for a key point or quotation.",
    "- `<pre><code>…</code></pre>` for code, and `<hr>` for a break.",
    "- `<table>` with `<tr>`, `<th>` and `<td>`, each cell holding `<p>…</p>`, for real comparisons.",
    '- `<div data-callout><p>…</p></div>`: a highlighted box, e.g. a summary or "How Devaicon helps".',
    `- \`<figure data-size="100"><img src="…" alt="…"><figcaption>…</figcaption></figure>\` for an image from the brief. \`data-size\` is how much of the column it fills: ${IMAGE_SIZES.join(", ")}. The caption is optional.`,
    '- `<div data-cta="Name"></div>` places one of the calls to action listed below, by its exact name. Use at most one in the body, about halfway through.',
    "",
    "Put each top-level element on its own line. Open with a short `<div data-callout>` holding three to five key takeaways as a list.",
    "",
    "## Names from this site's Blog library",
    "",
    "`author`, `category`, `closingCta` and any `data-cta` must be one of these names exactly. Anything else is dropped on import.",
    "",
    "**Authors** (`author`):",
    "",
    ...(authors.length ? names(authors) : ['- None yet. Leave `author` as "".']),
    "",
    "**Categories** (`category`; pick the closest):",
    "",
    ...(categories.length ? names(categories) : ['- None yet. Leave `category` as "".']),
    "",
    "**Calls to action** (`closingCta`, shown at the end; and `data-cta` in the body):",
    "",
    ...(ctas.length
      ? ctas.map((c) => `- "${c.name}": ${c.heading}${c.buttonLabel ? ` (button: ${c.buttonLabel})` : ""}`)
      : ['- None yet. Leave `closingCta` as "" and put no `data-cta` in the body.']),
    "",
    "## The other fields",
    "",
    "- `tags`: 2 to 5 short topic tags, each at most 40 characters, e.g. `\"Cloud\"`.",
    "- `heroImage`: `{ \"url\": \"…\", \"alt\": \"…\" }` with an image from the brief, or both \"\".",
    "- `faqs`: 4 to 6 real questions readers ask, as `{ \"question\": \"…\", \"answer\": \"…\" }`. Answers are 2 to 4 sentences and make sense on their own (they become FAQ rich results). Don't repeat the questions as headings in the body.",
    '- `toc`: `{ "enabled": true, "depth": 3, "title": "On this page", "labels": [] }`. A label gives a long heading a shorter contents entry: `{ "heading": "the heading\'s exact text", "text": "Shorter" }`.',
    `- \`format\` is always "${POST_FILE_FORMAT}" and \`version\` is ${POST_FILE_VERSION}. \`exportedAt\` can be left out.`,
    "",
    "### Pages on the site you may link to",
    "",
    ...pages.map(([path, name]) => `- \`${path}\`: ${name}`),
    "",
    "## A complete example",
    "",
    "This shows the format only. Do not copy its wording or claims.",
    "",
    "```json",
    samplePostFile(library, new Date("2026-01-01T00:00:00Z")),
    "```",
    "",
    "## Before you answer",
    "",
    "Check that: the JSON parses; the body uses only the tags above and has no `<h1>`; the author, category and calls to action are names from the lists above; every link is a site path from the list or an https:// URL; the search title and meta description are within their lengths and contain the focus keyphrase; there are no invented facts.",
    "",
    "Reply with **only the JSON**, with no explanation before or after it, so it can be saved as `<slug>.json` and uploaded to the Devaicon admin panel.",
  ]);
}
