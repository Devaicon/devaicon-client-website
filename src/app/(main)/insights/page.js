import InsightHero from "@/components/insight-page/InsightHero";
import BlogInsights from "@/components/insight-page/BlogInsights";
import FeaturedInsights from "@/components/insight-page/FeaturedInsights";

export const metadata = {
  title: "Insights & Resources",
  description:
    "Trends, insights and thought leadership on enterprise technology, AI adoption, digital transformation and innovation strategy from Devaicon.",
  alternates: {
    canonical: "/insights",
  },
};

const page = () => {
  return (
    <main>
      <InsightHero />
      <BlogInsights />
      <FeaturedInsights />
    </main>
  );
};

export default page;
