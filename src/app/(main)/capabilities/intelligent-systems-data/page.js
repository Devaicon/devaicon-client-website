import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  serviceSchema,
} from "@/lib/seo/structured-data";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import { Sparkles } from "lucide-react";
import React, { Suspense } from "react";

export const metadata = {
  title: "Intelligent Systems & Data",
  description:
    "AI, machine learning, data analytics, NLP, computer vision and AR/VR — systems that think, learn and decide using your data, not gut feeling.",
  alternates: {
    canonical: "/capabilities/intelligent-systems-data",
  },
};

/**
 * Intelligent Systems & Data Capabilities Page
 * Displays AI, Machine Learning, Data Science, NLP, Computer Vision, and AR/VR solutions
 */
const IntelligentSystemsDataPage = () => {
  const config = CAPABILITIES_CONFIG.intelligentSystemsData;

  return (
    <main>
      <JsonLd
        schema={[
          serviceSchema({
            name: config.title,
            description: config.subtitle,
            path: "/capabilities/intelligent-systems-data",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Capabilities", path: "/whatwedo" },
            { name: config.title, path: "/capabilities/intelligent-systems-data" },
          ]),
        ]}
      />

      {/* Scroll to hash functionality for deep linking */}
      <Suspense fallback={null}>
        <ScrollToHash />
      </Suspense>

      {/* Hero Section */}
      <PageHero
        title="Devaicon Capabilities"
        subtitle="Enterprise platforms, AI, and integration services"
        icon={<Sparkles className="w-7 h-7 text-white" />}
        label="Technical Expertise"
        showButton={false}
        backgroundImage="/artificial-intelligence.webp"
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

export default IntelligentSystemsDataPage;
