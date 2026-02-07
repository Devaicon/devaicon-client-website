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
    <section className="py-2 sm:py-4 md:py-1 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Side - Tabbed Form Section */}
          <div className="lg:w-[26.25rem] xl:w-[42.5rem]">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <div className="flex flex-col sm:flex-row h-full">
                {/* Left Sidebar with Tabs */}
                <div className="w-full sm:w-48 lg:w-56 flex-shrink-0 shadow-md bg-brand-primary">
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841556087595!2d-73.98823492346395!3d40.75889497138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzMyLjAiTiA3M8KwNTknMTMuOCJX!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Visit Our Office Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
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
                      123 Business Street
                      <br />
                      Suite 100
                      <br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-sm text-gray-600">+923418294097</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-sm text-gray-600">
                      contact@arbisoft.com
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
