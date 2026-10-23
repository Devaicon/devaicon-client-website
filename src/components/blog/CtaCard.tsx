import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Cta } from "@/lib/blog/types";
import { safeHref } from "./safeUrl";

/** A call to action from the library, in one of its three styles. */
export default function CtaCard({ cta }: { cta: Cta }) {
  const href = safeHref(cta.buttonUrl) ?? "/contact-us";
  const external = /^https?:/i.test(href);
  const button = (light: boolean) => (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-300 hover:shadow-lg ${
        light
          ? "bg-white text-[#2a1834] hover:bg-gray-100"
          : "text-white bg-gradient-to-b from-[#3d234b] to-[#2a1834] hover:from-[#4a3a6e] hover:to-[#3a1a4a]"
      }`}
    >
      {cta.buttonLabel}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );

  if (cta.style === "banner") {
    return (
      <aside className="my-10 rounded-2xl bg-gradient-to-b from-[#3d234b] to-[#2a1834] p-8 md:p-10 text-white">
        <p className="text-2xl md:text-3xl font-bold mb-3">{cta.heading}</p>
        {cta.body && <p className="text-gray-200 text-lg mb-6 leading-relaxed">{cta.body}</p>}
        {button(true)}
      </aside>
    );
  }

  if (cta.style === "inline") {
    return (
      <aside className="my-8 flex flex-col gap-4 rounded-xl border border-[#4555A7]/20 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-gray-900">{cta.heading}</p>
          {cta.body && <p className="text-gray-600">{cta.body}</p>}
        </div>
        <div className="shrink-0">{button(false)}</div>
      </aside>
    );
  }

  return (
    <aside className="my-10 rounded-xl border-2 border-[#4555A7]/20 bg-gradient-to-br from-purple-50 to-blue-50 p-8 shadow-sm">
      <p className="text-2xl font-bold text-gray-900 mb-4">{cta.heading}</p>
      {cta.body && <p className="text-gray-700 text-lg mb-6 leading-relaxed">{cta.body}</p>}
      {button(false)}
    </aside>
  );
}
