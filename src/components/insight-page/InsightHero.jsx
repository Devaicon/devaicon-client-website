"use client";

import PageHero from "@/components/PageHero";
import { Newspaper } from "lucide-react";

const InsightHero = () => {
  return (
    <PageHero
      title="Insights & Resources"
      subtitle="Explore the latest trends, insights, and thought leadership in enterprise technology, AI adoption, digital transformation, and innovation strategies."
      icon={<Newspaper className="w-7 h-7 text-white" />}
      label="Knowledge Hub"
      showButton={false}
      bgColor="bg-gradient-to-br from-[#3d234b] via-[#4a2d58] to-[#37469E]"
      height="min-h-96"
      backgroundImage="/data-science.webp"
    />
  );
};

export default InsightHero;
