import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
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
      {/* TODO: Update these Sections later */}
      {/* <TrustSection /> */}
      <StatsSection />
      <IndustrySection />
      <ServicesSection />
      <EnterpriseExcellence />
      <Capabilities />
      {/* <OurServicesSection />*/}
      {/* <BadgesSection /> */}

      <ResourcesHub />
      <TalkTabbedSection />
    </main>
  );
}
