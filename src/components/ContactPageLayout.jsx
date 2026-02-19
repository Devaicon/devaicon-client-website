"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageSquare, UserCircle } from "lucide-react";
import CallNowTab from "./CallNowTab";
import RequestCallbackForm from "./RequestCallbackForm";
import TalkToExpertForm from "./TalkToExpertForm";
import OptimizedMap from "./OptimizedMap";

const ContactPageLayout = () => {
  const [activeTab, setActiveTab] = useState("callNow");

  return (
    <section className="pt-6 sm:pt-8 md:pt-16 pb-8 md:pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10">
          {/* Left Side - Tabbed Form Section */}
          <div className="w-full lg:w-[480px] xl:w-[680px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <div className="flex flex-col sm:flex-row h-full">
                {/* Left Sidebar with Tabs */}
                <div className="w-full sm:w-[180px] md:w-[200px] lg:w-[200px] xl:w-[220px] flex-shrink-0 bg-brand-primary">
                  <div className="flex sm:flex-col gap-1 p-3 sm:p-4 md:p-5">
                    {/* Call Now Tab */}
                    <button
                      onClick={() => setActiveTab("callNow")}
                      className={`group flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left transition-all duration-300 rounded-lg sm:rounded-xl relative ${
                        activeTab === "callNow"
                          ? "bg-white/20 shadow-md text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {activeTab === "callNow" && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full hidden sm:block" />
                      )}
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-all ${
                        activeTab === "callNow" 
                          ? "bg-white/30" 
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}>
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap hidden min-[400px]:block">
                        Call Now
                      </span>
                    </button>

                    {/* Request Call Back Tab */}
                    <button
                      onClick={() => setActiveTab("requestCallback")}
                      className={`group flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left transition-all duration-300 rounded-lg sm:rounded-xl relative ${
                        activeTab === "requestCallback"
                          ? "bg-white/20 shadow-md text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {activeTab === "requestCallback" && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full hidden sm:block" />
                      )}
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-all ${
                        activeTab === "requestCallback" 
                          ? "bg-white/30" 
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}>
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap hidden min-[400px]:block">
                        Request Call
                      </span>
                    </button>

                    {/* Talk to Expert Tab */}
                    <button
                      onClick={() => setActiveTab("talkToExpert")}
                      className={`group flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left transition-all duration-300 rounded-lg sm:rounded-xl relative ${
                        activeTab === "talkToExpert"
                          ? "bg-white/20 shadow-md text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {activeTab === "talkToExpert" && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full hidden sm:block" />
                      )}
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-all ${
                        activeTab === "talkToExpert" 
                          ? "bg-white/30" 
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}>
                        <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap hidden min-[400px]:block">
                        Talk to Expert
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 p-5 sm:p-6 md:p-8 min-h-[400px]">
                  {activeTab === "callNow" && <CallNowTab />}
                  {activeTab === "requestCallback" && <RequestCallbackForm />}
                  {activeTab === "talkToExpert" && <TalkToExpertForm />}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map and Visit Office */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Map Section */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <OptimizedMap
                src="https://maps.google.com/maps?q=Business+Center,+Sharjah+Publishing+City+Free+Zone,+Sharjah&output=embed"
                title="Office Location Map"
                height="400px"
              />
            </div>

            {/* Visit Our Office Section */}
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Visit our office
              </h2>
              <div className="space-y-5 sm:space-y-6">
                {/* Address */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-sm sm:text-base">
                      Address
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Business Center
                      <br />
                      Sharjah Publishing City Free Zone
                      <br />
                      Sharjah, United Arab Emirates
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-sm sm:text-base">Phone</h3>
                    <a 
                      href="tel:+971507001805"
                      className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      +971 50 700 1805
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-sm sm:text-base">Email</h3>
                    <a 
                      href="mailto:contact@devaicon.com"
                      className="text-sm text-gray-600 hover:text-brand-primary transition-colors break-all"
                    >
                      contact@devaicon.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPageLayout;
