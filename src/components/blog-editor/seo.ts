import type { AdminPost, DocNode } from "@/lib/blog/types";
import { collectHeadings, nodeText } from "@/lib/blog/toc";

export const TITLE_IDEAL = [30, 60] as const;
export const DESCRIPTION_IDEAL = [120, 160] as const;

export type Check = { ok: boolean; label: string };

function walk(node: DocNode, visit: (n: DocNode) => void) {
  visit(node);
  for (const c of node.content ?? []) walk(c, visit);
}

export function wordCount(doc: DocNode): number {
  return nodeText(doc).split(/\s+/).filter(Boolean).length;
}

/** Text of the first paragraph with words in it: where a reader starts. */
function firstParagraph(doc: DocNode): string {
  let found = "";
  walk(doc, (n) => {
    if (!found && n.type === "paragraph") found = nodeText(n).trim();
  });
  return found;
}

const has = (text: string, phrase: string) =>
  phrase.length > 0 && text.toLowerCase().includes(phrase.toLowerCase());

/**
 * Plain checks an editor can act on. They're advice, not gates: nothing here
 * stops a post being published (see publishProblems on the server for that).
 */
export function seoChecks(post: AdminPost): Check[] {
  const title = post.seo.metaTitle || post.title;
  const description = post.seo.metaDescription || post.subtitle;
  const key = post.seo.focusKeyphrase.trim();
  const headings = collectHeadings(post.body);
  const words = wordCount(post.body);

  let imagesWithoutAlt = 0;
  let internalLinks = 0;
  walk(post.body, (n) => {
    if (n.type === "image" && !String(n.attrs?.alt ?? "").trim()) imagesWithoutAlt += 1;
    for (const m of n.marks ?? []) {
      const href = String(m.attrs?.href ?? "");
      if (m.type === "link" && (href.startsWith("/") || /devaicon\.com/i.test(href))) internalLinks += 1;
    }
  });

  const checks: Check[] = [
    {
      ok: title.length >= TITLE_IDEAL[0] && title.length <= TITLE_IDEAL[1],
      label: `Search title is ${title.length} characters (aim for ${TITLE_IDEAL[0]}–${TITLE_IDEAL[1]})`,
    },
    {
      ok: description.length >= DESCRIPTION_IDEAL[0] && description.length <= DESCRIPTION_IDEAL[1],
      label: post.seo.metaDescription
        ? `Meta description is ${description.length} characters (aim for ${DESCRIPTION_IDEAL[0]}–${DESCRIPTION_IDEAL[1]})`
        : "No meta description; the subtitle is used instead",
    },
    { ok: words >= 300, label: `${words} words in the body (aim for 300 or more)` },
    { ok: headings.filter((h) => h.level === 2).length >= 2, label: "At least two H2 sections" },
    { ok: internalLinks > 0, label: "Links to at least one other page on the site" },
    { ok: !post.heroImage.url || Boolean(post.heroImage.alt.trim()), label: "Hero image has alt text" },
    {
      ok: imagesWithoutAlt === 0,
      label: imagesWithoutAlt ? `${imagesWithoutAlt} image(s) in the body have no alt text` : "Every body image has alt text",
    },
  ];

  if (!key) {
    checks.unshift({ ok: false, label: "Set a focus keyphrase to check keyword use" });
  } else {
    checks.unshift(
      { ok: has(title, key), label: "Focus keyphrase is in the search title" },
      { ok: has(description, key), label: "Focus keyphrase is in the meta description" },
      { ok: has(post.slug.replace(/-/g, " "), key), label: "Focus keyphrase is in the URL" },
      { ok: has(firstParagraph(post.body), key), label: "Focus keyphrase is in the first paragraph" },
      { ok: headings.some((h) => has(h.text, key)), label: "Focus keyphrase is in a subheading" },
    );
  }
  return checks;
}
