"use client";

import { useState } from "react";
import Image from "next/image";
import CapabilitiesCards from "./CapabilitiesCards";
import {
  Brain,
  TrendingUp,
  MessageSquare,
  Eye,
  Glasses,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Cloud,
  Settings,
  Headphones,
  Target,
  Lightbulb,
  GraduationCap,
  Server,
  Puzzle,
  PenTool,
  Lock,
  FileText,
  GitBranch,
  RefreshCw,
  Wrench,
  BarChart3,
  Users,
} from "lucide-react";

const CATEGORIES = [
  "Intelligent Systems & Data",
  "Application & Software Development",
  "Infrastructure & Enterprise Systems",
  "Consulting & Transformation",
  "Open edX Services",
];

const CAPABILITIES_DATA = [
  // Intelligent Systems & Data Capabilities
  {
    id: 1,
    icon: <Brain className="w-7 h-7" />,
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Custom AI models built to solve real business problems, not demo projects. This includes predictive systems, recommendation engines, automation logic, and intelligent decision support tailored to your workflows.",
    category: "Intelligent Systems & Data",
    slug: "artificial-intelligence-machine-learning",
  },
  {
    id: 2,
    icon: <TrendingUp className="w-7 h-7" />,
    title: "Data Science & Analytics",
    description:
      "Turning raw data into insight. We design data pipelines, analytics dashboards, and reporting systems that help organisations understand trends, measure performance, and make informed decisions at scale.",
    category: "Intelligent Systems & Data",
    slug: "data-science-analytics",
  },
  {
    id: 3,
    icon: <MessageSquare className="w-7 h-7" />,
    title: "Natural Language Processing (NLP)",
    description:
      "Systems that understand and generate human language. This covers enterprise chatbots, text classification, sentiment analysis, document processing, and AI assistants integrated into existing platforms.",
    category: "Intelligent Systems & Data",
    slug: "natural-language-processing",
  },
  {
    id: 4,
    icon: <Eye className="w-7 h-7" />,
    title: "Computer Vision",
    description:
      "AI solutions that interpret images and video. Use cases include object detection, facial recognition, visual inspection, and automated monitoring for security, healthcare, and industrial applications.",
    category: "Intelligent Systems & Data",
    slug: "computer-vision",
  },
  {
    id: 5,
    icon: <Glasses className="w-7 h-7" />,
    title: "AR & VR Solutions",
    description:
      "Immersive technologies for training, simulation, and remote collaboration. We develop practical AR and VR experiences that improve learning outcomes and operational efficiency.",
    category: "Intelligent Systems & Data",
    slug: "ar-vr-solutions",
  },
  // Application & Software Development
  {
    id: 6,
    icon: <Globe className="w-7 h-7" />,
    title: "Web & Mobile Application Development",
    description:
      "End to end development of scalable web platforms and mobile applications. From MVPs to enterprise systems, we handle frontend, backend, APIs, and integrations with a focus on performance and security.",
    category: "Application & Software Development",
    slug: "web-mobile-application-development",
  },
  {
    id: 7,
    icon: <Monitor className="w-7 h-7" />,
    title: "Desktop Application Development",
    description:
      "Robust desktop software for business and operational needs. Ideal for environments requiring offline access, local processing, or tight integration with hardware and internal systems.",
    category: "Application & Software Development",
    slug: "desktop-application-development",
  },
  {
    id: 8,
    icon: <Palette className="w-7 h-7" />,
    title: "UI & UX Design",
    description:
      "User experience design that prioritises clarity and usability. We create interfaces that are intuitive, consistent, and aligned with business goals, not just visually pleasing.",
    category: "Application & Software Development",
    slug: "ui-ux-design",
  },
  // Infrastructure, Automation & Enterprise Systems
  {
    id: 9,
    icon: <Cloud className="w-7 h-7" />,
    title: "Cloud & DevOps Services",
    description:
      "Designing and managing cloud infrastructure using modern DevOps practices. This includes CI/CD pipelines, containerisation, monitoring, performance optimisation, and secure deployments on AWS, Azure, or GCP.",
    category: "Infrastructure & Enterprise Systems",
    slug: "cloud-devops-services",
  },
  {
    id: 10,
    icon: <Settings className="w-7 h-7" />,
    title: "ERP Systems & Business Automation",
    description:
      "Custom ERP solutions and workflow automation tailored to organisational processes. We replace manual operations with integrated systems that improve efficiency, accuracy, and visibility across departments.",
    category: "Infrastructure & Enterprise Systems",
    slug: "erp-systems-business-automation",
  },
  {
    id: 11,
    icon: <Headphones className="w-7 h-7" />,
    title: "Support & Maintenance",
    description:
      "Ongoing technical support to keep systems running smoothly. This includes monitoring, bug fixes, performance improvements, security updates, and feature enhancements after launch.",
    category: "Infrastructure & Enterprise Systems",
    slug: "support-maintenance",
  },
  // Strategic Consulting & Digital Transformation
  {
    id: 12,
    icon: <Target className="w-7 h-7" />,
    title: "Digital Transformation Consulting",
    description:
      "Assessment and redesign of business processes using modern technology. We help organisations move from outdated systems to efficient, scalable digital operations with a clear transformation roadmap.",
    category: "Consulting & Transformation",
    slug: "digital-transformation-consulting",
  },
  {
    id: 13,
    icon: <Lightbulb className="w-7 h-7" />,
    title: "Technology Strategy & Advisory",
    description:
      "Guidance on technology decisions that actually align with business objectives. This includes system audits, architecture planning, tool selection, and long term technology roadmaps.",
    category: "Consulting & Transformation",
    slug: "technology-strategy-advisory",
  },
  // Open edX Services
  {
    id: 14,
    icon: <Server className="w-7 h-7" />,
    title: "Open edX Hosting",
    description:
      "Secure, scalable cloud hosting for Open edX platforms, optimized for performance, reliability, and global learner access.",
    category: "Open edX Services",
    slug: "open-edx-hosting",
  },
  {
    id: 15,
    icon: <Puzzle className="w-7 h-7" />,
    title: "Customization & Feature Development",
    description:
      "Tailored Open edX enhancements built through plugins and extensions—adding new functionality without modifying the core platform.",
    category: "Open edX Services",
    slug: "customization-feature-development",
  },
  {
    id: 16,
    icon: <PenTool className="w-7 h-7" />,
    title: "Branding & UI/UX",
    description:
      "Fully branded learning experiences with custom themes, layouts, and UI refinements that align Open edX with your organization's identity.",
    category: "Open edX Services",
    slug: "branding-ui-ux",
  },
  {
    id: 17,
    icon: <FileText className="w-7 h-7" />,
    title: "Content Authoring & Course Development",
    description:
      "Design and build engaging courses using Open edX Studio, XBlocks, and interactive content aligned with instructional best practices.",
    category: "Open edX Services",
    slug: "content-authoring-course-development",
  },
  {
    id: 18,
    icon: <Lock className="w-7 h-7" />,
    title: "Integrations & SSO",
    description:
      "Seamless integration with enterprise systems including SSO, HR platforms, CRMs, analytics tools, and internal applications.",
    category: "Open edX Services",
    slug: "integrations-sso",
  },
  {
    id: 19,
    icon: <GitBranch className="w-7 h-7" />,
    title: "Deployment & Environment Setup",
    description:
      "End-to-end setup of development, staging, and production environments following best practices for security and maintainability.",
    category: "Open edX Services",
    slug: "deployment-environment-setup",
  },
  {
    id: 20,
    icon: <RefreshCw className="w-7 h-7" />,
    title: "Release Upgrades & Version Management",
    description:
      "Smooth upgrades to newer Open edX releases with minimal downtime—ensuring access to new features while protecting custom work.",
    category: "Open edX Services",
    slug: "release-upgrades-version-management",
  },
  {
    id: 21,
    icon: <Wrench className="w-7 h-7" />,
    title: "Maintenance & Support",
    description:
      "Ongoing monitoring, bug fixes, security updates, and operational support to keep your Open edX platform running smoothly.",
    category: "Open edX Services",
    slug: "open-edx-maintenance-support",
  },
  {
    id: 22,
    icon: <BarChart3 className="w-7 h-7" />,
    title: "Analytics & Reporting",
    description:
      "Advanced learner insights, progress tracking, and custom reports using Open edX data pipelines and external BI tools.",
    category: "Open edX Services",
    slug: "analytics-reporting",
  },
  {
    id: 23,
    icon: <Users className="w-7 h-7" />,
    title: "Multi-Tenant & Regional Deployments",
    description:
      "Support for multiple audiences, regions, or business units with isolated data, branding, and configuration options.",
    category: "Open edX Services",
    slug: "multi-tenant-regional-deployments",
  },
];

