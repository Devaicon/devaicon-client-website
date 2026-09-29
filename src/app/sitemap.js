import { SITE_URL } from "@/lib/seo";
import { getAllJobSlugs } from "@/lib/jobs-data";
import { getPublicPosts } from "@/lib/blog/api";

/**
 * Public, indexable pages only. The industry sub-pages are left out on
 * purpose: they render the /industries hub and canonicalise to it, and a
 * sitemap should list canonical URLs alone.
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
    path: "/capabilities/application-software-development",
    priority: 0.9,
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
  { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
  { path: "/engagement-models", priority: 0.8, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about-devaicon", priority: 0.7, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact-us", priority: 0.7, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/security", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

// Rebuilt when a post is published or changed; see /api/revalidate.
export const revalidate = 300;

export default async function sitemap() {
  // A content API outage leaves the posts out of this one build rather than
  // failing the sitemap for every other page.
  const posts = await getPublicPosts({ limit: 200 }).catch(() => []);
  const insights = posts
    .filter((p) => !p.noindex)
    .map((p) => ({
      path: `/insights/${p.slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: p.updatedAt || p.publishedAt || undefined,
    }));

  const jobs = getAllJobSlugs().map((slug) => ({
    path: `/careers/${slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  return [...STATIC_ROUTES, ...insights, ...jobs].map(
    ({ path, priority, changeFrequency, lastModified }) => ({
      url: new URL(path, SITE_URL).toString(),
      changeFrequency,
      priority,
      ...(lastModified ? { lastModified } : {}),
    })
  );
}
