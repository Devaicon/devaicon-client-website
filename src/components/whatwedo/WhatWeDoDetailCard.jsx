"use client";

import Image from "next/image";
import {
  ChevronDown,
  Search,
  Hammer,
  Settings,
  Globe,
  Headphones,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import React from "react";

// Icon mapping for string-based icon names
const iconMap = {
  Search,
  Hammer,
  Settings,
  Globe,
  Headphones,
  Sparkles,
};

/**
 * WhatWeDoDetailCard Component
 * Displays detailed what we do information with alternating layouts
 *
 * @param {string} id - Section ID for scrolling
 * @param {string} title - Title
 * @param {string} image - Image path
 * @param {string} icon - Icon name string
 * @param {string} iconAlt - Alt text for icon
 * @param {string} description - Main description
 * @param {Array} solutionText - List of solutions
 * @param {string} additionalContent - Additional context
 * @param {boolean} isOdd - Whether card index is odd (for layout)
 */
const WhatWeDoDetailCard = ({
  id,
  title,
  image,
  icon,
  iconAlt,
  description,
  solutionText,
  additionalContent,
  isOdd,
}) => {
  const [openSolution, setOpenSolution] = useState(false);

  const toggleSolution = () => {
    setOpenSolution((prev) => !prev);
  };

  // Set background color based on odd/even
  const backgroundColor = isOdd ? "#fef9f3" : "#DCD3FF33";

  // Set border radius
  const imageBorderRadius = {
    borderTopRightRadius: "2.25rem",
    borderTopLeftRadius: "2.25rem",
  };

  // Get the icon component from the string name
  const IconComponent = typeof icon === "string" ? iconMap[icon] : null;

  return (
    <section
      id={id}
      className="w-full py-10 md:py-12 scroll-mt-20"
      style={{ background: backgroundColor }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Card */}
        <article>
          <div
            className={`grid grid-cols-1 gap-0 ${
              isOdd ? "lg:grid-cols-[65fr_35fr]" : "lg:grid-cols-[35fr_65fr]"
            }`}
          >
            {/* Content Column */}
            <div
              className={`p-6 md:p-8 lg:p-10 flex gap-6 ${
                isOdd ? "order-1" : "order-2"
              }`}
            >
              {/* Icon - Fixed on Left */}
              <div className="flex-shrink-0">
                {IconComponent ? (
                  <div className="w-20 h-20 p-4 bg-white rounded-lg shadow-md flex items-center justify-center">
                    <IconComponent className="w-10 h-10 text-[#3d234b]" />
                  </div>
                ) : (
                  <div className="relative w-20 h-20 p-4 bg-white rounded-lg shadow-md">
                    <Image
                      src={icon}
                      alt={iconAlt}
                      fill
                      className="object-contain p-2"
                      sizes="5rem"
                    />
                  </div>
                )}
              </div>

              {/* All Content on Right */}
              <div className="flex-1 flex flex-col">
                {/* Badge */}
                <span className="inline-block text-xs font-semibold text-[#3d234b] uppercase tracking-wider mb-3">
                  HOW WE WORK
                </span>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                  {title}
                </h2>

                {/* Description Section */}
                {description && (
                  <div className="mb-6">
                    <p className="text-gray-600 text-base leading-relaxed">
                      {description}
                    </p>
                  </div>
                )}

                {/* Solutions Dropdown */}
                {solutionText && (
                  <div className="mb-5 max-w-2xl">
                    <button
                      onClick={toggleSolution}
                      className="w-full flex items-center justify-between py-4 bg-white hover:bg-gray-50 transition-colors border-l-4 border-[#3d234b]"
                      aria-expanded={openSolution}
                      aria-controls={`solution-${id}`}
                    >
                      <span className="text-[#3d234b] font-medium text-left text-lg pl-3">
                        {title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 mr-4 ${
                          openSolution ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openSolution && Array.isArray(solutionText) && (
                      <div id={`solution-${id}`} className="bg-white">
                        {solutionText.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-3 px-6 border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                          >
                            <span className="text-gray-700 text-sm">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {openSolution && !Array.isArray(solutionText) && (
                      <div
                        id={`solution-${id}`}
                        className="py-4 bg-gray-50 px-6"
                      >
                        <p className="text-gray-600 text-sm">{solutionText}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Content */}
                {additionalContent && (
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {additionalContent}
                  </p>
                )}
              </div>
            </div>

            {/* Image Column */}
            <div
              className={`relative h-64 lg:h-full min-h-75 overflow-hidden ${
                isOdd ? "order-2" : "order-1"
              }`}
              style={imageBorderRadius}
            >
              <Image
                src={image || "/hero-img.webp"}
                alt={`${title} visualization`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 35vw"
                priority
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default WhatWeDoDetailCard;
