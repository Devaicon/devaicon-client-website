import IndustriesContainer from "@/components/industries/IndustriesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { INDUSTRIES_CONFIG } from "@/lib/industries-data";
import React, { Suspense } from "react";

/**
 * Hospitality Industry Page
 * Hotels, restaurants, and tourism solutions
 */
const HospitalityIndustryPage = () => {
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
        showButton={false}
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

export default HospitalityIndustryPage;
