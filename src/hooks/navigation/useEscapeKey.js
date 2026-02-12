import { useEffect } from "react";

/**
 * Custom hook for handling Escape key press
 * Useful for closing modals, menus, and dropdowns
 *
 * @param {Function} callback - Function to call when Escape is pressed
 * @param {boolean} enabled - Whether the listener is active (default: true)
 */
export function useEscapeKey(callback, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [callback, enabled]);
}
