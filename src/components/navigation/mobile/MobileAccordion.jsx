import { ChevronDown } from "lucide-react";

/**
 * Reusable mobile accordion component
 * Handles collapsible sections with animation
 */
export function MobileAccordion({
  title,
  isOpen,
  onToggle,
  children,
  ariaControls,
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-gray-900 hover:bg-gray-50 px-4 py-3 text-base font-medium transition-colors rounded-lg"
        aria-expanded={isOpen}
        aria-controls={ariaControls}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          id={ariaControls}
          className="bg-gray-50 px-2 pb-3 space-y-2 animate-slideDown rounded-lg mt-1"
        >
          {children}
        </div>
      )}
    </div>
  );
}
