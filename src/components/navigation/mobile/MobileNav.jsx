import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CircleArrowRight } from "lucide-react";
import { MobileIndustriesAccordion } from "./MobileIndustriesAccordion";
import { MobileCapabilitiesAccordion } from "./MobileCapabilitiesAccordion";
import { MobileEngagementModelsAccordion } from "./MobileEngagementModelsAccordion";
import { MobileWhyDevaiconAccordion } from "./MobileWhyDevaiconAccordion";
import { ROUTES } from "@/constants/navigation";

/**
 * Mobile navigation menu
 * Slide-in menu with accordion sections
 */
export function MobileNav({ isOpen, onClose }) {
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);
  const [engagementModelsOpen, setEngagementModelsOpen] = useState(false);
  const [whyDevaiconOpen, setWhyDevaiconOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[70] lg:hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link
              href={ROUTES.HOME}
              className="flex items-center"
              onClick={onClose}
            >
              <Image
                src="/logo.svg"
                alt="Devaicon Logo"
                width={140}
                height={63}
                className="object-contain"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav
            className="flex-1 overflow-y-auto p-4"
            aria-label="Mobile navigation"
          >
            <div className="space-y-2">
              <MobileIndustriesAccordion
                isOpen={industriesOpen}
                onToggle={() => setIndustriesOpen(!industriesOpen)}
                onClose={onClose}
              />

              <MobileCapabilitiesAccordion
                isOpen={capabilitiesOpen}
                onToggle={() => setCapabilitiesOpen(!capabilitiesOpen)}
                onClose={onClose}
              />

              <Link
                href={ROUTES.INSIGHTS}
                className="block text-gray-900 hover:bg-gray-50 px-4 py-3 text-base font-medium border-b border-gray-100 transition-colors rounded-lg"
                onClick={onClose}
              >
                Insights
              </Link>

              <MobileEngagementModelsAccordion
                isOpen={engagementModelsOpen}
                onToggle={() => setEngagementModelsOpen(!engagementModelsOpen)}
                onClose={onClose}
              />

              <MobileWhyDevaiconAccordion
                isOpen={whyDevaiconOpen}
                onToggle={() => setWhyDevaiconOpen(!whyDevaiconOpen)}
                onClose={onClose}
              />
            </div>
          </nav>

          {/* Mobile CTA */}
          <div className="p-6 border-t border-gray-200">
            <Link
              href={ROUTES.CONTACT}
              className="flex items-center justify-center gap-2 w-full bg-[#3d234b] text-white px-6 py-3.5 rounded-lg hover:bg-[#2d1a3b] transition-colors font-medium"
              onClick={onClose}
            >
              <span>Get Started</span>
              <CircleArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
