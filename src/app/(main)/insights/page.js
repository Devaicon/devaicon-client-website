import InsightHero from "@/components/insight-page/InsightHero";
import BlogInsights from "@/components/insight-page/BlogInsights";
import FeaturedInsights from "@/components/insight-page/FeaturedInsights";
import { getPublicPosts } from "@/lib/blog/api";

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

const page = async () => {
  const [posts, featured] = await Promise.all([
    getPublicPosts({ limit: 200 }),
    getPublicPosts({ featured: true, limit: 3 }),
  ]);

  return (
    <main>
      <InsightHero />
      <BlogInsights posts={posts} />
      <FeaturedInsights posts={featured} />
    </main>
  );
};

export default page;
