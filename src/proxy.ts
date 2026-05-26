import { NextRequest, NextResponse } from "next/server";
import { readSessionFromToken, SESSION_COOKIE_NAME } from "./lib/session";

const PUBLIC_PATHS = [
  "/login",
  "/legacy/login",
  "/api/auth/login",
  "/api/legacy/auth/login",
];

// All matcher paths in `config.matcher` below run through this function.
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLegacy =
    pathname === "/legacy/login" ||
    pathname.startsWith("/legacy/dashboard") ||
    pathname.startsWith("/legacy/admin") ||
    pathname.startsWith("/api/legacy/");
  const loginPath = isLegacy ? "/legacy/login" : "/login";
  const dashboardPath = isLegacy ? "/legacy/dashboard" : "/dashboard";

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await readSessionFromToken(token);

  if (pathname === "/login" || pathname === "/legacy/login") {
    if (user) {
      // Authenticated users shouldn't access login page, redirect to dashboard
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Admin-only paths
  const adminOnly =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/legacy/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/legacy/admin");
  if (adminOnly && user.role !== "admin") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL(dashboardPath, req.url));
  }

  // Devs landing on /admin already handled above; admins on /dashboard is fine.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
    // New Express-backed routes (rewritten to the Express server)
    "/api/logs/:path*",
    "/api/projects/:path*",
    "/api/admin/:path*",
    "/api/auth/me",
    "/api/auth/logout",
    // Legacy Sheets-backed UI pages
    "/legacy/login",
    "/legacy/dashboard/:path*",
    "/legacy/admin/:path*",
    // Legacy Google-Sheets-backed API routes
    "/api/legacy/logs/:path*",
    "/api/legacy/projects/:path*",
    "/api/legacy/admin/:path*",
    "/api/legacy/auth/me",
    "/api/legacy/auth/logout",
  ],
};
