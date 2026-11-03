import type { DocNode } from "@/lib/blog/types";
import { inline } from "./doc";

/**
 * The small Markdown that block text is written in, turned into the editor's
 * document format so RichText draws it (and checks every link) as it does
 * for Insights posts.
 *
 *   Blank lines separate paragraphs.
 *   Lines starting "- " or "* " make a bulleted list; "1. " a numbered one.
 *   "### " (or "## ") starts a subheading. Sections get their H2 from the
 *   block's own heading, so headings in text are always H3.
 *   **bold** and [label](/path) work inside any line.
 */
export function markdownToDoc(source: string): DocNode {
  const content: DocNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) content.push({ type: "paragraph", content: inline(para.join(" ")) });
    para = [];
  };
  const flushList = () => {
    if (list) {
      content.push({
        type: list.ordered ? "orderedList" : "bulletList",
        content: list.items.map((t) => ({ type: "listItem", content: [{ type: "paragraph", content: inline(t) }] })),
      });
    }
    list = null;
  };

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    const heading = /^#{2,4}\s+(.*)$/.exec(line);

    if (!line) {
      flushPara();
      flushList();
    } else if (heading) {
      flushPara();
      flushList();
      content.push({ type: "heading", attrs: { level: 3 }, content: inline(heading[1]) });
    } else if (bullet || numbered) {
      flushPara();
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else if (list) {
      // A line under a list item carries on that item.
      list.items[list.items.length - 1] += ` ${line}`;
    } else {
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return { type: "doc", content };
}

/** The words in a piece of block text, for the SEO checks' counts. */
export function markdownWords(source: string): number {
  return source
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1")
    .replace(/[#*\-•|]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}
