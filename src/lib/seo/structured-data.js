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
 * A published insight post. Dates, author and image come from the post
 * itself, so every field is something a reader can see on the page. A team
 * byline is an Organization, never dressed up as a Person.
 *
 * @param {{ post: import("@/lib/blog/types").PublicPost, path: string }} args
 */
export function blogPostingSchema({ post, path }) {
  const url = absoluteUrl(path);
  const author = post.author
    ? {
        "@type": post.author.type === "Organization" ? "Organization" : "Person",
        name: post.author.name,
        ...(post.author.jobTitle && post.author.type !== "Organization"
          ? { jobTitle: post.author.jobTitle }
          : {}),
        ...(post.author.links?.length ? { sameAs: post.author.links } : {}),
      }
    : { "@id": ORGANIZATION_ID };
  const image = post.seo?.ogImage || post.heroImage?.url;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: metaDescription(post.seo?.metaDescription || post.subtitle, 300),
    url,
    mainEntityOfPage: url,
    image: image ? absoluteUrl(image) : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    articleSection: post.category?.name,
    keywords: post.tags?.length ? post.tags.join(", ") : undefined,
    author,
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/**
 * The post's FAQs. Google only shows FAQ rich results for a few kinds of
 * site now, but the markup is still valid and still read by AI answers.
 *
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export function faqPageSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
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
