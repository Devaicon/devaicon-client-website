import {
  Brain,
  Briefcase,
  Cloud,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

/**
 * Capabilities navigation data
 * Groups capabilities by category with their items and metadata
 */
export const capabilitiesData = [
  {
    name: "Intelligent Systems & Data",
    icon: Brain,
    slug: "intelligent-systems-data",
    description:
      "Building systems that think, learn, and make decisions using data rather than gut feeling.",
    items: [
      {
        name: "AI & Machine Learning",
        icon: "Brain",
        id: "artificial-intelligence-machine-learning",
      },
      {
        name: "Data Science & Analytics",
        icon: "TrendingUp",
        id: "data-science-analytics",
      },
      {
        name: "Natural Language Processing",
        icon: "MessageSquare",
        id: "natural-language-processing",
      },
      {
        name: "Computer Vision",
        icon: "Eye",
        id: "computer-vision",
      },
      {
        name: "AR & VR Solutions",
        icon: "Glasses",
        id: "ar-vr-solutions",
      },
    ],
  },
  {
    name: "Application & Software",
    icon: Briefcase,
    slug: "application-software-development",
    description:
      "Designing and building reliable software products that users actually want to use.",
    items: [
      {
        name: "Web & Mobile Development",
        icon: "Globe",
        id: "web-mobile-application-development",
      },
      {
        name: "Desktop Applications",
        icon: "Monitor",
        id: "desktop-application-development",
      },
      {
        name: "UI & UX Design",
        icon: "Palette",
        id: "ui-ux-design",
      },
    ],
  },
  {
    name: "Infrastructure & Enterprise",
    icon: Cloud,
    slug: "infrastructure-enterprise-systems",
    description:
      "Keeping systems scalable, stable, and automated so teams can focus on actual work.",
    items: [
      {
        name: "Cloud & DevOps Services",
        icon: "Cloud",
        id: "cloud-devops-services",
      },
      {
        name: "ERP & Business Automation",
        icon: "Settings",
        id: "erp-systems-business-automation",
      },
      {
        name: "Support & Maintenance",
        icon: "Headphones",
        id: "support-maintenance",
      },
    ],
  },
  {
    name: "Consulting & Transformation",
    icon: TrendingUp,
    slug: "consulting-transformation",
    description:
      "Helping organisations adopt technology properly instead of bolting tools together.",
    items: [
      {
        name: "Digital Transformation",
        icon: "Target",
        id: "digital-transformation-consulting",
      },
      {
        name: "Technology Strategy",
        icon: "Lightbulb",
        id: "technology-strategy-advisory",
      },
    ],
  },
  {
    name: "Open edX Services",
    icon: GraduationCap,
    slug: "open-edx-services",
    description:
      "Enterprise learning platforms, customization, and long-term scalability.",
    items: [
      {
        name: "Open edX Hosting",
        icon: "Server",
        id: "open-edx-hosting",
      },
      {
        name: "Customization & Features",
        icon: "Puzzle",
        id: "customization-feature-development",
      },
      {
        name: "Branding & UI/UX",
        icon: "PenTool",
        id: "branding-ui-ux",
      },
      {
        name: "Course Development",
        icon: "FileText",
        id: "content-authoring-course-development",
      },
      {
        name: "Integrations & SSO",
        icon: "Lock",
        id: "integrations-sso",
      },
      {
        name: "Deployment & Setup",
        icon: "GitBranch",
        id: "deployment-environment-setup",
      },
    ],
  },
];
