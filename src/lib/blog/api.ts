import type { Category, PostSummary, PublicPost } from "./types";

// Server-side reads of published content, for the public pages. Results are
// cached by Next and tagged "insights"; publishing a post expires the tag
// (see /api/revalidate), and the 5-minute fallback covers a missed signal.

const BASE = process.env.EXPRESS_API_URL ?? "http://localhost:4000";
const CACHE: RequestInit = { next: { revalidate: 300, tags: ["insights"] } };

async function get<T>(path: string): Promise<{ status: number; data: T | null }> {
  const res = await fetch(`${BASE}/api/public${path}`, CACHE);
  if (res.status === 404) return { status: 404, data: null };
  // Anything else unexpected throws, so a cached page is kept rather than
  // replaced with an empty one.
  if (!res.ok) throw new Error(`Content API ${path} returned ${res.status}`);
  return { status: res.status, data: (await res.json()) as T };
}

export type PostResult =
  | { kind: "post"; post: PublicPost; related: PostSummary[] }
  | { kind: "redirect"; slug: string }
  | { kind: "missing" };

export async function getPublicPost(slug: string): Promise<PostResult> {
  const { data } = await get<{ post?: PublicPost; related?: PostSummary[]; redirect?: string }>(
    `/posts/${encodeURIComponent(slug)}`,
  );
  if (!data) return { kind: "missing" };
  if (data.redirect) return { kind: "redirect", slug: data.redirect };
  return { kind: "post", post: data.post, related: data.related ?? [] };
}

export async function getPublicPosts(
  query: { featured?: boolean; limit?: number } = {},
): Promise<PostSummary[]> {
  const params = new URLSearchParams();
  if (query.featured) params.set("featured", "1");
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  const { data } = await get<{ posts: PostSummary[] }>(`/posts${qs ? `?${qs}` : ""}`);
  return data?.posts ?? [];
}

export async function getPublicCategories(): Promise<Category[]> {
  const { data } = await get<{ categories: Category[] }>("/categories");
  return data?.categories ?? [];
}
