import { NextRequest, NextResponse } from "next/server";
import { readSessionFromToken, SESSION_COOKIE_NAME } from "./lib/session";

// Signed in or not is all this decides. Which admin sections someone may open
// depends on their role's permissions, which only Express knows; the admin
// pages ask it, and Express refuses anything the role doesn't allow.

// All matcher paths in `config.matcher` below run through this function.
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

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

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
    // Express-backed routes (rewritten to the Express server). Login is left
    // out on purpose: it must be reachable while signed out.
    "/api/logs/:path*",
    "/api/projects/:path*",
    "/api/admin/:path*",
    "/api/preferences/:path*",
    "/api/users/:path*",
    "/api/roles/:path*",
    "/api/profile/:path*",
    "/api/auth/me",
    "/api/auth/logout",
  ],
};
