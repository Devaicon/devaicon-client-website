import WhatWeDoContainer from "@/components/whatwedo/WhatWeDoContainer";
import PageHero from "@/components/PageHero";
import ScrollToHash from "@/components/capabilities/ScrollToHash";
import { WHATWEDO_CONFIG } from "@/lib/whatwedo-data";
import { Briefcase } from "lucide-react";
import React, { Suspense } from "react";

/**
 * Main What We Do Page
 * Displays all what we do services with scroll navigation
 */
const WhatWeDoPage = () => {
  const whatWeDoConfig = WHATWEDO_CONFIG.main;

  return (
    <main>
      {/* Scroll to hash functionality for deep linking */}
      <Suspense fallback={null}>
        <ScrollToHash />
      </Suspense>

      {/* Hero Section */}
      <PageHero
        title="What We Do"
        subtitle="We guide your business through every step of technology growth to ensure you stay ahead of competitors."
        icon={<Briefcase className="w-7 h-7 text-white" />}
        label="Services & Solutions"
        showButton={false}
      />

      {/* What We Do Container */}
      <WhatWeDoContainer
        title={whatWeDoConfig.title}
        subtitle={whatWeDoConfig.subtitle}
        cards={whatWeDoConfig.cards}
        showGroups={true}
      />
    </main>
  );
};

export default WhatWeDoPage;
