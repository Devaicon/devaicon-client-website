"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const TrustSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      image: "/openAdex.jpg",
      badge: "Why Market Leaders Trust Us",
      title: (
        <>
          One of the Biggest{" "}
          <span className="text-[#281333]">Open Source Contributors</span> for
          LearnHub Platform
        </>
      ),
      stats: [
        { value: "3000+", label: "Pull Requests Across All GitHub Repos." },
        { value: "10+", label: "Years of Contribution" },
      ],
    },
    {
      image: "/kayak.jpg",
      badge: "Why Market Leaders Trust Us",
      title: (
        <>
          Work with the Team that Made TripFinder into a Leading{" "}
          <span className="text-[#281333]">Travel Search Engine</span>
        </>
      ),
      stats: [
        { value: "50M+", label: "Travelers Served Worldwide" },
        { value: "17+ Years", label: "In the Travel Tech Industry" },
      ],
    },
    {
      image: "/home_value_startups.jpg",
      badge: "Why Market Leaders Trust Us",
      title: (
        <>
          Creating Real Value: Our Track Record with{" "}
          <span className="text-[#281333]">50+ Tech Startups</span>
        </>
      ),
      stats: [
        { value: "$1B+", label: "In Revenue" },
        { value: "500M+", label: "Number of Users" },
      ],
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="bg-gray-50 section-padding-lg relative">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
          {/* Left Content */}
          <div
            className={`flex-1 w-full transition-all duration-700 ease-in-out ${
              isAnimating
                ? "opacity-0 -translate-x-16"
                : "opacity-100 translate-x-0"
            }`}
          >
            {/* Badge */}
            <div className="inline-block mb-4 sm:mb-6">
              <span className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-[#3d234b] text-[#3d234b] rounded-full text-sm sm:text-base font-medium">
                {slides[currentSlide].badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              {slides[currentSlide].title}
            </h2>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
              {slides[currentSlide].stats.map((stat, index) => (
                <div
                  key={index}
                  className="border-l-4 border-gray-300 pl-4 sm:pl-6"
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`flex-1 w-full flex justify-center lg:justify-end transition-all duration-700 ease-in-out relative h-64 sm:h-80 lg:h-96 ${
              isAnimating
                ? "opacity-0 -translate-x-16 scale-95"
                : "opacity-100 translate-x-0 scale-100"
            }`}
          >
            <Image
              src={slides[currentSlide].image}
              alt="Trust Section"
              fill
              className="object-contain rounded-lg shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-[#281333] hover:bg-[#3a1a4a] text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
          aria-label="Previous slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-[#281333] hover:bg-[#3a1a4a] text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
          aria-label="Next slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Carousel Dots */}
        <div className="carousel-dots justify-center">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`carousel-dot ${
                currentSlide === index ? "carousel-dot-active" : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
