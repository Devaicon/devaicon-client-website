import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MobileAccordion } from "./MobileAccordion";
import { industriesData } from "@/constants/navigation";
import { buildIndustryUrl } from "@/utils/navigation";

/**
 * Mobile industries nested accordion
 * First level: Industries section toggle
 * Second level: Individual industry details
 */
export function MobileIndustriesAccordion({ isOpen, onToggle, onClose }) {
  const [expandedIndustry, setExpandedIndustry] = useState(null);

  const toggleIndustry = (industryName) => {
    setExpandedIndustry(
      expandedIndustry === industryName ? null : industryName,
    );
  };

  return (
    <MobileAccordion
      title="Industries"
      isOpen={isOpen}
      onToggle={onToggle}
      ariaControls="mobile-industries"
    >
      {industriesData.map((industry) => {
        const IconComponent = industry.icon;
        const isExpanded = expandedIndustry === industry.name;

        return (
          <div
            key={industry.id}
            className="border-b border-gray-200 last:border-0"
          >
            <button
              onClick={() => toggleIndustry(industry.name)}
              className="w-full flex items-start gap-2 py-2 px-2 text-left rounded-lg hover:bg-white"
            >
              <div className="text-[#3d234b] mt-1">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {industry.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </div>
                {isExpanded && (
                  <div className="mt-2 space-y-2 animate-slideDown">
                    <p className="text-xs text-gray-600 mb-2">
                      {industry.description}
                    </p>
                    <Link
                      href={buildIndustryUrl(industry.id)}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3d234b] hover:underline mt-2"
                    >
                      Learn More
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </button>
          </div>
        );
      })}
    </MobileAccordion>
  );
}
