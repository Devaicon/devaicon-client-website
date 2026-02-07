"use client";

import { Award, Users, Network, Smile } from "lucide-react";
import ContactPageForm from "./ContactPageForm";

const ContactFormSection = () => {
  return (
    <div className="relative -mt-20 sm:-mt-24 lg:-mt-22 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-0">
            {/* Left Side - Contact Form */}
            <div className="p-8 sm:p-10 lg:p-14">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Start Your Project
                </h2>
                <p className="text-gray-600 text-base">
                  Share your vision. We&apos;ll respond within 24 hours.
                </p>
              </div>

              <ContactPageForm />
            </div>

            {/* Right Side - You're in good company */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 sm:p-10 lg:p-14 border-l border-gray-100">
              <div className="lg:sticky lg:top-8">
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    You&apos;re in good company
                  </h2>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="flex items-start gap-3.5">
                    <div className="flex-shrink-0 w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                      <Award className="w-5 h-5 text-[#3d234b]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1 tracking-tight">
                        18 YEARS OF EXCELLENCE
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Proven expertise, unmatched results
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex-shrink-0 w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                      <Network className="w-5 h-5 text-[#3d234b]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1 tracking-tight">
                        550+ PROJECTS COMPLETED
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Delivering project success no matter what
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex-shrink-0 w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                      <Users className="w-5 h-5 text-[#3d234b]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1 tracking-tight">
                        OVER 800 SPECIALISTS
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The experts behind your next breakthrough
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex-shrink-0 w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                      <Smile className="w-5 h-5 text-[#3d234b]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1 tracking-tight">
                        95% CLIENT SATISFACTION
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Always going beyond what&apos;s expected
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-7">
                  <div className="space-y-4 mb-7">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        CALL US
                      </h4>
                      <a
                        href="tel:+923418294097"
                        className="text-base font-semibold text-gray-900 hover:text-[#3d234b] transition-colors"
                      >
                        +923418294097
                      </a>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        EMAIL
                      </h4>
                      <a
                        href="mailto:contact@arbisoft.com"
                        className="text-base font-semibold text-gray-900 hover:text-[#3d234b] transition-colors"
                      >
                        contact@arbisoft.com
                      </a>
                    </div>
                  </div>

                  {/* Badge Placeholders */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      CERTIFICATIONS
                    </h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-12">
                          <span className="text-[0.625rem] font-bold text-gray-400">
                            LOGO
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-12">
                          <span className="text-[0.625rem] font-bold text-gray-400">
                            LOGO
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-12">
                          <span className="text-[0.625rem] font-bold text-gray-400">
                            LOGO
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-12">
                          <span className="text-[0.625rem] font-bold text-gray-400">
                            LOGO
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-12">
                          <span className="text-[0.625rem] font-bold text-gray-400">
                            LOGO
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-12">
                          <span className="text-[0.625rem] font-bold text-gray-400">
                            LOGO
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormSection;
