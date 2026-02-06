"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Reusable Engagement Models Section Component
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Main section title (default: "Why Different Engagement Models?")
 * @param {string} props.highlightText - Text to highlight in title (default: "ENGAGEMENT MODELS")
 * @param {string} props.highlightColor - Color for highlighted text (default: "#3d234b")
 * @param {Array<string>} props.descriptions - Array of description paragraphs
 * @param {Array<Object>} props.models - Array of engagement model objects
 * @param {string} props.tabBarBg - Background color for tab bar (default: "bg-gradient-to-br from-purple-50 to-blue-50")
 */
const EngagementModelsSection = ({
  title = "Why Different Engagement Models?",
  highlightText = "ENGAGEMENT MODELS",
  highlightColor = "#3d234b",
  descriptions = [],
  models = [],
  tabBarBg = "bg-gradient-to-br from-purple-50 to-blue-50",
}) => {
  const [activeModel, setActiveModel] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("right");

  const handleTabChange = (newIndex) => {
    if (newIndex === activeModel) return;

    setDirection(newIndex > activeModel ? "right" : "left");
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveModel(newIndex);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="container-responsive">
        {/* Title Section */}
        <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
            Why Different{" "}
            <span style={{ color: highlightColor }}>Engagement Models</span>?
          </h2>

          {/* Descriptions */}
          <div className="space-y-4">
            {descriptions.map((desc, index) => (
              <p
                key={index}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
              >
                {desc}
              </p>
            ))}
          </div>
        </div>

        {/* Tab Bar */}
        <div
          className={`${tabBarBg} rounded-2xl p-2 sm:p-3 mb-8 sm:mb-12 max-w-4xl mx-auto shadow-lg `}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 my-4">
            {models.map((model, index) => (
              <button
                key={index}
                onClick={() => handleTabChange(index)}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                  activeModel === index
                    ? "bg-[#3d234b] text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                {model.tabTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`max-w-5xl mx-auto ${tabBarBg} p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden`}
        >
          <div className="relative min-h-[500px]">
            {models.map(
              (model, index) =>
                activeModel === index && (
                  <div
                    key={index}
                    className={`text-center transition-all duration-500 ease-out ${
                      isTransitioning
                        ? direction === "right"
                          ? "opacity-0 translate-x-full"
                          : "opacity-0 -translate-x-full"
                        : "opacity-100 translate-x-0"
                    }`}
                  >
                    {/* Title and Description */}
                    <div className="mb-8 sm:mb-12 text-center">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                        {model.title}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed mx-auto max-w-4xl">
                        {model.description}
                      </p>
                    </div>

                    {/* The Devaicon Factor */}
                    {model.devaiconFactor && (
                      <div className="mb-8 sm:mb-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 md:p-10">
                        <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
                          The Devaicon Factor
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                          {model.devaiconFactor.map((stat, idx) => (
                            <div
                              key={idx}
                              className="text-center border-r border-gray-300 last:border-r-0"
                            >
                              <div
                                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4"
                                style={{ color: stat.color || "#3d234b" }}
                              >
                                {stat.value}
                              </div>
                              <p className="text-sm sm:text-base text-gray-700 leading-snug px-2">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technologies Employed */}
                    {model.technologies && model.technologies.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 sm:p-8">
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                          Technologies Employed
                        </h4>
                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10">
                          {model.technologies.map((tech, idx) => (
                            <div
                              key={idx}
                              className="group relative flex items-center justify-center p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
                            >
                              <Image
                                src={tech.logo}
                                alt={tech.name}
                                width={tech.width || 80}
                                height={tech.height || 80}
                                className="object-contain w-16 h-16 sm:w-20 sm:h-20 grayscale group-hover:grayscale-0 transition-all duration-300"
                              />
                              {tech.name && (
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                  {tech.name}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementModelsSection;
