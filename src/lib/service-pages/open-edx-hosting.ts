import { callout, cta, doc, h2, h3, ol, p, table, ul } from "./doc";
import { OPEN_EDX_CTAS, OPEN_EDX_PARENTS } from "./open-edx-shared";
import type { ServicePage } from "./types";

export const OPEN_EDX_HOSTING: ServicePage = {
  path: "/capabilities/open-edx-services/open-edx-hosting",
  title: "Managed Open edX Hosting",
  subtitle:
    "Secure, monitored Open edX hosting on AWS, Azure or your own infrastructure — deployed with Tutor, upgraded with every named release, and supported by engineers who work on the platform every day.",
  label: "Open edX Services",
  heroImage: "/hosting.webp",
  parents: OPEN_EDX_PARENTS,
  seo: {
    title: "Managed Open edX Hosting & Support",
    description:
      "Managed Open edX hosting on AWS, Azure or on-premise, including UAE data residency. Tutor deployments, release upgrades, backups, monitoring and support.",
    keywords: [
      "open edx hosting",
      "managed open edx hosting",
      "open edx hosting cost",
      "open edx tutor deployment",
      "open edx upgrade",
      "open edx support",
      "open edx uae",
    ],
  },
  serviceType: "Open edX hosting and managed services",
  ctas: OPEN_EDX_CTAS,
  closingCtaId: "hosting-closing",
  body: doc(
    p(
      "**Managed Open edX hosting** means a team runs the platform for you: the servers, the databases, the security patches, the backups, and the upgrade to each new Open edX release. You keep full control of your courses, learners and data, without needing in-house DevOps engineers who understand Open edX's many moving parts."
    ),
    p(
      "Devaicon deploys and operates Open edX with Tutor, the community's official distribution, on the cloud of your choice — including UAE-based regions when learner data has to stay in the country."
    ),

    h2("What our managed Open edX hosting includes"),
    ul(
      "**Production-grade deployment** with Tutor, configured for your domain, email delivery, SSL certificates and content delivery network",
      "**Separate development, staging and production environments**, so changes are tested before learners see them",
      "**Round-the-clock monitoring** of uptime, response times, background workers and disk, with alerting to our engineers",
      "**Automated backups** of MySQL, MongoDB and uploaded course files, with restores rehearsed rather than assumed",
      "**Security patching** of the operating system, containers and Open edX itself, including community security releases",
      "**Upgrades to every named Open edX release**, tested against your theme, plugins and custom XBlocks first",
      "**Scaling** of servers and workers ahead of enrolment peaks, exam windows and course launches",
      "**A support desk** for your administrators and course teams, with agreed response times"
    ),

    h2("Where your Open edX platform can run"),
    p(
      "Open edX is open source, so you are never tied to one hosting provider. We run it wherever your security, budget and data-residency rules point:"
    ),
    table(
      ["Hosting option", "Best for", "What Devaicon manages"],
      [
        [
          "Devaicon-managed cloud (AWS or Azure)",
          "Organisations that want one team accountable for the whole platform",
          "Everything: infrastructure, Open edX, upgrades, backups and support",
        ],
        [
          "Your own cloud account",
          "Teams with cloud contracts, credits or compliance rules of their own",
          "Deployment and day-to-day operation inside your account, with your team keeping ownership",
        ],
        [
          "UAE cloud regions",
          "Government, education and regulated organisations that must keep learner data in the UAE",
          "The same managed service, deployed in UAE-based regions such as AWS Middle East (UAE) or Azure UAE North",
        ],
        [
          "On-premise or private data centre",
          "Networks with no public cloud access",
          "Installation, hardening and runbooks, with remote or on-site operational support",
        ],
      ]
    ),

    h2("Single server or Kubernetes: choosing the architecture"),
    p(
      "Tutor can run Open edX in two shapes, and the right one depends on how many people use the platform at the same moment rather than how many accounts it holds."
    ),
    h3("Single server with Docker Compose"),
    p(
      "Every Open edX service runs in containers on one virtual machine. It is the fastest way to launch and the cheapest to run, and it suits pilots, internal academies and platforms with modest numbers of learners online at once. As a practical starting point a single server needs around 4 virtual CPUs and 8 GB of memory, more once video processing, many courses or busy cohorts are added."
    ),
    h3("Kubernetes for scale and high availability"),
    p(
      "For larger audiences, Tutor deploys Open edX to a Kubernetes cluster with managed databases and storage. Services scale independently, a failed node no longer takes the platform down, and upgrades can roll out with far less disruption. It costs more to run, so we recommend it when your concurrency, uptime targets or growth plans justify it."
    ),
    callout(
      h3("Not sure which you need?"),
      p(
        "We size platforms from three numbers: peak concurrent learners, the amount of video and file content, and the uptime you have promised your users. Share them with us and we will recommend an architecture with its running costs before anything is built."
      )
    ),

    h2("Upgrades to every named Open edX release"),
    p(
      "The Open edX community ships two named releases a year, each with new features, accessibility work and security fixes. Falling several releases behind makes every later upgrade harder, so we keep your platform current with a repeatable process:"
    ),
    ol(
      "Audit your customizations — theme, plugins, XBlocks and configuration — against the new release's changes",
      "Upgrade a staging copy of your platform using a recent snapshot of real data",
      "Test the journeys that matter: sign-in, enrolment, course content, grading, certificates and payments",
      "Rehearse the data migrations and time them, so the maintenance window is known in advance",
      "Upgrade production in an agreed window, with a tested rollback plan ready if it is needed"
    ),
    cta("hosting-inline"),

    h2("Monitoring, backups and security"),
    p(
      "A learning platform is most visible when it fails during an exam or a launch. Our operations work is designed around preventing exactly that:"
    ),
    ul(
      "Uptime and performance checks from outside your network, plus monitoring of the LMS, Studio, background workers and databases inside it",
      "Daily backups kept off the server they protect, with retention set to your policy",
      "Hardened servers, least-privilege access and encrypted connections throughout",
      "Prompt application of Open edX security releases and operating-system patches",
      "Logs and incident notes you can share with your own security and audit teams"
    ),

    h2("What affects the cost of Open edX hosting"),
    p(
      "The Open edX software itself is free. What you pay for is the infrastructure it runs on and the people who keep it running. The main factors are:"
    ),
    ul(
      "**Concurrent learners** — the biggest driver of server size, far more than total registered users",
      "**Video and file storage** — whether videos are hosted on the platform or streamed from a service such as YouTube or Vimeo",
      "**Architecture** — a single server costs far less than a highly available Kubernetes cluster",
      "**Number of environments** — staging and development copies add infrastructure cost but protect production",
      "**Region** — prices differ between cloud regions, including in-country UAE regions",
      "**Support coverage** — business-hours support versus round-the-clock cover, and how much course-team help you need"
    ),
    p(
      "We provide a fixed monthly quote once the platform is sized, so the cost is known before you commit. You can also compare our [engagement models](/engagement-models) for ongoing support."
    ),

    h2("Moving an existing Open edX site to Devaicon"),
    p(
      "Already running Open edX on another host, or on an install your team built years ago? We migrate platforms with their courses, learner accounts, grades and certificates intact. We start with a health check of your current setup, move it onto a supported Tutor deployment, upgrade it to a current release where needed, and switch over in a planned window. If the platform also needs new features or a fresh look, our [Open edX development and customization](/capabilities/open-edx-services/open-edx-development) team can work alongside the migration."
    )
  ),
  faqs: [
    {
      question: "Is Open edX free to use?",
      answer:
        "Yes. Open edX is open-source software, so there is no licence fee. The costs are the servers it runs on and the expertise needed to install, secure, upgrade and support it — which is what managed hosting covers.",
    },
    {
      question: "What is Tutor in Open edX?",
      answer:
        "Tutor is the official, community-supported way to install and run Open edX. It packages the platform's services as Docker containers and can deploy them to a single server or to a Kubernetes cluster. All of our deployments use it, which keeps your platform close to the community standard and easier to upgrade.",
    },
    {
      question: "Can you host Open edX in the UAE?",
      answer:
        "Yes. We can deploy Open edX in UAE-based cloud regions, such as AWS Middle East (UAE) or Azure UAE North, or on infrastructure inside your own data centre, so learner data stays in the country.",
    },
    {
      question: "How often does Open edX need upgrading?",
      answer:
        "The community publishes two named releases a year. We recommend moving to each one within a few months of release; skipping several makes later upgrades larger and riskier, and older releases stop receiving security fixes.",
    },
    {
      question: "Can you manage Open edX inside our own AWS or Azure account?",
      answer:
        "Yes. We can deploy and operate the platform inside your cloud account so that you keep ownership of the infrastructure and billing, while we handle the day-to-day running, monitoring and upgrades.",
    },
    {
      question: "Should we self-host Open edX or use a managed service?",
      answer:
        "Self-hosting works when you have engineers with Python, Django, Docker and Open edX experience who can own upgrades and incidents. If that expertise is not in-house, a managed service is usually cheaper than hiring for it and removes the risk of the platform depending on one person.",
    },
    {
      question: "Does Open edX support Arabic?",
      answer:
        "Yes. Open edX supports right-to-left languages, and both the learner and authoring interfaces can be shown in Arabic. We configure languages per site, and can run Arabic and English side by side.",
    },
  ],
  related: [
    {
      title: "Open edX Development & Customization",
      description: "Custom features, XBlocks, branded themes, integrations and SSO, built to survive upgrades.",
      path: "/capabilities/open-edx-services/open-edx-development",
      image: "/feature-development.webp",
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
