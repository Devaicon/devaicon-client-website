"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { isLoading, startProgress, subscribeProgress } from "@/lib/progress";

/** Loads shorter than this never show the bar, so quick pages don't flicker. */
const SHOW_AFTER_MS = 120;
/** A navigation that never lands (an error, a cancelled click) stops here. */
const NAV_TIMEOUT_MS = 10_000;

/**
 * Whether a click on this link will take the browser to another page.
 *
 * Read in the capture phase, before Next's <Link> handles the click: Link
 * cancels the browser's own navigation to do its own, so by the time the
 * click bubbles up it always looks cancelled. A link can opt out with
 * `data-no-progress`.
 */
function isPageNavigation(e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  const a = (e.target as Element | null)?.closest?.("a");
  if (!a || !a.href || a.hasAttribute("download") || a.hasAttribute("data-no-progress")) return false;
  if (a.target && a.target !== "_self") return false;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same page with a different #hash or ?query is not a page load here.
  return url.pathname !== window.location.pathname;
}

/**
 * The thin bar across the top of the window while a page loads. It creeps
 * towards the end while waiting, runs to the end when the page arrives, and
 * fades out. Its width and fade are set directly on the element, so the
 * animation never re-renders anything else.
 */
export default function PageProgress() {
  const loading = useSyncExternalStore(subscribeProgress, isLoading, () => false);
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const endNav = useRef<(() => void) | null>(null);

  // A click on an internal link starts a navigation…
  useEffect(() => {
    let timer = 0;
    const onClick = (e: MouseEvent) => {
      if (endNav.current || !isPageNavigation(e)) return;
      endNav.current = startProgress();
      timer = window.setTimeout(() => {
        endNav.current?.();
        endNav.current = null;
      }, NAV_TIMEOUT_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(timer);
    };
  }, []);

  // …and the new path arriving ends it.
  useEffect(() => {
    endNav.current?.();
    endNav.current = null;
  }, [pathname]);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const timers: number[] = [];
    let trickle = 0;
    const visible = el.style.opacity === "1";

    if (loading) {
      const begin = () => {
        let width = visible ? Math.min(parseFloat(el.style.width) || 0, 80) : 0;
        if (!visible) {
          el.style.transition = "none";
          el.style.width = "0%";
          void el.offsetWidth; // commit the reset before animating from it
          el.style.transition = "";
          el.style.opacity = "1";
        }
        width = Math.max(width, 15);
        el.style.width = `${width}%`;
        // Each step closes a tenth of the gap to 90%, so it slows as it goes.
        trickle = window.setInterval(() => {
          width += (90 - width) * 0.1;
          el.style.width = `${width}%`;
        }, 250);
      };
      if (visible) begin();
      else timers.push(window.setTimeout(begin, SHOW_AFTER_MS));
    } else if (visible) {
      el.style.width = "100%";
      timers.push(
        window.setTimeout(() => {
          el.style.opacity = "0";
          timers.push(window.setTimeout(() => (el.style.width = "0%"), 200));
        }, 200),
      );
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(trickle);
    };
  }, [loading]);

  return <div ref={barRef} className="page-progress" aria-hidden />;
}
