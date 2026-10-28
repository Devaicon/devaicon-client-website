"use client";

import { useEffect, useRef } from "react";

/**
 * Rises gently into place the first time it scrolls into view.
 *
 * It is visible in the server's HTML and stays visible without JavaScript.
 * Only content still below the fold when the page loads is hidden (the
 * reader can't see it yet), so nothing on screen blinks out on hydration.
 * Reduced motion leaves everything as it is. The styles are the
 * [data-reveal] rules in globals.css.
 *
 * @param {{ as?: string, delay?: number, className?: string, children: React.ReactNode, [attr: string]: unknown }} props
 *   `delay` in ms, for staggering items in a list. Anything else (an id,
 *   aria-labelledby) goes on the element.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className, children, ...attrs }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "waiting";
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.dataset.reveal = "in";
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      // Never leave content hidden, e.g. if the list it's in re-renders.
      if (el.dataset.reveal === "waiting") el.dataset.reveal = "in";
    };
  }, []);

  return (
    <Tag {...attrs} ref={ref} className={className} style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
