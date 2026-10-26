import { getPublicPost, getPublicPosts, type PostResult } from "./api";
import type { PostSummary } from "./types";
import { insightsContent, getInsightBySlug } from "@/lib/insights-content";

// Where the public insight pages get their posts, set by INSIGHTS_SOURCE:
//   api    — the content API only
//   static — the posts bundled with the site before the API existed
//   auto   — the API, falling back to the bundled posts when it fails or has
//            none (the default)
// The bundled posts are a stopgap while the API is brought up; the API's
// first start imports the same posts under the same URLs.

type Source = "api" | "static" | "auto";

function source(): Source {
  const v = process.env.INSIGHTS_SOURCE?.trim().toLowerCase();
  return v === "api" || v === "static" ? v : "auto";
}

/** A bundled post, in the shape src/lib/insights-content files hold. */
export type StaticInsight = NonNullable<ReturnType<typeof getInsightBySlug>>;

export type InsightResult = PostResult | { kind: "static"; post: StaticInsight };

function toSummary(post: StaticInsight): PostSummary {
  return {
    id: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    slug: post.slug,
    status: "published",
    featured: true,
    publishedAt: "",
    updatedAt: "",
    updatedBy: "",
    // Each file's `date` is really its reading time, e.g. "8 min read".
    readingMinutes: parseInt(post.date, 10) || 5,
    heroImage: { url: post.heroImage, alt: post.title },
    tags: post.tags ?? [],
    noindex: false,
    author: post.author ? { name: post.author.name } : null,
    category: {
      name: post.category,
      slug: post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    },
  };
}

function staticPosts(limit?: number): PostSummary[] {
  const all = Object.values(insightsContent).map(toSummary);
  return limit ? all.slice(0, limit) : all;
}

export async function listInsights(
  query: { featured?: boolean; limit?: number } = {},
): Promise<PostSummary[]> {
  const from = source();
  if (from === "static") return staticPosts(query.limit);
  if (from === "api") return getPublicPosts(query);
  try {
    const posts = await getPublicPosts(query);
    if (posts.length > 0) return posts;
  } catch (err) {
    console.error("[insights] content API failed; using bundled posts:", err);
  }
  return staticPosts(query.limit);
}

export async function findInsight(slug: string): Promise<InsightResult> {
  const from = source();
  if (from !== "static") {
    try {
      const result = await getPublicPost(slug);
      if (result.kind !== "missing" || from === "api") return result;
    } catch (err) {
      if (from === "api") throw err;
      console.error(`[insights] content API failed for ${slug}; using bundled post:`, err);
    }
  }
  const post = getInsightBySlug(slug);
  return post ? { kind: "static", post } : { kind: "missing" };
}
