"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Minimize2, Minus, Plus, X, ZoomIn } from "lucide-react";

const STEPS = [1, 1.5, 2, 3, 4];
const LAST = STEPS.length - 1;

/**
 * A post image that opens full screen when clicked, where the reader can zoom
 * in to see detail in a diagram or screenshot.
 */
export default function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Enlarge image: ${alt}` : "Enlarge image"}
        className="group relative block w-full cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4555A7] focus-visible:ring-offset-2"
      >
        {/* Body images come from anywhere an editor chose, so a plain img
            avoids next/image's per-host allow-list. They load lazily. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="w-full rounded-lg shadow-md" />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>
      {open && (
        <Viewer
          src={src}
          alt={alt}
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      )}
    </>
  );
}

function ViewerButton({
  label,
  onClick,
  disabled = false,
  autoFocus = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      className="rounded-md p-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

/**
 * The full-screen view. At 100% the image fits the window; zoomed, it grows
 * past the window and is moved by scrolling, or by dragging with a mouse.
 * Keys: + and − zoom, 0 fits, Esc closes.
 */
function Viewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [step, setStep] = useState(0);
  // The fitted size, measured when zooming starts; zoom multiplies it.
  const [base, setBase] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  // Set by a drag, so the click that ends it doesn't also zoom.
  const dragged = useRef(false);
  const scale = STEPS[step];

  function zoomTo(next: number) {
    const i = Math.min(LAST, Math.max(0, next));
    if (i === 0) {
      setBase(null);
    } else if (!base) {
      const r = imgRef.current?.getBoundingClientRect();
      if (!r || !r.width) return;
      setBase({ w: r.width, h: r.height });
    }
    setStep(i);
  }

  // Keep the middle of the picture in the middle as it grows or shrinks.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomTo(step + 1);
      else if (e.key === "-" || e.key === "_") zoomTo(step - 1);
      else if (e.key === "0") zoomTo(0);
      else return;
      e.preventDefault();
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  });

  const zoomed = step > 0 && base;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image"}
      className="anim-fade fixed inset-0 z-[100] flex flex-col bg-black/90"
    >
      <div className="flex shrink-0 items-center justify-end gap-1 p-2 sm:p-3">
        <ViewerButton label="Zoom out (−)" onClick={() => zoomTo(step - 1)} disabled={step === 0}>
          <Minus className="h-5 w-5" aria-hidden />
        </ViewerButton>
        <span aria-live="polite" className="w-12 text-center text-sm tabular-nums text-white/85">
          {Math.round(scale * 100)}%
        </span>
        <ViewerButton label="Zoom in (+)" onClick={() => zoomTo(step + 1)} disabled={step === LAST}>
          <Plus className="h-5 w-5" aria-hidden />
        </ViewerButton>
        <ViewerButton label="Fit to screen (0)" onClick={() => zoomTo(0)} disabled={step === 0}>
          <Minimize2 className="h-5 w-5" aria-hidden />
        </ViewerButton>
        <span className="mx-1 h-5 w-px bg-white/20" aria-hidden />
        <ViewerButton label="Close (Esc)" onClick={onClose} autoFocus>
          <X className="h-5 w-5" aria-hidden />
        </ViewerButton>
      </div>

      <div
        ref={scrollerRef}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="flex min-h-0 flex-1 overflow-auto px-4 pb-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onPointerDown={(e) => {
            const el = scrollerRef.current;
            if (!zoomed || e.pointerType !== "mouse" || !el) return;
            drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
            dragged.current = false;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            const el = scrollerRef.current;
            if (!d || !el) return;
            const dx = e.clientX - d.x;
            const dy = e.clientY - d.y;
            if (Math.abs(dx) + Math.abs(dy) > 4) dragged.current = true;
            el.scrollLeft = d.left - dx;
            el.scrollTop = d.top - dy;
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onClick={() => {
            if (dragged.current) {
              dragged.current = false;
              return;
            }
            zoomTo(step === 0 ? 2 : 0);
          }}
          style={zoomed ? { width: base.w * scale, height: base.h * scale } : undefined}
          className={`m-auto select-none rounded ${
            zoomed
              ? "max-w-none cursor-grab active:cursor-grabbing"
              : "max-h-[calc(100dvh-5rem)] max-w-full cursor-zoom-in object-contain"
          }`}
        />
      </div>
    </div>,
    document.body,
  );
}
