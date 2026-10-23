import { ChevronDown } from "lucide-react";
import type { Heading } from "@/lib/blog/toc";

function TocList({ entries }: { entries: Heading[] }) {
  return (
    <ol className="space-y-2 text-sm">
      {entries.map((h) => (
        <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
          <a href={`#${h.id}`} className="text-gray-600 hover:text-[#37469E] leading-snug block">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Collapsed contents above the body, for screens without the sidebar. */
export function TocDisclosure({ title, entries }: { title: string; entries: Heading[] }) {
  return (
    <details className="group mb-10 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <nav aria-label={title} className="mt-4">
        <TocList entries={entries} />
      </nav>
    </details>
  );
}

/** Contents pinned beside the body on wide screens. */
export function TocSidebar({ title, entries }: { title: string; entries: Heading[] }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label={title} className="sticky top-28">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
        <TocList entries={entries} />
      </nav>
    </aside>
  );
}
