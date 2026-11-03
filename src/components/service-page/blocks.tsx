import Link from "next/link";
import { ArrowRight, CircleCheck, Quote } from "lucide-react";
import RichText from "@/components/blog/RichText";
import CtaCard from "@/components/blog/CtaCard";
import FaqList from "@/components/blog/FaqList";
import ZoomableImage from "@/components/blog/ZoomableImage";
import { safeHref, safeSrc } from "@/components/blog/safeUrl";
import type { CtaStyle } from "@/lib/blog/types";
import type { Block } from "@/lib/service-pages/blocks";
import { ServiceIcon } from "@/lib/service-pages/icons";
import { markdownToDoc } from "@/lib/service-pages/markdown";

// How each kind of content block looks on a service page. Values come from
// the database or an imported file, so every one is read defensively: a
// missing or malformed field draws nothing rather than breaking the page.

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
type Item = Record<string, unknown>;

const H2 = "text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-28";
const LEAD = "text-gray-700 leading-relaxed mb-6 text-lg";
const NO_CTAS = {};
// Spelled out so Tailwind finds the class names.
const STAT_COLUMNS: Record<number, string> = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

function SectionHeading({ text, id }: { text: string; id?: string }) {
  return text ? (
    <h2 id={id} className={H2}>
      {text}
    </h2>
  ) : null;
}

function Markdown({ text }: { text: string }) {
  return text ? <RichText doc={markdownToDoc(text)} ctas={NO_CTAS} /> : null;
}

/** A heading and introduction, as most blocks open. */
function Opening({ block, id }: { block: Block; id?: string }) {
  return (
    <>
      <SectionHeading text={str(block.heading)} id={id} />
      <Markdown text={str(block.intro)} />
    </>
  );
}

