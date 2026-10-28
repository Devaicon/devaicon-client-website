"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
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
        className={`rounded-lg px-6 py-3 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
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

/** Copies the role's address, and says so for a moment. */
export function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard refused (an old browser, or no permission); the address bar still has it.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#3d234b] focus:outline-none focus-visible:underline"
    >
      {copied ? <Check className="h-4 w-4 text-green-600" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{copied ? "Link copied" : "Copy link to this role"}</span>
    </button>
  );
}
