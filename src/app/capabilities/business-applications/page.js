import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import React, { Suspense } from "react";

/**
 * Business Applications Capabilities Page
 * Displays all Dynamics 365 business application solutions
 * Includes Finance, Sales, Customer Service, Supply Chain, and more
 */
const BusinessApplicationsPage = () => {
  const businessAppsConfig = CAPABILITIES_CONFIG["business-applications"];

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
        title={businessAppsConfig.title}
        subtitle={businessAppsConfig.subtitle}
        cards={businessAppsConfig.cards}
        showGroups={true}
      />
    </main>
  );
};
