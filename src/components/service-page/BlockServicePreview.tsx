"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminServicePage } from "@/lib/service-pages/managed";
import BlockServicePage from "./BlockServicePage";

export default function BlockServicePreview({ id }: { id: string }) {
  const [page, setPage] = useState<AdminServicePage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/service-pages/${encodeURIComponent(id)}`).catch(() => null);
      if (cancelled) return;
      if (!res || !res.ok) {
        setError(
          res?.status === 401
            ? "Sign in to the dashboard to preview service pages."
            : res?.status === 403
              ? "You don't have access to service pages."
              : "This page couldn't be loaded.",
        );
        return;
      }
      setPage((await res.json()).page);
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
  if (!page) return <main className="min-h-[60vh] animate-pulse bg-gray-50" />;

  return (
    <>
      <div role="status" className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950">
        {page.status === "published" ? "Preview of the latest saved version of a live page." : "Preview · Draft, not published."}{" "}
        Only people signed in to the dashboard can see this page.{" "}
        <Link href={`/dashboard/services/${id}`} className="underline">
          Back to the editor
        </Link>
      </div>
      <BlockServicePage page={page} />
    </>
  );
}
