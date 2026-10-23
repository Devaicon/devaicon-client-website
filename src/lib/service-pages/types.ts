import type { Cta, DocNode, Faq } from "@/lib/blog/types";

/** A hardcoded service page: the same blocks as an Insights post, set in code. */
export type ServicePage = {
  /** Site-relative URL, also the canonical. */
  path: string;
  /** The H1. */
  title: string;
  /** Hero subtitle, and the meta description unless `seo.description` is set. */
  subtitle: string;
  /** Small label above the H1. */
  label: string;
  heroImage: string;
  /** Trail from Home up to (not including) this page. */
  parents: { name: string; path: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  /** Schema.org serviceType. */
  serviceType: string;
  body: DocNode;
  faqs: Faq[];
  /** CTA cards by id: placed inline with `cta(id)`, or closing the page. */
  ctas: Record<string, Cta>;
  closingCtaId: string;
  /** Cards at the foot of the page linking to neighbouring pages. */
  related: { title: string; description: string; path: string; image: string }[];
};
