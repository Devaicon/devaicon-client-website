import IndustriesContainer from "@/components/industries/IndustriesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { INDUSTRIES_CONFIG } from "@/lib/industries-data";
import React, { Suspense } from "react";

export const metadata = {
  title: "Non-Profit Technology Solutions",
  description:
    "Technology for non-profits balancing programme delivery, donor relationships, regulatory requirements and clear impact measurement.",
  alternates: {
    canonical: "/industries",
  },
};

/**
 * Non-Profit Industry Page
 * NGO, charity, and social organization solutions
 */
const NonProfitIndustryPage = () => {
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
        backgroundImage="/non-profit-organizations.webp"
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

export default NonProfitIndustryPage;
