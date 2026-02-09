"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      image: "/heroimg1.webp",
      title: (
        <>
          {/* <span className="text-gray-900"> </span> */}
          <span className="text-[#281333]">Value</span>
          <span className="text-gray-900"> Driven Innovative Through </span>
          <span className="text-[#281333]">Automation & AI</span>
        </>
      ),
      subtitle: (
        <>
          Trusted by top platforms like{" "}
          <span className="font-semibold">edX</span>,{" "}
          <span className="font-semibold">KAYAK</span>, and{" "}
          <span className="font-semibold">Careem</span> for our transformative
          solutions and exceptional results.
        </>
      ),
      buttonText: "Start a Project",
    },
    {
      image: "/ai.jpeg",
      title: (
        <>
          <span className="text-gray-900">Devaicon AI & ML </span>
          <span className="text-[#281333]">Solutions </span>
          <span className="text-gray-900">
            {" "}
            Powering the Future with Intelligent{" "}
          </span>
          <span className="text-[#281333]">Innovation</span>
        </>
      ),
      subtitle: (
        <>
          Trusted by top platforms like{" "}
          <span className="font-semibold">LearnHub</span>,{" "}
          <span className="font-semibold">TripFinder</span>, and{" "}
          <span className="font-semibold">RideShare</span> for our
          transformative solutions and exceptional results.
        </>
      ),
      buttonText: "Start a Project",
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
    }, 10000); // Change slide every 10 seconds

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
    <section className="hero-section  " role="banner">
      {/* Background Image */}
      <div className="absolute inset-0">
        {slides[currentSlide].image && (
          <Image
            src={slides[currentSlide].image}
            alt="Hero Background"
            fill
            className={`object-cover transition-all duration-700 ease-in-out ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            priority
            sizes="100vw"
          />
        )}
        <div
          className="absolute inset-0 hero-gradient"
          aria-hidden="true"
        ></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center pt-20 lg:pt-28 xl:pt-24">
        <div className="w-full xl:w-[calc(100%-25rem)] mx-auto px-4 sm:px-8 lg:px-6 xl:px-15">
          <div className="hero-content">
            {/* Main Heading */}
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 lg:mb-5 xl:mb-6 transition-all duration-700 ease-in-out ${
                isAnimating
                  ? "opacity-0 -translate-x-16"
                  : "opacity-100 translate-x-0"
              }`}
            >
              {slides[currentSlide].title}
            </h1>

            {/* Subtext */}
            <p
              className={`text-gray-700 text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg mb-4 sm:mb-5 lg:mb-6 xl:mb-8 leading-relaxed transition-all duration-700 ease-in-out ${
                isAnimating
                  ? "opacity-0 -translate-x-16"
                  : "opacity-100 translate-x-0"
              }`}
            >
              {slides[currentSlide].subtitle}
            </p>

            {/* CTA Button */}
            <Link href="/contact-us">
              <button
                className={`btn btn-primary text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg shadow-lg hover:shadow-xl transition-all duration-700 ease-in-out ${
                  isAnimating
                    ? "opacity-0 -translate-x-16"
                    : "opacity-100 translate-x-0"
                }`}
              >
                {slides[currentSlide].buttonText}
              </button>
            </Link>

            {/* Carousel Dots */}
            <div className="carousel-dots">
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
