import { NextRequest, NextResponse } from "next/server";
import { readSessionFromToken, SESSION_COOKIE_NAME } from "./lib/session";
import * as legacy from "./lib/legacy/session";

// Apart from redirecting retired service pages, signed in or not is all this
// decides. Which dashboard sections someone may open depends on their
// permissions, which only Express knows; the dashboard asks it, and Express
// refuses anything they aren't allowed.

// All matcher paths in `config.matcher` below run through this function.
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/services/")) return serviceRedirect(req);

  if (pathname.startsWith("/legacy/") || pathname.startsWith("/api/legacy/")) {
    return legacyProxy(req);
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await readSessionFromToken(token);

  if (pathname === "/login") {
    if (session) {
      // Authenticated users shouldn't access login page, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Retired service pages, set in the dashboard's editor: each old address
// answers with a 301 (what SEO tools check for) to the page that replaced it.
// Kept for a short while per server instance, so a page view rarely waits on
// the API; until a change reaches here, the page route itself redirects.
const REDIRECTS_TTL_MS = 30_000;
let redirects: { map: Record<string, string>; at: number } | null = null;
let loading: Promise<Record<string, string>> | null = null;

// A trailing "/" or "/api" is dropped, as in next.config.mjs.
const API = (process.env.EXPRESS_API_URL || "http://localhost:4000").trim().replace(/\/+$/, "").replace(/\/api$/, "");

async function fetchServiceRedirects(): Promise<Record<string, string>> {
  const res = await fetch(`${API}/api/public/service-redirects`, { cache: "no-store", signal: AbortSignal.timeout(3000) });
  if (!res.ok) throw new Error(`service-redirects returned ${res.status}`);
  return ((await res.json()) as { redirects?: Record<string, string> }).redirects ?? {};
}

async function serviceRedirects(): Promise<Record<string, string>> {
  if (redirects && Date.now() - redirects.at < REDIRECTS_TTL_MS) return redirects.map;
  loading ??= fetchServiceRedirects()
    .then((map) => {
      redirects = { map, at: Date.now() };
      return map;
    })
    // The API down: keep the last list, or none, and let pages load.
    .catch(() => redirects?.map ?? {})
    .finally(() => {
      loading = null;
    });
  return loading;
}

async function serviceRedirect(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/\/+$/, "").toLowerCase();
  const to = (await serviceRedirects())[path];
  if (!to) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = to;
  return NextResponse.redirect(url, 301);
}

// The Google Sheets time logger: its own cookie and login page, and gone
// entirely (404) once LEGACY_TIME_LOGGER=off.
const LEGACY_PUBLIC = ["/legacy/login", "/api/legacy/auth/login"];

async function legacyProxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!legacy.legacyEnabled()) {
    return pathname.startsWith("/api/")
      ? NextResponse.json({ error: "not_found" }, { status: 404 })
      : NextResponse.rewrite(new URL("/404", req.url), { status: 404 });
  }

  const token = req.cookies.get(legacy.SESSION_COOKIE_NAME)?.value;
  const user = await legacy.readSessionFromToken(token);

  if (pathname === "/legacy/login" && user) {
    const home = user.role === "admin" ? "/legacy/admin" : "/legacy/dashboard";
    return NextResponse.redirect(new URL(home, req.url));
  }
  if (user || LEGACY_PUBLIC.includes(pathname)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/legacy/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Public: only checked against the dashboard's retired service pages.
    "/services/:path*",
    "/login",
    "/dashboard/:path*",
    // Express-backed routes (rewritten to the Express server). Login is left
    // out on purpose: it must be reachable while signed out.
    "/api/logs/:path*",
    "/api/projects/:path*",
    "/api/admin/:path*",
    "/api/preferences/:path*",
    "/api/users/:path*",
    "/api/roles/:path*",
    "/api/profile/:path*",
    "/api/posts/:path*",
    "/api/authors/:path*",
    "/api/ctas/:path*",
    "/api/categories/:path*",
    // The job portal. /api/public/applications is left out: applicants
    // aren't signed in.
    "/api/jobs/:path*",
    "/api/applications/:path*",
    "/api/service-pages/:path*",
    "/api/auth/me",
    "/api/auth/logout",
    "/legacy/:path*",
    "/api/legacy/:path*",
  ],
};
