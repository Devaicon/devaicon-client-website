"use client";

import { useId, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImageIcon, Link2, Upload, X } from "lucide-react";

const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm";

/** Upload a file to Vercel Blob through /api/uploads; resolves to its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80) || "image";
  const blob = await upload(`insights/${safeName}`, file, {
    access: "public",
    handleUploadUrl: "/api/uploads",
  });
  return blob.url;
}

function looksLikeImageUrl(v: string) {
  return /^https?:\/\/\S+$/i.test(v) || /^\/[^/]\S*$/.test(v);
}

/**
 * Choose an image by uploading it or pasting a link. Uploads need
 * BLOB_READ_WRITE_TOKEN on the site; without it the link tab still works.
 */
export function ImageSourceInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const linkId = useId();

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("That image is over 8 MB. Resize it first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError(
        `${e instanceof Error ? e.message : "Upload failed."} If uploads aren't set up yet, use "Paste a link".`,
      );
      setMode("link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-36 w-full object-cover bg-neutral-100 dark:bg-neutral-800" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute right-2 top-2 rounded-md bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="inline-flex rounded-md border border-neutral-200 dark:border-neutral-800 p-0.5 text-xs">
        {(["upload", "link"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 ${
              mode === m ? "bg-neutral-900 text-white dark:bg-neutral-700" : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            {m === "upload" ? <Upload className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
            {m === "upload" ? "Upload" : "Paste a link"}
          </button>
        ))}
      </div>
      {mode === "upload" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
          className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-neutral-300 dark:border-neutral-700 px-4 py-5 text-center text-xs text-neutral-500"
        >
          <ImageIcon className="h-5 w-5" aria-hidden />
          <span>Drop an image here, or</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Choose a file"}
          </button>
          <span>JPG, PNG, WebP, GIF or AVIF, up to 8 MB</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <div>
          <label htmlFor={linkId} className="sr-only">
            Image link
          </label>
          <input
            id={linkId}
            defaultValue={value}
            placeholder="https://… or /image-on-this-site.webp"
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (!v || looksLikeImageUrl(v)) {
                setError(null);
                onChange(v);
              } else {
                setError("That doesn't look like a link. It should start with https:// or /.");
              }
            }}
            className={INPUT}
          />
        </div>
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export type ImageDetails = { src: string; alt: string; title: string };

/**
 * The editor's image dialog: source, alt text and optional caption. Given
 * `initial`, it edits an image already in the post instead of inserting one.
 */
export function ImageDialog({
  initial,
  onInsert,
  onClose,
}: {
  initial?: ImageDetails;
  onInsert: (image: ImageDetails) => void;
  onClose: () => void;
}) {
  const [src, setSrc] = useState(initial?.src ?? "");
  const [alt, setAlt] = useState(initial?.alt ?? "");
  const [caption, setCaption] = useState(initial?.title ?? "");
  const editing = Boolean(initial);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-dialog-title"
      className="anim-fade fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="anim-pop w-full max-w-md space-y-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg">
        <h2 id="image-dialog-title" className="font-semibold">
          {editing ? "Image details" : "Insert an image"}
        </h2>
        <ImageSourceInput value={src} onChange={setSrc} />
        <div>
          <label htmlFor="image-alt" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Alt text <span className="font-normal">(what the image shows, for screen readers and search)</span>
          </label>
          <input id="image-alt" autoFocus={editing} value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} className={INPUT} />
        </div>
        <div>
          <label htmlFor="image-caption" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Caption (optional)
          </label>
          <input id="image-caption" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={200} className={INPUT} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button
            type="button"
            disabled={!src || !alt.trim()}
            title={!alt.trim() ? "Describe the image first" : undefined}
            onClick={() => onInsert({ src, alt: alt.trim(), title: caption.trim() })}
            className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
          >
            {editing ? "Save" : "Insert"}
          </button>
        </div>
      </div>
    </div>
  );
}
