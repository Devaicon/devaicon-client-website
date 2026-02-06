import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import React, { Suspense } from "react";

/**
 * Intelligent Systems & Data Capabilities Page
 * Displays AI, Machine Learning, Data Science, NLP, Computer Vision, and AR/VR solutions
 */
const IntelligentSystemsDataPage = () => {
  const config = CAPABILITIES_CONFIG.intelligentSystemsData;

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
        title={config.title}
        subtitle={config.subtitle}
        cards={config.cards}
        showGroups={true}
        hideBadge={true}
      />
    </main>
  );
};

export default IntelligentSystemsDataPage;
