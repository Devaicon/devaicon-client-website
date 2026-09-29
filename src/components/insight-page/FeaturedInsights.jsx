import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FeaturedBlogCard = ({ post }) => {
  return (
    <div className=" flex flex-col sm:flex-row items-stretch pb-3">
      <div className="relative w-full sm:w-[45%] h-64 sm:h-auto min-h-[280px] shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.heroImage?.url || "/icon.webp"}
          alt={post.heroImage?.alt || ""}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 sm:p-6 flex flex-col justify-center flex-1">
        <div className="flex items-center gap-3 mb-3">
          {post.category && (
            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md text-gray-700 text-xs font-semibold rounded shadow-sm">
              {post.category.name}
            </span>
          )}
          <span className="text-xs text-gray-200">{post.readingMinutes} min read</span>
        </div>

        <h3 className="text-lg sm:text-xl font-semiBold  text-white mb-3 leading-snug">
          {post.title}
        </h3>

        <p className="text-gray-200 text-sm mb-4 leading-relaxed line-clamp-3">
          {post.subtitle}
        </p>

        <Link
          href={`/insights/${post.slug}`}
          className="px-4 py-2 rounded-[8px] font-semibold text-gray-700 bg-white/90 backdrop-blur-md hover:bg-white hover:shadow-lg transition-all duration-300 self-start inline-flex items-center gap-1"
        >
          Read more <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

// Posts an editor has marked "Feature this post" (at most three). With none
// marked, the section is left out rather than filled with placeholders.
const FeaturedInsights = ({ posts = [] }) => {
  if (posts.length === 0) return null;
  return (
    <section
      style={{ background: "#FEF9F3" }}
      className="py-1 sm:py-1 md:py-1 flex justify-center px-4 "
    >
      <div
        className="w-full max-w-7xl lg:w-[70%] rounded-2xl mb-14"
        style={{
          background: "linear-gradient(180deg, #3d234b 0%, #2a1834 100%)",
        }}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Left Section - Featured Blog Info */}
          <div className="w-full lg:w-[35%] flex flex-col justify-between">
            {/* Top Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-Bold text-white mb-5 leading-tight">
                Featured blogs
              </h2>

              <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6">
                Discover how Devaicon helps organizations apply AI, automation,
                and intelligent platforms to improve efficiency,
                decision-making, and scalability. Learn how enterprises are
                moving from experimentation to real, measurable outcomes.
              </p>

              <Link
                href="/insights"
                className="px-5 py-2.5 rounded-[8px] font-semibold text-white bg-gradient-to-b from-[#3d234b] to-[#2a1834] hover:shadow-lg hover:from-[#4a3a6e] hover:to-[#3a1a4a] transition-all duration-300 inline-flex items-center gap-2"
              >
                Read more <ArrowRight size={16} />
              </Link>
            </div>

            {/* Logo Section */}
            <div className="mt-8 lg:mt-12">
              <div className=" p-8 flex items-center justify-center ">
                <div className="relative w-100 h-100">
                  <Image
                    src="/icon.webp"
                    alt=""
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Blog Cards */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            {posts.map((post) => (
              <FeaturedBlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedInsights;
