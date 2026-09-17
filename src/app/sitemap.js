import { SITE_URL } from "@/lib/seo";
import { getAllJobSlugs } from "@/lib/jobs-data";
import { insightsContent } from "@/lib/insights-content";

/**
 * Public, indexable pages only. The industry sub-pages are left out on
 * purpose: they render the /industries hub and canonicalise to it, and a
 * sitemap should list canonical URLs alone.
 *
 * No lastModified: the content files carry no dates, and a build timestamp
 * would tell search engines every page changed on every deploy.
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

export default function sitemap() {
  const insights = Object.keys(insightsContent).map((slug) => ({
    path: `/insights/${slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const jobs = getAllJobSlugs().map((slug) => ({
    path: `/careers/${slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  return [...STATIC_ROUTES, ...insights, ...jobs].map(
    ({ path, priority, changeFrequency }) => ({
      url: new URL(path, SITE_URL).toString(),
      changeFrequency,
      priority,
    })
  );
}
