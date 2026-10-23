"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PublicPost } from "@/lib/blog/types";
import PostArticle from "./PostArticle";

export default function PostPreview({ id }: { id: string }) {
  const [post, setPost] = useState<PublicPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}/preview`).catch(() => null);
      if (cancelled) return;
      if (!res || !res.ok) {
        setError(
          res?.status === 401
            ? "Sign in to the dashboard to preview posts."
            : res?.status === 403
              ? "You don't have access to posts."
              : "This post couldn't be loaded.",
        );
        return;
      }
      setPost((await res.json()).post);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg text-gray-800">{error}</p>
        <Link href="/login" className="underline text-[#37469E]">
          Go to sign in
        </Link>
      </main>
    );
  }
  if (!post) return <main className="min-h-[60vh] animate-pulse bg-gray-50" />;

  const live = post.status === "published";
  return (
    <>
      <div role="status" className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950">
        {live
          ? "Preview of the latest saved version of a live post."
          : post.status === "scheduled"
            ? "Preview · Scheduled, not live yet."
            : "Preview · Draft, not published."}{" "}
        Only people signed in to the dashboard can see this page.{" "}
        <Link href={`/dashboard/insights/${id}`} className="underline">
          Back to the editor
        </Link>
      </div>
      <PostArticle post={post} />
    </>
  );
}
