// Stored documents are data, not markup: every link and image address is
// checked before it reaches an attribute. Anything unexpected (javascript:,
// data:, protocol-relative //) is dropped rather than rendered.

export function safeHref(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  if (v.startsWith("#")) return v;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    const u = new URL(v);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? v : null;
  } catch {
    return null;
  }
}

export function safeSrc(value: unknown): string | null {
  const href = safeHref(value);
  if (!href || href.startsWith("#") || /^(mailto|tel):/i.test(href)) return null;
  return href;
}
