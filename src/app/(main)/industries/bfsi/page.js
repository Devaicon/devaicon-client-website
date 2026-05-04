import IndustriesContainer from "@/components/industries/IndustriesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { INDUSTRIES_CONFIG } from "@/lib/industries-data";
import React, { Suspense } from "react";

/**
 * BFSI Industry Page
 * Banking, Financial Services, and Insurance solutions
 */
const BFSIIndustryPage = () => {
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
        backgroundImage="/banking.webp"
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

export default BFSIIndustryPage;
