/**
 * Base mega menu dropdown wrapper
 * Provides consistent layout and animation for all dropdown menus
 */
export function MegaMenuDropdown({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-24 w-full xl:w-[calc(100%-25rem)] z-40 animate-fadeInScale flex justify-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white shadow-2xl rounded-b-3xl border-x-2 border-b-2 border-gray-200 overflow-hidden w-full">
        {children}
      </div>
    </div>
  );
}
