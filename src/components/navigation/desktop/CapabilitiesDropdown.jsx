import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MegaMenuDropdown } from "./MegaMenuDropdown";
import { capabilitiesData } from "@/constants/navigation";
import {
  getIconComponent,
  buildCapabilityItemUrl,
  getCapabilitySlug,
} from "@/utils/navigation";

/**
 * Capabilities mega menu dropdown
 * Two-column layout with capability categories and detailed service items
 */
export function CapabilitiesDropdown({ isOpen, handlers }) {
  const [hoveredCapability, setHoveredCapability] = useState(
    capabilitiesData[0].name,
  );
  const currentCapability = capabilitiesData.find(
    (cap) => cap.name === hoveredCapability,
  );

  return (
    <MegaMenuDropdown isOpen={isOpen} {...handlers}>
      <div className="flex">
        {/* Left Section - Capabilities List */}
        <div className="w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-slideInLeft">
          <div className="space-y-2 stagger-animation">
            {capabilitiesData.map((capability) => {
              const IconComponent = capability.icon;
              const isActive = hoveredCapability === capability.name;

              return (
                <div
                  key={capability.slug}
                  onMouseEnter={() => setHoveredCapability(capability.name)}
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
                    {capability.name}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-[#3d234b]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section - Capability Details */}
        <div className="w-2/3 p-8 animate-slideInRight">
          {currentCapability && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentCapability.name}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {currentCapability.description}
              </p>

              {/* Capability Items */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentCapability.items.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  const itemUrl = buildCapabilityItemUrl(
                    currentCapability.name,
                    item.id,
                  );

                  return (
                    <Link
                      key={item.id}
                      href={itemUrl}
                      className="flex items-center gap-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg text-[#3d234b]">
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Learn More Button */}
              <Link
                href={`/capabilities/${getCapabilitySlug(currentCapability.name)}`}
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
