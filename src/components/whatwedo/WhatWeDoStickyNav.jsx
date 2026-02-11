"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Hammer,
  Settings,
  Globe,
  Headphones,
  Sparkles,
} from "lucide-react";

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
 * WhatWeDoStickyNav Component
 * Sticky navigation bar that appears when scrolling past the main cards section
 * Allows quick navigation between what we do detail sections
 */
const WhatWeDoStickyNav = ({ cards = [], activeCardId = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeSection, setActiveSection] = useState(activeCardId);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Get the first detail card element
      const firstDetailCard = document.getElementById(cards[0]?.id);

      if (firstDetailCard) {
        const rect = firstDetailCard.getBoundingClientRect();
        // Show navbar when first detail card is at or above viewport top
        setIsVisible(rect.top <= 100);
      }

      // Scroll spy: detect which section is currently in view
      let currentSection = activeCardId;
      const threshold = 200;

      cards.forEach((card) => {
        const element = document.getElementById(card.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in viewport with threshold
          if (rect.top <= threshold) {
            currentSection = card.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [cards, activeCardId]);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition(); // Initial check

      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, [isVisible]);

  // Auto-scroll to active nav item when activeSection changes
  useEffect(() => {
    if (scrollContainerRef.current && activeSection) {
      const activeButton = scrollContainerRef.current.querySelector(
        `button[data-card-id="${activeSection}"]`,
      );

      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeSection]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (cardId) => {
    const element = document.getElementById(cardId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 transition-transform duration-300">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-4">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="flex-shrink-0 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all border border-gray-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cards.map((card) => {
              const IconComponent =
                typeof card.icon === "string" && iconMap[card.icon]
                  ? iconMap[card.icon]
                  : null;
              const isActive = activeSection === card.id;

              return (
                <button
                  key={card.id}
                  data-card-id={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-[#3d234b] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
                  }`}
                  aria-label={`Navigate to ${card.title}`}
                  aria-current={isActive ? "true" : "false"}
                >
                  {/* Icon */}
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    {IconComponent ? (
                      <IconComponent className="w-5 h-5" />
                    ) : (
                      <div className="relative w-5 h-5">
                        <Image
                          src={card.icon}
                          alt={card.iconAlt}
                          fill
                          className="object-contain"
                          sizes="20px"
                        />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <span className="hidden sm:inline">{card.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="flex-shrink-0 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all border border-gray-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoStickyNav;
