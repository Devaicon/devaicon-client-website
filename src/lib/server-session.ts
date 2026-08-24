// Server-only helper. Uses `next/headers` so it cannot be imported from
// the middleware (edge runtime). Used inside API routes / server components.

import { cookies } from 'next/headers';
import { readSessionFromToken, SESSION_COOKIE_NAME } from './session';
import type { SessionUser } from './types';

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  return readSessionFromToken(token);
}
