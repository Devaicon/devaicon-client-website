"use client";

import React, { useState, useMemo } from "react";
import InsightSearchBar from "./InsightSearchBar";
import InsightCard from "./InsightCard";
import {
  filterPosts,
  matchesCategoryFilter,
  matchesSearchQuery,
} from "./insightUtils";

/** A post summary from the content API, in the shape the cards expect. */
const toCard = (p) => ({
  image: p.heroImage?.url || "/icon.webp",
  imageAlt: p.heroImage?.alt || "",
  category: p.category?.name ?? "Insights",
  title: p.title,
  description: p.subtitle,
  link: `/insights/${p.slug}`,
  tags: p.tags ?? [],
  minutes: p.readingMinutes,
});

const BlogInsights = ({ posts = [] }) => {
  const [activeCategory, setActiveCategory] = useState("View all");
  const [searchQuery, setSearchQuery] = useState("");

  // The newest post leads; the rest fill the grid. Categories are the ones
  // that actually have posts, so no filter ever leads to an empty page.
  const cards = useMemo(() => posts.map(toCard), [posts]);
  const [lead, ...rest] = cards;
  const categories = useMemo(
    () => ["View all", ...new Set(cards.map((c) => c.category))],
    [cards],
  );

  const filteredPosts = useMemo(
    () => filterPosts(rest, activeCategory, searchQuery),
    [rest, activeCategory, searchQuery],
  );

  const displayFeaturedPost = useMemo(
    () =>
      Boolean(lead) &&
      matchesCategoryFilter(lead, activeCategory) &&
      matchesSearchQuery(lead, searchQuery),
    [lead, activeCategory, searchQuery],
  );

  return (
    <section
      style={{ background: "#FEF9F3" }}
      className="py-8 sm:py-8 md:py-8 lg:py-8 flex justify-center px-4"
    >
      <div className="w-full max-w-7xl lg:w-[70%]">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            News and insights
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Learn about enterprise innovation, AI adoption, platform
            modernization,
            <br className="hidden sm:block" />
            and strategies for driving measurable business outcomes.
          </p>
        </div>

        {/* Search Bar and Filters Container */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <InsightSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <InsightCard
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={categories}
            featuredPost={lead}
            posts={filteredPosts}
            showFeatured={displayFeaturedPost}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogInsights;
