// Edge-runtime safe: this module only uses `jose`, no Node-only or
// `next/headers` imports. Safe to import from `proxy.ts`.
//
// Express issues and owns the session. This only checks the signature so the
// proxy can send signed-out visitors to /login without a round trip; whether
// the account is still active, and what it may do, is Express's call on every
// request. Express clears a cookie it rejects, so a revoked session can't
// leave the proxy believing someone is signed in.

import { jwtVerify } from 'jose';

export const SESSION_COOKIE_NAME = 'devaicon_session';

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error(
      'SESSION_SECRET env var must be set and at least 32 characters long.',
    );
  }
  return new TextEncoder().encode(raw);
}

/** The signed-in user's id, or null for a missing, bad or old-format token. */
export async function readSessionFromToken(
  token: string | undefined,
): Promise<{ userId: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub === 'string' && typeof payload.v === 'number') {
      return { userId: payload.sub };
    }
    return null;
  } catch {
    return null;
  }
}
