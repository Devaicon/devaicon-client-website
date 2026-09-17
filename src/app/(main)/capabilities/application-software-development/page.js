import CapabilitesContainer from "@/components/capabilities/CapabilitesContainer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  serviceSchema,
} from "@/lib/seo/structured-data";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { CAPABILITIES_CONFIG } from "@/lib/capabilities-data";
import { Code } from "lucide-react";
import React, { Suspense } from "react";

export const metadata = {
  title: "Application & Software Development",
  description:
    "Web platforms, mobile apps and desktop software designed for usability, performance and maintainability — products your users actually want to use.",
  alternates: {
    canonical: "/capabilities/application-software-development",
  },
};

/**
 * Application & Software Development Capabilities Page
 * Displays web, mobile, desktop, and UI/UX design services
 */
const ApplicationSoftwareDevelopmentPage = () => {
  const config = CAPABILITIES_CONFIG.applicationSoftwareDevelopment;

  return (
    <main>
      <JsonLd
        schema={[
          serviceSchema({
            name: config.title,
            description: config.subtitle,
            path: "/capabilities/application-software-development",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Capabilities", path: "/whatwedo" },
            { name: config.title, path: "/capabilities/application-software-development" },
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
        icon={<Code className="w-7 h-7 text-white" />}
        label="Technical Expertise"
        showButton={false}
        backgroundImage="/mobile-application-development.webp"
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

export default ApplicationSoftwareDevelopmentPage;
