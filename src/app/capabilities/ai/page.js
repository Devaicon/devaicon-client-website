import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import React, { Suspense } from "react";

/**
 * AI Capabilities Page
 * Displays all AI and Copilot solutions offered by Devaicon
 * Includes Microsoft Copilot, Azure OpenAI, AI Builder, and more
 */
const AICapabilitiesPage = () => {
  const aiConfig = CAPABILITIES_CONFIG.ai;

  return (
    <main>
      {/* Scroll to hash functionality for deep linking */}
      <Suspense fallback={null}>
        <ScrollToHash />
      </Suspense>

      {/* Hero Section */}
      <PageHero
        title="Devaicon Capabilities"
        subtitle="Enterprise platforms, AI, and integration services"
        showButton={false}
      />

      {/* Capabilities Container */}
      <CapabilitesContainer
        title={aiConfig.title}
        subtitle={aiConfig.subtitle}
        cards={aiConfig.cards}
        showGroups={true}
      />
    </main>
  );
};
