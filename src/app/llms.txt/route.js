import { SITE_URL, metaDescription } from "@/lib/seo";
import { listInsights } from "@/lib/blog/source";
import { getOpenJobs } from "@/lib/careers/api";
import { OPEN_EDX_HOSTING } from "@/lib/service-pages/open-edx-hosting";
import { OPEN_EDX_DEVELOPMENT } from "@/lib/service-pages/open-edx-development";
import { AI_AUTOMATION_PAKISTAN } from "@/lib/service-pages/ai-automation-pakistan";

/**
 * Served at /llms.txt (llmstxt.org): a plain map of the site for AI tools.
 * It lists the same canonical pages as the sitemap, so the industry
 * sub-pages are left out for the same reason. Descriptions repeat each
 * page's meta description; keep them in step when one changes.
 */
const SECTIONS = [
  {
    heading: "Services",
    links: [
      {
        title: "What We Do",
        path: "/whatwedo",
        description:
          "We guide your business through every step of technology growth, from strategy and build to enterprise systems, AI and ongoing support.",
      },
      {
        title: "Intelligent Systems & Data",
        path: "/capabilities/intelligent-systems-data",
        description:
          "AI, machine learning, data analytics, NLP, computer vision and AR/VR — systems that think, learn and decide using your data, not gut feeling.",
      },
      {
        title: AI_AUTOMATION_PAKISTAN.title,
        path: AI_AUTOMATION_PAKISTAN.path,
        description: AI_AUTOMATION_PAKISTAN.seo.description,
      },
      {
        title: "Application & Software Development",
        path: "/capabilities/application-software-development",
        description:
          "Web platforms, mobile apps and desktop software designed for usability, performance and maintainability — products your users actually want to use.",
      },
      {
        title: "Infrastructure & Enterprise Systems",
        path: "/capabilities/infrastructure-enterprise-systems",
        description:
          "Scalable infrastructure, ERP systems and automation with ongoing support, so your systems stay stable and your teams focus on actual work.",
      },
      {
        title: "Strategic Consulting & Transformation",
        path: "/capabilities/consulting-transformation",
        description:
          "Strategic guidance, transformation roadmaps and advisory services that align technology with your business objectives instead of bolting tools together.",
      },
      {
        title: "Open edX Services",
        path: "/capabilities/open-edx-services",
        description:
          "Open edX hosting, customisation, branding, integrations and feature development for enterprise learning platforms built for long-term scale.",
      },
      ...[OPEN_EDX_HOSTING, OPEN_EDX_DEVELOPMENT].map((page) => ({
        title: page.title,
        path: page.path,
        description: page.seo.description,
      })),
      {
        title: "Industries We Serve",
        path: "/industries",
        description:
          "Specialised technology solutions for banking, public sector, retail, manufacturing, hospitality, professional services, non-profits and education.",
      },
      {
        title: "Engagement Models",
        path: "/engagement-models",
        description:
          "Compare outsourcing, dedicated teams and staff augmentation to find the engagement model that cuts cost and gets your project delivered on time.",
      },
    ],
  },
  {
    heading: "Company",
    links: [
      {
        title: "About Devaicon",
        path: "/about-devaicon",
        description:
          "Learn about Devaicon's mission, vision, purpose and values, and how we transform enterprises through AI, data and digital transformation.",
      },
      {
        title: "Contact Us",
        path: "/contact-us",
        description:
          "Talk to Devaicon about a new build or an ongoing project. Reach our Sharjah team by phone or email and we'll get back to you quickly.",
      },
      {
        title: "Careers",
        path: "/careers",
        description:
          "Explore career opportunities at Devaicon and help transform businesses through AI, automation and digital solutions. See our open roles.",
      },
    ],
  },
];

const POLICIES = [
  {
    title: "Privacy Policy",
    path: "/privacy",
    description:
      "How Devaicon collects, uses, stores and protects your personal data, and the rights you have over the information we hold.",
  },
  {
    title: "Security Policy",
    path: "/security",
    description:
      "Devaicon's approach to securing systems and customer data: the controls, practices and safeguards we apply across our platforms and engagements.",
  },
  {
    title: "Cookie Policy",
    path: "/cookies",
    description:
      "What cookies Devaicon uses, what each type does, and how you can control or disable them in your browser.",
  },
];

// Rebuilt alongside the sitemap when posts or roles change.
export const revalidate = 300;

const line = ({ title, path, description }) =>
  `- [${title}](${new URL(path, SITE_URL)})${description ? `: ${description}` : ""}`;

const section = (heading, links) =>
  links.length ? [`## ${heading}`, "", ...links.map(line), ""] : [];

export async function GET() {
  // As in the sitemap, an API outage drops the posts rather than the file.
  const [posts, openJobs] = await Promise.all([
    listInsights({ limit: 200 }).catch(() => []),
    getOpenJobs().catch(() => []),
  ]);
  const insights = [
    {
      title: "Insights & Resources",
      path: "/insights",
      description:
        "Trends, insights and thought leadership on enterprise technology, AI adoption, digital transformation and innovation strategy from Devaicon.",
    },
    ...posts
      .filter((p) => !p.noindex)
      .map((p) => ({
        title: p.title,
        path: `/insights/${p.slug}`,
        description: metaDescription(p.subtitle),
      })),
  ];

  const jobs = openJobs.map((job) => ({
    title: job.title,
    path: `/careers/${job.slug}`,
    description: job.summary,
  }));

  const body = [
    "# Devaicon",
    "",
    "> Devaicon builds AI, automation, cloud and enterprise software solutions for organisations across banking, retail, manufacturing and the public sector. 18+ years of delivery, 550+ projects.",
    "",
    `Based in Sharjah, United Arab Emirates. Website: ${SITE_URL}/`,
    "",
    ...SECTIONS.flatMap(({ heading, links }) => section(heading, links)),
    ...section("Insights", insights),
    ...section("Open roles", jobs),
    ...section("Optional", POLICIES),
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
