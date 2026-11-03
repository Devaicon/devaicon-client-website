import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { Block } from "./blocks";

// Service pages built in the dashboard, as the Express API sends them, and
// the public site's server-side reads of them. Results are cached by Next and
// tagged "services"; publishing or changing a page expires the tag (see
// /api/revalidate), and the 5-minute fallback covers a missed signal.

export type ServicePageStatus = "draft" | "published";

export type ServiceSeo = {
  /** The <title>, before the brand suffix; the page title when empty. */
  metaTitle: string;
  /** The subtitle when empty. */
  metaDescription: string;
  focusKeyphrase: string;
  keywords: string[];
  /** The page's own /services URL when empty. */
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  /** The hero image when empty. */
  ogImage: string;
  noindex: boolean;
};

/** Everything a page renders from. */
export type ServicePageContent = {
  title: string;
  slug: string;
  label: string;
  icon: string;
  subtitle: string;
  heroImage: string;
  heroButtonText: string;
  heroButtonLink: string;
  /** The breadcrumb between Home and the page; '' for none. */
  parent: string;
  blocks: Block[];
  seo: ServiceSeo;
  serviceType: string;
  areaServed: string;
};

/** One row of the dashboard's list. */
export type ServicePageSummary = {
  id: string;
  title: string;
  slug: string;
  status: ServicePageStatus;
  noindex: boolean;
  blockCount: number;
  publishedAt: string;
  updatedAt: string;
  updatedBy: string;
};

export type AdminServicePage = ServicePageSummary &
  ServicePageContent & { createdAt: string; createdBy: string };

/** A live page as the sitemap and llms.txt list it. */
export type PublicServicePageSummary = {
  title: string;
  slug: string;
  subtitle: string;
  noindex: boolean;
  canonicalUrl: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
};

export type PublicServicePage = ServicePageContent & {
  status: ServicePageStatus;
  publishedAt: string;
  updatedAt: string;
};

export const servicePath = (slug: string) => `/services/${slug}`;

/** True when the page names itself as canonical, so it belongs in the sitemap. */
export function isSelfCanonical(page: { slug: string; noindex: boolean; canonicalUrl: string }): boolean {
  if (page.noindex) return false;
  const c = page.canonicalUrl.trim();
  return !c || c === servicePath(page.slug) || c.replace(/^https?:\/\/(www\.)?devaicon\.com/i, "") === servicePath(page.slug);
}

// A trailing "/" or "/api" is dropped, as in next.config.mjs.
const BASE = (process.env.EXPRESS_API_URL || "http://localhost:4000")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");
const CACHE: RequestInit = { next: { revalidate: 300, tags: ["services"] } };

async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}/api/public${path}`, CACHE);
  if (res.status === 404) return null;
  // Anything else unexpected throws, so a cached page is kept rather than
  // replaced with an empty one.
  if (!res.ok) throw new Error(`Service pages API ${path} returned ${res.status}`);
  return (await res.json()) as T;
}

/** Live pages, newest first. */
export async function getLiveServicePages(): Promise<PublicServicePageSummary[]> {
  const data = await get<{ pages: PublicServicePageSummary[] }>("/service-pages");
  return data?.pages ?? [];
}

/** A live page, or null when there's no such page. */
export async function getServicePage(slug: string): Promise<PublicServicePage | null> {
  const data = await get<{ page: PublicServicePage }>(`/service-pages/${encodeURIComponent(slug)}`);
  return data?.page ?? null;
}

/**
 * Live pages for build-time lists. Only a build survives an unreachable API;
 * at runtime the error is thrown so the last good result stays cached.
 */
export async function getLiveServicePagesForBuild(): Promise<PublicServicePageSummary[]> {
  try {
    return await getLiveServicePages();
  } catch (err) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw err;
    console.error("[services] content API unreachable at build time:", err);
    return [];
  }
}
