"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  DollarSign,
  Building2,
  MapPin,
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
  Search,
  Hammer,
  Settings,
  Globe,
  Headphones,
  Sparkles,
} from "lucide-react";
import CapabilityDetailCard from "./CapabilityDetailCard";
import CapabilitesGroups from "./CapabilitesGroups";
import CapabilityStickyNav from "./CapabilityStickyNav";

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
  Search,
  Hammer,
  Settings,
  Globe,
  Headphones,
  Sparkles,
};

/**
 * CapabilityCard Component
 * Displays a single capability card with icon, title, and learn more link
 * Handles click navigation to detail card sections
 */
const CapabilityCard = ({ title, icon, iconAlt, id, onCardClick }) => {
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
 * CapabilitiesContainer Component
 * Main container for displaying capability sections
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle
 * @param {Array} props.cards - Array of capability card data
 * @param {boolean} props.showGroups - Whether to show CapabilitesGroups divider
 * @param {boolean} props.hideBadge - Whether to hide the "HOW IT WORKS" badge in detail cards
 */
const CapabilitesContainer = ({
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
      <CapabilityStickyNav cards={cards} activeCardId={activeCardId} />

      <section
        className="w-full bg-[#fef9f3] py-16 md:py-20 lg:py-24"
        aria-labelledby="capabilities-heading"
      >
        <div className="max-w-8xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          {/* Section Header */}
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="capabilities-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </header>

          {/* Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            role="list"
          >
            {cards.map((card) => (
              <div key={card.id} role="listitem">
                <CapabilityCard
                  id={card.id}
                  title={card.title}
                  icon={card.icon}
                  iconAlt={card.iconAlt}
                  onCardClick={setActiveCardId}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Detail Cards - First half */}
        {cards.slice(0, Math.ceil(cards.length / 2)).map((card, index) => (
          <CapabilityDetailCard
            key={card.id}
            card={card}
            index={index}
            hideBadge={hideBadge}
          />
        ))}

        {/* CapabilitesGroups Component - Partition between cards */}
        {showGroups && <CapabilitesGroups />}

        {/* Dynamic Detail Cards - Second half */}
        {cards.slice(Math.ceil(cards.length / 2)).map((card, index) => (
          <CapabilityDetailCard
            key={card.id}
            card={card}
            index={index + Math.ceil(cards.length / 2)}
            hideBadge={hideBadge}
          />
        ))}
      </section>
    </>
  );
};

export default CapabilitesContainer;
