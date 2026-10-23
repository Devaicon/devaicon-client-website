import type { Metadata } from "next";
import PostPreview from "@/components/blog/PostPreview";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

// An unpublished post, rendered with the real article template. Readable only
// with a dashboard session: the data comes from the authenticated posts API.
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostPreview id={id} />;
}
