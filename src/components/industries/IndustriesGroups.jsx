import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Users, Globe } from "lucide-react";

/**
 * IndustriesGroups Component
 * Divider section displayed between industry detail cards
 * Highlights company strengths and provides call-to-action
 */
const IndustriesGroups = () => {
  const features = [
    {
      id: 1,
      icon: Award,
      title: "18+ Years",
      description: "Proven industry experience",
      bgColor: "#3d234b",
    },
    {
      id: 2,
      icon: Users,
      title: "Strong Client Base",
      description: "Trusted by enterprise customers",
      bgColor: "#3d234b",
    },
    {
      id: 3,
      icon: Globe,
      title: "GCC Partner",
      description: "Regional implementation expertise",
      bgColor: "#3d234b",
    },
  ];

  return (
    <section
      className="relative w-full py-10 md:py-12 lg:py-14 overflow-hidden"
      style={{ background: "#3d234b" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/digital-transformation.webp"
          alt="Background"
          fill
          className="object-cover"
          loading="lazy"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 md:mb-10">
          Turning technology into measurable business impacts
        </h2>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-6 md:p-8 backdrop-blur-3xl"
                style={{
                  boxShadow: "0px 4px 4px 0px #53406B80",
                }}
              >
                {/* Icon and Content Container */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: feature.bgColor }}
                  >
                    <IconComponent
                      className="w-6 h-6 text-white"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1">
                    <h3
                      className="text-lg md:text-xl font-bold mb-1"
                      style={{ color: "#3d234b" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm md:text-base"
                      style={{ color: "#3d234b" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#3d234b] font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg transition-all duration-300"
            aria-label="Get in touch with us"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndustriesGroups;
