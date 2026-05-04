import { timingSafeEqual } from 'crypto';
import type { Role, SessionUser } from './types';

/**
 * Users are defined entirely through env vars, following the pattern:
 *   DEV1_PASSWORD=...
 *   DEV2_PASSWORD=...
 *   ADMIN1_PASSWORD=...
 *
 * To add a person you just add another env var and redeploy. No DB.
 */

const USER_ENV_PATTERN = /^(DEV|ADMIN)(\d+)_PASSWORD$/;

export function listUsernames(): SessionUser[] {
  const users: SessionUser[] = [];
  for (const key of Object.keys(process.env)) {
    const m = key.match(USER_ENV_PATTERN);
    if (!m) continue;
    const role = m[1].toLowerCase() as Role;
    const num = m[2];
    users.push({ username: `${role}${num}`, role });
  }
  // stable order: admins first, then devs, then by number
  return users.sort((a, b) => {
    if (a.role !== b.role) return a.role === 'admin' ? -1 : 1;
    return a.username.localeCompare(b.username, undefined, { numeric: true });
  });
}

export function verifyCredentials(
  rawUsername: string,
  password: string,
): SessionUser | null {
  if (typeof rawUsername !== 'string' || typeof password !== 'string') return null;

  const username = rawUsername.trim().toLowerCase();
  const m = username.match(/^(dev|admin)(\d+)$/);
  if (!m) return null;

  const role = m[1] as Role;
  const num = m[2];
  const envKey = `${role.toUpperCase()}${num}_PASSWORD`;
  const expected = process.env[envKey];
  if (!expected) return null;

  // constant-time compare to avoid leaking length / prefix info
  const a = Buffer.from(password, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  return { username, role };
}
