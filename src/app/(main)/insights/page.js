import InsightHero from "@/components/insight-page/InsightHero";
import BlogInsights from "@/components/insight-page/BlogInsights";
import FeaturedInsights from "@/components/insight-page/FeaturedInsights";
import { getPublicPosts } from "@/lib/blog/api";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export const metadata = {
  title: "Insights & Resources",
  description:
    "Trends, insights and thought leadership on enterprise technology, AI adoption, digital transformation and innovation strategy from Devaicon.",
  alternates: {
    canonical: "/insights",
  },
};

// Rebuilt when a post is published or changed; see /api/revalidate.
export const revalidate = 300;

// An unreachable API at build time prerenders an empty listing that the first
// revalidation fills in. At runtime the error is left to throw, so ISR keeps
// the last good page instead of replacing it with an empty one.
const isBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

const page = async () => {
  const [posts, featured] = await Promise.all([
    getPublicPosts({ limit: 200 }),
    getPublicPosts({ featured: true, limit: 3 }),
  ]).catch((err) => {
    if (isBuild) return [[], []];
    throw err;
  });

  return (
    <main>
      <InsightHero />
      <BlogInsights posts={posts} />
      <FeaturedInsights posts={featured} />
    </main>
  );
};

export default page;
