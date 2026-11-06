/**
 * Pages that moved to /services/<slug>, most of them rebuilt in the
 * dashboard's service page module. Each old address redirects permanently to
 * its new one (see next.config.mjs), so the two never compete in search, and
 * links on the site go straight to the new address rather than through the
 * redirect.
 *
 * Plain .mjs so next.config.mjs can import it too.
 */
export const MOVED_PAGES = {
  "/engagement-models": "/services/engagement-models",
  "/capabilities/application-software-development":
    "/services/capabilities-application-software-development",
  "/industries/bfsi": "/services/industries-bfsi",
  "/ai-automation-services-pakistan": "/services/ai-automation-services-pakistan",
};

/**
 * Where a site path lives now.
 *
 * @param {string} path
 * @returns {string}
 */
export const livePath = (path) => MOVED_PAGES[path] ?? path;

/**
 * Whether a site path has moved, and so must not be listed as a page.
 *
 * @param {string} path
 * @returns {boolean}
 */
export const hasMoved = (path) => path in MOVED_PAGES;
