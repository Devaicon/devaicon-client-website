import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { TocDisclosure, TocSidebar } from "@/components/blog/TableOfContents";
import { safeHref, safeSrc } from "@/components/blog/safeUrl";
import { faqPageSchema, serviceSchema } from "@/lib/seo/structured-data";
import { ServiceIcon } from "@/lib/service-pages/icons";
import { servicePath, type ServicePageContent } from "@/lib/service-pages/managed";
import { breadcrumbTrail, pageOutline, searchDescription } from "@/lib/service-pages/seo";
import { ServiceBlock, blockFaqs } from "./blocks";

const TOC_TITLE = "On this page";

/**
 * A service page built in the dashboard: the same hero, contents and article
 * column as the service pages written in code, with its body drawn from
 * content blocks. Rendered on the server for the site, and in the browser for
 * the dashboard's preview.
 */
export default function BlockServicePage({ page }: { page: ServicePageContent }) {
  const { anchors, toc } = pageOutline(page.blocks);
  const heroImage = safeSrc(page.heroImage) ?? undefined;

  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        schema={[
          serviceSchema({
            name: page.title,
            description: searchDescription(page),
            path: servicePath(page.slug),
            serviceType: page.serviceType || undefined,
            areaServed: page.areaServed || undefined,
          }),
          faqPageSchema(blockFaqs(page.blocks)),
        ]}
      />

      <PageHero
        breadcrumbs={breadcrumbTrail(page)}
        title={page.title}
        subtitle={page.subtitle}
        icon={<ServiceIcon icon={page.icon} className="w-7 h-7 text-white" />}
        label={page.label}
        buttonText={page.heroButtonText || "Talk to an expert"}
        buttonLink={safeHref(page.heroButtonLink) ?? "/contact-us"}
        showButton={true}
        backgroundImage={heroImage}
        backgroundOpacity={0.5}
        metadata={undefined}
        metadataIcon={undefined}
      />

      <article className="max-w-6xl mx-auto px-6 sm:px-12 py-12 md:py-16">
        <div className={toc.length >= 2 ? "lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12" : ""}>
          <div className="min-w-0 max-w-3xl [&>section:first-child>h2:first-child]:mt-0">
            {toc.length >= 2 && <TocDisclosure title={TOC_TITLE} entries={toc} />}
            {page.blocks.map((block, i) => (
              <ServiceBlock key={i} block={block} id={anchors[i]} />
            ))}
          </div>
          {toc.length >= 2 && <TocSidebar title={TOC_TITLE} entries={toc} />}
        </div>
      </article>
    </main>
  );
}
