// Same-origin check for state-changing requests.
//
// Combined with sameSite=lax cookies and Content-Type checks, this is a
// solid CSRF defense. Skip it on safe methods (GET / HEAD / OPTIONS).

import type { NextRequest } from 'next/server';

export function isSameOrigin(req: NextRequest): boolean {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true;

  const host = req.headers.get('host');
  if (!host) return false;

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  // Some clients omit Origin — fall back to Referer.
  const referer = req.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // No origin and no referer on a mutating request → reject.
  return false;
}

/** Best-effort client IP extraction for rate-limit keying. */
export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}
