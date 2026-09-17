import IndustriesContainer from "@/components/industries/IndustriesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { INDUSTRIES_CONFIG } from "@/lib/industries-data";
import React, { Suspense } from "react";

export const metadata = {
  title: "Professional Services Technology",
  description:
    "Technology for consulting firms, legal practices and service providers juggling client projects, billing cycles and compliance requirements.",
  alternates: {
    canonical: "/industries",
  },
};

/**
 * Professional Services Industry Page
 * Consulting, legal, accounting, and advisory solutions
 */
const ProfessionalServicesIndustryPage = () => {
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

export default ProfessionalServicesIndustryPage;
