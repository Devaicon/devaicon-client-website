"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Building2,
  MapPin,
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
} from "lucide-react";
import IndustryDetailCard from "./IndustryDetailCard";
import IndustriesGroups from "./IndustriesGroups";
import IndustryStickyNav from "./IndustryStickyNav";

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
 * IndustryCard Component
 * Displays a single industry card with icon, title, and learn more link
 * Handles click navigation to detail card sections
 */
const IndustryCard = ({ title, icon, iconAlt, id, onCardClick }) => {
  const handleCardClick = () => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (onCardClick) {
      onCardClick(id);
    }
  };

  // Get the icon component from the string name
  const IconComponent =
    typeof icon === "string" && iconMap[icon] ? iconMap[icon] : null;

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
      aria-labelledby={`${id}-title`}
      role="button"
      tabIndex={0}
    >
      {/* Icon Container */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transform hover:scale-110 transition-transform duration-300 flex items-center justify-center">
        {IconComponent ? (
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#3d234b]" />
        ) : (
          <Image
            src={icon}
            alt={iconAlt}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
            unoptimized
          />
        )}
      </div>

      {/* Title */}
      <h3
        id={`${id}-title`}
        className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 text-center"
      >
        {title}
      </h3>

      {/* Learn More Link */}
      <span className="text-xs sm:text-sm font-medium inline-flex items-center gap-1 text-[#3d234b] hover:text-[#281333] transition-colors">
        Learn more
      </span>
    </article>
  );
};

/**
 * IndustriesContainer Component
 * Main container for displaying industry sections
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle
 * @param {Array} props.cards - Array of industry card data
 * @param {boolean} props.showGroups - Whether to show IndustriesGroups divider
 * @param {boolean} props.hideBadge - Whether to hide the "HOW IT WORKS" badge in detail cards
 */
const IndustriesContainer = ({
  title,
  subtitle,
  cards,
  showGroups = true,
  hideBadge = false,
}) => {
  const [activeCardId, setActiveCardId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Find which card is currently in viewport
      cards.forEach((card) => {
        const element = document.getElementById(card.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in viewport with threshold
          if (rect.top <= 200) {
            setActiveCardId(card.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [cards]);

  return (
    <>
      {/* Sticky Navigation - appears when scrolling past main cards */}
      <IndustryStickyNav cards={cards} activeCardId={activeCardId} />

      {/* Main Content Section */}
      <section
        className="w-full bg-gradient-to-br from-purple-50 to-blue-50 py-16 md:py-20 lg:py-24"
        aria-labelledby="industries-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="industries-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </header>

          {/* Industry Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            role="list"
          >
            {cards.map((card, index) => (
              <div key={card.id} role="listitem">
                <IndustryCard
                  title={card.title}
                  icon={card.icon}
                  iconAlt={card.iconAlt}
                  id={card.id}
                  onCardClick={setActiveCardId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Cards Section */}
      {cards.map((card, index) => (
        <div key={card.id}>
          <IndustryDetailCard
            id={card.id}
            title={card.title}
            icon={card.icon}
            iconAlt={card.iconAlt}
            image={card.image}
            industryContext={card.industryContext}
            painPoints={card.painPoints}
            ourApproach={card.ourApproach}
            solutionText={card.solutionText}
            additionalContent={card.additionalContent}
            futureHeading={card.futureHeading}
            futurePoints={card.futurePoints}
            isOdd={index % 2 === 0}
            hideBadge={hideBadge}
          />

          {/* Divider between sections */}
          {showGroups && index === Math.floor(cards.length / 2) - 1 && (
            <IndustriesGroups />
          )}
        </div>
      ))}
    </>
  );
};

export default IndustriesContainer;
