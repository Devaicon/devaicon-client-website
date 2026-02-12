/**
 * Mobile menu toggle button
 * Shows hamburger icon and handles accessibility
 */
export function MobileMenuButton({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Open navigation menu"
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
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
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
