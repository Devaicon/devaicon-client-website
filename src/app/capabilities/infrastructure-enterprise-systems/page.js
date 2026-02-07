import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import { Server } from "lucide-react";
import React, { Suspense } from "react";

/**
 * Infrastructure & Enterprise Systems Capabilities Page
 * Displays Cloud, DevOps, ERP, and Support services
 */
const InfrastructureEnterpriseSystemsPage = () => {
  const config = CAPABILITIES_CONFIG.infrastructureEnterpriseSystems;

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
        icon={<Server className="w-7 h-7 text-white" />}
        label="Technical Expertise"
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

export default InfrastructureEnterpriseSystemsPage;
