import IndustriesContainer from "@/components/industries/IndustriesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { INDUSTRIES_CONFIG } from "@/lib/industries-data";
import { Building2 } from "lucide-react";
import React, { Suspense } from "react";

/**
 * Main Industries Page
 * Displays all industry solutions with scroll navigation
 */
const IndustriesPage = () => {
  const industriesConfig = INDUSTRIES_CONFIG.all;

  return (
    <main>
      {/* Scroll to hash functionality for deep linking */}
      <Suspense fallback={null}>
        <ScrollToHash />
      </Suspense>

      {/* Hero Section */}
      <PageHero
        title="Industries We Serve"
        subtitle="Specialized solutions for your sector"
        icon={<Building2 className="w-7 h-7 text-white" />}
        label="Industry Expertise"
        showButton={false}
        backgroundImage="/professional-services.webp"
      />

      {/* Industries Container */}
      <IndustriesContainer
        title={industriesConfig.title}
        subtitle={industriesConfig.subtitle}
        cards={industriesConfig.cards}
        showGroups={true}
      />
    </main>
  );
};

export default IndustriesPage;
