"use client";

import Image from "next/image";

/**
 * GenericHero Component
 * Reusable hero section for consistent page headers across the application
 *
 * @param {Object} props
 * @param {string} props.title - Main heading text
 * @param {string} props.subtitle - Subheading text
 * @param {string} props.backgroundImage - Path to background image
 * @param {string} props.bgColor - Background color (default: "#3d234b")
 * @param {string} props.titleColor - Title text color (default: "text-white")
 * @param {string} props.subtitleColor - Subtitle text color (default: "text-gray-100")
 * @param {string} props.height - Height class (default: "min-h-96")
 */
const GenericHero = ({
  title,
  subtitle,
  backgroundImage,
  bgColor = "#3d234b",
  titleColor = "text-white",
  subtitleColor = "text-gray-100",
  height = "min-h-96",
}) => {
  return (
    <section
      className={`relative ${height} flex items-center overflow-hidden`}
      style={{ backgroundColor: bgColor }}
      role="banner"
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Glowing Circle - Top Right */}
        <div className="absolute -top-40 -right-40 w-200 h-200 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Large Glowing Circle - Bottom Left */}
        <div className="absolute -bottom-60 -left-60 w-224 h-224 bg-purple-300/15 rounded-full blur-3xl"></div>

        {/* Medium Circle - Center Right */}
        <div className="absolute top-1/4 -right-32 w-150 h-150 bg-indigo-300/12 rounded-full blur-3xl"></div>

        {/* Large Geometric Shape - Top Left */}
        <div className="absolute -top-32 -left-32 w-176 h-176 bg-gradient-to-br from-purple-200/10 to-white/8 rotate-45 blur-3xl"></div>

        {/* Accent Circle - Middle */}
        <div className="absolute top-1/2 left-1/3 w-125 h-125 bg-violet-300/15 rounded-full blur-3xl"></div>

        {/* Geometric Shape - Bottom Right */}
        <div className="absolute -bottom-40 -right-20 w-188 h-188 bg-gradient-to-tl from-purple-200/12 to-indigo-200/10 rotate-12 blur-3xl"></div>

        {/* Floating Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-indigo-200/15 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 flex items-center h-full">
        <div className="max-w-4xl">
          {/* Title */}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${titleColor} mb-4 sm:mb-6 leading-tight`}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`text-base sm:text-lg md:text-xl ${subtitleColor} leading-relaxed`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none"></div>
    </section>
  );
};

export default GenericHero;
