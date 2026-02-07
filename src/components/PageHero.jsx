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
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.label - Label text (e.g., "Legal Information")
 * @param {string} props.metadata - Metadata text (e.g., "Last Updated: ...")
 * @param {React.ReactNode} props.metadataIcon - Icon for metadata
 * @param {boolean} props.showButton - Whether to show the CTA button (default: true)
 */
const PageHero = ({
  title,
  subtitle,
  buttonText = "Discover More",
  buttonLink = "#",
  icon,
  label,
  metadata,
  metadataIcon,
  showButton = true,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-[#3d234b] via-[#4a2d5a] to-[#5a3464] text-white py-20 sm:py-16 lg:py-24 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15 mt-20">
        {/* Icon and Label */}
        {(icon || label) && (
          <div className="flex items-center gap-3 mb-6">
            {icon && (
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                {icon}
              </div>
            )}
            {label && (
              <>
                <div className="h-12 w-1 bg-white/30"></div>
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  {label}
                </span>
              </>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base sm:text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* CTA Button */}
        {showButton && (
          <Link
            href={buttonLink}
            className="inline-flex items-center gap-2 bg-white text-[#3d234b] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 group mb-6"
          >
            <span>{buttonText}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        )}

        {/* Metadata */}
        {metadata && (
          <div className="flex items-center gap-2 text-white/70">
            {metadataIcon}
            <p className="text-base sm:text-lg">{metadata}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHero;
