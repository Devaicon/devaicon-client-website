import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  serviceSchema,
} from "@/lib/seo/structured-data";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import { GraduationCap } from "lucide-react";
import React, { Suspense } from "react";

export const metadata = {
  title: "Open edX Services",
  description:
    "Open edX hosting, customisation, branding, integrations and feature development for enterprise learning platforms built for long-term scale.",
  alternates: {
    canonical: "/capabilities/open-edx-services",
  },
};

/**
 * Open edX Services Capabilities Page
 * Displays hosting, customization, branding, integrations, and all Open edX related services
 */
const OpenEdXServicesPage = () => {
  const config = CAPABILITIES_CONFIG.openEdXServices;

  return (
    <main>
      <JsonLd
        schema={[
          serviceSchema({
            name: config.title,
            description: config.subtitle,
            path: "/capabilities/open-edx-services",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Capabilities", path: "/whatwedo" },
            { name: config.title, path: "/capabilities/open-edx-services" },
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
        icon={<GraduationCap className="w-7 h-7 text-white" />}
        label="Technical Expertise"
        showButton={false}
        backgroundImage="/openedx.webp"
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

export default OpenEdXServicesPage;
