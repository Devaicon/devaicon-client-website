import { useEffect } from "react";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { NavItem } from "./NavItem";
import { IndustriesDropdown } from "./IndustriesDropdown";
import { CapabilitiesDropdown } from "./CapabilitiesDropdown";
import { EngagementModelsDropdown } from "./EngagementModelsDropdown";
import { WhyDevaiconDropdown } from "./WhyDevaiconDropdown";
import { useDropdown } from "@/hooks/navigation";
import { ROUTES } from "@/constants/navigation";

/**
 * Desktop navigation menu
 * Handles all desktop nav items and their associated dropdowns
 */
export function DesktopNav({ onDropdownStateChange }) {
  const industriesDropdown = useDropdown();
  const capabilitiesDropdown = useDropdown();
  const engagementModelsDropdown = useDropdown();
  const whyDevaiconDropdown = useDropdown();

  const hasAnyDropdownOpen =
    industriesDropdown.isOpen ||
    capabilitiesDropdown.isOpen ||
    engagementModelsDropdown.isOpen ||
    whyDevaiconDropdown.isOpen;

  // Notify parent component when dropdown state changes
  useEffect(() => {
    onDropdownStateChange?.(hasAnyDropdownOpen);
  }, [hasAnyDropdownOpen, onDropdownStateChange]);

  return (
    <>
      {/* Desktop Navigation Links */}
      <ul
        className="hidden lg:flex items-center gap-3 lg:gap-4 xl:gap-6 2xl:gap-8"
        role="list"
      >
        <NavItem
          href={ROUTES.INDUSTRIES}
          hasDropdown
          isDropdownOpen={industriesDropdown.isOpen}
          {...industriesDropdown.handlers}
        >
          Industries
        </NavItem>

        <NavItem
          href={ROUTES.CAPABILITIES_INTELLIGENT_SYSTEMS}
          hasDropdown
          isDropdownOpen={capabilitiesDropdown.isOpen}
          {...capabilitiesDropdown.handlers}
        >
          Capabilities
        </NavItem>

        <NavItem href={ROUTES.INSIGHTS}>Insights</NavItem>

        <NavItem
          href={ROUTES.ENGAGEMENT_MODELS}
          hasDropdown
          isDropdownOpen={engagementModelsDropdown.isOpen}
          {...engagementModelsDropdown.handlers}
        >
          Engagement Models
        </NavItem>

        <NavItem
          href={ROUTES.ABOUT}
          hasDropdown
          isDropdownOpen={whyDevaiconDropdown.isOpen}
          {...whyDevaiconDropdown.handlers}
        >
          Why Devaicon
        </NavItem>
      </ul>

      {/* Desktop CTA */}
      <Link
        href={ROUTES.CONTACT}
        className="hidden lg:flex items-center gap-1 xl:gap-2 border-gray-300 text-gray-700 hover:border-[#3d234b] hover:text-[#3d234b] transition-all duration-200 font-medium text-xs xl:text-sm group whitespace-nowrap"
        aria-label="Get started with Devaicon"
      >
        <span>Get Started</span>
        <CircleArrowRight className="w-5 h-5 xl:w-7 xl:h-7" />
      </Link>

      {/* Dropdown Menus */}
      <IndustriesDropdown
        isOpen={industriesDropdown.isOpen}
        handlers={industriesDropdown.handlers}
      />

      <CapabilitiesDropdown
        isOpen={capabilitiesDropdown.isOpen}
        handlers={capabilitiesDropdown.handlers}
      />

      <EngagementModelsDropdown
        isOpen={engagementModelsDropdown.isOpen}
        handlers={engagementModelsDropdown.handlers}
      />

      <WhyDevaiconDropdown
        isOpen={whyDevaiconDropdown.isOpen}
        handlers={whyDevaiconDropdown.handlers}
      />
    </>
  );
}
