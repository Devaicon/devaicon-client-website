// How wide a body image shows, as a share of the article column. The editor
// stores it on the image node, import files carry it as data-size, and the
// site's renderer reads it back through imageSize, so all three agree on the
// same four steps.

export const IMAGE_SIZES = [25, 50, 75, 100] as const;

export type ImageSize = (typeof IMAGE_SIZES)[number];

/** A stored or imported size, or full width when it isn't one of the steps. */
export function imageSize(value: unknown): ImageSize {
  const n = Number(value);
  return (IMAGE_SIZES as readonly number[]).includes(n) ? (n as ImageSize) : 100;
}
