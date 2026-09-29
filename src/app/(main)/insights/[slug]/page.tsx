import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import PostArticle from "@/components/blog/PostArticle";
import { safeSrc } from "@/components/blog/safeUrl";
import { getPublicPost, getPublicPosts } from "@/lib/blog/api";
import { brandedTitle, metaDescription } from "@/lib/seo";
import { blogPostingSchema, faqPageSchema } from "@/lib/seo/structured-data";

// Pages are cached and rebuilt when a post changes (see /api/revalidate);
// this is only the fallback if that signal is missed.
export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

// Prebuild what exists at build time; anything published later renders on
// its first visit. An unreachable API at build time just means none prebuilt.
export async function generateStaticParams() {
  try {
    const posts = await getPublicPosts({ limit: 200 });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicPost(slug);
  if (result.kind !== "post") {
    return { title: brandedTitle("Insight Not Found"), robots: { index: false, follow: true } };
  }
  const { post } = result;
  const description = metaDescription(post.seo.metaDescription || post.subtitle);
  const image = safeSrc(post.seo.ogImage) ?? safeSrc(post.heroImage.url);
  return {
    title: brandedTitle(post.seo.metaTitle || post.title),
    description,
    alternates: { canonical: post.seo.canonicalUrl || `/insights/${post.slug}` },
    keywords: post.tags,
    robots: post.seo.noindex ? { index: false, follow: true } : undefined,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: "article",
      title: post.seo.ogTitle || post.seo.metaTitle || post.title,
      description: metaDescription(post.seo.ogDescription || description),
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      section: post.category?.name,
      tags: post.tags,
      images: image ? [{ url: image, alt: post.heroImage.alt || post.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.seo.ogTitle || post.seo.metaTitle || post.title,
      description: metaDescription(post.seo.ogDescription || description),
      images: image ? [image] : undefined,
    },
  };
}

export default async function InsightPostPage({ params }: Params) {
  const { slug } = await params;
  const result = await getPublicPost(slug);
  if (result.kind === "redirect") permanentRedirect(`/insights/${result.slug}`);
  if (result.kind === "missing") notFound();
  const { post, related } = result;
  const path = `/insights/${post.slug}`;

  return (
    <>
      <JsonLd
        schema={[
          blogPostingSchema({ post, path }),
          faqPageSchema(post.faqs),
        ]}
      />
      <PostArticle post={post} related={related} />
    </>
  );
}
