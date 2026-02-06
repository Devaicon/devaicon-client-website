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
      className="flex flex-col items-center justify-center gap-4 p-6 sm:p-8 md:p-10 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
      aria-labelledby={`${id}-title`}
      role="button"
      tabIndex={0}
    >
      {/* Icon Container */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 transform hover:scale-110 transition-transform duration-300 flex items-center justify-center">
        {IconComponent ? (
          <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#4555A7]" />
        ) : (
          <Image
            src={icon}
            alt={iconAlt}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 80px"
          />
        )}
      </div>

      {/* Title */}
      <h3
        id={`${id}-title`}
        className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 text-center"
      >
        {title}
      </h3>

      {/* Learn More Link */}
      <span className="text-xs sm:text-sm font-medium inline-flex items-center gap-1 text-[#4555A7] hover:text-[#5B6FB6] transition-colors">
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
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Industry Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {cards.map((card, index) => (
              <IndustryCard
                key={card.id}
                title={card.title}
                icon={card.icon}
                iconAlt={card.iconAlt}
                id={card.id}
                onCardClick={setActiveCardId}
              />
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
