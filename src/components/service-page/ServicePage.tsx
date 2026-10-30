import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import RichText from "@/components/blog/RichText";
import CtaCard from "@/components/blog/CtaCard";
import FaqList from "@/components/blog/FaqList";
import { TocDisclosure, TocSidebar } from "@/components/blog/TableOfContents";
import { collectHeadings } from "@/lib/blog/toc";
import { brandedTitle, metaDescription } from "@/lib/seo";
import { faqPageSchema, serviceSchema } from "@/lib/seo/structured-data";
import type { ServicePage as ServicePageData } from "@/lib/service-pages/types";

const TOC_TITLE = "On this page";

/** Route metadata for a service page, from the same data the page renders. */
export function servicePageMetadata(page: ServicePageData): Metadata {
  const description = metaDescription(page.seo.description || page.subtitle);
  const image = page.ogImage ?? page.heroImage;
  return {
    title: brandedTitle(page.seo.title),
    description,
    keywords: page.seo.keywords,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      url: page.path,
      title: page.seo.title,
      description,
      images: [{ url: image, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description,
      images: [image],
    },
  };
}

/**
 * A service page laid out like an Insights post — hero, body with a table of
 * contents, FAQs and a closing call to action — but with its content set in
 * code, so it is fully rendered on the server and needs no API to load.
 */
export default function ServicePage({ page }: { page: ServicePageData }) {
  const toc = [
    ...collectHeadings(page.body).filter((h) => h.level <= 2),
    ...(page.faqs.length ? [{ id: "faq-heading", text: "FAQs", level: 2 }] : []),
  ];
  const closingCta = page.ctas[page.closingCtaId];
  const { icon: Icon } = page;

  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        schema={[
          serviceSchema({
            name: page.title,
            description: page.seo.description || page.subtitle,
            path: page.path,
            serviceType: page.serviceType,
            areaServed: page.areaServed,
          }),
          faqPageSchema(page.faqs),
        ]}
      />

      <PageHero
        breadcrumbs={[...page.parents, { name: page.title, path: page.path }]}
        title={page.title}
        subtitle={page.subtitle}
        icon={<Icon className="w-7 h-7 text-white" />}
        label={page.label}
        buttonText={page.heroButtonText}
        buttonLink="/contact-us"
        showButton={true}
        backgroundImage={page.heroImage}
        backgroundOpacity={0.5}
        metadata={undefined}
        metadataIcon={undefined}
      />

      <article className="max-w-6xl mx-auto px-6 sm:px-12 py-12 md:py-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
          <div className="min-w-0 max-w-3xl">
            <TocDisclosure title={TOC_TITLE} entries={toc} />
            <RichText doc={page.body} ctas={page.ctas} />
            <FaqList faqs={page.faqs} />
            {closingCta && <CtaCard cta={closingCta} />}
          </div>
          <TocSidebar title={TOC_TITLE} entries={toc} />
        </div>
      </article>

      {page.related.length > 0 && (
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16 md:py-20" aria-labelledby="related-heading">
          <div className="max-w-6xl mx-auto px-6 sm:px-12">
            <h2 id="related-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {page.relatedHeading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.related.map((r) => (
                <Link
                  key={r.path}
                  href={r.path}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-44 w-full">
                    <Image src={r.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4555A7] transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-600">{r.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#37469E]">
                      Learn more <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
