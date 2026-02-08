"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ResourcesHub = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const INSIGHTS_DATA = [
    {
      id: 1,
      slug: "value-driven-innovation-automation",
      image: "/Hero-img.webp",
      tag: "Digital Transformation",
      readTime: "7 min read",
      date: "15 JAN",
      title: "Value Driven Innovation through Automation",
      description:
        "Devaicon helps GCC enterprises move beyond the limits of traditional CRM & ERP software.",
    },
    {
      id: 2,
      slug: "agentic-ai",
      image: "/hero-img3.webp",
      tag: "AI & Automation",
      readTime: "8 min read",
      date: "12 JAN",
      title: "Agentic AI is Revolutionizing the Industries",
      description:
        "Stop struggling with disconnected data systems. We apply Agentic AI to banking, retail, and other GCC industries.",
    },
    {
      id: 3,
      slug: "data-sovereign-asset",
      image: "/hero-img4.webp",
      tag: "Data & Analytics",
      readTime: "7 min read",
      date: "10 JAN",
      title: "Data is Going to Be Your New Sovereign Asset",
      description:
        "Your company's data is your most valuable resource. We solve the problem of data silos by building a unified platform.",
    },
    {
      id: 4,
      slug: "autonomous-ai-customer-service",
      image: "/hero-img2.webp",
      tag: "AI & Customer Service",
      readTime: "8 min read",
      date: "08 JAN",
      title:
        "How Customer Service Teams Are Achieving a 20% to 45% Increase in Productivity with AI",
      description:
        "Companies using AI-driven tools like Microsoft Copilot see a 20% to 45% increase in the speed of resolving customer inquiries.",
    },
    {
      id: 5,
      slug: "powering-enterprise-transformation-ai",
      image: "/insight-card-5.webp",
      tag: "Automation",
      readTime: "6 min read",
      date: "05 JAN",
      title: "Doing More with Less Through Intelligent Automation",
      description:
        "See how automation and low-code platforms are helping enterprises reduce costs and increase efficiency.",
      comingSoon: true,
    },
    {
      id: 6,
      slug: "powering-enterprise-transformation-ai",
      image: "/insight-card-6.webp",
      tag: "Customer Experience",
      readTime: "5 min read",
      date: "03 JAN",
      title: "Reimagining Customer Service with AI and Insights",
      description:
        "Learn how AI-driven customer service solutions are improving response times, quality, and satisfaction.",
      comingSoon: true,
    },
  ];

  const filterCards = (card) => {
    const matchesFilter =
      activeFilter === "all" ||
      card.tag.toLowerCase().includes(activeFilter.toLowerCase());
    const matchesSearch = card.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  };

  const showFeatured =
    activeFilter === "all" &&
    ("Azure Cloud Migration: Transform Your Business Infrastructure"
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      searchTerm === "");

  return (
    <section className="section-padding-lg bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-2">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-8 pb-10">
          <div className="inline-block px-5 py-2 bg-gray-100 rounded-full mb-5">
            <span className="text-[#2D1B3D] text-xs font-bold uppercase tracking-wider">
              Software & Microsoft Services
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            How can we help you today?
          </h1>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for services, solutions, insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pr-16 text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#2D1B3D] focus:ring-4 focus:ring-[#2D1B3D]/10 transition-all text-gray-800"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2D1B3D] hover:bg-[#1a0f25] w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {[
              "all",
              "AI",
              "Automation",
              "Data",
              "Digital Transformation",
              "Customer",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-[#2D1B3D] text-white border-2 border-[#2D1B3D]"
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-[#2D1B3D] hover:text-[#2D1B3D]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {/* Featured Banner */}
          {showFeatured && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow w-full flex flex-col md:flex-row min-h-96">
              <div className="relative w-full md:w-[45%] h-96 md:h-auto shrink-0 overflow-hidden">
                <img
                  src="/on-demand1.webp"
                  alt="Azure Cloud Migration"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-b from-[#3d234b] to-[#2a1834] text-white text-xs font-semibold rounded">
                    Featured Webinar
                  </span>
                  <span className="text-sm text-gray-500">5 min read</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Azure Cloud Migration: Transform Your Business Infrastructure
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
                  Join our comprehensive webinar to discover best practices,
                  strategies, and real-world case studies for successful cloud
                  migration. Learn from Microsoft certified experts.
                </p>
                <Link
                  href="#"
                  className="px-5 py-2.5 rounded-[8px] font-semibold text-white bg-gradient-to-b from-[#3d234b] to-[#2a1834] hover:shadow-lg hover:from-[#4a3a6e] hover:to-[#3a1a4a] transition-all duration-300 self-start cursor-pointer inline-flex items-center gap-1"
                >
                  Register Now
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {INSIGHTS_DATA.filter(filterCards).map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col h-full"
              >
                {/* Card Image */}
                <div className="h-56 w-full relative overflow-hidden flex-shrink-0">
                  {card.image && (
                    <>
                      <img
                        src={card.image}
                        alt={card.title}
                        className={`h-full w-full object-cover object-center transition-transform duration-500 ${
                          card.comingSoon
                            ? "group-hover:scale-105 blur-sm"
                            : "group-hover:scale-110"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 ${
                          card.comingSoon
                            ? "bg-[#2D1B3D]/50 backdrop-blur-sm"
                            : ""
                        }`}
                      />
                    </>
                  )}

                  {/* Coming Soon Pill - centered */}
                  {card.comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="px-6 py-3 bg-white text-[#2D1B3D] rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Tag and Read Time */}
                  {!card.comingSoon && (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-3 py-1 bg-gradient-to-b from-[#3d234b] to-[#2a1834] text-white text-xs font-semibold rounded">
                        {card.tag}
                      </span>
                      <span className="text-sm text-gray-500">
                        {card.readTime}
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                    {card.description}
                  </p>

                  {/* Read More Button */}
                  {card.comingSoon ? (
                    <div className="px-4 py-2 rounded-[8px] bg-gray-300 text-gray-500 cursor-not-allowed font-semibold text-sm self-start inline-flex items-center gap-1">
                      Read More
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </div>
                  ) : (
                    <Link
                      href={`/insights/${card.slug}`}
                      className="px-4 py-2 rounded-[8px] font-semibold text-white bg-gradient-to-b from-[#3d234b] to-[#2a1834] hover:shadow-lg hover:from-[#4a3a6e] hover:to-[#3a1a4a] transition-all duration-300 self-start inline-flex items-center gap-1"
                    >
                      Read More
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesHub;
