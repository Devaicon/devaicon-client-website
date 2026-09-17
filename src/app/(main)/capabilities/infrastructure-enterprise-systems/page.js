import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  serviceSchema,
} from "@/lib/seo/structured-data";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import { Server } from "lucide-react";
import React, { Suspense } from "react";

export const metadata = {
  title: "Infrastructure & Enterprise Systems",
  description:
    "Scalable infrastructure, ERP systems and automation with ongoing support, so your systems stay stable and your teams focus on actual work.",
  alternates: {
    canonical: "/capabilities/infrastructure-enterprise-systems",
  },
};

/**
 * Infrastructure & Enterprise Systems Capabilities Page
 * Displays Cloud, DevOps, ERP, and Support services
 */
const InfrastructureEnterpriseSystemsPage = () => {
  const config = CAPABILITIES_CONFIG.infrastructureEnterpriseSystems;

  return (
    <main>
      <JsonLd
        schema={[
          serviceSchema({
            name: config.title,
            description: config.subtitle,
            path: "/capabilities/infrastructure-enterprise-systems",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Capabilities", path: "/whatwedo" },
            { name: config.title, path: "/capabilities/infrastructure-enterprise-systems" },
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
        icon={<Server className="w-7 h-7 text-white" />}
        label="Technical Expertise"
        showButton={false}
        backgroundImage="/ai.webp"
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
