/**
 * Capabilities data configuration for all capability pages
 * Centralized data structure for all service categories
 */

export const CAPABILITIES_CONFIG = {
  intelligentSystemsData: {
    id: "intelligent-systems-data",
    title: "Intelligent Systems & Data",
    subtitle:
      "Building systems that think, learn, and make decisions using data rather than gut feeling. Our solutions encompass AI, machine learning, data analytics, natural language processing, computer vision, and immersive AR/VR technologies.",
    cards: [
      {
        id: "artificial-intelligence-machine-learning",
        title: "Artificial Intelligence & Machine Learning",
        icon: "Brain",
        iconAlt: "AI & ML Icon",
        image: "/artificial-intelligence.webp",
        description:
          "Custom AI models built to solve real business problems, not demo projects. This includes predictive systems, recommendation engines, automation logic, and intelligent decision support tailored to your workflows.",
        solutionText: [
          "Custom predictive models for business forecasting",
          "Recommendation engines for personalized experiences",
          "Automated decision support systems",
          "End-to-end ML pipeline development and deployment",
        ],
        additionalContent:
          "Our AI and ML solutions are designed for production environments, not proof-of-concepts. We build systems that scale, maintain accuracy over time, and integrate seamlessly with your existing infrastructure while delivering measurable ROI.",
      },
      {
        id: "data-science-analytics",
        title: "Data Science & Analytics",
        icon: "TrendingUp",
        iconAlt: "Data Science Icon",
        image: "/data-science.webp",
        description:
          "Turning raw data into insight. We design data pipelines, analytics dashboards, and reporting systems that help organisations understand trends, measure performance, and make informed decisions at scale.",
        solutionText: [
          "End-to-end data pipeline architecture and implementation",
          "Custom analytics dashboards and visualization",
          "Statistical modeling and trend analysis",
          "Performance metrics and KPI tracking systems",
        ],
        additionalContent:
          "We build analytics infrastructure that grows with your business—from initial data collection through to actionable insights. Our solutions ensure data quality, processing efficiency, and clear visualization that stakeholders actually use.",
      },
      {
        id: "natural-language-processing",
        title: "Natural Language Processing (NLP)",
        icon: "MessageSquare",
        iconAlt: "NLP Icon",
        image: "/natural-language-processing.webp",
        description:
          "Systems that understand and generate human language. This covers enterprise chatbots, text classification, sentiment analysis, document processing, and AI assistants integrated into existing platforms.",
        solutionText: [
          "Enterprise chatbots and virtual assistants",
          "Automated text classification and categorization",
          "Sentiment analysis and opinion mining",
          "Intelligent document processing and extraction",
        ],
        additionalContent:
          "Our NLP solutions handle real-world language complexity—handling context, ambiguity, and domain-specific terminology. We build systems that improve over time through continuous learning and integration with your business processes.",
      },
      {
        id: "computer-vision",
        title: "Computer Vision",
        icon: "Eye",
        iconAlt: "Computer Vision Icon",
        image: "/computer-vision.webp",
        description:
          "AI solutions that interpret images and video. Use cases include object detection, facial recognition, visual inspection, and automated monitoring for security, healthcare, and industrial applications.",
        solutionText: [
          "Object detection and recognition systems",
          "Facial recognition and biometric authentication",
          "Automated visual quality inspection",
          "Real-time video monitoring and alerting",
        ],
        additionalContent:
          "We develop computer vision systems optimized for your specific use case—whether that's manufacturing quality control, security monitoring, medical imaging, or retail analytics. Our solutions balance accuracy, speed, and cost-effectiveness.",
      },
      {
        id: "ar-vr-solutions",
        title: "AR & VR Solutions",
        icon: "Glasses",
        iconAlt: "AR VR Icon",
        image: "/ar-and-vr-solutions.webp",
        description:
          "Immersive technologies for training, simulation, and remote collaboration. We develop practical AR and VR experiences that improve learning outcomes and operational efficiency.",
        solutionText: [
          "Immersive training simulations and scenarios",
          "Virtual collaboration spaces for remote teams",
          "AR-enhanced field service and maintenance",
          "VR product visualization and prototyping",
        ],
        additionalContent:
          "Our AR and VR solutions focus on practical business applications—not novelty experiences. We create immersive environments that reduce training costs, improve knowledge retention, and enable remote expertise delivery where it matters most.",
      },
    ],
  },

  applicationSoftwareDevelopment: {
    id: "application-software-development",
    title: "Application & Software Development",
    subtitle:
      "Designing and building reliable software products that users actually want to use. From web platforms to mobile apps and desktop software, we create solutions focused on usability, performance, and maintainability.",
    cards: [
      {
        id: "web-mobile-application-development",
        title: "Web & Mobile Application Development",
        icon: "Globe",
        iconAlt: "Web Mobile Dev Icon",
        image: "/mobile-application-development.webp",
        description:
          "End to end development of scalable web platforms and mobile applications. From MVPs to enterprise systems, we handle frontend, backend, APIs, and integrations with a focus on performance and security.",
        solutionText: [
          "Full-stack web application development",
          "Native and cross-platform mobile apps",
          "RESTful API and microservices architecture",
          "Third-party integrations and payment systems",
        ],
        additionalContent:
          "We build applications that perform under real-world conditions—handling traffic spikes, maintaining security, and providing responsive user experiences. Our development process includes proper testing, documentation, and deployment pipelines.",
      },
      {
        id: "desktop-application-development",
        title: "Desktop Application Development",
        icon: "Monitor",
        iconAlt: "Desktop Dev Icon",
        image: "/desktop-application-development.webp",
        description:
          "Robust desktop software for business and operational needs. Ideal for environments requiring offline access, local processing, or tight integration with hardware and internal systems.",
        solutionText: [
          "Cross-platform desktop applications",
          "Offline-capable business tools",
          "Hardware integration and device communication",
          "Legacy system modernization",
        ],
        additionalContent:
          "Desktop applications remain essential for specialized workflows, offline environments, and performance-critical tasks. We build modern desktop software that integrates with your existing infrastructure while providing the reliability users expect.",
      },
      {
        id: "ui-ux-design",
        title: "UI & UX Design",
        icon: "Palette",
        iconAlt: "UI UX Icon",
        image: "/ui-ux.webp",
        description:
          "User experience design that prioritises clarity and usability. We create interfaces that are intuitive, consistent, and aligned with business goals, not just visually pleasing.",
        solutionText: [
          "User research and usability testing",
          "Information architecture and user flows",
          "Interface design and prototyping",
          "Design system development and maintenance",
        ],
        additionalContent:
          "Good design means users accomplish their goals efficiently without confusion or frustration. We focus on creating interfaces that reduce support costs, increase adoption rates, and improve overall user satisfaction through evidence-based design decisions.",
      },
    ],
  },

  infrastructureEnterpriseSystems: {
    id: "infrastructure-enterprise-systems",
    title: "Infrastructure, Automation & Enterprise Systems",
    subtitle:
      "Keeping systems scalable, stable, and automated so teams can focus on actual work. We design and manage infrastructure, ERP systems, and provide ongoing support that ensures business continuity.",
    cards: [
      {
        id: "cloud-devops-services",
        title: "Cloud & DevOps Services",
        icon: "Cloud",
        iconAlt: "Cloud DevOps Icon",
        image: "/ai.webp",
        description:
          "Designing and managing cloud infrastructure using modern DevOps practices. This includes CI/CD pipelines, containerisation, monitoring, performance optimisation, and secure deployments on AWS, Azure, or GCP.",
        solutionText: [
          "Cloud infrastructure design and migration",
          "CI/CD pipeline automation and deployment",
          "Container orchestration with Kubernetes",
          "Infrastructure monitoring and alerting",
        ],
        additionalContent:
          "We build cloud infrastructure that's cost-effective, secure, and scalable. Our DevOps practices ensure fast, reliable deployments with proper monitoring, backup strategies, and disaster recovery planning that keeps systems running when it matters.",
      },
      {
        id: "erp-systems-business-automation",
        title: "ERP Systems & Business Automation",
        icon: "Settings",
        iconAlt: "ERP Icon",
        image: "/business-automation.webp",
        description:
          "Custom ERP solutions and workflow automation tailored to organisational processes. We replace manual operations with integrated systems that improve efficiency, accuracy, and visibility across departments.",
        solutionText: [
          "Custom ERP implementation and configuration",
          "Workflow automation and process optimization",
          "Department integration and data synchronization",
          "Business intelligence and reporting tools",
        ],
        additionalContent:
          "Our ERP solutions connect departments, eliminate redundant data entry, and provide real-time visibility into operations. We focus on implementations that actually get used—through proper training, change management, and ongoing support.",
      },
      {
        id: "support-maintenance",
        title: "Support & Maintenance",
        icon: "Headphones",
        iconAlt: "Support Icon",
        image: "/maintenance-and-support.webp",
        description:
          "Ongoing technical support to keep systems running smoothly. This includes monitoring, bug fixes, performance improvements, security updates, and feature enhancements after launch.",
        solutionText: [
          "24/7 system monitoring and incident response",
          "Regular security updates and patch management",
          "Performance optimization and scaling",
          "Feature enhancements and continuous improvement",
        ],
        additionalContent:
          "Software doesn't stop needing attention after launch. We provide proactive maintenance that prevents problems before they impact users—through monitoring, regular updates, and performance optimization that keeps systems reliable over time.",
      },
    ],
  },

  consultingTransformation: {
    id: "consulting-transformation",
    title: "Strategic Consulting & Digital Transformation",
    subtitle:
      "Helping organisations adopt technology properly instead of bolting tools together and hoping for the best. We provide strategic guidance, transformation roadmaps, and advisory services that align technology with business objectives.",
    cards: [
      {
        id: "digital-transformation-consulting",
        title: "Digital Transformation Consulting",
        icon: "Target",
        iconAlt: "Digital Transformation Icon",
        image: "/digital-transformation.webp",
        description:
          "Assessment and redesign of business processes using modern technology. We help organisations move from outdated systems to efficient, scalable digital operations with a clear transformation roadmap.",
        solutionText: [
          "Current state assessment and gap analysis",
          "Digital transformation roadmap development",
          "Process redesign and optimization",
          "Change management and training programs",
        ],
        additionalContent:
          "Digital transformation isn't about technology alone—it's about changing how organizations work. We help identify inefficiencies, design better processes, select appropriate tools, and manage the cultural change required for successful adoption.",
      },
      // Fixed this image
      {
        id: "technology-strategy-advisory",
        title: "Technology Strategy & Advisory",
        icon: "Lightbulb",
        iconAlt: "Tech Strategy Icon",
        image: "/advisory.webp",
        description:
          "Guidance on technology decisions that actually align with business objectives. This includes system audits, architecture planning, tool selection, and long term technology roadmaps.",
        solutionText: [
          "Technology stack evaluation and recommendations",
          "System architecture planning and review",
          "Vendor selection and procurement guidance",
          "Long-term technology roadmap development",
        ],
        additionalContent:
          "We help organizations make informed technology decisions—avoiding vendor lock-in, technical debt, and costly mistakes. Our advisory services provide independent, practical guidance based on your specific context, constraints, and goals.",
      },
    ],
  },

  openEdXServices: {
    id: "open-edx-services",
    title: "Open edX Services",
    subtitle:
      "Enterprise learning platforms, customization, and long-term scalability. We provide comprehensive Open edX services from hosting to feature development, ensuring your learning platform meets organizational needs.",
    cards: [
      // Fixed this image
      {
        id: "open-edx-hosting",
        title: "Open edX Hosting",
        icon: "Server",
        iconAlt: "Open edX Hosting Icon",
        image: "/hosting.webp",
        description:
          "Secure, scalable cloud hosting for Open edX platforms, optimized for performance, reliability, and global learner access.",
        solutionText: [
          "Managed cloud hosting on AWS, Azure, or GCP",
          "Auto-scaling for peak learner traffic",
          "Global CDN integration for fast content delivery",
          "Regular backups and disaster recovery",
        ],
        additionalContent:
          "We provide production-ready Open edX hosting that handles real-world demands—from hundreds to millions of learners. Our infrastructure ensures platform availability, fast load times, and data security through proper monitoring, scaling, and backup strategies.",
      },
      {
        id: "customization-feature-development",
        title: "Customization & Feature Development",
        icon: "Puzzle",
        iconAlt: "Customization Icon",
        image: "/feature-development.webp",
        description:
          "Tailored Open edX enhancements built through plugins and extensions—adding new functionality without modifying the core platform.",
        solutionText: [
          "Custom XBlocks and Django apps development",
          "Feature extensions and plugin architecture",
          "Third-party tool integrations",
          "Upgrade-safe customization approach",
        ],
        additionalContent:
          "We extend Open edX functionality through proper plugin development that survives platform upgrades. Our customizations add the features you need while maintaining compatibility with the Open edX ecosystem and future releases.",
      },
      {
        id: "branding-ui-ux",
        title: "Branding & UI/UX",
        icon: "PenTool",
        iconAlt: "Branding Icon",
        image: "/ui-ux.webp",
        description:
          "Fully branded learning experiences with custom themes, layouts, and UI refinements that align Open edX with your organization's identity.",
        solutionText: [
          "Custom theme development and branding",
          "UI/UX improvements and modernization",
          "Mobile-responsive design implementation",
          "Accessibility compliance and optimization",
        ],
        additionalContent:
          "We create branded learning experiences that reflect your organization's identity while maintaining usability and accessibility. Our designs work across devices and provide consistent, professional experiences that learners trust and engage with.",
      },
      {
        id: "content-authoring-course-development",
        title: "Content Authoring & Course Development",
        icon: "FileText",
        iconAlt: "Course Development Icon",
        image: "/course-development.webp",
        description:
          "Design and build engaging courses using Open edX Studio, XBlocks, and interactive content aligned with instructional best practices.",
        solutionText: [
          "Course design and curriculum development",
          "Interactive content creation with H5P and XBlocks",
          "Assessment and quiz development",
          "Video production and multimedia integration",
        ],
        additionalContent:
          "We help organizations create effective online courses—from instructional design through content production. Our courses balance pedagogy with engagement, using interactive elements, assessments, and multimedia that improve learning outcomes.",
      },
      {
        id: "integrations-sso",
        title: "Integrations & SSO",
        icon: "Lock",
        iconAlt: "Integration Icon",
        image: "/integrations.webp",
        description:
          "Seamless integration with enterprise systems including SSO, HR platforms, CRMs, analytics tools, and internal applications.",
        solutionText: [
          "Single Sign-On (SSO) with SAML, OAuth, or LTI",
          "LMS integration with HR and CRM systems",
          "Analytics and data warehouse connections",
          "API development for custom integrations",
        ],
        additionalContent:
          "We connect Open edX with your existing systems—eliminating duplicate logins, syncing user data, and enabling analytics pipelines. Our integrations reduce administrative overhead and provide unified reporting across learning and business systems.",
      },
      {
        id: "deployment-environment-setup",
        title: "Deployment & Environment Setup",
        icon: "GitBranch",
        iconAlt: "Deployment Icon",
        image: "/deployment-and-environment Setup.webp",
        description:
          "End-to-end setup of development, staging, and production environments following best practices for security and maintainability.",
        solutionText: [
          "Multi-environment setup (dev, staging, production)",
          "Automated deployment pipelines",
          "Security hardening and SSL configuration",
          "Documentation and runbook creation",
        ],
        additionalContent:
          "We establish proper Open edX environments with separation between development, testing, and production. Our deployments include security configurations, automated pipelines, and documentation that enables your team to manage the platform effectively.",
      },
      {
        id: "release-upgrades-version-management",
        title: "Release Upgrades & Version Management",
        icon: "RefreshCw",
        iconAlt: "Upgrade Icon",
        image: "/version-management.webp",
        description:
          "Smooth upgrades to newer Open edX releases with minimal downtime—ensuring access to new features while protecting custom work.",
        solutionText: [
          "Named release upgrades (Nutmeg to Olive, etc.)",
          "Testing and validation before production",
          "Custom code migration and compatibility",
          "Rollback planning and risk mitigation",
        ],
        additionalContent:
          "Open edX releases bring new features and security improvements, but upgrades require careful planning. We manage the entire upgrade process—testing customizations, migrating data, and ensuring platform stability through proper validation and contingency planning.",
      },
      {
        id: "open-edx-maintenance-support",
        title: "Maintenance & Support",
        icon: "Wrench",
        iconAlt: "Maintenance Icon",
        image: "/maintenance-and-support.webp",
        description:
          "Ongoing monitoring, bug fixes, security updates, and operational support to keep your Open edX platform running smoothly.",
        solutionText: [
          "24/7 platform monitoring and incident response",
          "Security patches and updates",
          "Performance optimization and scaling",
          "Technical support for administrators and learners",
        ],
        additionalContent:
          "We provide proactive Open edX maintenance that prevents problems before they impact learners. Our support includes monitoring, security updates, performance optimization, and technical assistance that keeps your learning platform reliable and available.",
      },
      {
        id: "analytics-reporting",
        title: "Analytics & Reporting",
        icon: "BarChart3",
        iconAlt: "Analytics Icon",
        image: "/analytics.webp",
        description:
          "Advanced learner insights, progress tracking, and custom reports using Open edX data pipelines and external BI tools.",
        solutionText: [
          "Learner progress and completion tracking",
          "Custom dashboard and report development",
          "Integration with Power BI, Tableau, or similar",
          "Data export and warehouse connections",
        ],
        additionalContent:
          "We help organizations understand learning effectiveness through proper analytics—from basic completion rates to advanced learner behavior analysis. Our reporting solutions provide actionable insights that improve course design and demonstrate learning impact.",
      },
      {
        id: "multi-tenant-regional-deployments",
        title: "Multi-Tenant & Regional Deployments",
        icon: "Users",
        iconAlt: "Multi-Tenant Icon",
        image: "/regional.webp",
        description:
          "Support for multiple audiences, regions, or business units with isolated data, branding, and configuration options.",
        solutionText: [
          "Multi-tenant architecture and site management",
          "Region-specific deployments for data compliance",
          "Separate branding per tenant or audience",
          "Isolated data and user management",
        ],
        additionalContent:
          "We help organizations serve multiple audiences through proper multi-tenant architecture—whether that's different regions, business units, or customer segments. Our deployments provide isolation, flexibility, and centralized management that scales with your needs.",
      },
    ],
  },
};
