import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlockServicePage from "@/components/service-page/BlockServicePage";
import { brandedTitle } from "@/lib/seo";
import { getLiveServicePages, getServicePage } from "@/lib/service-pages/managed";
import { serviceMetadata } from "@/lib/service-pages/seo";

type Params = { params: Promise<{ slug: string }> };

// Rebuilt when the page is published or changed; see /api/revalidate. Pages
// published after a build are rendered on their first visit.
export const revalidate = 300;

/**
 * Live pages are rendered at build time. An unreachable API builds none of
 * them rather than failing the build; each is then rendered on first visit.
 */
export async function generateStaticParams() {
  const pages = await getLiveServicePages().catch(() => []);
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) return { title: brandedTitle("Page Not Found"), robots: { index: false, follow: true } };
  return serviceMetadata(page);
}

/** A service page built from content blocks in the dashboard. */
export default async function ManagedServicePage({ params }: Params) {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) notFound();
  return <BlockServicePage page={page} />;
}
