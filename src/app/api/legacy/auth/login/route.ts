import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth";
import {
  createSessionCookie,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/session";
import { checkRateLimit, recordFailure, clearAttempts } from "@/lib/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/origin-check";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "forbidden_origin" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(`login:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "too_many_attempts",
        message: `Too many failed attempts. Try again in ${Math.ceil(
          (rate as any).retryAfterSeconds / 60,
        )} minute(s).`,
      },
      {
        status: 429,
        headers: { "Retry-After": String((rate as any).retryAfterSeconds) },
      },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const verification = verifyCredentials(
    body.username ?? "",
    body.password ?? "",
  );
  if (verification.error) {
    recordFailure(`login:${ip}`);
    return NextResponse.json({ error: verification.error }, { status: 401 });
  }

  const user = verification.user!;

  // Successful login — clear any prior failures from this IP.
  clearAttempts(`login:${ip}`);

  const token = await createSessionCookie(user);
  const res = NextResponse.json({ user });
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
