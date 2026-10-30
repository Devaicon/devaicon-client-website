import type { LucideIcon } from "lucide-react";
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
  /** Icon beside the label. */
  icon: LucideIcon;
  heroImage: string;
  /** Social share image, when it should differ from the hero background. */
  ogImage?: string;
  /** The hero's button, which leads to the contact page. */
  heroButtonText: string;
  /** Trail from Home up to (not including) this page. */
  parents: { name: string; path: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  /** Schema.org serviceType. */
  serviceType: string;
  /** Schema.org areaServed; the UAE unless set. */
  areaServed?: string;
  body: DocNode;
  faqs: Faq[];
  /** CTA cards by id: placed inline with `cta(id)`, or closing the page. */
  ctas: Record<string, Cta>;
  closingCtaId: string;
  /** Cards at the foot of the page linking to neighbouring pages. */
  relatedHeading: string;
  related: { title: string; description: string; path: string; image: string }[];
};
