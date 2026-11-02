import { Target } from "lucide-react";
import type { Cta } from "@/lib/blog/types";
import { callout, doc, h2, h3, img, ol, p, table, ul } from "./doc";
import type { ServicePage } from "./types";

const CTAS: Record<string, Cta> = {
  "consulting-closing": {
    id: "consulting-closing",
    name: "consulting-closing",
    heading: "Start your strategy-to-execution conversation",
    body: "Bring your answers to the readiness checklist, and we'll focus on the processes you want to change and your business goals.",
    buttonLabel: "Start a project",
    buttonUrl: "/contact-us",
    style: "banner",
  },
};

export const CONSULTING_TRANSFORMATION: ServicePage = {
  path: "/capabilities/consulting-transformation",
  title: "Strategic Consulting & Transformation for Organisations in Pakistan",
  subtitle:
    "Decide where your organisation should go, then change the processes, systems and habits needed to get there.",
  label: "Consulting & Transformation",
  icon: Target,
  heroImage: "/advisory.webp",
  ogImage: "/strategic-consulting-transformation-pakistan-hero.webp",
  heroButtonText: "Talk to a transformation expert",
  parents: [
    { name: "Home", path: "/" },
    { name: "Capabilities", path: "/whatwedo" },
  ],
  seo: {
    title: "Strategic Consulting & Transformation in Pakistan",
    description:
      "Strategic consulting & transformation for organisations in Pakistan: a clear roadmap, vendor-neutral technology advice and delivery. Talk to Devaicon.",
    keywords: [
      "strategic consulting & transformation",
      "strategy consulting Pakistan",
      "digital transformation consulting Pakistan",
      "transformation roadmap",
      "technology strategy and advisory",
      "strategy execution",
    ],
  },
  serviceType: "Strategic Consulting & Transformation",
  areaServed: "PK",
  ctas: CTAS,
  closingCtaId: "consulting-closing",
  body: doc(
    p(
      "Strategic consulting & transformation helps you decide where your organisation should go. It then changes the processes, systems and habits needed to get there. This guide is for leaders in Pakistan who have a strategy on paper but see little change on the ground. It covers five areas: how to tell whether you need strategy, transformation or both; a five-step model with decision gates; the KPIs to track; the risks to manage; and a checklist to test your readiness before you commit budget."
    ),
    callout(
      p(
        "**Quick answer:** Strategic consulting and transformation is the work of deciding where an organisation should go, then changing how it operates to get there. Strategy consulting sets the direction through corporate strategy, the business model and digital strategy. Transformation turns those strategic plans into new processes, systems, organisational structures and working habits. Change management and measured results make sure the strategy is actually carried out."
      )
    ),

    h2("What is strategic consulting and transformation?"),
    p(
      "It is one piece of work with two halves. The first half, strategy consulting, settles your long-term goals, the customer segments you serve and the new business areas worth entering. The second half changes processes, technology and culture so the organisation can deliver those choices. It then measures whether it did."
    ),
    p(
      "The two halves fail when they are separated. A strategy without execution stays a slide deck that nobody acts on. A transformation without a strategy automates the wrong things, often at high cost. It also leaves you with systems that solve yesterday's problems."
    ),
    p(
      "Strategy execution is where most of the value is won or lost. Fundamental changes to how people work take longer than the decision to make them. For that reason, the people who set the direction should stay involved until the change is in place."
    ),
    p(
      "The market is large and still growing. [Mordor Intelligence reports](https://www.mordorintelligence.com/industry-reports/global-strategic-consulting-services-market) that the Strategic Consulting Services Market, worth USD 77.53 billion in 2026, is growing at a CAGR of 4.25% to reach USD 95.49 billion by 2031."
    ),
    p(
      "Devaicon is ISO 27001 certified and an AWS partner. We have a 95% client satisfaction rate, a Net Promoter Score of 81.8 and offices in Sharjah (UAE) and Multan (Pakistan)."
    ),

    h2("Strategy, management or transformation consulting: which do you need?"),
    img(
      "/strategy-vs-transformation-consulting-decision-tree.webp",
      "Strategy, management or transformation consulting: which do you need?",
      "Answer five questions to see which engagement fits."
    ),
    p(
      "The right engagement depends on whether your problem is direction, performance or delivery. The table below compares the three types on points you can check against your own situation."
    ),
    table(
      ["Criterion", "Strategy consulting", "Management consulting", "Transformation & technology advisory"],
      [
        [
          "Core question it answers",
          "Where should we compete, and how?",
          "How can the current organisation run better?",
          "How do we change processes and systems to deliver the strategy?",
        ],
        [
          "Typical scope",
          "Corporate strategy, business model, market choices",
          "Operations, organisational structures, cost and performance",
          "Process redesign, systems, tool selection, change management",
        ],
        [
          "Main deliverables",
          "Strategic plans with clear business objectives",
          "An improvement plan and operating changes",
          "A transformation roadmap, tool selection and implemented systems",
        ],
        [
          "Typical trigger",
          "New business direction, new leadership or a market shift",
          "Falling margins, slow operations or structural problems",
          "Outdated systems, or a strategy that has stalled",
        ],
        [
          "Who it suits",
          "Boards and executive teams facing a choice of direction",
          "COOs fixing performance within a stable model",
          "Leaders with a direction who need it carried out",
        ],
        [
          "How success is measured",
          "Leadership commits to one direction; market results follow",
          "Efficiency and performance measures",
          "Adoption, cycle time and benefits realised against the ROI case",
        ],
      ]
    ),
    h3("Five questions to diagnose what you need"),
    p("Answer these honestly before you speak to any adviser. Each one tests a different gap."),
    ol(
      "Do your leaders agree on where the business should compete in three to five years? Disagreement here undermines every later decision.",
      "Is there a written strategy with named owners and measures? A strategy without owners is an intention, not a plan.",
      "Do your current systems and processes support that strategy? If staff work around the systems, the answer is no.",
      "Do you have people in-house who can run a change across several teams? Running daily operations is a different skill from running a programme.",
      "Can you measure progress today? Without a baseline, you cannot prove that anything improved."
    ),
    p("Use the answers to choose:"),
    ul(
      "If you answered no to question 1 or 2, start with strategy. Building systems before the direction is agreed wastes money.",
      "If you answered yes to 1 and 2 but no to 3, 4 or 5, choose transformation. The direction is set and the gap is delivery.",
      "If your answers are mixed, choose a combined strategy-to-execution engagement. This sharpens the strategy and carries it through delivery in one programme."
    ),
    h3("What is the difference between strategy consulting and management consulting?"),
    p(
      "Strategy consulting decides direction: which markets, business model and long-term goals an organisation should pursue. Management consulting improves how the existing organisation runs, including operations, organisational structures, human capital strategies and performance. Transformation consulting connects the two by changing processes, technology and culture to deliver the strategy."
    ),
    p(
      "In practice the lines blur. A change of direction usually forces a change of structure too. Ask any adviser which of the three parts they will own and which they will hand back to you."
    ),

    h2("What does strategic consulting and transformation cover?"),
    p(
      "It covers the strategy disciplines that set direction and the transformation and technology work that delivers it. The first part below explains the field. The second part sets out what we deliver."
    ),
    h3("What does a strategy consultant do?"),
    p(
      "A strategy consultant helps leaders decide where and how to compete. They analyse the market, customer segments, value chain and internal capabilities. They frame realistic options, build strategic plans with clear business objectives and help leadership commit to one direction. The organisation can then turn that direction into an executable roadmap."
    ),
    p("Strategy consulting services usually span several disciplines:"),
    ul(
      "Corporate strategy: which businesses to be in and where to put capital and management attention.",
      "Business model transformation: changing how you create and earn value, for example moving from one-off sales to service contracts.",
      "Digital strategy: deciding where data and technology should change the customer offer and the operation. Sound digital strategies start from a business problem, not a product.",
      "Organisational strategy and human capital strategies: structure, roles, skills and incentives.",
      "Value chain and supply chain strategy: which activities to own, outsource or automate."
    ),
    p("Pricing, market entry and M&A work are related fields, among others. They are not the focus of this page."),
    h3("Digital transformation consulting"),
    p(
      "We assess and redesign business processes using modern technology. The aim is to move organisations from outdated systems to efficient, scalable digital operations, guided by a clear transformation roadmap. Transformation is less about technology than about how people work. The work therefore covers finding inefficiencies, designing better processes, selecting suitable tools and managing the cultural change that adoption depends on."
    ),
    h3("Technology strategy and advisory"),
    p(
      "Our advisory work covers system audits, architecture planning, tool selection and long-term technology roadmaps. The guidance is independent and practical, based on your context, constraints and goals. Its purpose is to help you avoid vendor lock-in, technical debt and costly mistakes."
    ),
    p(
      "When the plan moves to delivery, we work across AI & Machine Learning, NLP, Computer Vision, Enterprise Chatbots, Data Pipeline Design, Power Platform, Dynamics 365 and Microsoft Fabric. We use a platform where it fits the process better than a fresh build. For custom work, our engineers use Python and Django on the server and React in the browser. You can read more about our [AI and automation services in Pakistan](/ai-automation-services-pakistan)."
    ),

    h2("From strategy to execution: a five-step engagement model"),
    img(
      "/strategy-to-execution-transformation-roadmap.webp",
      "From strategy to execution: a five-step engagement model: The five steps and their decision gates",
      "Each step ends in a decision gate before the next begins."
    ),
    p(
      "A strategy-to-execution engagement works best as five steps. Each step ends in a decision gate where you choose to continue, adjust or stop. Gates protect your budget, because each one forces a decision based on evidence rather than momentum."
    ),
    p(
      "The steps map onto [Devaicon's three-phase approach](/whatwedo). Assess & Envision begins with business discovery and turns insights into business requirements. It then uses gap-fit analysis and a solution demonstration, and quantifies benefits with an ROI assessment. Diagnose, Strategise and Roadmap sit in that phase. Execute sits in Build & Implement, and Measure sits in Run & Optimise."
    ),
    h3("The five steps and their decision gates"),
    ol(
      "Diagnose. Start with business discovery: current processes, systems, pain points and their costs. The deliverable is a current-state assessment. The gate is an agreed problem statement, because a team that disagrees on the problem will argue about every later step.",
      "Strategise. Weigh realistic options against your business objectives and constraints. The deliverable is a chosen direction with named owners. The gate is leadership sign-off.",
      "Roadmap. Use gap-fit analysis to compare what current systems do with what the strategy needs. Then sequence the changes into a transformation roadmap with an ROI case. The gate is a funding decision for the first stage only.",
      "Execute. Build, configure, integrate and train, with change management running alongside rather than after. The gate is that agreed adoption criteria are met. A common mistake is to declare success at go-live, when users may still be working around the new system.",
      "Measure. Track the agreed KPIs, fix what is not working and refine the process. The gate is a choice to extend, adjust or close the programme. Strategy execution depends on this step, because it shows whether the plan delivered what it promised."
    ),
    h3("Which KPIs to track at 90 days and 12 months"),
    p(
      "Early measures show whether the change is taking hold. Later measures show whether it paid off. Set baselines during Diagnose, or you will have nothing to compare against."
    ),
    table(
      ["At 90 days", "At 12 months"],
      [
        ["Adoption of the new process", "Cycle time for core processes"],
        ["Data quality in the new system", "Cost to serve"],
        ["Milestones delivered against the roadmap", "Customer satisfaction"],
        ["User issues logged and resolved", "Employee satisfaction"],
        ["Training completion", "Share of processes automated"],
        ["Use of old workarounds", "Benefits realised against the ROI case"],
      ]
    ),
    h3("How long does a transformation project take?"),
    p(
      "It depends on scope. A diagnosis or a tool selection is much shorter than a rollout across several systems and departments. Phase the work so each stage delivers value on its own. Then a delay in one stage does not hold back every benefit."
    ),
    p(
      "The choices that most affect duration are the number of systems involved, the state of your data and how much time your own people can give."
    ),

    h2("Is transformation consulting worth it for a Pakistani organisation?"),
    p(
      "It is worth it when the cost of standing still is clear and each step of the roadmap is tied to a measurable outcome. An ROI assessment before any build, vendor-neutral tool selection and agreed PKR or USD invoicing terms help keep the investment controlled and the results visible."
    ),
    h3("Where the value comes from"),
    p(
      "Value usually comes from removing costs you already carry. These include manual re-keying between systems, slow decisions caused by scattered data and rising maintenance on ageing software. Disconnected systems become increasingly expensive to keep running as they age."
    ),
    p(
      "Many mid-size and large organisations in Pakistan carry legacy systems built up over years. They often have small in-house teams that cannot run a change across several departments. They also face vendors who each push their own product. Independent advice matters most in that position."
    ),
    h3("Risks to manage: lock-in, technical debt and change fatigue"),
    ul(
      "Vendor lock-in: choose tools against your process requirements, and check data export and integration options before you sign.",
      "Technical debt: avoid quick custom fixes on top of old systems without a plan to retire them.",
      "Buying tools before fixing the process: redesign the process first, or you will automate the waste.",
      "Change fatigue: limit how many changes hit the same team at once, and show early results."
    ),
    p(
      "Our advisory aims to help organisations avoid vendor lock-in, technical debt and costly mistakes. Use platforms only where a platform fits the process better than a fresh build."
    ),
    h3("Invoicing in PKR or USD"),
    p(
      "Agree PKR or USD invoicing in the contract, along with how exchange movements are handled. Settling this at the start prevents disputes partway through the programme. It also makes your budget easier to defend."
    ),
    p(
      "This applies across the [industries we work with](/industries): banking and financial services, public sector, education and training, tourism and hospitality, trading and manufacturing, retail, professional services and non-profit organisations."
    ),

    h2("Are you ready to start? A pre-engagement checklist"),
    p(
      "You are ready to start when you can answer most of the points below. Gaps are not a reason to wait. They show what the first weeks of an engagement need to settle."
    ),
    h3("Readiness checklist"),
    ul(
      "A named executive sponsor with authority to make decisions.",
      "Agreed business objectives for the change.",
      "A list of current systems and who owns each one.",
      "Known pain points, with a rough cost for each.",
      "An understanding of where your data sits and how reliable it is.",
      "A budget range and a clear approval route.",
      "An internal transformation lead with time set aside.",
      "Willingness to invest in change management and training.",
      "An agreed way to measure success.",
      "Written security and data-handling requirements for any outside partner."
    ),
    h3("Do you need one consultant or a full project team?"),
    p(
      "A single adviser suits a diagnosis, a system audit or a tool selection. A cross-functional team suits delivery across several systems, where design, build, integration and training run in parallel. Match the team to the step you are in, not to the whole programme at once."
    ),
    p("You can [compare engagement models](/engagement-models) to see which structure fits your project."),
    h3("Can your team lead the transformation internally?"),
    p(
      "Your team can lead it if three things are in place: a dedicated lead, experience delivering change across several teams, and independent technology judgement. If any of these is missing, outside support fills that specific gap. Your people should still own the result. Strategies handed entirely to outsiders rarely survive after they leave."
    ),

    h2("Why organisations choose Devaicon for transformation"),
    p(
      "The firm that advises you also builds and runs what it recommends. We work through Assess & Envision, Build & Implement, and Run & Optimise, so nobody hands over a report and walks away."
    ),
    ul(
      "Track record: a journey of 5 years, with 100+ projects and 20+ tech partnerships.",
      "Credentials: ISO 27001 certified, the international standard for information security management. We are an AWS partner and hold the Clutch Champion, Clutch Leader and Best of Clutch awards.",
      "Client results: zero detractors and an average client relationship of 2 years, alongside the satisfaction and NPS scores above.",
      "Presence and support: offices in Sharjah and Multan, deep UAE & GCC knowledge and 24/7 support."
    ),
    p(
      "If your data will pass through an outside partner, you can [review our security practices](/security) before any work begins, and you can do so knowing we have 5 years and 100+ projects behind us."
    ),

    h2("Start your strategy-to-execution conversation"),
    p(
      "If your strategy has stalled or your systems are holding it back, strategic consulting & transformation is the next step. Get in touch with Devaicon through the [contact page](/contact-us) or by email at [contact@devaicon.com](mailto:contact@devaicon.com) to discuss the processes you want to change and your business goals."
    ),
    p(
      "Bring your answers to the readiness checklist to the first conversation. That lets the discussion focus on your situation rather than on general questions."
    )
  ),
  faqs: [],
  relatedHeading: "Related services",
  related: [
    {
      title: "AI Automation Services in Pakistan",
      description: "WhatsApp support in Urdu and Roman Urdu, document processing and workflow automation across your systems.",
      path: "/ai-automation-services-pakistan",
      image: "/implementing-ai-automation.webp",
    },
    {
      title: "Intelligent Systems & Data",
      description: "AI and machine learning, NLP, computer vision and data pipelines built for production, not demos.",
      path: "/capabilities/intelligent-systems-data",
      image: "/artificial-intelligence.webp",
    },
    {
      title: "Engagement Models",
      description: "Fixed-scope projects, dedicated teams or ongoing managed services — choose how we work together.",
      path: "/engagement-models",
      image: "/managed-services.webp",
    },
  ],
};
