"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Reusable Hero Section Component
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Main heading text
 * @param {string} props.subtitle - Subheading text
 * @param {string} props.buttonText - CTA button text (default: "Discover More")
 * @param {string} props.buttonLink - CTA button link (default: "#")
 * @param {string} props.bgColor - Background color class (default: "bg-[#3d234b]")
 * @param {string} props.titleColor - Title text color class (default: "text-white")
 * @param {string} props.subtitleColor - Subtitle text color class (default: "text-gray-100")
 * @param {boolean} props.showButton - Whether to show the CTA button (default: true)
 * @param {string} props.height - Height class (default: "min-h-[500px]")
 * @param {React.ReactNode} props.customShapes - Custom background shapes
 */
const PageHero = ({
  title,
  subtitle,
  buttonText = "Discover More",
  buttonLink = "#",
  bgColor = "bg-[#3d234b]",
  titleColor = "text-white",
  subtitleColor = "text-gray-100",
  showButton = true,
  height = "min-h-[500px]",
  customShapes,
}) => {
  return (
    <section
      className={`relative ${bgColor} ${height} flex items-center overflow-hidden`}
      role="banner"
    >
      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {customShapes ? (
          customShapes
        ) : (
          <>
            {/* Large Glowing Circle - Top Right */}
            <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] animate-pulse"></div>

            {/* Large Glowing Circle - Bottom Left */}
            <div className="absolute -bottom-60 -left-60 w-[900px] h-[900px] bg-purple-300/15 rounded-full blur-[140px]"></div>

            {/* Medium Circle - Center Right */}
            <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-indigo-300/12 rounded-full blur-[100px]"></div>

            {/* Large Geometric Shape - Top Left */}
            <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-gradient-to-br from-purple-200/10 to-white/8 rotate-45 blur-[100px]"></div>

            {/* Accent Circle - Middle */}
            <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-violet-300/15 rounded-full blur-[90px]"></div>

            {/* Geometric Shape - Bottom Right */}
            <div className="absolute -bottom-40 -right-20 w-[750px] h-[750px] bg-gradient-to-tl from-purple-200/12 to-indigo-200/10 rotate-12 blur-[110px]"></div>

            {/* Floating Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-indigo-200/15 rounded-full blur-3xl"></div>
          </>
        )}
      </div>

      {/* Content Container - Aligned Left */}
      <div className="relative z-10 w-full py-8 sm:py-12 md:py-20">
        <div className="max-w-[110rem] mx-auto pt-30 px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          {/* Title */}
          <h1
            className={`text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${titleColor} mb-4 sm:mb-6 leading-tight text-left`}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`text-sm sm:text-base md:text-lg lg:text-xl ${subtitleColor} mb-6 sm:mb-8 leading-relaxed max-w-3xl text-left`}
            >
              {subtitle}
            </p>
          )}

          {/* CTA Button */}
          {showButton && (
            <Link
              href={buttonLink}
              className="inline-flex items-center gap-2 bg-white text-[#3d234b] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 group"
            >
              <span>{buttonText}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}
        </div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none"></div>
    </section>
  );
};

export default PageHero;
