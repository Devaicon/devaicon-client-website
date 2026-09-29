"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { can } from "@/lib/types";
import { useAdminSession } from "@/components/admin/AdminSession";
import { ADMIN_SECTIONS } from "@/components/admin/sections";

// /admin has no page of its own: it opens the first section the signed-in
// user's role allows, or sends them back to their dashboard if there is none.
export default function AdminIndex() {
  const { me } = useAdminSession();
  const router = useRouter();

  useEffect(() => {
    if (!me) return;
    const first = ADMIN_SECTIONS.find((s) => s.anyOf.some((p) => can(me, p)));
    router.replace(first ? first.href : "/dashboard");
  }, [me, router]);

  return (
    <div className="h-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse" />
  );
}
