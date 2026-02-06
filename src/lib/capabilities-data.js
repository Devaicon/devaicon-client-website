/**
 * Capabilities data configuration for all capability pages
 * Centralized data structure for AI, Business Applications, Cloud Services, and Data capabilities
 */

export const CAPABILITIES_CONFIG = {
  ai: {
    id: "ai",
    title: "Artificial Intelligence",
    subtitle:
      "Our AI solutions focus on outcomes, not experiments. We deploy Copilot and custom AI to reduce costs, boost productivity, and speed decisions, helping enterprises achieve clear ROI. Our governed, scalable, and responsible AI platforms are built for secure operations, regulatory compliance, and long-term enterprise growth across industries.",
    cards: [
      {
        id: "microsoft-copilot-m365",
        title: "Microsoft Copilot for Microsoft 365",
        icon: "/icons/microsoft-copilot.svg",
        iconAlt: "Microsoft Copilot Icon",
        image: "/images/copilot-for-microsoft-365.webp",
        description:
          "Microsoft Copilot for Microsoft 365 helps teams work faster across Word, Excel, Outlook, and Teams. It simply organizes tasks, summarizes emails and automates repetitive work. Users can focus on important work easily and can collaborate more easily by completing daily tasks with less effort.",
        solutionText: [
          "Automates tasks in Microsoft 365.",
          " Summarizes emails and documents.",
          " Drafts reports and content quickly.",
          " Integrates with Teams for collaboration.",
        ],
        additionalContent:
          "Teams using Devaicon solutions like Microsoft Copilot for Microsoft 365 complete tasks faster and with greater accuracy. Team members of businesses can concentrate on strategic priorities that produce tangible business results because collaboration is streamlined and routine work is decreased.",
      },
      {
        id: "dynamics-365-copilot",
        title: "Dynamics 365 Copilot",
        icon: "/icons/Dynamics365_scalable.svg",
        iconAlt: "Dynamics 365 Copilot Icon",
        image: "/images/dynamics-365-copilot.webp",
        description:
          "Dynamics 365 Copilot supports sales, customer service, and operations. It provides guidance, suggests next steps, and helps teams manage workflows more efficiently. Users can respond to customer requests quickly, organize work better, and handle daily business processes without delays.",
        solutionText: [
          "Suggests actions for sales and service",
          "Automates routine customer tasks",
          "Supports case and workflow management",
          "Improves operational efficiency",
        ],
        additionalContent:
          "With Devaicon's Dynamics 365 Copilot solutions, businesses enhance productivity and maintain consistent service quality. Customers receive faster support from your business and the company achieves stronger results with improved client trust.",
      },
      {
        id: "azure-openai-service",
        title: "Azure OpenAI Service",
        icon: "/icons/azure/03438-icon-service-Azure-OpenAI.svg",
        iconAlt: "Azure OpenAI Icon",
        image: "/images/azure-openai-service.webp",
        description:
          "Azure OpenAI Service provides enterprise-ready tools for building smart applications. Businesses can use models for text, prediction, and automation. It is secure, scalable, and works with existing systems to help teams process information quickly, reduce errors, and complete tasks more reliably.",
        solutionText: [
          "Enterprise-ready models for business use",
          "Scalable for large workloads",
          "Secure and compliant platform",
          "Supports text and data processing",
        ],
        additionalContent:
          "With Azure OpenAI Service, companies develop better applications, improve decision-making and streamline workflows. Teams of departments work faster, their mistakes are reduced, and business operations become more consistent with efficiency.",
      },
      {
        id: "copilot-studio",
        title: "Copilot Studio",
        icon: "/icons/CopilotStudio_scalable.svg",
        iconAlt: "Copilot Studio Icon",
        image: "/images/copilot-studio.webp",
        description:
          "Copilot Studio lets teams design and customize tools for their business workflows. It allows users to create task helpers, monitor usage, and manage processes easily. Work becomes more organized, tasks are handled quickly, and members can focus on important projects instead of routine work.",
        solutionText: [
          "Build custom workflow tools",
          "Monitor usage and performance",
          "Integrates with Microsoft business apps",
          "Simplifies repetitive tasks",
        ],
        additionalContent:
          "Using Devaicon's Copilot Studio solutions, businesses minimize errors and standardize processes. Users complete projects faster, operations run smoothly and productivity rises. As a result, companies achieve measurable improvements in performance and operational reliability.",
      },
      {
        id: "ai-builder",
        title: "AI Builder",
        icon: "/icons/AIBuilder_scalable.svg",
        iconAlt: "AI Builder Icon",
        image: "/images/ai-builder.webp",
        description:
          "AI Builder helps businesses build predictive models and automate processes without complex coding. Teams can create models for forecasting, data organization, and decision support. Work becomes faster, more accurate, and easier to manage, while employees spend more time on tasks that add value.",
        solutionText: [
          "Build predictive models",
          "Automate routine processes",
          "Integrates with Power Platform",
          "Low-code interface for everyone",
        ],
        additionalContent:
          "With AI Builder, businesses and companies make better decisions, reduce manual work, and increase productivity. Seek help from Devaicon that ultimately helps teams complete tasks efficiently, and business results improve steadily.",
      },
      {
        id: "azure-ai-services",
        title: "Azure AI Services",
        icon: "/icons/azure/10162-icon-service-Cognitive-Services.svg",
        iconAlt: "Azure AI Services Icon",
        image: "/images/azure-ai-services.webp",
        description:
          "Azure AI Services provide tools for text, speech, and image processing. Businesses can process large amounts of data, analyze information and support daily operations. Teams can complete work faster, get accurate results and improve decision-making without delays.",
        solutionText: [
          "Text and speech processing",
          "Image and document analysis",
          "Predictive insights for teams",
          "Integrates with business systems",
        ],
        additionalContent:
          "Using Azure AI Services, teams work faster, reduce errors and make decisions based on real information. Operations are more reliable, employees are more productive, and business goals are achieved efficiently.",
      },
      {
        id: "intelligent-document-processing",
        title: "Intelligent Document Processing",
        icon: "/icons/azure/00819-icon-service-Form-Recognizers.svg",
        iconAlt: "Document Processing Icon",
        image: "/images/intelligent-document-processing.webp",
        description:
          "Intelligent Document Processing helps businesses extract information from forms, invoices and emails automatically. So teams spend less time on manual data entry that reduces mistakes and keeps information organized. Workflows become faster and smoother, helping employees focus on high-value tasks.",
        solutionText: [
          "Extract data from documents automatically",
          "Reduces manual entry errors",
          "Works with business systems",
          "Speeds up document processing",
        ],
        additionalContent:
          "With Intelligent Document Processing, companies save time and improve data accuracy. Plus, it also helps in processing documents faster. Teams of multiple businesses complete tasks efficiently, workflows stay smooth, and business operations run reliably.",
      },
      {
        id: "predictive-models",
        title: "Predictive Models",
        icon: "/icons/azure/10166-icon-service-Machine-Learning.svg",
        iconAlt: "Predictive Models Icon",
        image: "/images/predictive-ai-models.webp",
        description:
          "Predictive Models help businesses plan for the future by analyzing data trends. Teams can forecast sales, customer behavior and operational needs. As a result, this allows better planning, quicker decisions and more organized business processes.",
        solutionText: [
          "Forecast sales and demand",
          "Predict customer behavior",
          "Plan resources efficiently",
          "Reduce business risks",
        ],
        additionalContent:
          "With predictive models, companies make smarter decisions reduce errors and plan. Devaicon helps businesses become more confident in operations. Workflows are streamlined so team members can focus on priorities and business results improve consistently while growth and performance stay on track.",
      },
    ],
  },
  "business-applications": {
    id: "business-applications",
    title: "Business Applications",
    subtitle:
      "Our business applications connect finance, operations, sales, and service into one intelligent system. Using Dynamics 365, we help organizations streamline processes, improve visibility, and drive smarter decisions, enabling measurable efficiency, stronger control, and scalable growth across complex enterprise environments with confidence and clarity.",
    cards: [
      {
        id: "dynamics-365-finance",
        title: "Dynamics 365 Finance",
        icon: "/icons/Finance_scalable.svg",
        iconAlt: "Finance Icon",
        image: "/images/dynamics-365-finance.webp",
        description:
          "Dynamics 365 Finance helps businesses manage money easily. It covers budgeting, accounts payable, receivable cash flow and reporting. Teams can track financial performance control spending and make decisions based on real-time information to keep operations running smoothly and efficiently.",
        solutionText: [
          "Manage the general ledger and accounts",
          "Budgeting and cash flow tracking",
          "Financial reporting and compliance",
          "Automate invoicing and payments",
        ],
        additionalContent:
          "With Devaicon's Finance solutions organizations, consolidate financial operations improve reporting accuracy and optimize cash flow. Teams gain clear visibility into budgets, reduce reconciliation errors and strengthen financial governance for measurable operational and strategic performance.",
      },
      {
        id: "dynamics-365-supply-chain",
        title: "Dynamics 365 Supply Chain Management",
        icon: "/icons/SupplyChainManagement_scalable.svg",
        iconAlt: "Supply Chain Icon",
        image: "/images/dynamics-365-supply-chain-management.webp",
        description:
          "Dynamics 365 Supply Chain Management helps businesses track inventory, manufacturing and deliveries. Teams can plan production, monitor warehouses and manage suppliers. Operations become more organized and reliable to meet customer demands efficiently without delays.",
        solutionText: [
          "Inventory and warehouse management",
          "Procurement and supplier coordination",
          "Production planning and scheduling",
          "Track shipments and deliveries",
        ],
        additionalContent:
          "With Devaicon's Supply Chain solutions, companies optimize inventory production and logistics. Resource allocation improves operational bottlenecks are reduced and makes delivery timelines predictable driving measurable efficiency and reliability across supply networks.",
      },
      {
        id: "dynamics-365-sales",
        title: "Dynamics 365 Sales",
        icon: "/icons/Sales_scalable.svg",
        iconAlt: "Sales Icon",
        image: "/images/dynamics-365-sales.webp",
        description:
          "Dynamics 365 Sales helps teams track leads manage opportunities and close deals faster. It organizes customer information and provides clear visibility on pipelines so sales teams can focus on building relationships and achieving targets effectively.",
        solutionText: [
          "Track leads and opportunities",
          "Manage customer relationships",
          "Pipeline visibility and tracking",
          "Automate routine sales tasks",
        ],
        additionalContent:
          "With Devaicon's Sales solutions, teams close deals faster improve customer engagement and hit targets. Sales processes are simpler more efficient and help the company grow revenue consistently.",
      },
      {
        id: "dynamics-365-customer-service",
        title: "Dynamics 365 Customer Service",
        icon: "/icons/CustomerServices_scalable.svg",
        iconAlt: "Customer Service Icon",
        image: "/images/dynamics-365-customer-service.webp",
        description:
          "Dynamics 365 Customer Service helps teams respond to customer requests quickly. It manages cases supports multiple channels and ensures customers get consistent answers. Teams can deliver better service and resolve issues without delays.",
        solutionText: [
          "Case management and tracking",
          "Omnichannel support",
          "Self-service portals",
          "Service level tracking",
        ],
        additionalContent:
          "With Devaicon's Customer Service solutions, enterprises manage multichannel support efficiently. Businesses resolve cases faster maintain SLAs and improve customer satisfaction while reducing operational overhead and driving measurable improvements in service performance.",
      },
      {
        id: "dynamics-365-field-service",
        title: "Dynamics 365 Field Service",
        icon: "/icons/FieldService_scalable.svg",
        iconAlt: "Field Service Icon",
        image: "/images/dynamics-365-field-service.webp",
        description:
          "Dynamics 365 Field Service helps businesses manage on-site teams and equipment. It schedules work orders assigns technicians and tracks service tasks. Operations become more organized and field teams can complete work efficiently without missing appointments.",
        solutionText: [
          "Work order management",
          "Technician scheduling",
          "Asset tracking and maintenance",
          "Mobile field support",
        ],
        additionalContent:
          "With Devaicon's Field Service solutions, businesses optimize on-site operations and technician scheduling. Work order completion is faster resource utilization improves and operational reliability increases, resulting in measurable efficiency gains and higher client satisfaction.",
      },
      {
        id: "dynamics-365-project-operations",
        title: "Dynamics 365 Project Operations",
        icon: "/icons/ProjectOperations_scalable.svg",
        iconAlt: "Project Operations Icon",
        image: "/images/dynamics-365-project-operations.webp",
        description:
          "Dynamics 365 Project Operations helps businesses plan and manage projects. Teams can track tasks assign resources and manage budgets. Projects are completed on time and within budget while keeping everyone aligned and informed.",
        solutionText: [
          "Project planning and scheduling",
          "Resource management",
          "Budget tracking and reporting",
          "Time and expense management",
        ],
        additionalContent:
          "With Devaicon's Project Operations solutions, project planning resourcing and budgeting are optimized. Businesses maintain timelines reduce cost overruns and track progress in real-time ensuring measurable improvements in project delivery and operational efficiency.",
      },
      {
        id: "dynamics-365-human-resources",
        title: "Dynamics 365 Human Resources",
        icon: "/icons/HumanResources_scalable.svg",
        iconAlt: "Human Resources Icon",
        image: "/images/dynamics-365-human-resources.webp",
        description:
          "Dynamics 365 Human Resources helps manage employee data benefits leave and performance. Teams can track HR tasks and keep records organized. Work becomes more efficient and employees are supported throughout their lifecycle.",
        solutionText: [
          "Employee data management",
          "Leave and benefits tracking",
          "Performance and skills management",
          "HR analytics and reporting",
        ],
        additionalContent:
          "With Devaicon's Human Resources solutions, employee data leave and performance management are streamlined. HR processes become consistent and measurable reducing errors improving reporting and enhancing workforce productivity while supporting strategic organizational objectives.",
      },
      {
        id: "dynamics-365-commerce",
        title: "Dynamics 365 Commerce",
        icon: "/icons/Commerce_scalable.svg",
        iconAlt: "Commerce Icon",
        image: "/images/dynamics-365-commerce.webp",
        description:
          "Dynamics 365 Commerce helps businesses manage their online sales and pricing. Teams can track orders manage inventory and deliver a consistent shopping experience across channels. Operations become simpler and sales run efficiently.",
        solutionText: [
          "Omnichannel retail management",
          "POS and online store integration",
          "Pricing and promotion management",
          "Inventory tracking",
        ],
        additionalContent:
          "With Devaicon's Commerce solutions, businesses provide better shopping experiences. Businesses and companies manage sales efficiently reduce errors and ensure smooth operations. Customers are satisfied and revenue grows steadily.",
      },
      {
        id: "dynamics-365-business-central",
        title: "Dynamics 365 Business Central",
        icon: "/icons/BusinessCentral_scalable.svg",
        iconAlt: "Business Central Icon",
        image: "/images/dynamics-365-business-central.webp",
        description:
          "Dynamics 365 Business Central helps small and mid-sized businesses manage finance sales, inventory, and projects. Businesses can track operations in one place make informed decisions and keep the business organized.",
        solutionText: [
          "All-in-one ERP for small and mid-sized businesses",
          "Finance and sales management",
          "Inventory and project tracking",
          "Reporting and insights",
        ],
        additionalContent:
          "With Devaicon's Business Central solutions, small and mid-sized businesses integrate finance sales and inventory management. Companies achieve operational consistency reduce errors and gain insights for strategic decisions producing measurable improvements in productivity and business growth.",
      },
    ],
  },
  "cloud-services": {
    id: "cloud-services",
    title: "Cloud Services",
    subtitle:
      "Our cloud services help enterprises build secure, scalable, and resilient platforms on Azure. We modernize infrastructure, optimize costs, strengthen security, and enable faster innovation, ensuring systems are reliable, compliant, and ready to support business growth across demanding enterprise workloads and regional regulations with clear governance and operational confidence today.",
    cards: [
      {
        id: "microsoft-azure-infrastructure",
        title: "Microsoft Azure Infrastructure",
        icon: "/icons/azure/10018-icon-service-Azure-A.svg",
        iconAlt: "Azure Infrastructure Icon",
        image: "/images/azure-infrastructure.webp",
        description:
          "Microsoft Azure Infrastructure provides secure and reliable cloud platforms for businesses. It hosts applications, stores data and connects teams globally. Companies can scale resources up or down and run workloads efficiently without worrying about physical hardware.",
        solutionText: [
          "Secure cloud hosting for apps and data",
          "Scalable computing resources",
          "Global availability and reliability",
          "High performance and uptime",
        ],
        additionalContent:
          "With Devaicon's Azure Infrastructure solutions, clients run applications smoothly, scale easily and reduce IT costs. Businesses and companies work efficiently, data stays secure and operations remain reliable, enabling businesses to focus on growth and strategic initiatives.",
      },
      {
        id: "azure-app-services",
        title: "Azure App Services & Web Apps",
        icon: "/icons/azure/10035-icon-service-App-Services.svg",
        iconAlt: "App Services Icon",
        image: "/images/azure-app-services-web-apps.webp",
        description:
          "Azure App Services lets businesses create web apps and APIs quickly. It supports multiple languages and frameworks. Teams can deploy updates easily, manage traffic and deliver consistent performance for users everywhere.",
        solutionText: [
          "Web apps and APIs hosting",
          "Easy deployment and updates",
          "Multi-language support",
          "High performance and reliability",
        ],
        additionalContent:
          "With Devaicon's App Services solutions, clients launch apps faster, keep users satisfied and reduce downtime. Team members of various businesses manage updates with ease and business operations run smoothly, giving companies the confidence to innovate and scale.",
      },
      {
        id: "azure-kubernetes-service",
        title: "Azure Kubernetes Service",
        icon: "/icons/kubernetes.svg",
        iconAlt: "Kubernetes Icon",
        image: "/images/azure-kubernetes-service.webp",
        description:
          "Azure Kubernetes Service helps businesses deploy and manage containerized applications. Teams can run apps in the cloud efficiently and scale automatically based on demand. It simplifies complex infrastructure management.",
        solutionText: [
          "Manage containerized apps",
          "Automatic scaling",
          "Simplified infrastructure",
          "Reliable cloud deployment",
        ],
        additionalContent:
          "With Devaicon's Kubernetes solutions, clients deliver applications faster, scale seamlessly and maintain reliable services. Users save time, reduce operational complexity and businesses gain agility to respond to changing market needs.",
      },
      {
        id: "azure-virtual-desktop",
        title: "Azure Virtual Desktop",
        icon: "/icons/azure/00327-icon-service-Azure-Virtual-Desktop.svg",
        iconAlt: "Virtual Desktop Icon",
        image: "/images/azure-virtual-desktop.webp",
        description:
          "Azure Virtual Desktop lets teams work from anywhere using virtual desktops. Employees access applications, files and tools securely from any device. Businesses can provide remote work flexibility without compromising security.",
        solutionText: [
          "Secure remote desktop access",
          "Access apps and files from anywhere",
          "Supports multiple devices",
          "Centralized management",
        ],
        additionalContent:
          "With Devaicon's Virtual Desktop solutions, clients enable employees to work productively from any location. Security is maintained, collaboration improves and business operations continue smoothly without disruption.",
      },
      {
        id: "azure-integration-services",
        title: "Azure Integration Services",
        icon: "/icons/PowerAutomate_scalable.svg",
        iconAlt: "Integration Services Icon",
        image: "/images/azure-integration-services.webp",
        description:
          "Azure Integration Services connect different applications and data systems. Teams can automate workflows, share information across systems and simplify business processes. Integration reduces manual work and errors.",
        solutionText: [
          "Connect apps and data",
          "Automate workflows",
          "Simplify business processes",
          "Reduce manual work",
        ],
        additionalContent:
          "With Devaicon's Integration Services, clients streamline workflows, improve data sharing and reduce errors. Users and teams can focus on value-added work while operations run efficiently and reliably.",
      },
      {
        id: "azure-security-identity",
        title: "Azure Security & Identity",
        icon: "/icons/azure/00321-icon-service-Security.svg",
        iconAlt: "Security Icon",
        image: "/images/azure-security-identity.webp",
        description:
          "Azure Security & Identity protects business data, applications and users. Teams can control access, enforce policies and monitor security risks. Businesses stay safe from threats while maintaining productivity.",
        solutionText: [
          "Protect data and applications",
          "Manage user access",
          "Enforce security policies",
          "Monitor risks",
        ],
        additionalContent:
          "With Devaicon's Security solutions, clients safeguard operations, prevent data breaches and maintain compliance. Businesses can work confidently knowing systems are secure and business continuity is ensured.",
      },
      {
        id: "azure-devops-cicd",
        title: "Azure DevOps & CI/CD Pipelines",
        icon: "/icons/azure/10261-icon-service-Azure-DevOps.svg",
        iconAlt: "DevOps Icon",
        image: "/images/azure-devops-ci-cd-pipelines.webp",
        description:
          "Azure DevOps helps teams build, test and deploy software faster. CI/CD pipelines automate workflows, reduce errors and ensure code updates reach users quickly. Teams can manage projects and track progress efficiently.",
        solutionText: [
          "Continuous integration and delivery",
          "Automated testing and deployment",
          "Track project progress",
          "Reduce software errors",
        ],
        additionalContent:
          "With Devaicon's DevOps solutions, clients accelerate software delivery, reduce mistakes and keep projects on schedule. Team members of businesses collaborate effectively and businesses achieve measurable improvements in project and operational performance.",
      },
      {
        id: "cloud-migration-modernization",
        title: "Cloud Migration & Modernization",
        icon: "/icons/azure/10281-icon-service-Azure-Migrate.svg",
        iconAlt: "Cloud Migration Icon",
        image: "/images/cloud-migration-modernization.webp",
        description:
          "Cloud Migration & Modernization helps businesses move applications and data to the cloud safely. Teams update systems, optimize resources and improve performance without disrupting operations. Modern infrastructure supports business growth.",
        solutionText: [
          "Migrate applications and data",
          "Update legacy systems",
          "Optimize cloud resources",
          "Improve performance",
        ],
        additionalContent:
          "With Devaicon's Cloud Migration solutions, clients modernize operations, reduce IT costs and increase efficiency. Company users adopt new systems smoothly and business operations remain reliable while supporting long-term growth.",
      },
    ],
  },
  data: {
    id: "data",
    title: "Data",
    subtitle:
      "Our data solutions turn scattered information into trusted, decision-ready insights. Using Microsoft Fabric, analytics, and governance, we create a single version of truth, helping leaders move faster, reduce risk, and align teams around measurable outcomes that improve performance across the enterprise with accountability, security, and regulatory confidence built in.",
    cards: [
      {
        id: "microsoft-fabric",
        title: "Microsoft Fabric",
        icon: "/icons/PowerPlatform_scalable.svg",
        iconAlt: "Microsoft Fabric Icon",
        image: "/images/microsoft-fabric.webp",
        description:
          "Microsoft Fabric is a unified platform for data integration analytics and reporting. It helps teams access all company data in one place. Users can analyze information share insights and make better decisions faster without switching between multiple tools.",
        solutionText: [
          "Centralized data platform",
          "Easy integration of multiple data sources",
          "Analyze and visualize data",
          "Share insights across teams",
        ],
        additionalContent:
          "With Devaicon's Fabric solutions, clients make decisions faster and improve operations. Teams access data easily spot trends and work efficiently. Business results are clearer and performance improves steadily.",
      },
      {
        id: "azure-data-factory",
        title: "Azure Data Factory",
        icon: "/icons/azure/10126-icon-service-Data-Factories.svg",
        iconAlt: "Azure Data Factory Icon",
        image: "/images/azure-data-factory.webp",
        description:
          "Azure Data Factory helps move transform and load data from different sources. Teams can prepare data for reporting analytics and dashboards. Workflows are automated reducing manual work and saving time for critical business tasks.",
        solutionText: [
          "Move and transform data",
          "Automate data workflows",
          "Prepare data for analytics",
          "Integrate multiple data sources",
        ],
        additionalContent:
          "With Devaicon's Data Factory solutions, clients manage data efficiently reduce errors and deliver insights faster. Businesses can trust information for decision-making and improve overall performance.",
      },
      {
        id: "azure-synapse-analytics",
        title: "Azure Synapse Analytics",
        icon: "/icons/azure/00606-icon-service-Azure-Synapse-Analytics.svg",
        iconAlt: "Azure Synapse Icon",
        image: "/images/azure-synapse-analytics.webp",
        description:
          "Azure Synapse Analytics lets teams explore large amounts of data quickly. It combines data storage processing and analytics in one platform. Businesses can spot trends measure performance and make smarter decisions across operations.",
        solutionText: [
          "Analyze large datasets",
          "Combine storage and analytics",
          "Generate actionable insights",
          "Support business reporting",
        ],
        additionalContent:
          "With Devaicon's Synapse solutions, businesses gain faster insights and better visibility. Moreover, the team's track performance clearly improves decisions and achieves business goals efficiently.",
      },
      {
        id: "power-bi",
        title: "Power BI",
        icon: "/icons/azure/03332-icon-service-Power-BI-Embedded.svg",
        iconAlt: "Power BI Icon",
        image: "/images/power-bi.webp",
        description:
          "Power BI helps teams visualize data and create interactive dashboards. It turns raw information into charts and reports. Users can monitor performance track trends and share insights easily across departments.",
        solutionText: [
          "Create interactive dashboards",
          "Visualize performance metrics",
          "Track trends and KPIs",
          "Share insights across teams",
        ],
        additionalContent:
          "With Devaicon's Power BI solutions, companies visualize key metrics clearly and monitor performance in real-time. Teams share interactive dashboards, spot trends quickly, and make data-driven decisions that improve operational efficiency and drive measurable business growth.",
      },
      {
        id: "onelake",
        title: "OneLake",
        icon: "/icons/Dataverse_scalable.svg",
        iconAlt: "OneLake Icon",
        image: "/images/onelake.webp",
        description:
          "OneLake centralizes company data in a single secure storage platform. Teams can access files datasets and reports in one place. Work becomes simpler organized and faster with better control over information.",
        solutionText: [
          "Single storage for all data",
          "Secure and organized",
          "Easy access for teams",
          "Supports analytics and reporting",
        ],
        additionalContent:
          "With Devaicon's OneLake solutions, businesses unify data storage and access. Teams find and share information quickly, maintain accuracy, and improve collaboration, driving measurable gains in operational performance and business outcomes.",
      },
      {
        id: "azure-sql-managed-databases",
        title: "Azure SQL & Managed Databases",
        icon: "/icons/azure/10130-icon-service-SQL-Database.svg",
        iconAlt: "Azure SQL Icon",
        image: "/images/azure-sql-managed-databases.webp",
        description:
          "Azure SQL and managed databases store and manage business data securely. Teams can run applications generate reports and analyze information without worrying about servers or maintenance. Databases are reliable and scalable.",
        solutionText: [
          "Secure database management",
          "Scalable and reliable",
          "Supports business applications",
          "Easy reporting and analysis",
        ],
        additionalContent:
          "With Devaicon's SQL solutions, clients keep data organized and accessible. Teams work efficiently to reduce errors and maintain smooth operations. Business decisions are faster and more accurate.",
      },
      {
        id: "real-time-analytics",
        title: "Real-Time Analytics",
        icon: "/icons/azure/10145-icon-service-Azure-Data-Explorer-Clusters.svg",
        iconAlt: "Real-Time Analytics Icon",
        image: "/images/real-time-analytics.webp",
        description:
          "Real-Time Analytics allows teams to monitor data instantly. Businesses can track operations detect issues and respond quickly. Decisions are based on current information making processes faster and more effective.",
        solutionText: [
          "Monitor data in real-time",
          "Detect issues quickly",
          "Track operations efficiently",
          "Support fast decision-making",
        ],
        additionalContent:
          "With Devaicon's Real-Time Analytics solutions, clients act faster and improve performance. Teams and businesses respond to problems immediately, operations stay smooth and business results improve.",
      },
      {
        id: "data-governance-security",
        title: "Data Governance & Security (Microsoft Purview)",
        icon: "/icons/azure/00011-icon-service-Compliance.svg",
        iconAlt: "Data Governance Icon",
        image: "/images/data-governance-security.webp",
        description:
          "Microsoft Purview helps businesses manage and protect data. Teams can classify monitor and control information while meeting compliance standards. Security is enforced across systems keeping sensitive data safe and reliable.",
        solutionText: [
          "Classify and monitor data",
          "Ensure compliance standards",
          "Protect sensitive information",
          "Maintain control across systems",
        ],
        additionalContent:
          "With Devaicon's Data Governance solutions, clients secure their data and meet regulations. Teams handle information safely reduce risks and maintain trust. Business operations remain secure and efficient.",
      },
    ],
  },
};
