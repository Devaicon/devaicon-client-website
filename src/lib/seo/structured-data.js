/**
 * JSON-LD builders. Every field here must be backed by something a visitor
 * can actually verify on the page — invented ratings, prices or dates are
 * worse than no schema at all.
 */

import { SITE_NAME, SITE_URL, absoluteUrl, metaDescription } from "./index";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Publisher identity, emitted once site-wide from the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo_dark.svg"),
    },
    description:
      "Devaicon builds AI, automation, cloud and enterprise software solutions for organisations across banking, retail, manufacturing and the public sector.",
    email: "contact@devaicon.com",
    telephone: "+971507001805",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sharjah",
      addressCountry: "AE",
    },
    sameAs: ["https://www.linkedin.com/company/devaicon"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "contact@devaicon.com",
      telephone: "+971507001805",
      areaServed: "AE",
      availableLanguage: ["en"],
    },
  };
}

/** Site identity, so Google can attribute pages to one publisher. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * A capability offering.
 *
 * @param {{ name: string, description: string, path: string }} service
 */
export function serviceSchema({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: metaDescription(description, 300),
    url: absoluteUrl(path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: "AE",
  };
}

/**
 * An insight article. `datePublished` is omitted deliberately: the insight
 * content files carry a reading time, not a publication date, so there is
 * nothing truthful to put here yet.
 *
 * @param {{ post: object, path: string }} args
 */
export function articleSchema({ post, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: metaDescription(post.subtitle, 300),
    url: absoluteUrl(path),
    image: post.heroImage ? absoluteUrl(post.heroImage) : undefined,
    articleSection: post.category,
    keywords: post.tags?.join(", "),
    author: {
      "@type": "Organization",
      name: post.author?.name ?? SITE_NAME,
    },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/**
 * Breadcrumb trail.
 *
 * @param {Array<{ name: string, path: string }>} trail
 */
export function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}
