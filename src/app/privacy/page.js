"use client";

import TalkTabbedSection from "../../components/TalkTabbedSection";
import {
  Shield,
  Lock,
  Eye,
  Users,
  FileText,
  Globe,
  Clock,
  Mail,
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className=" relative bg-gradient-to-br from-[#3d234b] via-[#4a2d5a] to-[#5a3464] text-white py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-[59px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="h-12 w-1 bg-white/30"></div>
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Legal Information
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            Privacy Policy
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
          {/* Introduction */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Introduction
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed text-lg">
                Devaicon is committed to protecting the privacy and personal
                data of its clients, partners, website visitors, and employees.
                This Privacy Policy explains how we collect, use, disclose,
                store, and protect personal data in compliance with applicable
                UAE data protection laws and internationally recognized privacy
                principles.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Information We Collect
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              We may collect the following categories of information:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#3d234b] hover:shadow-lg transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Personal Identification Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Name, email address, phone number, job title, company name.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#3d234b] hover:shadow-lg transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Business Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Project requirements, contracts, invoices, and communications.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#3d234b] hover:shadow-lg transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Technical Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  IP address, browser type, operating system, device
                  identifiers, and usage logs.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#3d234b] hover:shadow-lg transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Recruitment Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  CVs, employment history, education, and professional details
                  (if you apply for a job).
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  How We Use Information
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#3d234b]/5 to-white p-8 rounded-2xl border border-[#3d234b]/10">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                We use collected information to:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Provide and manage our services
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Respond to inquiries and requests
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Improve website performance and user experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Manage contractual and legal obligations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Conduct recruitment and internal operations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Ensure security and prevent fraud
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* International Data Transfers & Sharing */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  International Data Transfers & Sharing
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                We do not sell personal data. We may share data with:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#3d234b] rounded-full flex-shrink-0 mt-2.5"></div>
                  <span className="text-gray-700 text-lg">
                    Trusted service providers and partners under confidentiality
                    agreements
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#3d234b] rounded-full flex-shrink-0 mt-2.5"></div>
                  <span className="text-gray-700 text-lg">
                    Legal or regulatory authorities when required by law
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#3d234b] rounded-full flex-shrink-0 mt-2.5"></div>
                  <span className="text-gray-700 text-lg">
                    Professional advisers (legal, financial, or auditors)
                  </span>
                </li>
              </ul>
              <div className="bg-gradient-to-r from-[#3d234b]/10 to-transparent p-6 rounded-xl border-l-4 border-[#3d234b]">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Where personal data is transferred outside the UAE, we ensure
                  appropriate safeguards are in place to protect data in
                  accordance with applicable laws and industry standards.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Data Retention
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                We retain personal data only for as long as necessary to fulfill
                the purposes outlined in this policy, unless a longer retention
                period is required or permitted by law.
              </p>
            </div>
          </section>

          {/* Data Subject Rights */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Data Subject Rights
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Depending on applicable law, you may have the right to:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 text-lg">
                  Access your personal data
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 text-lg">
                  Request correction or deletion
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 text-lg">
                  Object to or restrict processing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 text-lg">Withdraw consent</span>
              </li>
            </ul>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  EU/UK Residents
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Additionally have the right to data portability and to lodge a
                  complaint with a supervisory authority.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#3d234b]/5 to-white p-6 rounded-2xl border-2 border-[#3d234b]/20">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#3d234b]" />
                  Contact
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Requests may be sent to:{" "}
                  <a
                    href="mailto:privacy@devaicon.com"
                    className="text-[#3d234b] hover:underline font-semibold"
                  >
                    privacy@devaicon.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Security of Information */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Security of Information
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                We implement appropriate technical and organizational measures
                to safeguard personal data against unauthorized access, loss,
                misuse, or alteration.
              </p>
            </div>
          </section>

          {/* Policy Updates */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Policy Updates
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                We may update this Privacy Policy periodically. Changes will be
                posted on our website.
              </p>
            </div>
          </section>
        </div>
      </div>

      <TalkTabbedSection />
    </div>
  );
};

export default PrivacyPolicy;
