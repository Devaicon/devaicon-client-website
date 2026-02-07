"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CircleArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  Building2,
  Clock,
  Layers,
  Scale,
  Store,
  MapPin,
  Monitor,
  Briefcase,
  DollarSign,
  Heart,
  ShoppingCart,
  Factory,
  Zap,
  FlaskConical,
  Settings,
  Landmark,
  Shield,
  TrendingUp,
  HandCoins,
  Calculator,
  HardHat,
  Users,
  Ruler,
  Gavel,
  Code2,
  Truck,
  Building,
  GraduationCap,
  HandHelping,
  Globe,
  Cloud,
  Brain,
  Puzzle,
  Wrench,
  Rocket,
  Info,
  Phone,
  Newspaper,
  Search,
  Leaf,
  MessageSquare,
  Eye,
  Glasses,
  Palette,
  Target,
  Lightbulb,
  Server,
  PenTool,
  Lock,
  FileText,
  GitBranch,
  RefreshCw,
  BarChart3,
  Headphones,
} from "lucide-react";

// Icon mapping for navbar capability items
const navIconMap = {
  Brain,
  TrendingUp,
  MessageSquare,
  Eye,
  Glasses,
  Globe,
  Monitor,
  Palette,
  Cloud,
  Settings,
  Headphones,
  Target,
  Lightbulb,
  Server,
  Puzzle,
  PenTool,
  Lock,
  FileText,
  GitBranch,
  RefreshCw,
  BarChart3,
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showIndustriesDropdown, setShowIndustriesDropdown] = useState(false);
  const [showCapabilitiesDropdown, setShowCapabilitiesDropdown] =
    useState(false);
  const [showWhyVitaDropdown, setShowWhyVitaDropdown] = useState(false);
  const [showEngagementModelsDropdown, setShowEngagementModelsDropdown] =
    useState(false);
  const [hoveredIndustry, setHoveredIndustry] = useState(
    "Banking & Financial Services",
  );
  const [hoveredCapability, setHoveredCapability] = useState(
    "Intelligent Systems & Data",
  );
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  const industriesTimeoutRef = useRef(null);
  const capabilitiesTimeoutRef = useRef(null);
  const whyVitaTimeoutRef = useRef(null);
  const engagementModelsTimeoutRef = useRef(null);

  // Mobile dropdown states
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [mobileCapabilitiesOpen, setMobileCapabilitiesOpen] = useState(false);
  const [mobileWhyVitaOpen, setMobileWhyVitaOpen] = useState(false);
  const [mobileEngagementModelsOpen, setMobileEngagementModelsOpen] =
    useState(false);
  const [mobileExpandedIndustry, setMobileExpandedIndustry] = useState(null);
  const [mobileExpandedCapability, setMobileExpandedCapability] =
    useState(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeMobileMenu();
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const handleIndustriesEnter = () => {
    if (industriesTimeoutRef.current) {
      clearTimeout(industriesTimeoutRef.current);
    }
    setShowIndustriesDropdown(true);
  };

  const handleIndustriesLeave = () => {
    industriesTimeoutRef.current = setTimeout(() => {
      setShowIndustriesDropdown(false);
    }, 150);
  };

  const handleCapabilitiesEnter = () => {
    if (capabilitiesTimeoutRef.current) {
      clearTimeout(capabilitiesTimeoutRef.current);
    }
    setShowCapabilitiesDropdown(true);
  };

  const handleCapabilitiesLeave = () => {
    capabilitiesTimeoutRef.current = setTimeout(() => {
      setShowCapabilitiesDropdown(false);
    }, 150);
  };

  const handleWhyVitaEnter = () => {
    if (whyVitaTimeoutRef.current) {
      clearTimeout(whyVitaTimeoutRef.current);
    }
    setShowWhyVitaDropdown(true);
  };

  const handleWhyVitaLeave = () => {
    whyVitaTimeoutRef.current = setTimeout(() => {
      setShowWhyVitaDropdown(false);
    }, 150);
  };

  const handleEngagementModelsEnter = () => {
    if (engagementModelsTimeoutRef.current) {
      clearTimeout(engagementModelsTimeoutRef.current);
    }
    setShowEngagementModelsDropdown(true);
  };

  const handleEngagementModelsLeave = () => {
    engagementModelsTimeoutRef.current = setTimeout(() => {
      setShowEngagementModelsDropdown(false);
    }, 150);
  };

  const clientFeedbacks = [
    {
      company: "Travelliance",
      logo: "/blog1.jfif",
      feedback:
        "Arbisoft partnered with Travelliance (TVA) to develop Accounting, Reporting, & Operations solutions. We helped cut downtime to zero, providing 24/7 support, and making sure their database of 7 million users functions smoothly.",
      clientName: "Dori Hotoran",
      clientDesignation: "Director Global Operations - Travelliance",
      clientImage: "/blog1.jfif",
    },
    {
      company: "TechCorp Solutions",
      logo: "/blog3.jfif",
      feedback:
        "Working with Devaicon transformed our digital infrastructure. Their expertise in cloud migration and AI integration helped us reduce operational costs by 40% while improving system performance and scalability.",
      clientName: "Sarah Mitchell",
      clientDesignation: "CTO - TechCorp Solutions",
      clientImage: "/blog3.jfif",
    },
    {
      company: "GlobalRetail Inc",
      logo: "/event1.avif",
      feedback:
        "Devaicon's dedicated team approach ensured seamless implementation of our enterprise resource planning system. Their 24/7 support and proactive monitoring have been instrumental in our digital transformation journey.",
      clientName: "Michael Chen",
      clientDesignation: "VP of Operations - GlobalRetail Inc",
      clientImage: "/event1.avif",
    },
  ];

  const handlePrevFeedback = () => {
    setCurrentFeedbackIndex((prev) =>
      prev === 0 ? clientFeedbacks.length - 1 : prev - 1,
    );
  };

  const handleNextFeedback = () => {
    setCurrentFeedbackIndex((prev) =>
      prev === clientFeedbacks.length - 1 ? 0 : prev + 1,
    );
  };

  const capabilitiesData = [
    {
      name: "Intelligent Systems & Data",
      icon: <Brain className="w-5 h-5" />,
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
      icon: <Briefcase className="w-5 h-5" />,
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
      icon: <Cloud className="w-5 h-5" />,
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
      icon: <TrendingUp className="w-5 h-5" />,
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
      icon: <GraduationCap className="w-5 h-5" />,
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

  const industriesData = [
    {
      name: "Banking & Financial Services",
      id: "bfsi",
      icon: <DollarSign className="w-5 h-5" />,
      description:
        "Devaicon serves banks and financial institutions across the UAE and GCC with secure and compliant digital platforms. Financial organizations manage complex operations every day. These include finance control, customer data, risk management, and regulatory reporting.",
    },
    {
      name: "Public Sector",
      id: "public-sector",
      icon: <Building2 className="w-5 h-5" />,
      description:
        "Devaicon helps public sector organizations modernize services and improve governance. Government entities manage large volumes of data, finance, and citizen services. Devaicon delivers digital platforms that support transparency, efficiency, and accountability.",
    },
    {
      name: "Tourism & Hospitality",
      id: "hospitality",
      icon: <MapPin className="w-5 h-5" />,
      description:
        "Devaicon supports hotels, resorts, and travel businesses with connected digital systems. The hospitality industry faces high service expectations and operational pressure. Devaicon helps manage bookings, guest engagement, finance, and daily operations.",
    },
    {
      name: "Trading & Manufacturing",
      id: "manufacturing",
      icon: <Factory className="w-5 h-5" />,
      description:
        "Devaicon helps trading and manufacturing companies manage supply chains and production systems. These businesses require accuracy, speed, and visibility. Devaicon connects inventory, production, logistics, and finance into a single digital view.",
    },
    {
      name: "Retail",
      id: "retail",
      icon: <Store className="w-5 h-5" />,
      description:
        "Devaicon supports retailers in managing sales, inventory, and customer engagement. Retail businesses operate across physical and digital channels. Devaicon connects these channels through unified commerce platforms.",
    },
    {
      name: "Professional Services",
      id: "professional-services",
      icon: <Briefcase className="w-5 h-5" />,
      description:
        "Devaicon supports professional service firms with structured digital platforms. These firms manage projects, clients, billing, and compliance. Devaicon helps simplify operations while improving service delivery and transparency.",
    },
    {
      name: "Non Profit",
      id: "nonprofit",
      icon: <Heart className="w-5 h-5" />,
      description:
        "Devaicon helps non-profit organizations manage funding, programs, and reporting. These organizations need transparency and accountability. Devaicon delivers platforms that support impact tracking and compliance while keeping operations efficient.",
    },
    {
      name: "Education",
      id: "education",
      icon: <GraduationCap className="w-5 h-5" />,
      description:
        "Devaicon empowers educational institutions with integrated digital platforms for student management, learning, and administration. Schools and universities manage complex academic operations, student data, and teaching resources.",
    },
  ];

  const solutionsCategories = [
    {
      name: "Architecture & Engineering",
      icon: <Home className="w-5 h-5" />,
    },
    { name: "Government", icon: <Building2 className="w-5 h-5" /> },
    { name: "Rental", icon: <Clock className="w-5 h-5" /> },
    { name: "Construction", icon: <Layers className="w-5 h-5" /> },
    { name: "Legal", icon: <Scale className="w-5 h-5" /> },
    { name: "Retail", icon: <Store className="w-5 h-5" /> },
    {
      name: "Consulting",
      icon: <MapPin className="w-5 h-5" />,
      highlighted: true,
    },
    { name: "Manufacturing", icon: <Monitor className="w-5 h-5" /> },
    { name: "Service", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Financial Services", icon: <DollarSign className="w-5 h-5" /> },
    { name: "Non-Profit", icon: <Heart className="w-5 h-5" /> },
    { name: "Wholesale", icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-center">
        <nav
          className={`bg-white border-2 border-gray-200 mx-auto w-full xl:w-[calc(100%-25rem)] h-20 lg:h-24 px-4 sm:px-8 lg:px-6 xl:px-15 py-4 lg:py-8 rounded-none transition-all duration-200 ${
            showIndustriesDropdown ||
            showCapabilitiesDropdown ||
            showWhyVitaDropdown ||
            showEngagementModelsDropdown
              ? " border-b-0"
              : "lg:rounded-b-3xl"
          }`}
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center flex-shrink-0"
              aria-label="Devaicon - Go to homepage"
            >
              <Image
                src="/logo.svg"
                alt="Devaicon Logo"
                width={124}
                height={51}
                priority
                className="object-contain w-20 sm:w-24 lg:w-28 xl:w-32 h-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <ul
              className="hidden lg:flex items-center gap-3 lg:gap-4 xl:gap-6 2xl:gap-8"
              role="list"
            >
              {/* Industries Dropdown */}
              <li
                className="relative"
                onMouseEnter={handleIndustriesEnter}
                onMouseLeave={handleIndustriesLeave}
              >
                <Link
                  href="/industries"
                  className="text-gray-700 hover:text-[#3d234b] transition-colors font-bold text-xs xl:text-sm relative whitespace-nowrap flex items-center gap-1"
                >
                  Industries
                  <ChevronDown
                    className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${
                      showIndustriesDropdown ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </li>

              {/* Capabilities Dropdown */}
              <li
                className="relative"
                onMouseEnter={handleCapabilitiesEnter}
                onMouseLeave={handleCapabilitiesLeave}
              >
                <Link
                  href="/capabilities/intelligent-systems-data"
                  className="text-gray-700 hover:text-[#3d234b] transition-colors font-bold text-xs xl:text-sm relative whitespace-nowrap flex items-center gap-1"
                >
                  Capabilities
                  <ChevronDown
                    className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${
                      showCapabilitiesDropdown ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </li>

              {/* Insights Link */}
              <li>
                <Link
                  href="/insights"
                  className="text-gray-700 hover:text-[#3d234b] transition-colors font-bold text-xs xl:text-sm relative whitespace-nowrap"
                >
                  Insights
                </Link>
              </li>

              {/* Engagement Models Dropdown */}
              <li
                className="relative"
                onMouseEnter={handleEngagementModelsEnter}
                onMouseLeave={handleEngagementModelsLeave}
              >
                <Link
                  href="/engagement-models"
                  className="text-gray-700 hover:text-[#3d234b] transition-colors font-bold text-xs xl:text-sm relative whitespace-nowrap flex items-center gap-1"
                >
                  Engagement Models
                  <ChevronDown
                    className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${
                      showEngagementModelsDropdown ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </li>

              {/* Why Devaicon Dropdown */}
              <li
                className="relative"
                onMouseEnter={handleWhyVitaEnter}
                onMouseLeave={handleWhyVitaLeave}
              >
                <Link
                  href="#"
                  className="text-gray-700 hover:text-[#3d234b] transition-colors font-bold text-xs xl:text-sm relative whitespace-nowrap flex items-center gap-1"
                >
                  Why Devaicon
                  <ChevronDown
                    className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${
                      showWhyVitaDropdown ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </li>
            </ul>

            {/* Desktop CTA */}
            <Link
              href="/contact-us"
              className="hidden lg:flex items-center gap-1 xl:gap-2 border-gray-300 text-gray-700 hover:border-[#3d234b] hover:text-[#3d234b] transition-all duration-200 font-medium text-xs xl:text-sm group whitespace-nowrap"
              aria-label="Get started with Devaicon"
            >
              <span>Get Started</span>
              <CircleArrowRight className="w-5 h-5 xl:w-7 xl:h-7" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Industries Dropdown */}
      {showIndustriesDropdown && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-24 w-full xl:w-[calc(100%-25rem)] z-40 animate-fadeInScale flex justify-center"
          onMouseEnter={handleIndustriesEnter}
          onMouseLeave={handleIndustriesLeave}
        >
          <div className="bg-white shadow-2xl rounded-b-3xl border-x-2 border-b-2 border-gray-200 overflow-hidden w-full flex">
            {/* Left Section - Industry List */}
            <div className="w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-slideInLeft">
              <div className="space-y-2 stagger-animation">
                {industriesData.map((industry, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredIndustry(industry.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      hoveredIndustry === industry.name
                        ? "bg-white shadow-lg scale-[1.02] border-l-4 border-[#3d234b]"
                        : "hover:bg-white/60 hover:shadow-sm"
                    }`}
                  >
                    <div className="text-[#3d234b]">{industry.icon}</div>
                    <span className="text-sm font-medium text-gray-900 flex-1">
                      {industry.name}
                    </span>
                    {hoveredIndustry === industry.name && (
                      <ChevronRight className="w-4 h-4 text-[#3d234b]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Industry Details */}
            <div className="w-2/3 p-8 animate-slideInRight">
              {industriesData.map(
                (industry) =>
                  hoveredIndustry === industry.name && (
                    <div key={industry.name}>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {industry.name}
                      </h3>
                      <p className="text-gray-700 text-base leading-relaxed mb-6">
                        {industry.description}
                      </p>

                      <Link
                        href={`/industries#${industry.id}`}
                        className="bg-transparent border-2 border-[#3d234b] text-[#3d234b] px-6 py-2.5 rounded-md font-semibold hover:bg-[#3d234b] hover:text-white transition-all duration-200 flex items-center gap-2 w-fit"
                      >
                        LEARN MORE
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Capabilities Dropdown */}
      {showCapabilitiesDropdown && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-24 w-full xl:w-[calc(100%-25rem)] z-40 animate-fadeInScale flex justify-center"
          onMouseEnter={handleCapabilitiesEnter}
          onMouseLeave={handleCapabilitiesLeave}
        >
          <div className="bg-white shadow-2xl rounded-b-3xl border-x-2 border-b-2 border-gray-200 overflow-hidden w-full flex">
            {/* Left Section - Capabilities List */}
            <div className="w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-slideInLeft">
              <div className="space-y-2 stagger-animation">
                {capabilitiesData.map((capability, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCapability(capability.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      hoveredCapability === capability.name
                        ? "bg-white shadow-lg scale-[1.02] border-l-4 border-[#3d234b]"
                        : "hover:bg-white/60 hover:shadow-sm"
                    }`}
                  >
                    <div className="text-[#3d234b]">{capability.icon}</div>
                    <span className="text-sm font-medium text-gray-900 flex-1">
                      {capability.name}
                    </span>
                    {hoveredCapability === capability.name && (
                      <ChevronRight className="w-4 h-4 text-[#3d234b]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Capability Details */}
            <div className="w-2/3 p-8 animate-slideInRight">
              {capabilitiesData.map(
                (capability) =>
                  hoveredCapability === capability.name && (
                    <div key={capability.name}>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {capability.name}
                      </h3>
                      <p className="text-gray-700 text-base leading-relaxed mb-6">
                        {capability.description}
                      </p>

                      {/* Items */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {capability.items.map((item, idx) => {
                          const IconComponent = navIconMap[item.icon];
                          return (
                            <Link
                              key={idx}
                              href={`/capabilities/${
                                hoveredCapability ===
                                "Intelligent Systems & Data"
                                  ? "intelligent-systems-data"
                                  : hoveredCapability ===
                                      "Application & Software"
                                    ? "application-software-development"
                                    : hoveredCapability ===
                                        "Infrastructure & Enterprise"
                                      ? "infrastructure-enterprise-systems"
                                      : hoveredCapability ===
                                          "Consulting & Transformation"
                                        ? "consulting-transformation"
                                        : "open-edx-services"
                              }#${item.id}`}
                              className="flex items-center gap-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center justify-center h-8 w-8 rounded-lg text-[#3d234b]">
                                {IconComponent && (
                                  <IconComponent className="w-5 h-5" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {item.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                      <Link
                        href={`/capabilities/${
                          hoveredCapability === "Intelligent Systems & Data"
                            ? "intelligent-systems-data"
                            : hoveredCapability === "Application & Software"
                              ? "application-software-development"
                              : hoveredCapability ===
                                  "Infrastructure & Enterprise"
                                ? "infrastructure-enterprise-systems"
                                : hoveredCapability ===
                                    "Consulting & Transformation"
                                  ? "consulting-transformation"
                                  : "open-edx-services"
                        }`}
                        className="bg-transparent border-2 border-[#3d234b] text-[#3d234b] px-6 py-2.5 rounded-md font-semibold hover:bg-[#3d234b] hover:text-white transition-all duration-200 flex items-center gap-2 w-fit"
                      >
                        LEARN MORE
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Engagement Models Dropdown */}
      {showEngagementModelsDropdown && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-24 w-full xl:w-[calc(100%-25rem)] z-40 animate-fadeInScale flex justify-center"
          onMouseEnter={handleEngagementModelsEnter}
          onMouseLeave={handleEngagementModelsLeave}
        >
          <div className="bg-white shadow-2xl rounded-b-3xl border-x-2 border-b-2 border-gray-200 overflow-hidden w-full p-6">
            <div className="flex gap-6">
              {/* Left Section - Client Feedback Carousel */}
              <div className="w-1/2 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6 rounded-2xl animate-slideInLeft shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Hear From Our Clients
                </h3>

                <div className="relative">
                  {/* Feedback Content */}
                  <div className="transition-all duration-500 ease-in-out">
                    {/* Company Logo */}
                    <div className="mb-3">
                      <Image
                        src={clientFeedbacks[currentFeedbackIndex].logo}
                        alt={clientFeedbacks[currentFeedbackIndex].company}
                        width={100}
                        height={32}
                        className="h-8 w-auto object-contain"
                      />
                    </div>

                    {/* Feedback Text */}
                    <div className="mb-0 min-h-17">
                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        &quot;
                        {clientFeedbacks[currentFeedbackIndex].feedback}
                        &quot;
                      </p>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center gap-1 mb-3">
                      <Image
                        src={clientFeedbacks[currentFeedbackIndex].clientImage}
                        alt={clientFeedbacks[currentFeedbackIndex].clientName}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#3d234b]"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {clientFeedbacks[currentFeedbackIndex].clientName}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {
                            clientFeedbacks[currentFeedbackIndex]
                              .clientDesignation
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={handlePrevFeedback}
                      className="p-2 rounded-full bg-white hover:bg-[#3d234b] text-[#3d234b] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
                      aria-label="Previous feedback"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextFeedback}
                      className="p-2 rounded-full bg-white hover:bg-[#3d234b] text-[#3d234b] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
                      aria-label="Next feedback"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {/* Indicators */}
                    <div className="flex gap-2 ml-auto">
                      {clientFeedbacks.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentFeedbackIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentFeedbackIndex
                              ? "bg-[#3d234b] w-8"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          aria-label={`Go to feedback ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Engagement Model Links */}
              <div className="w-1/2 animate-slideInRight">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {/* Link 1 */}
                  <div>
                    <Link
                      href="/engagement-models/software-development-outsourcing"
                      className="group inline-block"
                    >
                      <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#3d234b] transition-colors border-b-2 border-[#3d234b] pb-1">
                        Software Development Outsourcing
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">
                      Building your software with our expert team.
                    </p>
                  </div>

                  {/* Link 2 */}
                  <div>
                    <Link
                      href="/engagement-models/dedicated-teams"
                      className="group inline-block"
                    >
                      <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#3d234b] transition-colors border-b-2 border-[#3d234b] pb-1">
                        Dedicated Teams
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">
                      Long term, integrated teams for your project success.
                    </p>
                  </div>

                  {/* Link 3 */}
                  <div>
                    <Link
                      href="/engagement-models/it-staff-augmentation"
                      className="group inline-block"
                    >
                      <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#3d234b] transition-colors border-b-2 border-[#3d234b] pb-1">
                        IT Staff Augmentation
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">
                      Quick engagement to boost your team.
                    </p>
                  </div>

                  {/* Link 4 */}
                  <div>
                    <Link
                      href="/engagement-models/new-venture-partnership"
                      className="group inline-block"
                    >
                      <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#3d234b] transition-colors border-b-2 border-[#3d234b] pb-1">
                        New Venture Partnership
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">
                      Collaborative launch for your business success.
                    </p>
                  </div>

                  {/* Discover More Button */}
                  <div className="col-span-2 pt-3">
                    <Link
                      href="/engagement-models"
                      className="bg-transparent border-2 border-[#3d234b] text-[#3d234b] px-6 py-2.5 rounded-md font-semibold hover:bg-[#3d234b] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                    >
                      DISCOVER MORE
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Devaicon Dropdown */}
      {showWhyVitaDropdown && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-24 w-full xl:w-[calc(100%-25rem)] z-40 animate-fadeInScale flex items-center"
          onMouseEnter={handleWhyVitaEnter}
          onMouseLeave={handleWhyVitaLeave}
        >
          <div className="bg-white shadow-2xl rounded-b-3xl border-x-2 border-b-2 border-gray-200 overflow-hidden w-full p-8 px-64">
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 stagger-animation">
              <Link
                href="/about-devaicon"
                className="flex flex-col items-center text-center gap-4 p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#3d234b]"
              >
                <div className="text-[#3d234b] group-hover:scale-110 transition-transform duration-300 p-3 rounded-full group-hover:bg-[#3d234b] group-hover:text-white group-hover:shadow-lg">
                  <Info className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    About Devaicon
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Learn about our mission and values
                  </p>
                </div>
              </Link>

              <Link
                href="/whatwedo"
                className="flex flex-col items-center text-center gap-4 p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#3d234b]"
              >
                <div className="text-[#3d234b] group-hover:scale-110 transition-transform duration-300 p-3 rounded-full group-hover:bg-[#3d234b] group-hover:text-white group-hover:shadow-lg">
                  <Rocket className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    What We Do
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Explore our solutions and services
                  </p>
                </div>
              </Link>

              <Link
                href="/contact-us"
                className="flex flex-col items-center text-center gap-4 p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#3d234b]"
              >
                <div className="text-[#3d234b] group-hover:scale-110 transition-transform duration-300 p-3 rounded-full group-hover:bg-[#3d234b] group-hover:text-white group-hover:shadow-lg">
                  <Phone className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    Contact
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Get in touch with our team
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[70] lg:hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={closeMobileMenu}
                >
                  <Image
                    src="/logo.svg"
                    alt="Devaicon Logo"
                    width={90}
                    height={37}
                    className="object-contain"
                  />
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav
                className="flex-1 overflow-y-auto p-4"
                aria-label="Mobile navigation"
              >
                <div className="space-y-2">
                  {/* Industries Dropdown */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() =>
                        setMobileIndustriesOpen(!mobileIndustriesOpen)
                      }
                      className="w-full flex items-center justify-between text-gray-900 hover:bg-gray-50 px-4 py-3 text-base font-medium transition-colors rounded-lg"
                    >
                      <span>Industries</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileIndustriesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileIndustriesOpen && (
                      <div className="bg-gray-50 px-2 pb-3 space-y-2 animate-slideDown rounded-lg mt-1">
                        {industriesData.map((industry, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 last:border-0"
                          >
                            <button
                              onClick={() =>
                                setMobileExpandedIndustry(
                                  mobileExpandedIndustry === industry.name
                                    ? null
                                    : industry.name,
                                )
                              }
                              className="w-full flex items-start gap-2 py-2 px-2 text-left rounded-lg hover:bg-white"
                            >
                              <div className="text-[#3d234b] mt-1">
                                {industry.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {industry.name}
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                                      mobileExpandedIndustry === industry.name
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </div>
                                {mobileExpandedIndustry === industry.name && (
                                  <div className="mt-2 space-y-2 animate-slideDown">
                                    <p className="text-xs text-gray-600 mb-2">
                                      {industry.description}
                                    </p>
                                    <Link
                                      href={`/industries#${industry.id}`}
                                      onClick={closeMobileMenu}
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3d234b] hover:underline mt-2"
                                    >
                                      Learn More
                                      <ChevronRight className="w-3 h-3" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Capabilities Dropdown */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() =>
                        setMobileCapabilitiesOpen(!mobileCapabilitiesOpen)
                      }
                      className="w-full flex items-center justify-between text-gray-900 hover:bg-gray-50 px-4 py-3 text-base font-medium transition-colors rounded-lg"
                    >
                      <span>Capabilities</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileCapabilitiesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileCapabilitiesOpen && (
                      <div className="bg-gray-50 px-2 pb-3 space-y-2 animate-slideDown rounded-lg mt-1">
                        {capabilitiesData.map((capability, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 last:border-0"
                          >
                            <button
                              onClick={() =>
                                setMobileExpandedCapability(
                                  mobileExpandedCapability === capability.name
                                    ? null
                                    : capability.name,
                                )
                              }
                              className="w-full flex items-start gap-2 py-2 px-2 text-left rounded-lg hover:bg-white"
                            >
                              <div className="text-[#3d234b] mt-1">
                                {capability.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {capability.name}
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                                      mobileExpandedCapability ===
                                      capability.name
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </div>
                                {mobileExpandedCapability ===
                                  capability.name && (
                                  <div className="mt-2 space-y-3 animate-slideDown">
                                    <p className="text-xs text-gray-600">
                                      {capability.description}
                                    </p>
                                    <div className="space-y-2">
                                      {capability.items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 p-2"
                                        >
                                          <div className="flex items-center justify-center h-6 w-6">
                                            <Image
                                              src={item.icon}
                                              alt={item.name}
                                              width={20}
                                              height={20}
                                              className="w-4 h-4"
                                            />
                                          </div>
                                          <span className="text-xs font-medium text-gray-700">
                                            {item.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <Link
                                      href="/capabilities"
                                      onClick={closeMobileMenu}
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3d234b] hover:underline mt-2"
                                    >
                                      LEARN MORE
                                      <ChevronRight className="w-3 h-3" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Insights Link */}
                  <Link
                    href="/insights"
                    className="block text-gray-900 hover:bg-gray-50 px-4 py-3 text-base font-medium border-b border-gray-100 transition-colors rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Insights
                  </Link>

                  {/* Engagement Models Dropdown */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() =>
                        setMobileEngagementModelsOpen(
                          !mobileEngagementModelsOpen,
                        )
                      }
                      className="w-full flex items-center justify-between text-gray-900 hover:bg-gray-50 px-4 py-3 text-base font-medium transition-colors rounded-lg"
                    >
                      <span>Engagement Models</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileEngagementModelsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileEngagementModelsOpen && (
                      <div className="bg-gray-50 px-2 pb-3 space-y-2 animate-slideDown rounded-lg mt-1">
                        <Link
                          href="/engagement-models/software-development-outsourcing"
                          className="block p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            Software Development Outsourcing
                          </div>
                          <div className="text-xs text-gray-600">
                            Building your software with our expert team.
                          </div>
                        </Link>
                        <Link
                          href="/engagement-models/dedicated-teams"
                          className="block p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            Dedicated Teams
                          </div>
                          <div className="text-xs text-gray-600">
                            Long term, integrated teams for your project
                            success.
                          </div>
                        </Link>
                        <Link
                          href="/engagement-models/it-staff-augmentation"
                          className="block p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            IT Staff Augmentation
                          </div>
                          <div className="text-xs text-gray-600">
                            Quick engagement to boost your team.
                          </div>
                        </Link>
                        <Link
                          href="/engagement-models/new-venture-partnership"
                          className="block p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            New Venture Partnership
                          </div>
                          <div className="text-xs text-gray-600">
                            Collaborative launch for your business success.
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Why Devaicon Dropdown */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setMobileWhyVitaOpen(!mobileWhyVitaOpen)}
                      className="w-full flex items-center justify-between text-gray-900 hover:bg-gray-50 px-4 py-3 text-base font-medium transition-colors rounded-lg"
                    >
                      <span>Why Devaicon</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileWhyVitaOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileWhyVitaOpen && (
                      <div className="bg-gray-50 px-2 pb-3 space-y-2 animate-slideDown rounded-lg mt-1">
                        <Link
                          href="/about-devaicon"
                          className="flex items-center gap-3 p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Info className="w-5 h-5 text-[#3d234b]" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              About Devaicon
                            </div>
                            <div className="text-xs text-gray-600">
                              Learn about our mission
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="/whatwedo"
                          className="flex items-center gap-3 p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Rocket className="w-5 h-5 text-[#3d234b]" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              What We Do
                            </div>
                            <div className="text-xs text-gray-600">
                              Explore our solutions
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="/contact-us"
                          className="flex items-center gap-3 p-3 rounded-md bg-white hover:bg-purple-50 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Phone className="w-5 h-5 text-[#3d234b]" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              Contact
                            </div>
                            <div className="text-xs text-gray-600">
                              Get in touch with us
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              {/* Mobile CTA */}
              <div className="p-6 border-t border-gray-200">
                <Link
                  href="/contact-us"
                  className="flex items-center justify-center gap-2 w-full bg-[#3d234b] text-white px-6 py-3.5 rounded-lg hover:bg-[#2d1a3b] transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  <span>Get Started</span>
                  <CircleArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
