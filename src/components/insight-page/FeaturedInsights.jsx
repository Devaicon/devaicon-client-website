import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURED_BLOG_POSTS = [
  {
    image: "/upcoming-blog.webp",
    category: "Cloud",
    title: "Building Scalable Cloud Foundations for Growth",
    description:
      "Discover best practices for designing secure, scalable cloud architectures that support enterprise workloads.",
    slug: "powering-enterprise-transformation-ai",
    comingSoon: true,
  },
  {
    image: "/upcoming-blog.webp",
    category: "Cloud",
    title: "Building Scalable Cloud Foundations for Growth",
    description:
      "Discover best practices for designing secure, scalable cloud architectures that support enterprise workloads.",
    slug: "powering-enterprise-transformation-ai",
    comingSoon: true,
  },
  {
    image: "/upcoming-blog.webp",
    category: "Cloud",
    title: "Building Scalable Cloud Foundations for Growth",
    description:
      "Discover best practices for designing secure, scalable cloud architectures that support enterprise workloads.",
    slug: "powering-enterprise-transformation-ai",
    comingSoon: true,
  },
];

const FeaturedBlogCard = ({ post }) => {
  return (
    <div className=" flex flex-col sm:flex-row items-stretch pb-3">
      {/* Image Section */}
      <div className="relative w-full sm:w-[45%] h-64 sm:h-auto min-h-[280px] shrink-0 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        {post.comingSoon && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-gray-700 text-xs sm:text-sm font-semibold px-6 py-2 bg-white/90 backdrop-blur-md rounded-full uppercase shadow-lg">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col justify-center flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md text-gray-700 text-xs font-semibold rounded shadow-sm">
            {post.category}
          </span>

          <span className="text-xs text-gray-200">5 min read</span>
        </div>

        <h3 className="text-lg sm:text-xl font-semiBold  text-white mb-3 leading-snug">
          {post.title}
        </h3>

        <p className="text-gray-200 text-sm mb-4 leading-relaxed">
          {post.description}
        </p>

        {post.comingSoon ? (
          <button
            disabled
            className="px-4 py-2 bg-white/90 backdrop-blur-md text-gray-600 rounded text-sm font-semibold cursor-not-allowed self-start inline-flex items-center gap-1 opacity-70 shadow-sm"
          >
            Read more <ArrowRight size={16} />
          </button>
        ) : (
          <Link
            href={`/insights/${post.slug}`}
            className="px-4 py-2 rounded-[8px] font-semibold text-gray-700 bg-white/90 backdrop-blur-md hover:bg-white hover:shadow-lg transition-all duration-300 self-start inline-flex items-center gap-1"
          >
            Read more <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
};

const FeaturedInsights = () => {
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
              <div className="flex items-center gap-3 mb-4 ">
                <span className="text-white text-sm px-3 py-1 rounded bg-gradient-to-b from-[#3d234b] to-[#2a1834]">
                  Trending: <span className="font-semibold ">Growth</span>
                </span>
                <span className="text-gray-300 text-sm">5 min read</span>
              </div>

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
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Blog Cards */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            {FEATURED_BLOG_POSTS.map((post, index) => (
              <FeaturedBlogCard key={index} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedInsights;
