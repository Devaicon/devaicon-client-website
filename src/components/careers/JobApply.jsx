"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Link2, Share2 } from "lucide-react";
import ApplyDialog from "./ApplyDialog";

/**
 * The Apply button and the form it opens. `tone` matches where it sits:
 * "light" on the purple hero, "dark" on white.
 *
 * @param {{ job: Pick<import("@/lib/careers/types").PublicJob, "title" | "slug" | "department" | "workplace" | "location" | "employmentType">, tone?: "light" | "dark", className?: string }} props
 */
export function ApplyButton({ job, tone = "dark", className = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded-lg px-6 py-3 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          tone === "light"
            ? "bg-white text-[#3d234b] hover:bg-gray-100 focus-visible:ring-white focus-visible:ring-offset-[#3d234b]"
            : "bg-[#3d234b] text-white hover:bg-[#2d1a3b] focus-visible:ring-[#3d234b]"
        } ${className}`}
      >
        Apply for this role
      </button>
      <ApplyDialog open={open} onClose={() => setOpen(false)} job={job} />
    </>
  );
}

/** A button label that slides to its confirmation and back. */
function SwapLabel({ done, idle, confirmed }) {
  const reduced = useReducedMotion();
  const y = reduced ? 0 : 6;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={done ? "done" : "idle"}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -y }}
        transition={{ duration: 0.15 }}
        className="inline-flex items-center gap-2"
      >
        {done ? confirmed : idle}
      </motion.span>
    </AnimatePresence>
  );
}

const BUTTON =
  "flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d234b] focus-visible:ring-offset-2";

/**
 * Share opens the device's own share sheet; where a browser has none, it
 * starts an email instead. Copy URL puts the address on the clipboard.
 *
 * @param {{ title: string, summary: string }} props
 */
export function ShareButtons({ title, summary }) {
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);

  const flash = (set) => {
    set(true);
    setTimeout(() => set(false), 1800);
  };

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${title} at Devaicon`, text: summary, url });
        flash(setShared);
      } catch {
        // Closing the share sheet rejects too; that's not worth a message.
      }
      return;
    }
    const subject = encodeURIComponent(`${title} at Devaicon`);
    const body = encodeURIComponent(`${summary ? `${summary}\n\n` : ""}${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash(setCopied);
    } catch {
      // Clipboard refused (an old browser, or no permission); the address bar still has it.
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900">Share this role</h2>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={share}
          className={`${BUTTON} ${shared ? "bg-[#3d234b] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
        >
          <SwapLabel
            done={shared}
            idle={<><Share2 className="h-4 w-4" aria-hidden />Share</>}
            confirmed={<><Check className="h-4 w-4" aria-hidden />Shared!</>}
          />
        </button>
        <button
          type="button"
          onClick={copy}
          className={`${BUTTON} ${copied ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
        >
          <SwapLabel
            done={copied}
            idle={<><Link2 className="h-4 w-4" aria-hidden />Copy URL</>}
            confirmed={<><Check className="h-4 w-4" aria-hidden />URL copied!</>}
          />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? "Link copied to the clipboard." : shared ? "Shared." : ""}
      </p>
    </div>
  );
}
