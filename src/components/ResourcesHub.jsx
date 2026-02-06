"use client";

import { useState } from "react";
import Image from "next/image";

const ResourcesHub = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const cards = [
    {
      id: 1,
      category: "blog",
      date: { day: "15", month: "Dec" },
      title: "Maximizing Microsoft 365 for Enterprise Productivity",
      cta: "Read More",
      image: "/blog1.jfif",
    },
    {
      id: 2,
      category: "on-demand",
      date: { day: "20", month: "Dec" },
      title: "Power Platform: Low-Code Solutions for Business",
      cta: "Watch Now",
      image: "/on-demand2.webp",
    },
    {
      id: 3,
      category: "blog",
      date: { day: "18", month: "Dec" },
      title: "DevOps Excellence with Azure: CI/CD Pipeline Guide",
      cta: "Learn More",
      image: "/blog2.png",
    },
    {
      id: 4,
      category: "on-demand",
      date: { day: "22", month: "Dec" },
      title: "Cybersecurity Excellence: Protecting Digital Assets",
      cta: "View Webinar",
      image: "/on-demand3.jpg",
    },
    {
      id: 5,
      category: "event",
      date: { day: "05", month: "Jan" },
      title: "Microsoft Tech Summit: Innovation & Transformation",
      cta: "Register",
      image: "/event1.avif",
    },
    {
      id: 6,
      category: "blog",
      date: { day: "12", month: "Dec" },
      title: "AI & Machine Learning with Azure Cognitive Services",
      cta: "Explore",
      image: "/blog3.jfif",
    },
  ];

  const filterCards = (card) => {
    const matchesFilter =
      activeFilter === "all" || card.category === activeFilter;
    const matchesSearch = card.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  };

  const showFeatured =
    (activeFilter === "all" || activeFilter === "on-demand") &&
    ("Azure Cloud Migration: Transform Your Business Infrastructure"
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      searchTerm === "");

  return (
    <section className="section-padding-lg bg-white">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-5 py-2 bg-gray-100 rounded-full mb-5">
            <span className="text-[#2D1B3D] text-xs font-bold uppercase tracking-wider">
              Software & Microsoft Services
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            How can we help you today?
          </h1>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-10">
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
            {["all", "blog", "on-demand", "event"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-[#2D1B3D] text-white border-2 border-[#2D1B3D]"
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-[#2D1B3D] hover:text-[#2D1B3D]"
                }`}
              >
                {filter === "on-demand" ? "On-Demand" : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {/* Featured Banner */}
          {showFeatured && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#2D1B3D] transition-all cursor-pointer group">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="h-96 lg:h-125 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="/on-demand1.png"
                    alt="Azure Cloud Migration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#a07dbb]/30"></div>
                </div>
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                  <span className="inline-block w-fit px-4 py-2 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wide rounded-full mb-5">
                    Featured Webinar
                  </span>
                  <div className="text-gray-400 text-sm font-medium mb-4">
                    December 28, 2025
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 leading-tight">
                    Azure Cloud Migration: Transform Your Business
                    Infrastructure
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Join our comprehensive webinar to discover best practices,
                    strategies, and real-world case studies for successful cloud
                    migration. Learn from Microsoft certified experts.
                  </p>
                  <div className="flex items-center gap-3 text-[#2D1B3D] font-semibold text-sm uppercase tracking-wide group-hover:gap-4 transition-all">
                    Register Now
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cards.filter(filterCards).map((card) => (
              <div
                key={card.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[#2D1B3D] transition-all cursor-pointer group"
              >
                {/* Card Image */}
                <div
                  className={`h-56 relative overflow-hidden ${
                    card.image
                      ? "bg-gray-200"
                      : `bg-linear-to-br ${card.gradient}`
                  }`}
                >
                  {card.image && (
                    <>
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-[#a07dbb]/30"></div>
                    </>
                  )}
                  {/* Tag */}
                  <span
                    className={`absolute top-4 left-4 px-4 py-1.5 bg-white rounded-full text-xs font-bold uppercase tracking-wide z-10 ${
                      card.category === "blog"
                        ? "text-blue-800"
                        : card.category === "on-demand"
                          ? "text-amber-700"
                          : "text-emerald-700"
                    }`}
                  >
                    {card.category === "on-demand"
                      ? "On-Demand"
                      : card.category}
                  </span>
                  {/* Date */}
                  <div className="absolute top-4 right-4 bg-white/95 rounded-lg p-2 text-center font-semibold z-10">
                    <div className="text-xl text-gray-900 leading-none">
                      {card.date.day}
                    </div>
                    <div className="text-xs text-gray-600 uppercase mt-0.5">
                      {card.date.month}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5 leading-snug">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-[#2D1B3D] font-semibold text-sm uppercase tracking-wide group-hover:gap-3 transition-all mt-auto">
                    {card.cta}
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </div>
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
