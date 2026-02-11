import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Users, Globe } from "lucide-react";

/**
 * CapabilitesGroups Component
 * Divider section displayed between capability detail cards
 * Highlights company strengths and provides call-to-action
 */
const CapabilitesGroups = () => {
  const features = [
    {
      id: 1,
      icon: Award,
      title: "5+ Years",
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
      title: "Global Partner",
      description: "Worldwide implementation reach",
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
          src="/digital-trasformation.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
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

        {/* Contact Button */}
        <div className="flex justify-center">
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ffffff] hover:bg-[#2a1834] text-[#3d234b] hover:text-white text-sm md:text-base rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            Contact us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CapabilitesGroups;
