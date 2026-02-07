"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "./insightUtils";
import { CategoryBadge, ReadTime, CardWrapper } from "./InsightComponents";

const CategoryFilters = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-4xl bg-white py-3 rounded-lg">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeCategory === category
              ? "bg-gradient-to-b from-[#3d234b] to-[#2a1834] text-white"
              : "text-black hover:bg-gray-100"
          }`}
          aria-pressed={activeCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const FeaturedCard = ({ post }) => {
  return (
    <CardWrapper className="w-full mb-8 flex flex-col md:flex-row min-h-96">
      <div className="relative w-full md:w-[45%] h-70 md:h-auto shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={post.category} variant="primary" />
          <ReadTime />
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-5">
          {post.description}
        </p>
        <Link
          href={post.link}
          className="px-5 py-2.5 rounded-[8px] font-semibold text-white bg-gradient-to-b from-[#3d234b] to-[#2a1834] hover:shadow-lg hover:from-[#4a3a6e] hover:to-[#3a1a4a] transition-all duration-300 self-start cursor-pointer inline-flex items-center gap-1"
        >
          Read more <ArrowRight size={16} />
        </Link>
      </div>
    </CardWrapper>
  );
};

const BlogPostCard = ({ post }) => {
  return (
    <CardWrapper className="flex flex-col">
      <div className="relative w-full h-55 shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <CategoryBadge category={post.category} variant="secondary" />
          <ReadTime className="text-xs" />
        </div>
        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          {post.title}
        </h4>
        <p className="text-gray-600 text-sm mb-4 flex-1">{post.description}</p>
        <Link
          href={post.link}
          className="px-4 py-2 rounded-[8px] font-semibold text-white bg-gradient-to-b from-[#3d234b] to-[#2a1834] hover:shadow-lg hover:from-[#4a3a6e] hover:to-[#3a1a4a] transition-all duration-300 self-start inline-flex items-center gap-1"
        >
          Read more <ArrowRight size={16} />
        </Link>
      </div>
    </CardWrapper>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-600 text-lg mb-2">No articles found</p>
      <p className="text-gray-500 text-sm">
        Try adjusting your search or filter to find what you&apos;re looking
        for.
      </p>
    </div>
  );
};

const InsightCard = ({
  activeCategory,
  onCategoryChange,
  featuredPost,
  posts,
  showFeatured,
}) => {
  return (
    <>
      <CategoryFilters
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />

      {showFeatured && <FeaturedCard post={featuredPost} />}

      {posts.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogPostCard key={index} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
};

export default InsightCard;
