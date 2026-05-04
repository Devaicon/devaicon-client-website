import PageHero from "@/components/PageHero";
import CareersIntro from "@/components/careers/CareersIntro";
import WhyJoinUs from "@/components/careers/WhyJoinUs";
import CareerBenefits from "@/components/careers/CareerBenefits";
import CareerGrowth from "@/components/careers/CareerGrowth";
import JobOpenings from "@/components/careers/JobOpenings";
import ApplicationProcess from "@/components/careers/ApplicationProcess";
import { Briefcase } from "lucide-react";

export const metadata = {
  title: "Careers at Devaicon - Join Our Innovation Team",
  description:
    "Explore exciting career opportunities at Devaicon. Join our team of innovators and help transform businesses through AI, automation, and digital solutions.",
  keywords: [
    "careers",
    "jobs",
    "technology careers",
    "software development jobs",
    "AI careers",
    "cloud careers",
    "Devaicon careers",
    "tech jobs",
  ],
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        title="Build Your Career with Devaicon"
        subtitle="Join a team of passionate innovators driving digital transformation across industries. Unlock your potential and shape the future of technology."
        icon={<Briefcase className="w-7 h-7 text-white" />}
        label="Careers"
        buttonText="View Open Positions"
        buttonLink="#job-openings"
        showButton={true}
        backgroundImage="/professional-collaboration.webp"
      />

      {/* Introduction */}
      <CareersIntro />

      {/* Why Join Us */}
      <WhyJoinUs />

      {/* Benefits */}
      <CareerBenefits />

      {/* Career Growth */}
      <CareerGrowth />

      {/* Job Openings */}
      <JobOpenings />

      {/* Application Process */}
      <ApplicationProcess />
    </main>
  );
}
