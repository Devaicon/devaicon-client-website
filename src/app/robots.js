import { SITE_URL } from "@/lib/seo";

/**
 * Served at /robots.txt. The public site is open to every crawler; only the
 * signed-in dashboard, the legacy time logger, draft previews and the API are
 * kept out. Post images live on Vercel Blob, so blocking /api/ hides none.
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/login",
        "/legacy",
        "/insights/preview/",
      ],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL,
  };
}
