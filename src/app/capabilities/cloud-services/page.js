import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import React, { Suspense } from "react";

/**
 * Cloud Services Capabilities Page
 * Displays all Azure cloud infrastructure and services solutions
 * Includes Azure Infrastructure, Kubernetes, DevOps, Security, and more
 */
const CloudServicesPage = () => {
  const cloudConfig = CAPABILITIES_CONFIG["cloud-services"];

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
        title={cloudConfig.title}
        subtitle={cloudConfig.subtitle}
        cards={cloudConfig.cards}
        showGroups={true}
      />
    </main>
  );
};

export default CloudServicesPage;
