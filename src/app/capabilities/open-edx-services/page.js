import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import React, { Suspense } from "react";

/**
 * Open edX Services Capabilities Page
 * Displays hosting, customization, branding, integrations, and all Open edX related services
 */
const OpenEdXServicesPage = () => {
  const config = CAPABILITIES_CONFIG.openEdXServices;

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

export default OpenEdXServicesPage;
