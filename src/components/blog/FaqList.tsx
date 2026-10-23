import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/blog/types";

/**
 * Questions and answers as disclosure rows. Answers stay in the HTML while
 * closed, so search engines read them whether or not anyone opens one.
 */
export default function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {faqs.map((f, i) => (
          <details key={i} className="group p-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold text-gray-900">
              {f.question}
              <ChevronDown className="mt-1 h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
