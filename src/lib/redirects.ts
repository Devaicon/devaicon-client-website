// The redirects set in the dashboard (retired service pages and the Redirects
// module), for lists of pages: an address that redirects isn't a page any
// more, so the sitemap and llms.txt leave it out. proxy.ts does the
// redirecting itself, from its own copy.

const BASE = (process.env.EXPRESS_API_URL || "http://localhost:4000")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

/** `{ "/old": "/new" }`; empty when the API can't be reached. */
export async function getRedirects(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${BASE}/api/public/redirects`, { next: { revalidate: 300, tags: ["services"] } });
    if (!res.ok) return {};
    return ((await res.json()) as { redirects?: Record<string, string> }).redirects ?? {};
  } catch {
    return {};
  }
}
