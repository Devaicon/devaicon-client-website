import { capabilitiesData } from "@/constants/navigation";

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
  return `/capabilities/${slug}#${itemId}`;
}

/**
 * Build industry URL
 * @param {string} industryId - Industry identifier
 * @returns {string} - Full URL path with hash
 */
export function buildIndustryUrl(industryId) {
  return `/industries#${industryId}`;
}
