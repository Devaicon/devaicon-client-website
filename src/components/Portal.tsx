"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noSubscribe = () => () => {};

/**
 * Renders its children at the end of <body> instead of where it's used.
 *
 * Every modal goes through this. A `position: fixed` overlay is only "above
 * everything" inside its own stacking context: placed in a sticky sidebar,
 * a transformed card or the z-50 site header, its z-index is capped by that
 * ancestor, and later content (the contact card under every page, the
 * navbar) paints over it. From <body> its z-index means what it says.
 *
 * Nothing renders on the server or during hydration; the browser's first
 * client render adds it, so the markup always matches.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const inBrowser = useSyncExternalStore(noSubscribe, () => true, () => false);
  return inBrowser ? createPortal(children, document.body) : null;
}
