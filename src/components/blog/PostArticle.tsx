import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import PageHero from "@/components/PageHero";
import type { PostSummary, PublicPost } from "@/lib/blog/types";
import { tocEntries } from "@/lib/blog/toc";
import RichText from "./RichText";
import CtaCard from "./CtaCard";
import { safeHref, safeSrc } from "./safeUrl";

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// For CSS url(): the characters that could end the value are encoded.
const cssUrl = (src: string) => src.replace(/[()'"\\\s]/g, (c) => encodeURIComponent(c));

/**
 * A post as readers see it. Shared by the public page and the editor's
 * preview, so what an editor previews is exactly what gets published.
 */
export default function PostArticle({
  post,
  related = [],
}: {
  post: PublicPost;
  related?: PostSummary[];
}) {
  const hero = safeSrc(post.heroImage.url);
  const toc = post.toc.enabled ? tocEntries(post.body, post.toc) : [];
  const showToc = toc.length >= 2;
  const author = post.author;
  const avatar = author ? safeSrc(author.avatarUrl) : null;

  const tocList = (
    <ol className="space-y-2 text-sm">
      {toc.map((h) => (
        <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
          <a href={`#${h.id}`} className="text-gray-600 hover:text-[#37469E] leading-snug block">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: post.title, path: `/insights/${post.slug}` },
        ]}
        title={post.title}
        subtitle={post.subtitle}
        icon={<BookOpen className="w-7 h-7 text-white" />}
        label={post.category?.name ?? "Insights"}
        buttonText="Back to Insights"
        buttonLink="/insights"
        showButton={true}
        backgroundImage={hero ? cssUrl(hero) : undefined}
        backgroundOpacity={0.5}
        metadata={undefined}
        metadataIcon={undefined}
      />

      <article className="max-w-6xl mx-auto px-6 sm:px-12 py-12 md:py-16">
        <header className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
          {post.category && (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#4555A7] to-[#7C5BA8] text-white text-xs font-semibold rounded">
              {post.category.name}
            </span>
          )}
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
          {author && (
            <>
              <span aria-hidden>·</span>
              <span>By {author.name}</span>
            </>
          )}
        </header>

        <div className={showToc ? "lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12" : ""}>
          <div className="min-w-0 max-w-3xl">
            {hero && (
              <figure className="mb-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero}
                  alt={post.heroImage.alt}
                  fetchPriority="high"
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </figure>
            )}

            {showToc && (
              <details className="group mb-10 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                  {post.toc.title}
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <nav aria-label={post.toc.title} className="mt-4">
                  {tocList}
                </nav>
              </details>
            )}

            <RichText doc={post.body} ctas={post.ctas} />

            {post.faqs.length > 0 && (
              <section aria-labelledby="faq-heading" className="mt-14">
                <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Frequently asked questions
                </h2>
                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                  {post.faqs.map((f, i) => (
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
            )}

            {post.closingCta && <CtaCard cta={post.closingCta} />}

            <footer className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-start justify-between gap-6">
              {author && (
                <div className="flex items-start gap-4 max-w-xl">
                  {avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="text-lg font-bold text-gray-900">{author.name}</p>
                    {author.jobTitle && <p className="text-sm text-gray-600">{author.jobTitle}</p>}
                    {author.bio && <p className="mt-2 text-sm text-gray-700 leading-relaxed">{author.bio}</p>}
                    {author.links.length > 0 && (
                      <p className="mt-2 flex flex-wrap gap-3 text-sm">
                        {author.links.map((l) => {
                          const href = safeHref(l);
                          if (!href) return null;
                          return (
                            <a key={l} href={href} rel="noopener noreferrer me" target="_blank" className="text-[#37469E] underline">
                              {new URL(href, "https://devaicon.com").hostname.replace(/^www\./, "")}
                            </a>
                          );
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {post.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-4 py-2 text-white text-xs font-semibold rounded-full shadow-sm"
                      style={{ background: "#4A2D58" }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </footer>
          </div>

          {showToc && (
            <aside className="hidden lg:block">
              <nav aria-label={post.toc.title} className="sticky top-28">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {post.toc.title}
                </p>
                {tocList}
              </nav>
            </aside>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Related articles</h2>
              <Link
                href="/insights"
                className="px-6 py-3 hover:shadow-lg text-white font-semibold rounded-lg transition-all duration-300"
                style={{ background: "#37469E" }}
              >
                View all posts
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((r) => {
                const img = safeSrc(r.heroImage.url);
                return (
                  <Link
                    key={r.id}
                    href={`/insights/${r.slug}`}
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" loading="lazy" className="h-48 w-full object-cover" />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                        {r.category && (
                          <span className="inline-block px-3 py-1 text-white text-xs font-semibold rounded" style={{ background: "#4A2D58" }}>
                            {r.category.name}
                          </span>
                        )}
                        {r.readingMinutes} min read
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4555A7] transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{r.subtitle}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#37469E]">
                        Read more <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
