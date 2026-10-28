import { Compass, Cpu, GraduationCap, Globe, Laptop, Users } from "lucide-react";
import Reveal from "./Reveal";

const REASONS = [
  {
    icon: Globe,
    title: "Work clients depend on",
    text: "Build systems that banks, retailers, manufacturers and public bodies run every day, with international clients and teams.",
  },
  {
    icon: Cpu,
    title: "Current technology",
    text: "Work hands-on with AI, cloud platforms and enterprise systems, and help choose what we adopt next.",
  },
  {
    icon: Users,
    title: "People who share what they know",
    text: "Pair with experienced engineers and consultants, and have a mentor guiding you from your first week.",
  },
  {
    icon: Compass,
    title: "A clear path forward",
    text: "Regular reviews, promotion on merit, and the chance to lead projects and teams as you grow.",
  },
  {
    icon: GraduationCap,
    title: "Time to keep learning",
    text: "Training programmes, certifications and conferences, so your skills keep pace with the work.",
  },
  {
    icon: Laptop,
    title: "Flexible working",
    text: "Flexible hours, and remote or hybrid arrangements where the role allows.",
  },
];

const BENEFITS = [
  { title: "Health and wellness", items: ["Comprehensive medical insurance", "Dental and vision coverage", "Mental health support", "Annual health checkups"] },
  { title: "Learning and development", items: ["Professional certifications", "Conference attendance", "Online learning platforms", "Mentorship programs"] },
  { title: "Flexibility and time off", items: ["Hybrid work model", "Flexible working hours", "Paid time off", "Parental leave"] },
  { title: "Pay and rewards", items: ["Competitive salaries", "Performance bonuses", "Retirement plans", "Stock options"] },
  { title: "Travel and mobility", items: ["International assignments", "Travel opportunities", "Relocation assistance", "Transportation allowance"] },
  { title: "Everyday perks", items: ["Meal allowances", "Coffee and snacks", "Team building events", "Recreational activities"] },
];

/** A section whose heading sits beside its content on wide screens. */
function SplitSection({ id, title, intro, tone = "white", children }) {
  return (
    <section aria-labelledby={id} className={`py-16 lg:py-20 ${tone === "grey" ? "bg-gray-50" : "bg-white"}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-6 xl:px-15">
        <Reveal className="lg:col-span-4">
          <h2 id={id} className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{intro}</p>
        </Reveal>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

/** Why people join, then what they get. */
export default function WhyDevaicon() {
  return (
    <>
      <SplitSection
        id="why-heading"
        tone="grey"
        title="Why work at Devaicon"
        intro="We're a delivery team first. You'll do work that ships to real clients, learn from people who've done it for years, and get room to grow into what you want to do next."
      >
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {REASONS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 2) * 80 + Math.floor(i / 2) * 40} className="border-t border-gray-300 pt-5">
              <h3 className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
                <Icon className="h-5 w-5 shrink-0 text-[#3d234b]" aria-hidden />
                {title}
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">{text}</p>
            </Reveal>
          ))}
        </ul>
      </SplitSection>

      <SplitSection
        id="benefits-heading"
        title="Benefits"
        intro="What comes with every role. Each posting also lists anything specific to that position."
      >
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {BENEFITS.map((group, i) => (
            <Reveal key={group.title} delay={(i % 3) * 70}>
              <h3 className="font-semibold text-gray-900">{group.title}</h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3d234b]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </SplitSection>
    </>
  );
}
