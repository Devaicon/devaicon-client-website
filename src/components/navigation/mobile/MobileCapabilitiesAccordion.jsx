import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MobileAccordion } from "./MobileAccordion";
import { capabilitiesData } from "@/constants/navigation";
import { getCapabilitySlug, getIconComponent } from "@/utils/navigation";

/**
 * Mobile capabilities nested accordion
 * First level: Capabilities section toggle
 * Second level: Individual capability categories
 * Third level: Capability items list
 */
export function MobileCapabilitiesAccordion({ isOpen, onToggle, onClose }) {
  const [expandedCapability, setExpandedCapability] = useState(null);

  const toggleCapability = (capabilityName) => {
    setExpandedCapability(
      expandedCapability === capabilityName ? null : capabilityName,
    );
  };

  return (
    <MobileAccordion
      title="Capabilities"
      isOpen={isOpen}
      onToggle={onToggle}
      ariaControls="mobile-capabilities"
    >
      {capabilitiesData.map((capability) => {
        const IconComponent = capability.icon;
        const isExpanded = expandedCapability === capability.name;

        return (
          <div
            key={capability.slug}
            className="border-b border-gray-200 last:border-0"
          >
            <button
              onClick={() => toggleCapability(capability.name)}
              className="w-full flex items-start gap-2 py-2 px-2 text-left rounded-lg hover:bg-white"
            >
              <div className="text-[#3d234b] mt-1">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {capability.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </div>
                {isExpanded && (
                  <div className="mt-2 space-y-3 animate-slideDown">
                    <p className="text-xs text-gray-600">
                      {capability.description}
                    </p>
                    <div className="space-y-2">
                      {capability.items.map((item) => {
                        const ItemIcon = getIconComponent(item.icon);

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 p-2"
                          >
                            <div className="flex items-center justify-center h-6 w-6 text-[#3d234b]">
                              {ItemIcon && <ItemIcon className="w-4 h-4" />}
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <Link
                      href={`/capabilities/${getCapabilitySlug(capability.name)}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3d234b] hover:underline mt-2"
                    >
                      LEARN MORE
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
