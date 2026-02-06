"use client";

import { useState } from "react";

const OurServicesSection = () => {
  const [activeService, setActiveService] = useState("dynamics");

  const services = {
    dynamics: {
      title: "Business Applications",
      description: [
        "Customer trends, demands, and technological advancements can change in an instant. But one thing stays constant: customers demand excellent customer service, so your methods of engagement matter.",
        "Together with our customers, we deliver high value by unifying sales and service into the heart of your operations. This ensures you can drive sales growth by understanding your digital buyer behaviour, strengthen brand loyalty by delighting your customers at every touchpoint and achieve transformational success by enhancing employee and user experience.",
      ],
      offerings: [
        {
          name: "Dynamics 365 Sales",
          desc: "Empower your sales team with AI-driven insights and streamlined processes.",
          gradient: "bg-gradient-to-br from-[#2d1b4e] to-[#4a3a6e]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          ),
        },
        {
          name: "Dynamics 365 Marketing",
          desc: "Create personalized customer journeys and drive engagement at scale.",
          gradient: "bg-gradient-to-br from-[#00a9e0] to-[#0078d4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          ),
        },
        {
          name: "Dynamics 365 Customer Service",
          desc: "Deliver exceptional service experiences across all channels.",
          gradient: "bg-gradient-to-br from-[#ff6b35] to-[#ff8c42]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          ),
        },
        {
          name: "Dynamics 365 Field Service",
          desc: "Optimize field operations with intelligent scheduling and mobile tools.",
          gradient: "bg-gradient-to-br from-[#00a9a5] to-[#4ecdc4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          ),
        },
      ],
    },
    cloud: {
      title: "Cloud Services",
      description: [
        "Transform your business with scalable, secure, and innovative cloud solutions built on Microsoft Azure. Our cloud experts help you modernize infrastructure, optimize costs, and accelerate digital transformation.",
        "We design and implement cloud architectures that enable your organization to innovate faster, scale efficiently, and maintain enterprise-grade security and compliance.",
      ],
      offerings: [
        {
          name: "Azure Migration",
          desc: "Seamlessly migrate your workloads to Azure with minimal disruption.",
          gradient: "bg-gradient-to-br from-[#2d1b4e] to-[#4a3a6e]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
            </svg>
          ),
        },
        {
          name: "Cloud Infrastructure",
          desc: "Design and deploy scalable, resilient cloud infrastructure solutions.",
          gradient: "bg-gradient-to-br from-[#00a9e0] to-[#0078d4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
          ),
        },
        {
          name: "Cloud Security",
          desc: "Implement comprehensive security and compliance frameworks.",
          gradient: "bg-gradient-to-br from-[#ff6b35] to-[#ff8c42]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          ),
        },
        {
          name: "Cloud Optimization",
          desc: "Maximize ROI through cost optimization and performance tuning.",
          gradient: "bg-gradient-to-br from-[#00a9a5] to-[#4ecdc4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          ),
        },
      ],
    },
    data: {
      title: "Data and Artificial Intelligence",
      description: [
        "Unlock the power of your data with advanced analytics and AI solutions. We help organizations turn data into actionable insights and build intelligent applications that drive business value.",
        "Our data and AI experts leverage Microsoft's powerful tools to create data-driven strategies, implement machine learning models, and build intelligent automation that transforms your business operations.",
      ],
      offerings: [
        {
          name: "Data Analytics",
          desc: "Transform raw data into meaningful insights with Power BI and Azure Synapse.",
          gradient: "bg-gradient-to-br from-[#2d1b4e] to-[#4a3a6e]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          ),
        },
        {
          name: "Machine Learning",
          desc: "Build and deploy ML models that solve real business challenges.",
          gradient: "bg-gradient-to-br from-[#00a9e0] to-[#0078d4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <path d="M12 2a9 9 0 0 0-9 9v4a9 9 0 0 0 18 0v-4a9 9 0 0 0-9-9z"></path>
              <path d="M12 2v20"></path>
            </svg>
          ),
        },
        {
          name: "AI Solutions",
          desc: "Implement intelligent automation and cognitive services.",
          gradient: "bg-gradient-to-br from-[#ff6b35] to-[#ff8c42]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
            </svg>
          ),
        },
        {
          name: "Data Governance",
          desc: "Ensure data quality, security, and compliance across your organization.",
          gradient: "bg-gradient-to-br from-[#00a9a5] to-[#4ecdc4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          ),
        },
      ],
    },
    automation: {
      title: "Intelligent Business Process Automation & Apps",
      description: [
        "Streamline operations and boost productivity with intelligent automation and custom application development. We help you eliminate manual processes and build solutions that scale with your business.",
        "From Power Platform solutions to custom applications, we create tools that empower your teams to work smarter, respond faster, and deliver better results.",
      ],
      offerings: [
        {
          name: "Power Platform",
          desc: "Build custom apps and workflows with low-code Power Platform tools.",
          gradient: "bg-gradient-to-br from-[#2d1b4e] to-[#4a3a6e]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          ),
        },
        {
          name: "Process Automation",
          desc: "Automate repetitive tasks with Power Automate and RPA.",
          gradient: "bg-gradient-to-br from-[#00a9e0] to-[#0078d4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6"></path>
            </svg>
          ),
        },
        {
          name: "Custom Applications",
          desc: "Develop tailored applications that meet your unique requirements.",
          gradient: "bg-gradient-to-br from-[#ff6b35] to-[#ff8c42]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          ),
        },
        {
          name: "Integration Services",
          desc: "Connect systems and data sources for seamless workflows.",
          gradient: "bg-gradient-to-br from-[#00a9a5] to-[#4ecdc4]",
          icon: (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white stroke-2 fill-none"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          ),
        },
      ],
    },
  };

  const servicesList = [
    { id: "dynamics", name: "Business Applications" },
    { id: "cloud", name: "Cloud Services" },
    { id: "data", name: "Data and Artificial Intelligence" },
    {
      id: "automation",
      name: "Intelligent Business Process Automation & Apps",
    },
  ];

  const currentService = services[activeService];

  return (
    <div className="bg-white py-12 md:py-20 px-4 md:px-5">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 lg:gap-20 items-start">
          {/* Left Section: Services List */}
          <div className="lg:sticky lg:top-32">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-accent leading-tight mb-6 md:mb-10">
              What can we help you with?
            </h2>

            <div className="flex flex-col">
              {servicesList.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`py-4 md:py-6 border-b border-gray-200 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    activeService === service.id
                      ? "bg-gray-50 pl-3 md:pl-5 pr-3 md:pr-5 -ml-3 md:-ml-5 border-l-4 border-l-[#2d1b4e]"
                      : "hover:pl-3"
                  }`}
                >
                  <span
                    className={`text-base sm:text-lg md:text-xl font-semibold transition-colors duration-300 ${
                      activeService === service.id
                        ? "text-brand-accent"
                        : "text-[#2d1b4e] hover:text-[#4a3a6e]"
                    }`}
                  >
                    {service.name}
                  </span>
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                      activeService === service.id
                        ? "bg-[#2d1b4e]"
                        : "bg-[#2d1b4e] hover:bg-[#4a3a6e] hover:translate-x-1"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 md:w-5 md:h-5 stroke-white stroke-2 fill-none"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Service Details */}
          <div className="bg-gray-50 rounded-xl p-5 sm:p-6 md:p-8 lg:p-12 min-h-100 md:min-h-125">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2d1b4e] mb-5 md:mb-8">
              {currentService.title}
            </h3>

            <div className="space-y-4 md:space-y-5 mb-8 md:mb-10">
              {currentService.description.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Offerings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
              {currentService.offerings.map((offering, index) => (
                <div
                  key={index}
                  className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:border-[#2d1b4e] hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 ${offering.gradient}`}
                  >
                    {offering.icon}
                  </div>
                  <h4 className="text-base md:text-lg font-semibold text-[#2d1b4e] mb-2">
                    {offering.name}
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-600">
                    {offering.desc}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-block mt-6 md:mt-8 bg-[#2d1b4e] text-white px-5 sm:px-6 md:px-10 py-2 sm:py-2.5 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:bg-[#4a3a6e] hover:-translate-y-1 hover:shadow-lg"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServicesSection;
