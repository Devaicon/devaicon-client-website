import Link from "next/link";
import { MobileAccordion } from "./MobileAccordion";
import { engagementModelsData } from "@/constants/navigation";

/**
 * Mobile engagement models accordion
 * Lists all engagement model options
 */
export function MobileEngagementModelsAccordion({ isOpen, onToggle, onClose }) {
  return (
    <MobileAccordion
      title="Engagement Models"
      isOpen={isOpen}
      onToggle={onToggle}
      ariaControls="mobile-engagement-models"
    >
      {engagementModelsData.map((model) => (
        <Link
          key={model.title}
          href={model.href}
          className="block p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
          onClick={onClose}
        >
          <div className="text-sm font-semibold text-gray-900 mb-1">
            {model.title}
          </div>
          <div className="text-xs text-gray-600">{model.description}</div>
        </Link>
      ))}
    </MobileAccordion>
  );
}
