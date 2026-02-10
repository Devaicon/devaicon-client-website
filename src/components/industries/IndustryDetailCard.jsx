"use client";

import {
  ChevronDown,
  DollarSign,
  Building2,
  MapPin,
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import React from "react";

// Icon mapping for string-based icon names
const iconMap = {
  DollarSign,
  Building2,
  MapPin,
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
};

/**
 * IndustryDetailCard Component
 * Displays detailed industry information with alternating layouts
 *
 * @param {string} id - Industry section ID for scrolling
 * @param {string} title - Industry title
 * @param {string} image - Industry image path
 * @param {string} icon - Icon name string
 * @param {string} iconAlt - Alt text for icon
 * @param {string} industryContext - Industry context description
 * @param {Array} painPoints - List of common pain points
 * @param {string} ourApproach - Devaicon's approach description
 * @param {Array} solutionText - List of solutions
 * @param {string} additionalContent - Additional context
 * @param {string} futureHeading - Future section heading
 * @param {Array} futurePoints - Future points list
 * @param {boolean} isOdd - Whether card index is odd (for layout)
 * @param {boolean} hideBadge - Whether to hide the "HOW IT WORKS" badge
 */
const IndustryDetailCard = ({
  id,
  title,
  image,
  icon,
  iconAlt,
  industryContext,
  painPoints,
  ourApproach,
  solutionText,
  additionalContent,
  futureHeading,
  futurePoints,
  isOdd,
  hideBadge = false,
}) => {
  const [openSolution, setOpenSolution] = useState(false);

  const toggleSolution = () => {
    setOpenSolution((prev) => !prev);
  };

  // Set background color based on odd/even
  const backgroundColor = isOdd ? "#fef9f3" : "#DCD3FF33";

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
                  <div className="w-20 h-20 p-4 bg-white rounded-lg shadow-md flex items-center justify-center">
                    <img
                      src={icon}
                      alt={iconAlt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* All Content on Right */}
              <div className="flex-1 flex flex-col">
                {/* Badge */}
                {!hideBadge && (
                  <span className="inline-block text-xs font-semibold text-[#3d234b] uppercase tracking-wider mb-3">
                    INDUSTRY SOLUTIONS
                  </span>
                )}

                {/* Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                  {title}
                </h2>

                {/* Industry Context Section */}
                {industryContext && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Industry Context
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {industryContext}
                    </p>
                  </div>
                )}

                {/* Common Pain Points Section */}
                {painPoints && painPoints.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Common Pain Points
                    </h3>
                    <ul className="space-y-2">
                      {painPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-600 text-base leading-relaxed"
                        >
                          <span className="text-[#3d234b] mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Our Approach Section */}
                {ourApproach && (
                  <div className="mb-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Our Approach with Dynamics 365
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {ourApproach}
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

                {/* Future Section */}
                {futureHeading && futurePoints && futurePoints.length > 0 && (
                  <div className="mt-6 p-6 bg-white rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {futureHeading}
                    </h3>
                    <ul className="space-y-2">
                      {futurePoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-600 text-base leading-relaxed"
                        >
                          <span className="text-[#3d234b] mr-2">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Image Column */}
            <div
              className={`h-64 lg:h-full min-h-75 overflow-hidden rounded-t-[2.3rem] ${
                isOdd ? "order-2" : "order-1"
              }`}
            >
              <img
                src={image || "/hero-img.webp"}
                alt={`${title} visualization`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default IndustryDetailCard;
