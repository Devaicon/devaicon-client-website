// Edge-runtime safe: this module only uses `jose`, no Node-only or
// `next/headers` imports. Safe to import from `middleware.ts`.

import { SignJWT, jwtVerify } from 'jose';
import type { SessionUser } from './types';

const COOKIE_NAME = 'devaicon_session';
const SESSION_TTL_HOURS = 12;

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error(
      'SESSION_SECRET env var must be set and at least 32 characters long.',
    );
  }
  return new TextEncoder().encode(raw);
}

export async function createSessionCookie(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(getSecret());
  return token;
}

export async function readSessionFromToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.username === 'string' &&
      (payload.role === 'dev' || payload.role === 'admin')
    ) {
      return { username: payload.username, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_TTL_SECONDS = SESSION_TTL_HOURS * 60 * 60;
