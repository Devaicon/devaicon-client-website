"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * ScrollToHash Component
 * Automatically scrolls to an element when a hash is present in the URL
 * Used for deep linking to specific capability cards
 *
 * @example
 * URL: /capabilities/ai#microsoft-copilot-m365
 * Will scroll to the element with id="microsoft-copilot-m365"
 */
const ScrollToHash = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get hash from URL
    const hash = window.location.hash;

    if (hash) {
      // Remove the # symbol
      const id = hash.substring(1);

      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          // Scroll with smooth behavior and proper offset for sticky nav
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams]);

  return null;
};

export default ScrollToHash;
