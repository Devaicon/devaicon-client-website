import { SITE_URL } from "@/lib/seo";
import { listInsights } from "@/lib/blog/source";
import { getOpenJobs } from "@/lib/careers/api";
import { getLiveServicePages, isSelfCanonical } from "@/lib/service-pages/managed";
import { getAllIndustries } from "@/lib/industries-data";
import { hasMoved } from "@/lib/moved-pages.mjs";

/**
 * Public, indexable pages only: a sitemap should list canonical URLs alone.
 *
 * Every page carries the date its main content last changed, never the build
 * time: a build timestamp would claim every page changed on every deploy, and
 * Google stops trusting the dates. Pages written in code have hand-kept dates
 * below; bump a page's date when you change what it says (not for styling or
 * refactors). Posts, roles and dashboard pages bring their own dates.
 */

// Main content of the pages written in code, as of this date.
const CONTENT_REVIEWED = "2026-11-18";
// Matches the "Last Updated" line the legal pages show.
const LEGAL_UPDATED = "2025-12-24";

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly", lastModified: CONTENT_REVIEWED },
  { path: "/whatwedo", priority: 0.9, changeFrequency: "monthly", lastModified: CONTENT_REVIEWED },
  {
    path: "/capabilities/intelligent-systems-data",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: CONTENT_REVIEWED,
  },
  {
    path: "/services/ai-automation-services-pakistan",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: CONTENT_REVIEWED,
  },
  {
    path: "/capabilities/infrastructure-enterprise-systems",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: CONTENT_REVIEWED,
  },
  {
    path: "/services/consulting-transformation-pakistan",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: CONTENT_REVIEWED,
  },
  {
    path: "/capabilities/open-edx-services",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: CONTENT_REVIEWED,
  },
  {
    path: "/capabilities/open-edx-services/open-edx-hosting",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: CONTENT_REVIEWED,
  },
  {
    path: "/capabilities/open-edx-services/open-edx-development",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: CONTENT_REVIEWED,
  },
  { path: "/industries", priority: 0.8, changeFrequency: "monthly", lastModified: CONTENT_REVIEWED },
  ...getAllIndustries()
    .map(({ id }) => `/industries/${id}`)
    .filter((path) => !hasMoved(path))
    .map((path) => ({ path, priority: 0.7, changeFrequency: "monthly", lastModified: CONTENT_REVIEWED })),
  // /insights and /careers take the newest post or role date; see below.
  { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about-devaicon", priority: 0.7, changeFrequency: "monthly", lastModified: CONTENT_REVIEWED },
  { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact-us", priority: 0.7, changeFrequency: "yearly", lastModified: CONTENT_REVIEWED },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: LEGAL_UPDATED },
  { path: "/security", priority: 0.3, changeFrequency: "yearly", lastModified: LEGAL_UPDATED },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly", lastModified: LEGAL_UPDATED },
];

// Rebuilt when a post, role or service page is published or changed; see
// /api/revalidate.
export const revalidate = 300;

export default async function sitemap() {
  // A content API outage leaves the posts out of this one build rather than
  // failing the sitemap for every other page.
  const [posts, openJobs, servicePages] = await Promise.all([
    listInsights({ limit: 200 }).catch(() => []),
    getOpenJobs().catch(() => []),
    getLiveServicePages().catch(() => []),
  ]);
  const insights = posts
    .filter((p) => !p.noindex)
    .map((p) => ({
      path: `/insights/${p.slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: p.updatedAt || p.publishedAt || undefined,
    }));

  // Open roles only: a closed role's page is noindex.
  const jobs = openJobs.map((job) => ({
    path: `/careers/${job.slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
    lastModified: job.updatedAt || job.publishedAt || undefined,
  }));

  // Pages built in the dashboard, unless hidden or canonical elsewhere.
  const services = servicePages.filter(isSelfCanonical).map((page) => ({
    path: `/services/${page.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: page.updatedAt || page.publishedAt || undefined,
  }));

  // A listing page changes when something on it does.
  const newest = (items, fallback) =>
    items.map((i) => i.lastModified).filter(Boolean).map((d) => new Date(d))
      .sort((a, b) => b - a)[0] ?? fallback;
  const listingDates = {
    "/insights": newest(insights, CONTENT_REVIEWED),
    "/careers": newest(jobs, CONTENT_REVIEWED),
  };
  const staticRoutes = STATIC_ROUTES.map((route) =>
    route.path in listingDates
      ? { ...route, lastModified: listingDates[route.path] }
      : route
  );

  return [...staticRoutes, ...services, ...insights, ...jobs].map(
    ({ path, priority, changeFrequency, lastModified }) => ({
      url: new URL(path, SITE_URL).toString(),
      changeFrequency,
      priority,
      ...(lastModified ? { lastModified } : {}),
    })
  );
}
