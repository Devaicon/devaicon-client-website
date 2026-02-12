import Link from "next/link";
import { ChevronDown } from "lucide-react";

/**
 * Reusable navigation item with optional dropdown indicator
 * Props mirror native link behavior plus dropdown visual cues
 */
export function NavItem({
  href,
  children,
  hasDropdown = false,
  isDropdownOpen = false,
  onMouseEnter,
  onMouseLeave,
  ariaLabel,
}) {
  return (
    <li
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={href}
        className="text-gray-700 hover:text-[#3d234b] transition-colors font-bold text-md xl:text-md relative whitespace-nowrap flex items-center gap-1"
        aria-label={ariaLabel}
      >
        {children}
        {hasDropdown && (
          <ChevronDown
            className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        )}
      </Link>
    </li>
  );
}
