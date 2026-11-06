import { capabilitiesData } from "@/constants/navigation";
import { livePath } from "@/lib/moved-pages.mjs";

/**
 * Get capability route slug by capability name
 * Eliminates complex ternary chains for route mapping
 *
 * @param {string} capabilityName - Name of the capability
 * @returns {string} - URL slug for the capability
 */
export function getCapabilitySlug(capabilityName) {
  const capability = capabilitiesData.find(
    (cap) => cap.name === capabilityName,
  );
  return capability?.slug || "intelligent-systems-data";
}

/**
 * Build capability item URL
 * @param {string} capabilityName - Parent capability name
 * @param {string} itemId - Item identifier
 * @returns {string} - Full URL path with hash
 */
export function buildCapabilityItemUrl(capabilityName, itemId) {
  const slug = getCapabilitySlug(capabilityName);
  return `${livePath(`/capabilities/${slug}`)}#${itemId}`;
}

/**
 * Build industry URL
 * @param {string} industryId - Industry identifier
 * @returns {string} - Full URL path with hash
 */
export function buildIndustryUrl(industryId) {
  return `/industries#${industryId}`;
}

/**
 * Build capability page URL, following the page if it has moved
 * @param {string} capabilityName - Name of the capability
 * @returns {string} - URL path for the capability page
 */
export function buildCapabilityUrl(capabilityName) {
  return livePath(`/capabilities/${getCapabilitySlug(capabilityName)}`);
}
