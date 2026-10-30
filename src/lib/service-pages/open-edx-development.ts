import { GraduationCap } from "lucide-react";
import { callout, cta, doc, h2, h3, ol, p, table, ul } from "./doc";
import { OPEN_EDX_CTAS, OPEN_EDX_PARENTS } from "./open-edx-shared";
import type { ServicePage } from "./types";

export const OPEN_EDX_DEVELOPMENT: ServicePage = {
  path: "/capabilities/open-edx-services/open-edx-development",
  title: "Open edX Development & Customization",
  subtitle:
    "Custom features, XBlocks, branded themes, integrations and SSO for Open edX — engineered through the platform's own extension points, so your platform keeps upgrading cleanly.",
  label: "Open edX Services",
  icon: GraduationCap,
  heroImage: "/feature-development.webp",
  heroButtonText: "Talk to an Open edX expert",
  parents: OPEN_EDX_PARENTS,
  seo: {
    title: "Open edX Development & Customization Services",
    description:
      "Open edX development services: custom XBlocks, plugins, MFE theming, SSO, LTI and integrations, analytics and mobile apps, all built to stay upgrade-safe.",
    keywords: [
      "open edx development",
      "open edx development services",
      "open edx customization",
      "open edx xblock development",
      "open edx theme",
      "open edx integration",
      "open edx developer",
      "open edx vs moodle",
    ],
  },
  serviceType: "Open edX software development and customization",
  ctas: OPEN_EDX_CTAS,
  closingCtaId: "development-closing",
  body: doc(
    p(
      "**Open edX development** is the work of shaping the open-source Open edX platform around your organisation: your brand, your course formats, your sign-in, and the systems your learners and administrators already use. Done well, it gives you a learning platform that feels built for you while staying close enough to the community code to keep receiving its improvements."
    ),
    p(
      "Devaicon's engineers work across the whole Open edX stack — Python and Django on the server, React micro-frontends in the browser — and build every customization through the platform's supported extension points rather than by editing its core."
    ),

    h2("Open edX development services we provide"),
    h3("Branding, themes and UI/UX"),
    p(
      "Open edX's learner and authoring screens are React micro-frontends (MFEs). We apply your brand through a brand package and the Paragon design system — colours, typography, logos and components — and redesign key journeys such as the course catalogue, learner dashboard and course home. Older server-rendered pages are themed to match, so the experience is consistent end to end."
    ),
    h3("Custom XBlocks and course components"),
    p(
      "XBlocks are the building blocks of Open edX courses. When the built-in problem types are not enough, we build new ones: interactive simulations, scenario-based assessments, custom graders, embedded tools and content types specific to your subject area — all usable by your course teams in Studio without developer help."
    ),
    h3("Plugins, events and feature development"),
    p(
      "New capabilities are delivered as Django app plugins, Open edX events and filters, and frontend plugin slots. That covers custom enrolment rules, learner dashboards, reporting views, workflow automation and administrator tools — packaged separately from the platform so they can be versioned, tested and carried forward to each new release."
    ),
    h3("Integrations and single sign-on"),
    ul(
      "**Single sign-on** with Microsoft Entra ID, Google Workspace, Okta or any identity provider that speaks SAML, OAuth 2.0 or OpenID Connect",
      "**LTI 1.3** to embed external tools in your courses, or to deliver Open edX content inside another LMS",
      "**HR, CRM and student information systems** for enrolments, completions and learner records",
      "**Payments and e-commerce** for selling courses, programmes and certificates",
      "**Video platforms** such as YouTube, Vimeo or private streaming services"
    ),
    h3("Analytics and reporting"),
    p(
      "We deploy and extend Aspects, the Open edX analytics stack built on ClickHouse and Apache Superset, and connect learning data to Power BI, Tableau or your data warehouse — so you can report on enrolment, engagement, completion and assessment results alongside your business data."
    ),
    h3("Mobile apps"),
    p(
      "Open edX has open-source native apps for iOS and Android. We build and publish them under your own brand, connected to your platform, so learners can study and download content on the go."
    ),

    h2("Customize Open edX without forking the core"),
    callout(
      h3("Why this matters for your budget"),
      p(
        "The most expensive Open edX projects are the ones that changed the platform's core code. Every new release then has to be merged by hand, upgrades slip from weeks to months, and security fixes wait. We keep your changes in plugins, XBlocks, themes and configuration, so upgrading means updating the platform underneath them — not rewriting your features."
      )
    ),
    p("Choosing the right extension point is the first design decision we make on every request:"),
    table(
      ["What you need", "How we build it", "Effect on upgrades"],
      [
        ["Your brand across the platform", "Brand package, design tokens and MFE customization", "Minimal: carried forward with each release"],
        ["A new kind of course activity", "Custom XBlock", "Low: versioned and installed separately"],
        ["Changed behaviour on the server", "Django plugin using Open edX events and filters", "Low: uses supported, documented hooks"],
        ["New or changed screens", "Frontend plugin slots or a custom micro-frontend", "Low to moderate, depending on the screen"],
        ["A change the hooks cannot reach", "Agreed with you first, then contributed upstream where possible", "Kept as small and as temporary as possible"],
      ]
    ),
    cta("development-inline"),

    h2("How an Open edX development project runs"),
    ol(
      "**Discovery** — we review your goals, current platform and integrations, and agree what success looks like",
      "**Solution design** — each requirement is mapped to an extension point, with an estimate and a delivery plan",
      "**Build** — work happens in a Tutor development environment, in short iterations you can review",
      "**Testing** — automated tests plus acceptance testing on a staging copy of your platform",
      "**Release** — deployment in an agreed window, with documentation for your administrators",
      "**Support** — ongoing fixes and upgrades through our [managed Open edX hosting](/capabilities/open-edx-services/open-edx-hosting) or your own team"
    ),

    h2("Arabic and bilingual Open edX platforms"),
    p(
      "Open edX supports right-to-left layouts and Arabic translations out of the box, but bilingual platforms still need care: themes that mirror correctly, course content in both languages, and certificates, emails and custom features that are translated too. Based in the UAE, we build Arabic-English platforms and test every screen and feature in both directions."
    ),

    h2("Open edX or Moodle?"),
    p(
      "Both are mature open-source learning platforms, and the better choice depends on how you teach. Open edX is built for scale and structured online courses; Moodle grew out of the classroom and is very flexible for blended teaching."
    ),
    table(
      ["", "Open edX", "Moodle"],
      [
        ["Best suited to", "Online academies, MOOCs, certification and large self-paced programmes", "Schools, universities and blended classroom teaching"],
        ["Course authoring", "Studio, with structured units, problem types and XBlocks", "Activities and resources arranged within a course page"],
        ["Technology", "Python, Django and React micro-frontends", "PHP"],
        ["Extending it", "XBlocks, Django plugins, events, filters and frontend plugin slots", "A large directory of community plugins"],
        ["Scaling", "Designed for very large learner numbers, with Kubernetes deployments", "Scales well, typically with more tuning at very large sizes"],
      ]
    ),
    p(
      "If you are weighing the two, we are happy to look at your requirements and give you an honest recommendation — including when Open edX is not the right fit. See our full range of [Open edX services](/capabilities/open-edx-services) for what we support after launch."
    )
  ),
  faqs: [
    {
      question: "What programming languages is Open edX built with?",
      answer:
        "The Open edX back end is written in Python using the Django framework, with MySQL, MongoDB and Redis for storage. The learner and authoring interfaces are React micro-frontends. Course components called XBlocks are written in Python, with HTML, CSS and JavaScript for their interfaces.",
    },
    {
      question: "Will customizations break when Open edX is upgraded?",
      answer:
        "Not if they are built through the platform's extension points. We deliver features as plugins, XBlocks, themes and configuration rather than edits to the core code, and test them against each new release on a staging copy before production is upgraded.",
    },
    {
      question: "Can you work on an Open edX platform another vendor built?",
      answer:
        "Yes. We start with a code and infrastructure review to understand what has been changed and where. Where earlier work modified the core platform, we recommend a plan to move it into plugins so future upgrades become manageable.",
    },
    {
      question: "How long does an Open edX customization project take?",
      answer:
        "It depends on scope. A branded launch with standard integrations is usually measured in weeks, while custom XBlocks, complex integrations or new learner experiences take longer. We give a scoped estimate after discovery, before any build starts.",
    },
    {
      question: "Can Open edX use our Microsoft Entra ID (Azure AD) sign-in?",
      answer:
        "Yes. Open edX supports single sign-on over SAML and OAuth 2.0 / OpenID Connect, so learners can sign in with Microsoft Entra ID, Google Workspace or another identity provider. Accounts can be created automatically on first sign-in.",
    },
    {
      question: "Do you build custom XBlocks?",
      answer:
        "Yes. We design and build XBlocks for interactive content, assessments and grading that the built-in components do not cover, and package them so your course teams can add them to courses in Studio.",
    },
  ],
  relatedHeading: "Related Open edX services",
  related: [
    {
      title: "Managed Open edX Hosting",
      description: "Secure, monitored hosting on AWS, Azure or in the UAE, with upgrades and support included.",
      path: "/capabilities/open-edx-services/open-edx-hosting",
      image: "/hosting.webp",
    },
    {
      title: "All Open edX Services",
      description: "Hosting, customization, course development, analytics and multi-tenant deployments in one place.",
      path: "/capabilities/open-edx-services",
      image: "/openedx.webp",
    },
    {
      title: "Engagement Models",
      description: "Fixed-scope projects, dedicated teams or ongoing managed services — choose how we work together.",
      path: "/engagement-models",
      image: "/managed-services.webp",
    },
  ],
};
