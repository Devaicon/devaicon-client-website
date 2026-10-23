"use client";

import { createContext, useContext } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import type { DOMOutputSpec } from "@tiptap/pm/model";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extensions";
import { Megaphone, X } from "lucide-react";
import { imageSize } from "@/lib/blog/images";
import type { Cta } from "@/lib/blog/types";

// Everything the editor can produce. The site's renderer (components/blog/
// RichText.tsx) draws exactly these node types; a new one here needs a case
// there too, or it will be saved but never shown.

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: { toggleCallout: () => ReturnType };
    ctaBlock: { insertCta: (ctaId: string) => ReturnType };
  }
}

/** A highlighted box around a run of blocks, e.g. "How Devaicon helps". */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  parseHTML: () => [{ tag: "div[data-callout]" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { "data-callout": "", class: "post-editor-callout" }),
    0,
  ],
  addCommands() {
    return {
      toggleCallout:
        () =>
        ({ commands }) =>
          commands.toggleWrap(this.name),
    };
  },
});

/** CTAs the editor can show a preview of, by id. */
export const CtaLibraryContext = createContext<Record<string, Cta>>({});

function CtaNodeView({ node, deleteNode, selected }: ReactNodeViewProps) {
  const ctas = useContext(CtaLibraryContext);
  const cta = ctas[String(node.attrs.ctaId)];
  return (
    <NodeViewWrapper
      data-drag-handle
      className={`my-4 flex items-start gap-3 rounded-lg border-2 border-dashed p-4 ${
        selected ? "border-violet-500" : "border-violet-300 dark:border-violet-800"
      } bg-violet-50/60 dark:bg-violet-950/30`}
      contentEditable={false}
    >
      <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
      <div className="min-w-0 flex-1 text-sm">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
          Call to action{cta ? ` · ${cta.style}` : ""}
        </div>
        {cta ? (
          <>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">{cta.heading}</div>
            <div className="text-neutral-600 dark:text-neutral-400">
              Button: {cta.buttonLabel} → {cta.buttonUrl}
            </div>
          </>
        ) : (
          <div className="text-red-600">This CTA was deleted from the library and won&apos;t be shown.</div>
        )}
      </div>
      <button
        type="button"
        onClick={deleteNode}
        aria-label="Remove call to action"
        className="rounded p-1 text-neutral-500 hover:bg-violet-100 hover:text-neutral-900 dark:hover:bg-violet-900/50"
      >
        <X className="h-4 w-4" />
      </button>
    </NodeViewWrapper>
  );
}

/** A library CTA placed in the body. Stores only its id, so edits to the CTA reach every post. */
export const CtaBlock = Node.create({
  name: "ctaBlock",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes: () => ({ ctaId: { default: null } }),
  parseHTML: () => [{ tag: "div[data-cta-id]", getAttrs: (el) => ({ ctaId: (el as HTMLElement).dataset.ctaId }) }],
  renderHTML: ({ node }) => ["div", { "data-cta-id": node.attrs.ctaId }],
  addNodeView() {
    return ReactNodeViewRenderer(CtaNodeView);
  },
  addCommands() {
    return {
      insertCta:
        (ctaId: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { ctaId } }),
    };
  },
});

/**
 * A body image, drawn as a figure: the picture, and its title as the caption
 * underneath. `size` is how wide it shows in the column.
 *
 * Besides a bare <img>, a <figure> holding an <img> and a <figcaption> reads
 * as one image, which is how exported and imported post files write them.
 */
export const BodyImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 100,
        parseHTML: (el: HTMLElement) => {
          const v = el.getAttribute("data-size") ?? el.querySelector("img")?.getAttribute("data-size");
          return v == null ? null : imageSize(v);
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure",
        // Ahead of the plain <img> rule, so the figure's image isn't read twice.
        priority: 60,
        getAttrs: (el) => {
          const img = (el as HTMLElement).querySelector("img");
          const src = img?.getAttribute("src")?.trim();
          if (!img || !src || src.startsWith("data:")) return false;
          return {
            src,
            alt: img.getAttribute("alt"),
            title: el.querySelector("figcaption")?.textContent?.trim() || img.getAttribute("title"),
          };
        },
      },
      ...(this.parent?.() ?? []),
    ];
  },
  renderHTML({ node }) {
    const { src, alt, title } = node.attrs;
    const size = imageSize(node.attrs.size);
    const figure: Record<string, string> = size === 100 ? {} : { "data-size": String(size) };
    const caption: DOMOutputSpec[] = title ? [["figcaption", {}, String(title)]] : [];
    return ["figure", figure, ["img", { src, alt: alt ?? "" }], ...caption];
  },
});

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["mailto", "tel"],
      HTMLAttributes: { rel: "noopener noreferrer", target: null },
    },
  }),
  BodyImage.configure({ inline: false, allowBase64: false }),
  TableKit.configure({ table: { resizable: false } }),
  Placeholder.configure({
    placeholder: ({ node }) =>
      node.type.name === "heading" ? "Heading" : "Write, or paste from a document…",
  }),
  Callout,
  CtaBlock,
];
