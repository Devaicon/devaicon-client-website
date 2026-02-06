import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import React, { Suspense } from "react";

/**
 * Data Capabilities Page
 * Displays all data platform, analytics, and governance solutions
 * Includes Microsoft Fabric, Azure Synapse, Power BI, Data Governance, and more
 */
const DataCapabilitiesPage = () => {
  const dataConfig = CAPABILITIES_CONFIG.data;

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
        title={dataConfig.title}
        subtitle={dataConfig.subtitle}
        cards={dataConfig.cards}
        showGroups={true}
      />
    </main>
  );
};

export default DataCapabilitiesPage;
