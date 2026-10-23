import { Fragment, type ReactNode } from "react";
import type { Cta, DocNode } from "@/lib/blog/types";
import { collectHeadings, nodeText } from "@/lib/blog/toc";
import { imageSize, type ImageSize } from "@/lib/blog/images";
import CtaCard from "./CtaCard";
import { safeHref, safeSrc } from "./safeUrl";
import ZoomableImage from "./ZoomableImage";

/**
 * Renders an editor document as React elements — never as an HTML string.
 * Only the node and mark types below are drawn; anything else in a stored
 * document is skipped, so the editor can grow new features without the site
 * rendering something it hasn't been taught to render safely.
 */
export default function RichText({
  doc,
  ctas,
}: {
  doc: DocNode;
  ctas: Record<string, Cta>;
}) {
  // Anchors come from the same function the table of contents uses, handed
  // out in document order as headings are met.
  const anchors = collectHeadings(doc).map((h) => h.id);
  const ctx = { ctas, anchors, next: 0 };
  return <>{renderChildren(doc, ctx)}</>;
}

type Ctx = { ctas: Record<string, Cta>; anchors: string[]; next: number };

function renderChildren(node: DocNode, ctx: Ctx): ReactNode {
  return (node.content ?? []).map((child, i) => (
    <Fragment key={i}>{renderNode(child, ctx)}</Fragment>
  ));
}

const P = "text-gray-700 leading-relaxed mb-6 text-lg";
// Narrow images still take the full width on phones, where a quarter of the
// column would be too small to read.
const FIGURE_WIDTH: Record<ImageSize, string> = {
  25: "sm:w-1/4",
  50: "sm:w-1/2",
  75: "sm:w-3/4",
  100: "",
};
const HEADING: Record<number, string> = {
  2: "text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-28",
  3: "text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4 scroll-mt-28",
  4: "text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-3 scroll-mt-28",
};

function renderNode(node: DocNode, ctx: Ctx): ReactNode {
  switch (node.type) {
    case "paragraph":
      if (!node.content?.length) return null;
      return <p className={P}>{renderChildren(node, ctx)}</p>;

    case "heading": {
      const level = [2, 3, 4].includes(Number(node.attrs?.level)) ? Number(node.attrs?.level) : 2;
      // Same test collectHeadings applies, so the nth anchor lands on the nth heading.
      const id = nodeText(node).trim() ? ctx.anchors[ctx.next++] : undefined;
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      return (
        <Tag id={id} className={HEADING[level]}>
          {renderChildren(node, ctx)}
        </Tag>
      );
    }

    case "text":
      return renderText(node);

    case "hardBreak":
      return <br />;

    case "bulletList":
      return <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700">{renderChildren(node, ctx)}</ul>;

    case "orderedList": {
      const start = Number(node.attrs?.start ?? 1);
      return (
        <ol start={start > 1 ? start : undefined} className="list-decimal pl-6 space-y-3 mb-6 text-gray-700">
          {renderChildren(node, ctx)}
        </ol>
      );
    }

    case "listItem":
      // List paragraphs drop their bottom margin; the list spaces its items.
      return (
        <li className="text-lg leading-relaxed [&>p]:mb-0 [&>ul]:mt-3 [&>ol]:mt-3 [&>ul]:mb-0 [&>ol]:mb-0">
          {renderChildren(node, ctx)}
        </li>
      );

    case "blockquote":
      return (
        <blockquote className="my-10 border-l-4 border-[#4555A7] bg-gray-50 px-6 py-4 italic text-gray-800 [&>p]:mb-2 [&>p:last-child]:mb-0">
          {renderChildren(node, ctx)}
        </blockquote>
      );

    case "callout":
      return (
        <section className="my-12 rounded-lg border border-gray-300 bg-gray-200 p-8 md:p-12 shadow-lg [&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0 [&>*:last-child]:mb-0">
          {renderChildren(node, ctx)}
        </section>
      );

    case "codeBlock":
      return (
        <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{(node.content ?? []).map((c) => c.text ?? "").join("")}</code>
        </pre>
      );

    case "horizontalRule":
      return <hr className="my-10 border-gray-200" />;

    case "image": {
      const src = safeSrc(node.attrs?.src);
      if (!src) return null;
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      const caption = typeof node.attrs?.title === "string" ? node.attrs.title : "";
      return (
        <figure className={`mx-auto my-10 ${FIGURE_WIDTH[imageSize(node.attrs?.size)]}`}>
          <ZoomableImage src={src} alt={alt} />
          {caption && (
            <figcaption className="mt-3 text-center text-sm italic text-gray-500">{caption}</figcaption>
          )}
        </figure>
      );
    }

    case "table":
      return (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-base text-gray-700">
            <tbody>{renderChildren(node, ctx)}</tbody>
          </table>
        </div>
      );
    case "tableRow":
      return <tr className="border-b border-gray-200">{renderChildren(node, ctx)}</tr>;
    case "tableHeader":
      return (
        <th className="bg-gray-50 px-4 py-3 font-semibold text-gray-900 align-top [&>p]:mb-0 [&>p]:text-base">
          {renderChildren(node, ctx)}
        </th>
      );
    case "tableCell":
      return <td className="px-4 py-3 align-top [&>p]:mb-0 [&>p]:text-base">{renderChildren(node, ctx)}</td>;

    case "ctaBlock": {
      const cta = ctx.ctas[String(node.attrs?.ctaId ?? "")];
      return cta ? <CtaCard cta={cta} /> : null;
    }

    default:
      return null;
  }
}

function renderText(node: DocNode): ReactNode {
  let out: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold":
        out = <strong className="font-semibold text-gray-900">{out}</strong>;
        break;
      case "italic":
        out = <em>{out}</em>;
        break;
      case "underline":
        out = <u>{out}</u>;
        break;
      case "strike":
        out = <s>{out}</s>;
        break;
      case "code":
        out = <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em]">{out}</code>;
        break;
      case "link": {
        const href = safeHref(mark.attrs?.href);
        if (!href) break;
        const external = /^https?:/i.test(href);
        out = (
          <a
            href={href}
            className="font-medium text-[#37469E] underline underline-offset-2 hover:text-[#2a1834]"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {out}
          </a>
        );
        break;
      }
      default:
        break;
    }
  }
  return out;
}