export function ServiceBlock({ block, id }: { block: Block; id?: string }) {
  switch (block.type) {
    case "richText":
      return (
        <section>
          <SectionHeading text={str(block.heading)} id={id} />
          <Markdown text={str(block.body)} />
        </section>
      );

    case "featureGrid": {
      const items = list<Item>(block.items).filter((i) => str(i.title));
      const three = block.columns === "3";
      return (
        <section>
          <Opening block={block} id={id} />
          <div className={`mb-8 grid gap-5 sm:grid-cols-2 ${three ? "xl:grid-cols-3" : ""}`}>
            {items.map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-b from-[#3d234b] to-[#2a1834]">
                  <ServiceIcon icon={item.icon} className="h-5 w-5 text-white" aria-hidden />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{str(item.title)}</h3>
                {str(item.text) && <p className="whitespace-pre-line leading-relaxed text-gray-600">{str(item.text)}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "steps": {
      const items = list<Item>(block.items).filter((i) => str(i.title));
      return (
        <section>
          <Opening block={block} id={id} />
          <ol className="relative mb-8 space-y-8 border-l-2 border-[#4555A7]/20 pl-8">
            {items.map((item, i) => (
              <li key={i} className="relative">
                <span
                  className="absolute -left-[calc(3.125rem+1px)] flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#3d234b] to-[#2a1834] text-sm font-bold text-white ring-4 ring-white"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="mb-1.5 text-xl font-bold text-gray-900">{str(item.title)}</h3>
                {str(item.text) && <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700">{str(item.text)}</p>}
              </li>
            ))}
          </ol>
        </section>
      );
    }

    case "stats": {
      const items = list<Item>(block.items).filter((i) => str(i.value));
      return (
        <section>
          <SectionHeading text={str(block.heading)} id={id} />
          <div className="my-10 rounded-2xl border border-[#4555A7]/15 bg-gradient-to-br from-purple-50 to-blue-50 p-8">
            <dl className={`grid gap-8 sm:grid-cols-2 ${STAT_COLUMNS[items.length] ?? ""}`}>
              {items.map((item, i) => (
                <div key={i} className="flex flex-col-reverse">
                  <dt className="mt-1 text-gray-700">{str(item.label)}</dt>
                  <dd className="text-4xl font-bold tracking-tight text-[#37469E]">{str(item.value)}</dd>
                </div>
              ))}
            </dl>
            {str(block.note) && <p className="mt-6 text-sm text-gray-500">{str(block.note)}</p>}
          </div>
        </section>
      );
    }

    case "checklist":
      return (
        <section>
          <Opening block={block} id={id} />
          <ul className="mb-8 space-y-3">
            {list<string>(block.items).map(str).filter(Boolean).map((item, i) => (
              <li key={i} className="flex gap-3 text-lg leading-relaxed text-gray-700">
                <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-[#4555A7]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "comparisonTable": {
      const columns = list<string>(block.columns).map(str);
      const rows = list<unknown[]>(block.rows).map((r) => list<string>(r).map(str));
      return (
        <section>
          <Opening block={block} id={id} />
          <figure className="my-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-base text-gray-700">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {columns.map((c, i) => (
                      <th key={i} scope="col" className="bg-gray-50 px-4 py-3 align-top font-semibold text-gray-900">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={r} className="border-b border-gray-200">
                      {columns.map((_, c) =>
                        c === 0 ? (
                          <th key={c} scope="row" className="px-4 py-3 align-top font-semibold text-gray-900">
                            {row[c] ?? ""}
                          </th>
                        ) : (
                          <td key={c} className="px-4 py-3 align-top">
                            {row[c] ?? ""}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {str(block.caption) && <figcaption className="mt-3 text-sm italic text-gray-500">{str(block.caption)}</figcaption>}
          </figure>
        </section>
      );
    }

    case "callout":
      return (
        <section className="my-12 rounded-lg border border-gray-300 bg-gray-200 p-8 shadow-lg md:p-12 [&_h3:first-child]:mt-0 [&>*:last-child>*:last-child]:mb-0">
          {str(block.heading) && <h3 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">{str(block.heading)}</h3>}
          <div>
            <Markdown text={str(block.body)} />
          </div>
        </section>
      );

    case "imageText": {
      const src = safeSrc(block.image);
      const left = block.imagePosition === "left";
      return (
        <section>
          <SectionHeading text={str(block.heading)} id={id} />
          <div className="mb-8 grid items-center gap-8 md:grid-cols-2">
            <div className={left ? "md:order-2" : ""}>
              <Markdown text={str(block.body)} />
            </div>
            {src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={str(block.imageAlt)}
                loading="lazy"
                className={`w-full rounded-xl object-cover shadow-md ${left ? "md:order-1" : ""}`}
              />
            )}
          </div>
        </section>
      );
    }

    case "image": {
      const src = safeSrc(block.src);
      if (!src) return null;
      return (
        <figure className="mx-auto my-10">
          <ZoomableImage src={src} alt={str(block.alt)} />
          {str(block.caption) && (
            <figcaption className="mt-3 text-center text-sm italic text-gray-500">{str(block.caption)}</figcaption>
          )}
        </figure>
      );
    }

    case "quote": {
      const who = [str(block.name), str(block.role)].filter(Boolean);
      return (
        <figure className="my-12 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 p-8 md:p-10">
          <Quote className="mb-4 h-8 w-8 text-[#4555A7]/40" aria-hidden />
          <blockquote className="whitespace-pre-line text-xl font-medium leading-relaxed text-gray-900 md:text-2xl">
            {str(block.quote)}
          </blockquote>
          {who.length > 0 && (
            <figcaption className="mt-6 text-gray-600">
              {str(block.name) && <span className="font-semibold text-gray-900">{str(block.name)}</span>}
              {str(block.name) && str(block.role) && ", "}
              {str(block.role)}
            </figcaption>
          )}
        </figure>
      );
    }

    case "techStack":
      return (
        <section>
          <Opening block={block} id={id} />
          <ul className="mb-8 flex flex-wrap gap-2.5">
            {list<string>(block.items).map(str).filter(Boolean).map((item, i) => (
              <li
                key={i}
                className="rounded-full border border-[#4555A7]/20 bg-purple-50 px-4 py-1.5 text-sm font-medium text-[#37469E]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      );

    case "cta": {
      if (!str(block.heading) || !str(block.buttonLabel)) return null;
      const style = (["panel", "banner", "inline"].includes(String(block.style)) ? block.style : "panel") as CtaStyle;
      return (
        <CtaCard
          cta={{
            id: "",
            name: "",
            heading: str(block.heading),
            body: str(block.body),
            buttonLabel: str(block.buttonLabel),
            buttonUrl: str(block.buttonUrl) || "/contact-us",
            style,
          }}
        />
      );
    }

    case "faq": {
      const faqs = list<Item>(block.items)
        .map((i) => ({ question: str(i.question), answer: str(i.answer) }))
        .filter((f) => f.question && f.answer);
      return <FaqList faqs={faqs} />;
    }

    case "related": {
      const items = list<Item>(block.items).filter((i) => str(i.title) && safeHref(i.path));
      if (!items.length) return null;
      return (
        <section className="mt-14">
          {str(block.heading) && <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">{str(block.heading)}</h2>}
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((item, i) => {
              const image = safeSrc(item.image);
              return (
                <Link
                  key={i}
                  href={safeHref(item.path)!}
                  className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" loading="lazy" className="h-40 w-full object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#4555A7]">
                      {str(item.title)}
                    </h3>
                    {str(item.description) && <p className="text-sm text-gray-600">{str(item.description)}</p>}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#37469E]">
                      Learn more <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}

/** FAQs a page's FAQ block holds, for its structured data. */
export function blockFaqs(blocks: Block[]) {
  const faq = blocks.find((b) => b.type === "faq");
  return list<Item>(faq?.items)
    .map((i) => ({ question: str(i.question), answer: str(i.answer) }))
    .filter((f) => f.question && f.answer);
}
