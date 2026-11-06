import { SITE_URL } from "@/lib/seo";
import { listInsights } from "@/lib/blog/source";
import { getOpenJobs } from "@/lib/careers/api";
import { getLiveServicePages, isSelfCanonical } from "@/lib/service-pages/managed";
import { getAllIndustries } from "@/lib/industries-data";
import { hasMoved } from "@/lib/moved-pages.mjs";

/**
 * Public, indexable pages only: a sitemap should list canonical URLs alone.
 *
 * Static pages carry no lastModified: their content files have no dates, and
 * a build timestamp would claim every page changed on every deploy. Insight
 * posts do have real dates, so theirs is sent.
 */
const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/whatwedo", priority: 0.9, changeFrequency: "monthly" },
  {
    path: "/capabilities/intelligent-systems-data",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/services/ai-automation-services-pakistan",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/capabilities/infrastructure-enterprise-systems",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/capabilities/consulting-transformation",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/capabilities/open-edx-services",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/capabilities/open-edx-services/open-edx-hosting",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/capabilities/open-edx-services/open-edx-development",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
  ...getAllIndustries()
    .map(({ id }) => `/industries/${id}`)
    .filter((path) => !hasMoved(path))
    .map((path) => ({ path, priority: 0.7, changeFrequency: "monthly" })),
  { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about-devaicon", priority: 0.7, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact-us", priority: 0.7, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/security", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
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

  return [...STATIC_ROUTES, ...services, ...insights, ...jobs].map(
    ({ path, priority, changeFrequency, lastModified }) => ({
      url: new URL(path, SITE_URL).toString(),
      changeFrequency,
      priority,
      ...(lastModified ? { lastModified } : {}),
    })
  );
}
