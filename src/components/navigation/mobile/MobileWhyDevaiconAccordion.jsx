import Link from "next/link";
import { MobileAccordion } from "./MobileAccordion";
import { whyDevaiconData } from "@/constants/navigation";

/**
 * Mobile "Why Devaicon" accordion
 * Quick links to company pages
 */
export function MobileWhyDevaiconAccordion({ isOpen, onToggle, onClose }) {
  return (
    <MobileAccordion
      title="Why Devaicon"
      isOpen={isOpen}
      onToggle={onToggle}
      ariaControls="mobile-why-devaicon"
    >
      {whyDevaiconData.map((item) => {
        const IconComponent = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
            onClick={onClose}
          >
            <IconComponent className="w-5 h-5 text-[#3d234b]" />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {item.title}
              </div>
              <div className="text-xs text-gray-600">{item.description}</div>
            </div>
          </Link>
        );
      })}
    </MobileAccordion>
  );
}
