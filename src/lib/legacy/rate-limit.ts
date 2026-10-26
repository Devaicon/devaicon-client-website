// In-memory sliding-window rate limiter.
//
// Used to throttle failed login attempts per client IP. Resets on server
// restart, which is fine for a single-instance deployment. If you scale to
// multiple instances behind a load balancer, swap this for a Redis-backed
// limiter (e.g. @upstash/ratelimit).

type Entry = { count: number; firstAttempt: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 20;

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.firstAttempt + WINDOW_MS - now) / 1000),
    );
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    store.set(key, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

export function clearAttempts(key: string): void {
  store.delete(key);
}

// Periodically purge expired entries so the map doesn't grow forever.
declare const globalThis: any;
if (!globalThis.__devaicon_rate_limit_cleanup) {
  globalThis.__devaicon_rate_limit_cleanup = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (now - v.firstAttempt > WINDOW_MS) store.delete(k);
    }
  }, WINDOW_MS);
  // unref so it doesn't keep the process alive
  globalThis.__devaicon_rate_limit_cleanup?.unref?.();
}
