import { useRef, useCallback } from "react";

/**
 * Custom hook for implementing hover intent pattern with delay
 * Prevents accidental dropdown triggers and improves UX
 *
 * @param {number} delay - Delay in milliseconds before hiding (default: 150ms)
 * @returns {object} - { handleEnter, handleLeave }
 */
export function useHoverIntent(delay = 150) {
  const timeoutRef = useRef(null);

  const handleEnter = useCallback((callback) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    callback();
  }, []);

  const handleLeave = useCallback(
    (callback) => {
      timeoutRef.current = setTimeout(() => {
        callback();
        timeoutRef.current = null;
      }, delay);
    },
    [delay],
  );

  return { handleEnter, handleLeave };
}
