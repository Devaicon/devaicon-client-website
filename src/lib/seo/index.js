/**
 * SEO helpers shared by every route's metadata export.
 *
 * Search engines truncate titles past ~60 characters and meta descriptions
 * past ~160, so templated pages (insights, job postings) run their copy
 * through these helpers instead of emitting whatever length the content
 * data happens to be.
 */

export const SITE_URL = "https://devaicon.com";
export const SITE_NAME = "Devaicon";

const BRAND_SUFFIX = ` | ${SITE_NAME}`;
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 155;

/**
 * Append the brand suffix only while the result still fits in the SERP.
 * Returned as an absolute title so the root layout's template does not
 * append a second suffix.
 *
 * @param {string} title
 * @returns {{ absolute: string }}
 */
export function brandedTitle(title) {
  const base = (title ?? "").trim();
  const withBrand = `${base}${BRAND_SUFFIX}`;

  return { absolute: withBrand.length <= TITLE_LIMIT ? withBrand : base };
}

/**
 * Trim to a whole word within the description limit, adding an ellipsis only
 * when something was actually cut.
 *
 * @param {string} text
 * @param {number} [limit]
 * @returns {string}
 */
export function metaDescription(text, limit = DESCRIPTION_LIMIT) {
  const base = (text ?? "").replace(/\s+/g, " ").trim();

  if (base.length <= limit) return base;

  const clipped = base.slice(0, limit - 1);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).replace(
    /[,;:.\-–—]$/,
    ""
  )}…`;
}

/**
 * Absolute URL for a site-relative path.
 *
 * @param {string} path
 * @returns {string}
 */
export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
