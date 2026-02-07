"use client";

import TalkTabbedSection from "../../components/TalkTabbedSection";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Users,
  FileCheck,
  Clock,
  Activity,
} from "lucide-react";

const SecurityPolicy = () => {
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
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div className="h-12 w-1 bg-white/30"></div>
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Legal Information
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            Security Policy
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
          {/* Purpose & Scope */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Purpose & Scope
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                This Information Security Policy outlines Devaicon&apos;s
                commitment to protecting information assets belonging to the
                company, its clients, and partners. It supports our SaaS
                platforms and managed services environments, including
                cloud-hosted systems.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#3d234b]/5 to-white p-8 rounded-2xl border-l-4 border-[#3d234b]">
              <p className="text-gray-700 leading-relaxed text-lg">
                <strong className="text-gray-900 font-bold">Scope:</strong>{" "}
                Applies to all employees, contractors, and third-party service
                providers, as well as all information systems, networks,
                applications, and data.
              </p>
            </div>
          </section>

          {/* Security Principles */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Security Principles
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              Devaicon follows these core security principles:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Confidentiality
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Information is accessible only to authorized individuals.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Integrity
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Information is accurate and protected from unauthorized
                  modification.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Availability
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Information is accessible when required for business
                  operations.
                </p>
              </div>
            </div>
          </section>

          {/* Security Controls */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Security Controls
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#3d234b]/5 to-white p-8 rounded-2xl border border-[#3d234b]/10">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                We maintain enterprise-grade security controls aligned with
                ISO/IEC 27001, SOC 2, and cloud security best practices,
                including:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Role-based access control (RBAC)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Multi-factor authentication (MFA)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Encryption of data at rest and in transit
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Secure software development lifecycle (SSDLC)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Code reviews and penetration testing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Continuous monitoring and logging
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Incident Management */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Incident Management
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-orange-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                Security incidents are identified, reported, assessed, and
                responded to promptly. Corrective actions are implemented to
                prevent recurrence.
              </p>
            </div>
          </section>

          {/* Employee & Third-Party Responsibilities */}
          <section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Employee & Third-Party Responsibilities
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Employees</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  All personnel are required to follow company security
                  policies, protect credentials and confidential information,
                  and report suspected security incidents immediately.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Third Parties
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Third parties with access to Devaicon information systems must
                  comply with equivalent security standards and contractual
                  obligations.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Review */}
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Policy Review
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3d234b] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                This policy is reviewed periodically and updated to address
                emerging risks and regulatory requirements.
              </p>
            </div>
          </section>
        </div>
      </div>

      <TalkTabbedSection />
    </div>
  );
};

export default SecurityPolicy;
