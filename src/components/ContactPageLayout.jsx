"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageSquare, UserCircle } from "lucide-react";
import CallNowTab from "./CallNowTab";
import RequestCallbackForm from "./RequestCallbackForm";
import TalkToExpertForm from "./TalkToExpertForm";

const ContactPageLayout = () => {
  const [activeTab, setActiveTab] = useState("callNow");

  return (
    <section className="pt-6 sm:pt-8 md:pt-16 pb-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Two Column Layout - Tabs and Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Column 1: Tab Buttons + Visit Our Office Content */}
            <div className="w-full sm:w-64 lg:w-96 flex-shrink-0 shadow-md bg-brand-primary">
              <div className="flex sm:flex-col p-5">
                {/* Call Now Tab */}
                <button
                  onClick={() => setActiveTab("callNow")}
                  className={`flex-1 sm:flex-none flex items-center gap-3 px-4 py-4 sm:py-5 text-left transition-all rounded-lg ${
                    activeTab === "callNow"
                      ? "bg-white/20 border-l-4 border-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Phone className="w-9 h-9 p-1.5 rounded-lg bg-white/20 text-white" />
                  <span className="text-white text-sm font-semibold">
                    Call Now
                  </span>
                </button>

                {/* Request Call Back Tab */}
                <button
                  onClick={() => setActiveTab("requestCallback")}
                  className={`flex-1 sm:flex-none flex items-center gap-3 px-4 py-4 sm:py-5 text-left transition-all rounded-lg ${
                    activeTab === "requestCallback"
                      ? "bg-white/20 border-l-4 border-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <MessageSquare className="w-9 h-9 p-1.5 rounded-lg bg-white/20 text-white" />
                  <span className="text-white text-sm font-semibold whitespace-nowrap">
                    Request Call Back
                  </span>
                </button>

                {/* Talk to Expert Tab */}
                <button
                  onClick={() => setActiveTab("talkToExpert")}
                  className={`flex-1 sm:flex-none flex items-center gap-3 px-4 py-4 sm:py-5 text-left transition-all rounded-lg ${
                    activeTab === "talkToExpert"
                      ? "bg-white/20 border-l-4 border-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <UserCircle className="w-9 h-9 p-1.5 rounded-lg bg-white/20 text-white" />
                  <span className="text-white text-sm font-semibold whitespace-nowrap">
                    Talk to Expert
                  </span>
                </button>
              </div>

              {/* Visit Our Office Content */}
              <div className="p-5 pt-0 hidden sm:block">
                <div className="border-t border-white/20 pt-6 space-y-8">
                  {/* Address */}
                  <div className="flex items-start gap-3 ps-6">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">
                        Address
                      </h3>
                      <p className="text-xs text-white/80 leading-relaxed">
                        123 Business Street
                        <br />
                        Suite 100
                        <br />
                        City, State 12345
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3 ps-6">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">
                        Phone
                      </h3>
                      <p className="text-xs text-white/80">+923418294097</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3 ps-6">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">
                        Email
                      </h3>
                      <p className="text-xs text-white/80">
                        contact@arbisoft.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Tab Content */}
            <div className="flex-1 p-6 sm:p-8">
              {activeTab === "callNow" && <CallNowTab />}
              {activeTab === "requestCallback" && <RequestCallbackForm />}
              {activeTab === "talkToExpert" && <TalkToExpertForm />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPageLayout;
