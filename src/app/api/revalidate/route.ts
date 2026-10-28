import { timingSafeEqual } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Called by the Express server when a post or job posting is published,
 * changed or removed, so its pages rebuild now rather than when their cache
 * next expires. Guarded by a secret both apps share (REVALIDATE_SECRET).
 *
 * `tags` names the data caches to expire; a server that sends none is
 * talking about posts.
 */
const KNOWN_TAGS = ["insights", "careers"];

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const given = req.headers.get("x-revalidate-secret") ?? "";
  const ok =
    secret.length >= 16 &&
    given.length === secret.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as { paths?: unknown; tags?: unknown };
  const paths = Array.isArray(body.paths)
    ? body.paths.filter((p): p is string => typeof p === "string" && p.startsWith("/")).slice(0, 50)
    : [];

  const tags = Array.isArray(body.tags)
    ? KNOWN_TAGS.filter((t) => (body.tags as unknown[]).includes(t))
    : ["insights"];

  // The data cache first, so rebuilt pages read fresh content.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  for (const path of paths) revalidatePath(path);
  return NextResponse.json({ revalidated: paths, tags });
}
