// Central export file for all insight content
import agenticAI from "./agentic-ai";
import dataAsset from "./data-sovereign-asset";
import autonomousAICustomerService from "./autonomous-ai-customer-service";
import slider01 from "./value-driven-innovation-automation";

export const insightsContent = {
  "agentic-ai": agenticAI,
  "data-sovereign-asset": dataAsset,
  "autonomous-ai-customer-service": autonomousAICustomerService,
  "value-driven-innovation-automation": slider01,
  // Add more slugs here as you create content
};

export const getInsightBySlug = (slug) => {
  return insightsContent[slug] || null;
};
