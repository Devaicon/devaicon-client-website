import PageHero from "@/components/PageHero";
import OpenRoles from "@/components/careers/OpenRoles";
import WhyDevaicon from "@/components/careers/WhyDevaicon";
import HiringProcess from "@/components/careers/HiringProcess";
import { getOpenJobsForPage } from "@/lib/careers/api";
import { Briefcase } from "lucide-react";

export const metadata = {
  title: "Careers at Devaicon - Join Our Innovation Team",
  description:
    "Explore career opportunities at Devaicon and help transform businesses through AI, automation and digital solutions. See our open roles.",
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
  alternates: {
    canonical: "/careers",
  },
};

// Rebuilt when a role is published, changed or closed; see /api/revalidate.
export const revalidate = 300;

/**
 * The open roles come first, because they're what most visitors are here
 * for; why to join, the benefits and how hiring works follow for anyone
 * still deciding.
 */
export default async function CareersPage() {
  const jobs = await getOpenJobsForPage();
  const count = jobs?.length ?? 0;

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ]}
        title="Build your career with Devaicon"
        subtitle="Join the team building AI, cloud and enterprise software for organisations across the region. Find a role that fits, or send us your résumé."
        icon={<Briefcase className="w-7 h-7 text-white" />}
        label="Careers"
        buttonText={count > 0 ? `See ${count} open ${count === 1 ? "role" : "roles"}` : "See open roles"}
        buttonLink="#open-roles"
        showButton={true}
        backgroundImage="/professional-collaboration.webp"
      />

      <OpenRoles jobs={jobs} />
      <WhyDevaicon />
      <HiringProcess />
    </main>
  );
}