// Map category names to capabilities page URLs
const CATEGORY_TO_URL = {
  "Intelligent Systems & Data": "/capabilities/intelligent-systems-data",
  "Application & Software Development":
    "/capabilities/application-software-development",
  "Infrastructure & Enterprise Systems":
    "/capabilities/infrastructure-enterprise-systems",
  "Consulting & Transformation": "/capabilities/consulting-transformation",
  "Open edX Services": "/capabilities/open-edx-services",
};

export default function Capabilities() {
  const [activeCategory, setActiveCategory] = useState("Intelligent Systems & Data");

  const filteredCapabilities = CAPABILITIES_DATA.filter(
    (item) => item.category === activeCategory
  );

  return (
    <section className="w-full min-h-screen bg-[#dce5ed] flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-7xl flex flex-col items-center rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="w-full min-h-40 sm:min-h-45 md:h-50 lg:h-58 bg-[rgba(74,45,88,1)] text-white flex flex-col items-center justify-center px-4 py-6">
          <Image
            src="/icon.webp"
            alt="Capabilities Icon"
            width={100}
            height={80}
            priority
            className="w-15 h-auto sm:w-20 sm:h-auto md:w-25 md:h-auto"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] font-bold text-center my-2">
            Devaicon Capabilities
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-normal text-[#f2f2f2] text-center mb-4 px-2">
            Enterprise platforms, AI, and integration services
          </p>
        </div>

        {/* Filters */}
        <div className="w-full py-6 sm:py-8 px-4">
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 sm:gap-3 min-w-max pb-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`h-12 sm:h-13 md:h-14 px-5 sm:px-6 md:px-7 py-2.5 rounded-full text-sm sm:text-base md:text-lg font-semibold text-white whitespace-nowrap cursor-pointer
                    bg-gradient-to-b from-[#3e234c] to-[#6c3c85]
                    focus-visible:outline-2 focus-visible:outline-[rgba(90,58,104,0.5)]
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${activeCategory === category ? "bg-[#6b4775] shadow-lg bg-gradient-to-b from-[#3e2340] to-[#6c3c80]" : "hover:shadow-md hover:from-[#4a2d58] hover:to-[#7a4a9f] opacity-80"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-4 w-full px-4 pb-6 sm:pb-8 md:pb-10">
          {filteredCapabilities.map((capability) => (
            <CapabilitiesCards
              key={capability.id}
              {...capability}
              categoryUrl={CATEGORY_TO_URL[capability.category]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
