"use client";

import { use } from "react";
import { SectionGate } from "@/components/dashboard/DashboardShell";
import PostEditor from "@/components/blog-editor/PostEditor";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <SectionGate anyOf={["posts.write", "posts.publish", "posts.delete"]}>
      <PostEditor id={id} />
    </SectionGate>
  );
}
