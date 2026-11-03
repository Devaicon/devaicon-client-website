import type { Metadata } from "next";
import BlockServicePreview from "@/components/service-page/BlockServicePreview";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

// An unpublished service page, rendered with the real template. Readable only
// with a dashboard session: the data comes from the authenticated API.
export default async function ServicePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlockServicePreview id={id} />;
}
