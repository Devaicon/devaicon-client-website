import IndustriesContainer from "@/components/industries/IndustriesContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { INDUSTRIES_CONFIG } from "@/lib/industries-data";
import React, { Suspense } from "react";

export const metadata = {
  title: "Retail Technology Solutions",
  description:
    "Technology for retailers across stores, online and hybrid models — knowing what customers want, keeping it in stock and delivering it consistently.",
  alternates: {
    canonical: "/industries",
  },
};

/**
 * Retail Industry Page
 * E-commerce, POS, and customer experience solutions
 */
const RetailIndustryPage = () => {
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
        backgroundImage="/retail.webp"
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

export default RetailIndustryPage;
