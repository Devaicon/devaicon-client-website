import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import StatsSection from "@/components/StatsSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import OurServicesSection from "@/components/OurServicesSection";
import IndustrySection from "@/components/IndustrySection";
import BadgesSection from "@/components/BadgesSection";
import TalkTabbedSection from "@/components/TalkTabbedSection";
import ResourcesHub from "@/components/ResourcesHub";
import EnterpriseExcellence from "@/components/EnterpriseExcellence";
import Capabilities from "@/components/Capabilities";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustSection />
      <StatsSection />
      <WhatWeDoSection />
      <EnterpriseExcellence />
      <Capabilities />
      <OurServicesSection />
      <IndustrySection />
      {/* <BadgesSection /> */}

      <ResourcesHub />
      <TalkTabbedSection />
    </main>
  );
}
