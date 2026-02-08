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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Side - Tabbed Form Section */}
          <div className="lg:w-[420px] xl:w-[680px]">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <div className="flex flex-col sm:flex-row h-full">
                {/* Left Sidebar with Tabs */}
                <div className="w-full sm:w-[200px] lg:w-[220px] flex-shrink-0 shadow-md bg-brand-primary">
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
                      <Phone className="w-9 h-9 p-[6px] rounded-lg bg-white/20 text-white" />
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
                      <MessageSquare className="w-9 h-9 p-[6px] rounded-lg bg-white/20 text-white" />
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
                      <UserCircle className="w-9 h-9 p-[6px] rounded-lg bg-white/20 text-white" />
                      <span className="text-white text-sm font-semibold whitespace-nowrap">
                        Talk to Expert
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 p-6 sm:p-8">
                  {activeTab === "callNow" && <CallNowTab />}
                  {activeTab === "requestCallback" && <RequestCallbackForm />}
                  {activeTab === "talkToExpert" && <TalkToExpertForm />}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map and Visit Office */}
          <div className="flex-1 space-y-6">
            {/* Map Section */}
            <div className="bg-white rounded-2xl shadow-lg py-8 flex justify-center h-100">
              <Image
                src="/map.svg"
                alt="Office Location Map"
                width={600}
                height={400}
              />
            </div>

            {/* Visit Our Office Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#333333] mb-6">
                Visit our office
              </h2>
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Office 704, 7th Floor, 5EA Building (East Wing)
                      <br />
                      Dubai Airport Freezone Authority – DAFZA
                      <br />
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Phone
                    </h3>
                    <p className="text-sm text-gray-600">+971 50 702 0541</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Email
                    </h3>
                    <p className="text-sm text-gray-600">
                      contact@withvita.cloud
                    </p>
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
