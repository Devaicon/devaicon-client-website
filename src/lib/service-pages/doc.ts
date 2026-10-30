import type { DocNode } from "@/lib/blog/types";

// Builders for the editor's document format, so service pages written in code
// are drawn by the same renderer as Insights posts and pick up every block
// style the editor offers — headings, lists, callouts, tables and CTA cards.
//
// Text accepts two inline marks: **bold** and [label](/path).

const INLINE = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

function inline(text: string): DocNode[] {
  const out: DocNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push({ type: "text", text: text.slice(last, m.index) });
    out.push(
      m[1] !== undefined
        ? { type: "text", text: m[1], marks: [{ type: "bold" }] }
        : { type: "text", text: m[2], marks: [{ type: "link", attrs: { href: m[3] } }] }
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}

const item = (text: string): DocNode => ({ type: "listItem", content: [p(text)] });
const cell = (type: "tableHeader" | "tableCell", text: string): DocNode => ({
  type,
  content: [p(text)],
});

export const doc = (...content: DocNode[]): DocNode => ({ type: "doc", content });
export const p = (text: string): DocNode => ({ type: "paragraph", content: inline(text) });
export const h2 = (text: string): DocNode => ({ type: "heading", attrs: { level: 2 }, content: inline(text) });
export const h3 = (text: string): DocNode => ({ type: "heading", attrs: { level: 3 }, content: inline(text) });
export const ul = (...items: string[]): DocNode => ({ type: "bulletList", content: items.map(item) });
export const ol = (...items: string[]): DocNode => ({ type: "orderedList", content: items.map(item) });
export const callout = (...content: DocNode[]): DocNode => ({ type: "callout", content });
/** A full-width image, enlargeable on click; the caption shows beneath it. */
export const img = (src: string, alt: string, caption = ""): DocNode => ({
  type: "image",
  attrs: { src, alt, title: caption },
});
/** A CTA card; the id is a key of the page's `ctas`. */
export const cta = (ctaId: string): DocNode => ({ type: "ctaBlock", attrs: { ctaId } });

export const table = (head: string[], rows: string[][]): DocNode => ({
  type: "table",
  content: [
    { type: "tableRow", content: head.map((t) => cell("tableHeader", t)) },
    ...rows.map((r) => ({ type: "tableRow", content: r.map((t) => cell("tableCell", t)) })),
  ],
});
