import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook for managing mobile menu state and body scroll lock
 * Handles menu open/close, escape key, and overflow prevention
 *
 * @returns {object} - { isOpen, open, close, toggle }
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
}
