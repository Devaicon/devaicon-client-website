"use client";

import { useId, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Portal from "@/components/Portal";
import { ImageSourceInput } from "@/components/blog-editor/ImagePicker";
import {
  BLOCKS,
  BLOCK_BY_TYPE,
  blankItem,
  blockGaps,
  blockTitle,
  isSafeUrl,
  MAX_CELLS,
  type Block,
  type FieldSpec,
} from "@/lib/service-pages/blocks";
import { ICON_NAMES, ServiceIcon } from "@/lib/service-pages/icons";

// The forms for content blocks, drawn from the block catalogue: each field
// kind has one input, so a new block type needs no new form code.

export const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm disabled:opacity-60";
export const LABEL = "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";
const SMALL_BUTTON =
  "inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";

export function Field({
  label,
  htmlFor,
  hint,
  extra,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={LABEL}>
            {label}
          </label>
        ) : (
          <span className={LABEL}>{label}</span>
        )}
        {extra}
      </div>
      {children}
      {hint && <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
}

/**
 * A list edited as lines of text. The text is kept as typed, so a new empty
 * line survives until something is written on it.
 */
function LinesInput({
  id,
  value,
  onChange,
  toText,
  fromText,
  rows,
  disabled,
  placeholder,
}: {
  id: string;
  value: unknown[];
  onChange: (v: unknown[]) => void;
  toText: (v: unknown[]) => string;
  fromText: (text: string) => unknown[];
  rows: number;
  disabled: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState(() => toText(value));
  return (
    <textarea
      id={id}
      value={text}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => {
        setText(e.target.value);
        onChange(fromText(e.target.value));
      }}
      className={`${INPUT} font-mono text-[13px] leading-6`}
    />
  );
}

const lines = (text: string) =>
  text
    .split("\n")
    // Pasted bullet lists keep their markers otherwise.
    .map((l) => l.replace(/^\s*(?:[-*•·]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);

function IconSelect({ id, value, onChange, disabled }: { id: string; value: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-b from-[#3d234b] to-[#2a1834]">
        <ServiceIcon icon={value} className="h-4 w-4 text-white" aria-hidden />
      </span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={INPUT}>
        {ICON_NAMES.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

const asList = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** One field of a block or of an item, by its kind. */
export function FieldInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled: boolean;
}) {
  const id = useId();
  const s = typeof value === "string" ? value : "";
  const label = `${field.label}${field.required ? "" : " (optional)"}`;
  const count = field.max && (field.kind === "text" || field.kind === "textarea" || field.kind === "markdown") && (
    <span className={`text-[11px] tabular-nums ${s.length > field.max * 0.9 ? "text-amber-600" : "text-neutral-400"}`}>
      {s.length}/{field.max}
    </span>
  );

  switch (field.kind) {
    case "text":
      return (
        <Field label={label} htmlFor={id} hint={field.hint} extra={count}>
          <input id={id} value={s} maxLength={field.max} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={INPUT} />
        </Field>
      );
    case "textarea":
    case "markdown":
      return (
        <Field label={label} htmlFor={id} hint={field.hint} extra={count}>
          <textarea
            id={id}
            value={s}
            maxLength={field.max}
            rows={field.kind === "markdown" ? Math.min(14, Math.max(5, s.split("\n").length + 1)) : 3}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={INPUT}
          />
        </Field>
      );
    case "url":
      return (
        <Field label={label} htmlFor={id} hint={isSafeUrl(s) ? field.hint : "Start with / for a page on this site, or https:// for another site."}>
          <input
            id={id}
            value={s}
            disabled={disabled}
            placeholder="/contact-us or https://…"
            onChange={(e) => onChange(e.target.value.trim())}
            className={`${INPUT} ${isSafeUrl(s) ? "" : "border-red-400 dark:border-red-700"}`}
          />
        </Field>
      );
    case "image":
      return (
        <Field label={label} hint={field.hint}>
          {disabled ? <p className="truncate text-sm text-neutral-500">{s || "No image"}</p> : <ImageSourceInput value={s} onChange={onChange} />}
        </Field>
      );
    case "icon":
      return (
        <Field label={label} htmlFor={id} hint={field.hint}>
          <IconSelect id={id} value={s} onChange={onChange} disabled={disabled} />
        </Field>
      );
    case "select":
      return (
        <Field label={label} htmlFor={id} hint={field.hint}>
          <select id={id} value={s} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={INPUT}>
            {(field.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o[0].toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        </Field>
      );
    case "strings":
      return (
        <Field label={label} htmlFor={id} hint={field.hint}>
          <LinesInput
            id={id}
            value={asList(value)}
            onChange={onChange}
            toText={(v) => v.join("\n")}
            fromText={(t) => lines(t).slice(0, field.maxItems)}
            rows={Math.min(12, Math.max(3, asList(value).length + 1))}
            disabled={disabled}
          />
        </Field>
      );
    case "rows":
      return (
        <Field label={label} htmlFor={id} hint={field.hint}>
          <LinesInput
            id={id}
            value={asList(value)}
            onChange={onChange}
            toText={(v) => v.map((r) => asList(r).join(" | ")).join("\n")}
            fromText={(t) =>
              t
                .split("\n")
                .filter((l) => l.trim())
                .map((l) => l.split("|").map((c) => c.trim()).slice(0, MAX_CELLS))
                .slice(0, field.maxItems)
            }
            rows={Math.min(14, Math.max(4, asList(value).length + 1))}
            disabled={disabled}
            placeholder="Option A | What it does | Best for"
          />
        </Field>
      );
    case "items":
      return <ItemsInput field={field} value={asList(value) as Record<string, unknown>[]} onChange={onChange} disabled={disabled} />;
  }
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** A list of small records: feature cards, steps, FAQs and the like. */
function ItemsInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldSpec;
  value: Record<string, unknown>[];
  onChange: (v: unknown) => void;
  disabled: boolean;
}) {
  // Stable keys for the rows, so each keeps its inputs when the list is reordered.
  const [keys, setKeys] = useState(() => value.map(() => crypto.randomUUID()));
  const fields = field.fields ?? [];
  const noun = field.label.toLowerCase().replace(/s$/, "");
  const full = field.maxItems !== undefined && value.length >= field.maxItems;

  const set = (next: Record<string, unknown>[], nextKeys: string[]) => {
    setKeys(nextKeys);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className={LABEL}>{field.label}</span>
        <span className="text-[11px] text-neutral-400">
          {value.length}
          {field.maxItems ? ` of up to ${field.maxItems}` : ""}
        </span>
      </div>
      <ol className="space-y-3">
        {value.map((item, i) => (
          <li key={keys[i] ?? i} className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-950/40">
            <div className="mb-2 flex items-center gap-1">
              <span className="flex-1 text-xs font-medium text-neutral-500">
                {field.label.replace(/s$/, "")} {i + 1}
              </span>
              <button type="button" className={SMALL_BUTTON} disabled={disabled || i === 0} onClick={() => set(move(value, i, i - 1), move(keys, i, i - 1))} aria-label={`Move ${noun} ${i + 1} up`}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={SMALL_BUTTON}
                disabled={disabled || i === value.length - 1}
                onClick={() => set(move(value, i, i + 1), move(keys, i, i + 1))}
                aria-label={`Move ${noun} ${i + 1} down`}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={`${SMALL_BUTTON} hover:text-red-600`}
                disabled={disabled}
                onClick={() => set(value.filter((_, j) => j !== i), keys.filter((_, j) => j !== i))}
                aria-label={`Remove ${noun} ${i + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className={`grid gap-3 ${fields.length > 2 ? "sm:grid-cols-2 sm:[&>*:has(textarea)]:col-span-2" : ""}`}>
              {fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={item[f.key]}
                  disabled={disabled}
                  onChange={(v) => onChange(value.map((it, j) => (j === i ? { ...it, [f.key]: v } : it)))}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={disabled || full}
        onClick={() => set([...value, blankItem(fields)], [...keys, crypto.randomUUID()])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        {full ? `Up to ${field.maxItems}` : `Add ${noun}`}
      </button>
    </div>
  );
}

/** One block in the editor: a header with its controls, then its fields. */
export function BlockCard({
  block,
  index,
  total,
  open,
  onToggle,
  onChange,
  onMove,
  onDuplicate,
  onInsertBelow,
  onRemove,
  disabled,
}: {
  block: Block;
  index: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  onChange: (b: Block) => void;
  onMove: (to: number) => void;
  onDuplicate: () => void;
  onInsertBelow: () => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const spec = BLOCK_BY_TYPE[block.type];
  const bodyId = useId();
  if (!spec) return null;
  const title = blockTitle(block);
  const gaps = blockGaps(block);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-1 px-3 py-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left"
        >
          <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${open ? "" : "-rotate-90"}`} aria-hidden />
          <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {index + 1}
          </span>
          <span className="shrink-0 text-sm font-semibold">{spec.label}</span>
          {title && <span className="truncate text-sm text-neutral-500 dark:text-neutral-400">· {title}</span>}
          {gaps.length > 0 && (
            <span title={`Needs ${gaps.join(", ")} before publishing`} className="ml-1 shrink-0 text-amber-600">
              <TriangleAlert className="h-3.5 w-3.5" aria-label={`Needs ${gaps.join(", ")} before publishing`} />
            </span>
          )}
        </button>
        <button type="button" className={SMALL_BUTTON} disabled={disabled || index === 0} onClick={() => onMove(index - 1)} aria-label="Move block up" title="Move up">
          <ArrowUp className="h-4 w-4" />
        </button>
        <button type="button" className={SMALL_BUTTON} disabled={disabled || index === total - 1} onClick={() => onMove(index + 1)} aria-label="Move block down" title="Move down">
          <ArrowDown className="h-4 w-4" />
        </button>
        <button type="button" className={SMALL_BUTTON} disabled={disabled} onClick={onInsertBelow} aria-label="Add a block below" title="Add a block below">
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" className={SMALL_BUTTON} disabled={disabled || Boolean(spec.once)} onClick={onDuplicate} aria-label="Duplicate block" title={spec.once ? "A page can have only one" : "Duplicate"}>
          <Copy className="h-4 w-4" />
        </button>
        <button type="button" className={`${SMALL_BUTTON} hover:text-red-600`} disabled={disabled} onClick={onRemove} aria-label="Delete block" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <div id={bodyId} className="anim-drop space-y-4 border-t border-neutral-100 px-4 py-4 dark:border-neutral-800">
          {gaps.length > 0 && (
            <p className="flex gap-1.5 text-xs text-amber-700 dark:text-amber-400">
              <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
              Needs {gaps.join(", ")} before the page can be published.
            </p>
          )}
          {spec.fields.map((f) => (
            <FieldInput key={f.key} field={f} value={block[f.key]} disabled={disabled} onChange={(v) => onChange({ ...block, [f.key]: v })} />
          ))}
        </div>
      )}
    </section>
  );
}

/** The list of block types to add, each with a line on what it's for. */
export function BlockPicker({
  used,
  onPick,
  onClose,
}: {
  used: Set<string>;
  onPick: (type: string) => void;
  onClose: () => void;
}) {
  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-picker-title"
        className="anim-fade fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="anim-pop flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
            <h2 id="block-picker-title" className="font-semibold">
              Add a content block
            </h2>
            <button type="button" onClick={onClose} aria-label="Close" className={SMALL_BUTTON}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="grid gap-2 overflow-y-auto p-4 sm:grid-cols-2">
            {BLOCKS.map((b, i) => {
              const taken = Boolean(b.once && used.has(b.type));
              return (
                <li key={b.type}>
                  <button
                    type="button"
                    autoFocus={i === 0}
                    disabled={taken}
                    onClick={() => onPick(b.type)}
                    className="h-full w-full rounded-lg border border-neutral-200 p-3 text-left hover:border-violet-400 hover:bg-violet-50/50 disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:bg-transparent dark:border-neutral-800 dark:hover:bg-violet-950/30"
                  >
                    <span className="block text-sm font-semibold">{b.label}</span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      {taken ? "Already on this page; a page can have one." : b.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Portal>
  );
}
