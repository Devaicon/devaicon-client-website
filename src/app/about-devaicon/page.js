import PageHero from "@/components/PageHero";
import AboutIntro from "@/components/AboutIntro";

export const metadata = {
  title: "About Devaicon - Our Mission, Vision & Values",
  description:
    "Learn about Devaicon's mission to transform enterprises through AI, data innovation, and digital transformation. Discover our vision, purpose, and core values.",
};

export default function AboutDevaiconPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        title="About Devaicon"
        subtitle="Empowering enterprises to lead with clarity, intelligence, and confidence through AI, data, and digital transformation."
        buttonText="Get in Touch"
        buttonLink="/contact-us"
        showButton={true}
      />

      {/* Intro Section - Mission, Vision, Purpose */}
      <AboutIntro />
    </main>
  );
}
