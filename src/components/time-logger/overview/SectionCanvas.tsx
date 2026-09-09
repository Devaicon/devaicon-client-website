"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeOffIcon,
  GripVerticalIcon,
  MaximizeIcon,
  MinimizeIcon,
  PlusIcon,
} from "lucide-react";
import { DURATION, EASE, fadeRise, staggerContainer, staggerItem } from "../motion";
import {
  gridClassOf,
  hiddenSections,
  sectionById,
  type SectionId,
  type SectionLayout,
  type SectionSize,
} from "./sections";
import type { SectionLayoutApi } from "./useSectionLayout";

/**
 * Lays the Overview's blocks out, and — in arrange mode — lets them be moved.
 *
 * Dragging is done with the native HTML drag-and-drop API rather than a
 * library: the drop targets are the blocks themselves, there is no cross-window
 * case, and a dependency for one screen is a dependency on every screen. The
 * arrow buttons beside each handle are not a fallback for a broken drag — they
 * are the keyboard path, and the touch one.
 */

const HANDLE_BUTTON =
  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

function ArrangeBar({
  title,
  index,
  count,
  size,
  resizable,
  onMove,
  onSize,
  onHide,
}: {
  title: string;
  index: number;
  count: number;
  size: SectionSize;
  resizable: boolean;
  onMove: (to: number) => void;
  onSize: (next: SectionSize) => void;
  onHide: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-t-xl border border-b-0 border-dashed border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 px-2 py-1.5">
      <GripVerticalIcon
        aria-hidden
        className="h-4 w-4 shrink-0 cursor-grab text-violet-500 active:cursor-grabbing"
      />
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-violet-900 dark:text-violet-200">
        {title}
      </span>
      <button
        type="button"
        onClick={() => onMove(index - 1)}
        disabled={index === 0}
        title="Move up"
        aria-label={`Move ${title} up`}
        className={HANDLE_BUTTON}
      >
        <ChevronUpIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        title="Move down"
        aria-label={`Move ${title} down`}
        className={HANDLE_BUTTON}
      >
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      {resizable && (
        <button
          type="button"
          onClick={() => onSize(size === "max" ? "min" : "max")}
          title={size === "max" ? "Minimise" : "Maximise"}
          aria-label={size === "max" ? `Minimise ${title}` : `Maximise ${title}`}
          className={HANDLE_BUTTON}
        >
          {size === "max" ? (
            <MinimizeIcon className="h-4 w-4" />
          ) : (
            <MaximizeIcon className="h-4 w-4" />
          )}
        </button>
      )}
      <button
        type="button"
        onClick={onHide}
        title="Hide this section"
        aria-label={`Hide ${title}`}
        className={HANDLE_BUTTON}
      >
        <EyeOffIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function SectionCanvas({
  layout,
  api,
  arranging,
  content,
}: {
  layout: SectionLayout;
  api: SectionLayoutApi;
  arranging: boolean;
  /** Rendered block for each id. A missing id simply renders nothing. */
  content: Partial<Record<SectionId, ReactNode>>;
}) {
  const reduced = useReducedMotion();
  // The block being dragged, and the slot the pointer is currently over.
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const hidden = hiddenSections(layout);

  function endDrag() {
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="space-y-4">
      <motion.div
        variants={staggerContainer(!!reduced)}
        initial="initial"
        animate="animate"
        // minmax rather than a fixed row height: a two-row block gets a
        // predictable slot, and the tile band, which spans no rows, still
        // grows to however many cards are in it.
        className="grid grid-cols-1 gap-4 lg:auto-rows-[minmax(13rem,auto)] lg:grid-cols-2"
      >
        {layout.map((placement, index) => {
          const def = sectionById(placement.id);
          const node = content[placement.id];
          if (!def || !node) return null;

          const isDragging = dragIndex === index;
          const isTarget =
            overIndex === index && dragIndex !== null && dragIndex !== index;

          return (
            <div
              key={placement.id}
              draggable={arranging}
              onDragStart={(e) => {
                // Firefox refuses to start a drag without transfer data.
                e.dataTransfer.setData("text/plain", placement.id);
                e.dataTransfer.effectAllowed = "move";
                setDragIndex(index);
              }}
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overIndex !== index) setOverIndex(index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) api.moveSection(dragIndex, index);
                endDrag();
              }}
              onDragEnd={endDrag}
              className={`${gridClassOf(def, placement.size)} ${
                arranging ? "cursor-grab active:cursor-grabbing" : ""
              } ${isDragging ? "opacity-40" : ""}`}
            >
              {/* The animated element sits inside the drag host: framer-motion
                  claims onDragStart/onDragEnd for its own pan gestures, so the
                  native handlers would never reach the DOM from a motion.div. */}
              <motion.div
                variants={staggerItem(!!reduced)}
                layout={!reduced}
                transition={{ duration: reduced ? 0 : DURATION.card, ease: EASE }}
                className={`flex h-full flex-col ${
                  isTarget
                    ? "rounded-xl ring-2 ring-violet-500 ring-offset-2 ring-offset-neutral-50 dark:ring-offset-neutral-950"
                    : ""
                }`}
              >
                {arranging && (
                  <ArrangeBar
                    title={def.title}
                    index={index}
                    count={layout.length}
                    size={placement.size}
                    resizable={def.resizable}
                    onMove={(to) => api.moveSection(index, to)}
                    onSize={(next) => api.setSectionSize(placement.id, next)}
                    onHide={() => api.hideSection(placement.id)}
                  />
                )}
                {/* While arranging, a block is a thing being moved rather than
                    a thing being used, so its controls stop responding and a
                    drag can start anywhere on it. The exception is a block
                    whose own editing lives inside it — the tile band — which
                    is dragged by its handle bar instead. */}
                <div
                  className={`min-h-0 flex-1 ${
                    arranging
                      ? `select-none overflow-hidden rounded-b-xl border border-t-0 border-dashed border-violet-300 dark:border-violet-800 p-2 ${
                          def.keepsInteractive ? "" : "pointer-events-none"
                        }`
                      : ""
                  }`}
                >
                  {node}
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <AnimatePresence initial={false}>
        {arranging && hidden.length > 0 && (
          <motion.div
            key="hidden-tray"
            variants={fadeRise(!!reduced)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-4"
          >
            <p className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Not on the page
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {hidden.map((def) => (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => api.showSection(def.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium transition-colors hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  {def.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {arranging && layout.length === 0 && (
        <p className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 px-5 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Every section is hidden. Add one back from the tray above.
        </p>
      )}
    </div>
  );
}
