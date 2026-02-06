import PageHero from "@/components/PageHero";
import EngagementModelsSection from "@/components/EngagementModelsSection";
import EngagementModelComparison from "@/components/EngagementModelComparison";
import EngagementDecisionMatrix from "@/components/EngagementDecisionMatrix";

export default function EngagementModelsPage() {
  const engagementModelsData = [
    {
      tabTitle: "Software Outsourcing",
      title: "Software Development Outsourcing",
      description:
        "Partner with our expert team to build your software solutions from the ground up. We handle the entire development lifecycle, allowing you to focus on your core business while we deliver high-quality, scalable software tailored to your specific needs.",
      devaiconFactor: [
        {
          value: "18+",
          label: "Years building custom solutions and applications",
          color: "#3d234b",
        },
        {
          value: "550+",
          label: "Projects Delivered",
          color: "#10B981",
        },
        {
          value: "800+",
          label: "Specialists with decades of experience",
          color: "#F59E0B",
        },
      ],
      technologies: [
        { name: "React", logo: "/logo.png", width: 80, height: 80 },
        { name: "Node.js", logo: "/logo.png", width: 80, height: 80 },
        { name: "Python", logo: "/logo.png", width: 80, height: 80 },
        { name: "AWS", logo: "/logo.png", width: 80, height: 80 },
        { name: "Docker", logo: "/logo.png", width: 80, height: 80 },
      ],
    },
    {
      tabTitle: "Dedicated Teams",
      title: "Dedicated Development Teams",
      description:
        "Get a fully integrated team dedicated exclusively to your project. Our dedicated teams work as an extension of your in-house team, providing long-term partnership, seamless collaboration, and consistent results for your ongoing development needs.",
      devaiconFactor: [
        {
          value: "18+",
          label: "Years building custom solutions and applications",
          color: "#3d234b",
        },
        {
          value: "550+",
          label: "Projects Delivered",
          color: "#10B981",
        },
        {
          value: "800+",
          label: "Specialists with decades of experience",
          color: "#F59E0B",
        },
      ],
      technologies: [
        { name: "Angular", logo: "/logo.png", width: 80, height: 80 },
        { name: "Vue.js", logo: "/logo.png", width: 80, height: 80 },
        { name: "Java", logo: "/logo.png", width: 80, height: 80 },
        { name: "Azure", logo: "/logo.png", width: 80, height: 80 },
        { name: "MongoDB", logo: "/logo.png", width: 80, height: 80 },
      ],
    },
    {
      tabTitle: "Staff Augmentation",
      title: "IT Staff Augmentation",
      description:
        "Quickly scale your team with highly skilled professionals who integrate seamlessly into your existing workflow. Our staff augmentation services provide you with the talent you need, when you need it, ensuring rapid project advancement without long-term commitments.",
      devaiconFactor: [
        {
          value: "18+",
          label: "Years building custom solutions and applications",
          color: "#3d234b",
        },
        {
          value: "550+",
          label: "Projects Delivered",
          color: "#10B981",
        },
        {
          value: "800+",
          label: "Specialists with decades of experience",
          color: "#F59E0B",
        },
      ],
      technologies: [
        { name: "TypeScript", logo: "/logo.png", width: 80, height: 80 },
        { name: "GraphQL", logo: "/logo.png", width: 80, height: 80 },
        { name: ".NET", logo: "/logo.png", width: 80, height: 80 },
        { name: "Kubernetes", logo: "/logo.png", width: 80, height: 80 },
        { name: "PostgreSQL", logo: "/logo.png", width: 80, height: 80 },
      ],
    },
  ];

  const comparisonData = {
    headers: [
      {
        title: "Software Outsourcing",
        subtitle: "Complete project delegation",
        badge: "Turnkey Solution",
      },
      {
        title: "Dedicated Teams",
        subtitle: "Extended team integration",
        badge: "Long-term Partnership",
      },
      {
        title: "Staff Augmentation",
        subtitle: "On-demand expertise",
        badge: "Flexible Scaling",
      },
    ],
    rows: [
      {
        criteria: "Project Scope",
        values: [
          {
            text: "Comprehensive end-to-end delivery including design, development, testing, and deployment with full lifecycle management.",
          },
          {
            text: "Continuous development initiatives and ongoing product evolution with dedicated technical resources.",
          },
          {
            text: "Targeted assignments and specialized tasks requiring additional technical capacity or niche expertise.",
          },
        ],
      },
      {
        criteria: "Project Size",
        values: [
          {
            text: "Medium to Large",
            tags: ["Enterprise Scale", "Complex Systems"],
          },
          { text: "Medium to Large", tags: ["Scalable Teams", "Growth-Ready"] },
          {
            text: "Small to Medium",
            tags: ["Focused Delivery", "Agile Response"],
          },
        ],
      },
      {
        criteria: "Engagement Duration",
        values: [
          {
            text: "Long-term strategic partnership with defined project milestones and deliverable commitments.",
          },
          {
            text: "Long-term collaboration with sustained team presence and institutional knowledge development.",
          },
          {
            text: "Short-term or flexible engagement based on immediate business requirements and resource demands.",
          },
        ],
      },
      {
        criteria: "Client Involvement",
        values: [
          {
            text: "Minimal operational involvement. We manage all aspects of project execution, delivery, and quality assurance while maintaining regular strategic communication.",
          },
          {
            text: "High collaborative engagement. Direct partnership with dedicated resources requiring regular input, strategic direction, and decision-making participation.",
          },
          {
            text: "Intensive hands-on management. You maintain full oversight, provide technical direction, and integrate resources within your existing operational framework.",
          },
        ],
      },
      {
        criteria: "Control & Governance",
        values: [
          {
            text: "We maintain operational control with established governance frameworks, providing comprehensive status reporting and milestone updates.",
          },
          {
            text: "Shared governance model with collaborative decision-making. Regular synchronization on priorities, technical direction, and strategic initiatives.",
          },
          {
            text: "You retain complete operational authority. We provide technical expertise and execution capability within your established processes and methodologies.",
          },
        ],
      },
      {
        criteria: "Flexibility",
        values: [
          {
            text: "Moderate flexibility with structured change management processes. Scope modifications accommodated through formal amendment procedures.",
          },
          {
            text: "High adaptability with dynamic resource allocation. Team composition and priorities can be adjusted to evolving business requirements.",
          },
          {
            text: "Maximum flexibility with rapid scaling capabilities. Resource levels can be increased or decreased based on real-time project demands.",
          },
        ],
      },
      {
        criteria: "Team Structure",
        values: [
          {
            text: "We design and deploy optimal team architecture based on project requirements and technical complexity.",
          },
          {
            text: "Collaborative team design. We provide recommendations and best practices while you determine final structure and management approach.",
          },
          {
            text: "You define and manage all team composition, reporting structures, and operational workflows within your organization.",
          },
        ],
      },
      {
        criteria: "Risk & Accountability",
        values: [
          {
            text: "Minimal client risk exposure. We assume primary responsibility for project management, technical execution, and delivery outcomes.",
            badge: { text: "Low Risk Profile", type: "low" },
          },
          {
            text: "Balanced risk distribution contingent on internal technical leadership and management capabilities within your organization.",
            badge: { text: "Medium Risk Profile", type: "medium" },
          },
          {
            text: "Elevated client responsibility dependent on internal management expertise, technical acumen, and project complexity factors.",
            badge: { text: "Medium-High Risk", type: "high" },
          },
        ],
      },
      {
        criteria: "Cost Structure",
        values: [
          {
            text: "Fixed-price model based on comprehensive scope definition and agreed deliverables. Predictable budgeting with minimal variance.",
            badge: { text: "Fixed Investment", type: "fixed" },
          },
          {
            text: "Variable pricing based on team composition, engagement duration, and required expertise levels. Aligned with resource utilization.",
            badge: { text: "Flexible Investment", type: "flexible" },
          },
          {
            text: "Resource-based pricing model determined by the number and seniority of engaged professionals. Scalable cost structure.",
            badge: { text: "Flexible Investment", type: "flexible" },
          },
        ],
      },
    ],
    bestSuited: [
      {
        cases: [
          "Small to medium enterprises seeking to concentrate on core business operations while partnering with specialized technology providers for complete project delivery",
          "Organizations with limited internal technical capabilities requiring comprehensive development expertise and project management",
          "Companies pursuing large-scale, complex initiatives demanding full-cycle solutions from conception through deployment",
        ],
      },
      {
        cases: [
          "Growth-stage companies requiring committed, full-time technical teams for continuous product development and long-term platform maintenance",
          "Enterprises with strategic long-term technology initiatives requiring sustained development capacity and deep product knowledge",
          "Organizations seeking direct team collaboration and integration without the overhead of HR administration and recruitment",
        ],
      },
      {
        cases: [
          "Companies requiring temporary technical capacity augmentation for defined time periods without long-term employment obligations",
          "Organizations seeking to scale technical workforce dynamically while maintaining flexibility in resource allocation",
          "Enterprises with established internal teams requiring specialized expertise for specific project components or technical domains",
        ],
      },
    ],
  };

  const decisionMatrixData = {
    modelNames: [
      "Software Development Outsourcing",
      "Dedicated Teams",
      "IT Staff Augmentation",
    ],
    modelDescriptions: [
      "Complete project delegation with comprehensive lifecycle management",
      "Extended team integration with collaborative governance",
      "On-demand expertise with flexible resource allocation",
    ],
    requirements: [
      {
        requirement: "Rapid team scaling and resource deployment capabilities",
        compatibility: [false, true, true],
      },
      {
        requirement:
          "Direct team management and operational oversight authority",
        compatibility: [false, true, true],
      },
      {
        requirement:
          "Comprehensive managed solution with minimal client involvement",
        compatibility: [true, false, false],
      },
      {
        requirement:
          "Complete control over development processes and methodologies",
        compatibility: [false, true, true],
      },
      {
        requirement:
          "Long-term strategic partnership and sustained collaboration",
        compatibility: [true, true, false],
      },
      {
        requirement: "Short-term project execution with defined deliverables",
        compatibility: [false, false, true],
      },
      {
        requirement: "End-to-end project outsourcing with turnkey delivery",
        compatibility: [true, false, false],
      },
      {
        requirement: "Deep integration with existing organizational teams",
        compatibility: [false, true, true],
      },
      {
        requirement: "Specialized expertise for specific technical domains",
        compatibility: [false, false, true],
      },
    ],
  };

  return (
    <main>
      <PageHero
        title="Outsourcing, Dedicated Teams, or Augmentation – Choose What Brings You the Most Value at Lower Costs"
        subtitle="Choosing the right engagement model can reduce your costs, increase your confidence, and ensure timely project completion."
        buttonText="Discover More"
        buttonLink="#engagement-models"
        height="min-h-[600px]"
      />

      <EngagementModelsSection
        title="Why Different Engagement Models?"
        highlightText="Engagement Models"
        highlightColor="#3d234b"
        descriptions={[
          "Different engagement models exist because of the diverse IT needs in the industry. Every project is unique, and so are its needs. At Devaicon, we offer three different engagement models so you can choose the one that fits your unique project requirements and provides the best value in terms of time, money, and results.",
          "Here's a brief overview of what each engagement model covers and who should opt for which model.",
        ]}
        models={engagementModelsData}
        tabBarBg="bg-gradient-to-br from-purple-50 to-blue-50"
      />

      <EngagementModelComparison
        title="How to Choose the Right Engagement Model"
        highlightText="Engagement Model"
        highlightColor="#3d234b"
        description="Understand how each engagement model differs based on project complexity, cost, and risk management, and pick the one that aligns with your business goals."
        headers={comparisonData.headers}
        rows={comparisonData.rows}
        bestSuited={comparisonData.bestSuited}
      />

      <EngagementDecisionMatrix
        description="Alternatively, answer these simple questions to quickly determine the best engagement model based on your preferences for control, management, and project requirements."
        modelNames={decisionMatrixData.modelNames}
        modelDescriptions={decisionMatrixData.modelDescriptions}
        requirements={decisionMatrixData.requirements}
      />
    </main>
  );
}
