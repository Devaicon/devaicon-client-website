import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { PublicJob, PublicJobDetail } from "./types";

// Server-side reads of the careers page's roles. Results are cached by Next
// and tagged "careers"; publishing, changing or closing a role expires the
// tag (see /api/revalidate), and the 5-minute fallback covers a missed signal.

// A trailing "/" or "/api" is dropped, as in next.config.mjs.
const BASE = (process.env.EXPRESS_API_URL || "http://localhost:4000")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");
const CACHE: RequestInit = { next: { revalidate: 300, tags: ["careers"] } };

async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}/api/public${path}`, CACHE);
  if (res.status === 404) return null;
  // Anything else unexpected throws, so a cached page is kept rather than
  // replaced with an empty one.
  if (!res.ok) throw new Error(`Careers API ${path} returned ${res.status}`);
  return (await res.json()) as T;
}

/** Open roles, newest first. */
export async function getOpenJobs(): Promise<PublicJob[]> {
  const data = await get<{ jobs: PublicJob[] }>("/jobs");
  return data?.jobs ?? [];
}

/** A published or closed role, or null when there's no such page. */
export async function getJob(slug: string): Promise<PublicJobDetail | null> {
  const data = await get<{ job: PublicJobDetail }>(`/jobs/${encodeURIComponent(slug)}`);
  return data?.job ?? null;
}

/**
 * Open roles for the careers page, or null when they couldn't be read.
 * Only a build survives an unreachable API (the page then refreshes on its
 * timer); at runtime the error is thrown so the last good page stays cached.
 */
export async function getOpenJobsForPage(): Promise<PublicJob[] | null> {
  try {
    return await getOpenJobs();
  } catch (err) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw err;
    console.error("[careers] content API unreachable at build time:", err);
    return null;
  }
}
