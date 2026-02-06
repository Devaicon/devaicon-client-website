import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import React, { Suspense } from "react";

/**
 * Application & Software Development Capabilities Page
 * Displays web, mobile, desktop, and UI/UX design services
 */
const ApplicationSoftwareDevelopmentPage = () => {
  const config = CAPABILITIES_CONFIG.applicationSoftwareDevelopment;

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

export default ApplicationSoftwareDevelopmentPage;
