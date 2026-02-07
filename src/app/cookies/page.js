"use client";

import TalkTabbedSection from "../../components/TalkTabbedSection";
import {
  Cookie,
  Settings,
  Activity,
  Eye,
  Globe,
  Clock,
  CheckCircle,
} from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#3d234b] via-[#4a2d5a] to-[#5a3464] text-white py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Cookie className="w-7 h-7 text-white" />
            </div>
            <div className="h-12 w-1 bg-white/30"></div>
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Legal Information
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            Cookie Policy
          </h1>
          <div className="flex items-center gap-2 text-white/70">
            <Clock className="w-5 h-5" />
            <p className="text-base sm:text-lg">
              Last Updated: December 24, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-12 py-12 sm:py-16 lg:py-20">
        <div className="space-y-16">
          {/* What Are Cookies */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  What Are Cookies
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed text-lg">
                Cookies are small text files stored on your device when you
                visit a website. They help improve functionality, performance,
                and user experience. This policy applies to Devaicon FZCO&apos;s
                websites, client portals, and SaaS platforms.
              </p>
            </div>
          </section>

          {/* Types of Cookies */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Types of Cookies We Use
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              Devaicon FZCO may use:
            </p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Strictly Necessary Cookies
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Required for authentication, security, and SaaS platform
                      functionality / website operation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Performance Cookies
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Measure platform and website performance and help analyze
                      website usage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Functionality Cookies
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Remember user preferences and settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Understand usage trends and collect aggregated, anonymized
                      usage data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Consent Cookies
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Store cookie consent preferences (EU/UK compliance).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  How We Use Cookies
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#3d234b]/5 to-white p-8 rounded-2xl border border-[#3d234b]/10">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Cookies are used to:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Ensure website functionality
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Analyze traffic and usage patterns
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Improve content and user experience
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Managing Cookies
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-sm mb-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                You can manage or disable cookies through your browser settings.
                Please note that disabling cookies may affect website
                functionality.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  EU and UK Users
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Will be presented with a cookie consent banner in compliance
                with GDPR and UK GDPR. You may manage or withdraw consent at any
                time through cookie settings or browser controls.
              </p>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Third-Party Cookies
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                Some cookies may be placed by third-party services such as
                analytics or performance monitoring tools. These providers have
                their own privacy policies.
              </p>
            </div>
          </section>

          {/* Updates to Policy */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Updates to This Policy
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                We may update this Cookie Policy from time to time. Updates will
                be published on our website.
              </p>
            </div>
          </section>
        </div>
      </div>

      <TalkTabbedSection />
    </div>
  );
};

export default CookiePolicy;
