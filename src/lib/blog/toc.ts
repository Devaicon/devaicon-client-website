import type { DocNode, TocSettings } from "./types";

// Headings and their anchors. The editor's table-of-contents panel and the
// site's renderer both call collectHeadings on the same document, so an
// anchor the editor shows is the anchor the page links to.

export type Heading = { id: string; text: string; level: number };

export function nodeText(node: DocNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(nodeText).join("");
}

export function anchorFor(text: string): string {
  return (
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section"
  );
}

/** Every heading in document order (callouts included), with unique anchors. */
export function collectHeadings(doc: DocNode): Heading[] {
  const out: Heading[] = [];
  const seen = new Map<string, number>();
  const visit = (n: DocNode) => {
    if (n.type === "heading") {
      const text = nodeText(n).trim();
      if (text) {
        const base = anchorFor(text);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        out.push({
          id: count === 0 ? base : `${base}-${count + 1}`,
          text,
          level: Number(n.attrs?.level ?? 2),
        });
      }
      return;
    }
    for (const c of n.content ?? []) visit(c);
  };
  visit(doc);
  return out;
}

/** The entries a post's table of contents shows, with any renamed wording. */
export function tocEntries(doc: DocNode, toc: TocSettings): Heading[] {
  const labels = new Map(toc.labels.map((l) => [l.id, l.text]));
  return collectHeadings(doc)
    .filter((h) => h.level <= toc.depth)
    .map((h) => ({ ...h, text: labels.get(h.id) || h.text }));
}
