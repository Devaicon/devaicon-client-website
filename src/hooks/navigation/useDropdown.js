import { useState } from "react";
import { useHoverIntent } from "./useHoverIntent";

/**
 * Custom hook for managing dropdown state with hover intent
 * Centralizes dropdown open/close logic with built-in hover delays
 *
 * @param {number} hoverDelay - Delay before closing dropdown (default: 150ms)
 * @returns {object} - { isOpen, handlers }
 */
export function useDropdown(hoverDelay = 150) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleEnter, handleLeave } = useHoverIntent(hoverDelay);

  const handlers = {
    onMouseEnter: () => handleEnter(() => setIsOpen(true)),
    onMouseLeave: () => handleLeave(() => setIsOpen(false)),
  };

  return { isOpen, handlers };
}
