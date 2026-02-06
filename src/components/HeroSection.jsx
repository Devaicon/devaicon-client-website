"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      image: "/heroimg1.jpeg",
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
      <div className="relative8 container-responsive max-w-[96rem] py-8 sm:py-12 md:py-20 flex items-center h-full">
        <div className="hero-content">
          {/* Main Heading */}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 transition-all duration-700 ease-in-out ${
              isAnimating
                ? "opacity-0 -translate-x-16"
                : "opacity-100 translate-x-0"
            }`}
          >
            {slides[currentSlide].title}
          </h1>

          {/* Subtext */}
          <p
            className={`text-gray-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed transition-all duration-700 ease-in-out ${
              isAnimating
                ? "opacity-0 -translate-x-16"
                : "opacity-100 translate-x-0"
            }`}
          >
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA Button */}
          <button
            className={`btn btn-primary text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-700 ease-in-out ${
              isAnimating
                ? "opacity-0 -translate-x-16"
                : "opacity-100 translate-x-0"
            }`}
          >
            {slides[currentSlide].buttonText}
          </button>

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
    </section>
  );
};

export default HeroSection;
