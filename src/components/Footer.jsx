import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const industries = [
    { name: "Banking & Financial Services", href: "/industries/bfsi" },
    { name: "Public Sector", href: "/industries/public-sector" },
    { name: "Tourism & Hospitality", href: "/industries/hospitality" },
    { name: "Trading & Manufacturing", href: "/industries/manufacturing" },
    { name: "Retail", href: "/industries/retail" },
    {
      name: "Professional Services",
      href: "/industries/professional-services",
    },
    { name: "Non Profit", href: "/industries/nonprofit" },
  ];

  const capabilities = [
    { name: "Capabilities Overview", href: "/capabilities" },
    { name: "AI", href: "/capabilities/intelligent-systems-data" },
    {
      name: "Business Applications",
      href: "/capabilities/application-software-development",
    },
    {
      name: "Cloud Services",
      href: "/capabilities/infrastructure-enterprise-systems",
    },
    { name: "Data", href: "/capabilities/intelligent-systems-data" },
  ];

  const company = [
    { name: "Why Devaicon", href: "/about-devaicon" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Insights", href: "/insights" },
    { name: "What We Do", href: "/whatwedo" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Security Policy", href: "/security" },
    { name: "Cookies Policy", href: "/cookies" },
  ];

  const offices = [
    {
      name: "San Francisco",
      phone: "+1 415 555 0123",
      address: "500 Market Street, San Francisco, CA 94102",
    },
    {
      name: "Toronto",
      phone: "+1 416 555 7890",
      address: "250 Yonge Street, Toronto, ON M5B 2L7",
    },
    {
      name: "Mumbai",
      phone: "+91 22 5555 1234",
      address: "350 Marine Drive, Mumbai, India 400002",
    },
    {
      name: "Sydney",
      phone: "+61 2 5555 6789",
      address: "100 George Street, Sydney, NSW 2000",
    },
    {
      name: "Paris",
      phone: "+33 1 5555 4321",
      address: "75 Champs-Élysées, Paris, France 75008",
    },
  ];

  const certifications = [
    { name: "Top B2B" },
    { name: "Clutch Champion" },
    { name: "Best of Clutch" },
    { name: "ISO 27001" },
    { name: "Top Software" },
    { name: "ISO Certified" },
    { name: "AWS Partner" },
    { name: "Clutch Global" },
    { name: "Top Developers" },
    { name: "Clutch Leader" },
  ];

  return (
    <footer className="bg-[#3d234b] text-white pt-12 sm:pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-24 lg:pt-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Left Section - Logo, Tagline, Awards */}
          <div className="lg:col-span-4">
            {/* Logo */}

            <div className="flex items-center gap-3 mb-2 sm:mb-2">
              <h1
                className="text-3xl sm:text-4xl font-extralight"
                style={{ fontWeight: "300" }}
              >
                With
              </h1>
              <Image
                src="/logo_dark.svg"
                alt="Devaicon Logo"
                width={80}
                height={80}
                className="h-12 sm:h-12 w-auto"
              />
            </div>

            {/* Tagline */}
            <div className="mb-8 sm:mb-10">
              <h2
                className="text-2xl sm:text-3xl font-extralight leading-tight"
                style={{ fontWeight: "300" }}
              >
                If you can imagine it,
                <br />
                we can{" "}
                <span style={{ fontWeight: "700" }} className="italic">
                  build it
                </span>
              </h2>
            </div>

            {/* Awards & Certifications */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Awards & Certifications
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="cursor-pointer bg-[#281333] rounded-lg p-3 flex items-center justify-center aspect-square hover:bg-[#1f0f28] transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-300">
                        {cert.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Email */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:contact@devaicon.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base break-all"
                >
                  contact@withdevaicon.cloud
                </a>
              </div>

              {/* Social Media Icons */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Middle Section - Industries, Capabilities, Company */}
          <div className="lg:col-span-5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Industries */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                Industries
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {industries.map((industry, index) => (
                  <li key={index}>
                    <Link
                      href={industry.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {industry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Capabilities */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                Capabilities
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {capabilities.map((capability, index) => (
                  <li key={index}>
                    <Link
                      href={capability.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {capability.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                Company
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section - Global Offices */}
          <div className="lg:col-span-3 relative">
            {/* World Map Background */}
            <div className="absolute inset-0 opacity-10">
              <svg
                viewBox="0 0 300 200"
                className="w-full h-full"
                style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.3))" }}
              >
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="5" cy="5" r="1" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="300" height="200" fill="url(#dots)" />
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                Our Global Offices
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="text-sm">
                    <h4 className="font-bold text-white mb-2">{office.name}</h4>
                    {office.phone && (
                      <div className="flex items-start gap-2 mb-1">
                        <svg
                          className="w-4 h-4 mt-0.5 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-gray-300">{office.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-300">{office.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer - Policies and Copyright */}
        <div className="border-t border-gray-700 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
          <div className="flex flex-wrap justify-center gap-1 text-center">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="/security"
              className="hover:text-white transition-colors"
            >
              Security Policy
            </Link>
            <span>|</span>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
          <div className="text-center sm:text-right">
            © 2025 Devaicon. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
