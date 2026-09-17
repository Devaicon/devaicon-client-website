import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  serviceSchema,
} from "@/lib/seo/structured-data";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import { Target } from "lucide-react";
import React, { Suspense } from "react";

export const metadata = {
  title: "Strategic Consulting & Transformation",
  description:
    "Strategic guidance, transformation roadmaps and advisory services that align technology with your business objectives instead of bolting tools together.",
  alternates: {
    canonical: "/capabilities/consulting-transformation",
  },
};

/**
 * Consulting & Transformation Capabilities Page
 * Displays Digital Transformation and Technology Strategy services
 */
const ConsultingTransformationPage = () => {
  const config = CAPABILITIES_CONFIG.consultingTransformation;

  return (
    <main>
      <JsonLd
        schema={[
          serviceSchema({
            name: config.title,
            description: config.subtitle,
            path: "/capabilities/consulting-transformation",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Capabilities", path: "/whatwedo" },
            { name: config.title, path: "/capabilities/consulting-transformation" },
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
        icon={<Target className="w-7 h-7 text-white" />}
        label="Technical Expertise"
        showButton={false}
        backgroundImage="/advisory.webp"
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

export default ConsultingTransformationPage;
