import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MegaMenuDropdown } from "./MegaMenuDropdown";
import { engagementModelsData, ROUTES } from "@/constants/navigation";

/**
 * Engagement Models mega menu dropdown
 * Two-column layout with introduction and engagement options grid
 */
export function EngagementModelsDropdown({ isOpen, handlers }) {
  return (
    <MegaMenuDropdown isOpen={isOpen} {...handlers}>
      <div className="p-6">
        <div className="flex gap-6">
          {/* Left Section - Header */}
          <div className="w-1/2 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8 rounded-2xl animate-slideInLeft shadow-lg flex flex-col justify-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Engagement Models
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              Choose the right collaboration model that fits your business
              needs. From dedicated teams to staff augmentation, we offer
              flexible engagement options tailored to help you achieve your
              project goals efficiently.
            </p>
          </div>

          {/* Right Section - Engagement Model Links */}
          <div className="w-1/2 animate-slideInRight">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {engagementModelsData.map((model) => (
                <div key={model.title}>
                  <Link href={model.href} className="group inline-block">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#3d234b] transition-colors border-b-2 border-[#3d234b] pb-1">
                      {model.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-gray-600 leading-relaxed mt-2">
                    {model.description}
                  </p>
                </div>
              ))}

              {/* Discover More Button */}
              <div className="col-span-2 pt-3">
                <Link
                  href={ROUTES.ENGAGEMENT_MODELS}
                  className="bg-transparent border-2 border-[#3d234b] text-[#3d234b] px-6 py-2.5 rounded-md font-semibold hover:bg-[#3d234b] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  DISCOVER MORE
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MegaMenuDropdown>
  );
}
