import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

const TONES = {
  // On the purple page heroes.
  dark: {
    link: "text-white/70 hover:text-white",
    current: "text-white",
    separator: "text-white/40",
  },
  light: {
    link: "text-gray-500 hover:text-[#3d234b]",
    current: "text-gray-900",
    separator: "text-gray-300",
  },
};

/**
 * The trail from Home to the current page, shown to readers and given to
 * search engines as BreadcrumbList structured data. Both come from the same
 * list, so what Google shows under a result is always what the page shows.
 *
 * The last entry is the current page and is not a link.
 *
 * @param {{
 *   trail: Array<{ name: string, path: string }>,
 *   tone?: "dark" | "light",
 *   className?: string,
 * }} props
 */
export default function Breadcrumbs({ trail, tone = "dark", className = "" }) {
  if (!trail || trail.length < 2) return null;
  const colors = TONES[tone] ?? TONES.dark;

  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.path} className="flex min-w-0 items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    aria-hidden
                    className={`h-3.5 w-3.5 shrink-0 ${colors.separator}`}
                  />
                )}
                {last ? (
                  <span
                    aria-current="page"
                    title={crumb.name}
                    className={`block max-w-[14rem] truncate font-medium sm:max-w-md ${colors.current}`}
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className={`inline-flex items-center gap-1 transition-colors ${colors.link}`}
                  >
                    {i === 0 && <Home aria-hidden className="h-3.5 w-3.5" />}
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
