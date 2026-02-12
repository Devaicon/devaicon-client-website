import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MegaMenuDropdown } from "./MegaMenuDropdown";
import { industriesData } from "@/constants/navigation";
import { buildIndustryUrl } from "@/utils/navigation";

/**
 * Industries mega menu dropdown
 * Two-column layout with industry list and detail panel
 */
export function IndustriesDropdown({ isOpen, handlers }) {
  const [hoveredIndustry, setHoveredIndustry] = useState(
    industriesData[0].name,
  );
  const currentIndustry = industriesData.find(
    (ind) => ind.name === hoveredIndustry,
  );

  return (
    <MegaMenuDropdown isOpen={isOpen} {...handlers}>
      <div className="flex">
        {/* Left Section - Industry List */}
        <div className="w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-slideInLeft">
          <div className="space-y-2 stagger-animation">
            {industriesData.map((industry) => {
              const IconComponent = industry.icon;
              const isActive = hoveredIndustry === industry.name;

              return (
                <div
                  key={industry.id}
                  onMouseEnter={() => setHoveredIndustry(industry.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-white shadow-lg scale-[1.02] border-l-4 border-[#3d234b]"
                      : "hover:bg-white/60 hover:shadow-sm"
                  }`}
                >
                  <div className="text-[#3d234b]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 flex-1">
                    {industry.name}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-[#3d234b]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section - Industry Details */}
        <div className="w-2/3 p-8 animate-slideInRight">
          {currentIndustry && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentIndustry.name}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {currentIndustry.description}
              </p>
              <Link
                href={buildIndustryUrl(currentIndustry.id)}
                className="bg-transparent border-2 border-[#3d234b] text-[#3d234b] px-6 py-2.5 rounded-md font-semibold hover:bg-[#3d234b] hover:text-white transition-all duration-200 flex items-center gap-2 w-fit"
              >
                LEARN MORE
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </MegaMenuDropdown>
  );
}
