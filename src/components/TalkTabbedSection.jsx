"use client";

import { useState } from "react";
import CallNowTab from "./CallNowTab";
import RequestCallbackForm from "./RequestCallbackForm";
import TalkToExpertForm from "./TalkToExpertForm";

const TalkTabbedSection = () => {
  const [activeTab, setActiveTab] = useState("callNow");

  return (
    <section className="pt-8 sm:pt-12 pb-0 bg-white">
      <div className="w-full px-0">
        <div className="grid lg:grid-cols-2 gap-0 shadow-2xl overflow-hidden">
          {/* Left Side - Contact Form */}
          <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Have Questions? Let&apos;s{" "}
              <span className="text-brand">Talk.</span>
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base">
              We have got the answers to your questions.
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 mb-4 sm:mb-6 md:mb-8">
              <button
                onClick={() => setActiveTab("callNow")}
                className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-colors text-xs sm:text-sm md:text-base ${
                  activeTab === "callNow"
                    ? "text-brand border-b-2 border-[#281333]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Call Now
              </button>
              <button
                onClick={() => setActiveTab("requestCallback")}
                className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-colors text-xs sm:text-sm md:text-base ${
                  activeTab === "requestCallback"
                    ? "text-brand border-b-2 border-[#281333]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Request Call Back
              </button>
              <button
                onClick={() => setActiveTab("talkToExpert")}
                className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-colors text-xs sm:text-sm md:text-base ${
                  activeTab === "talkToExpert"
                    ? "text-brand border-b-2 border-[#281333]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Talk to Expert
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "callNow" && <CallNowTab />}
            {activeTab === "requestCallback" && <RequestCallbackForm />}
            {activeTab === "talkToExpert" && <TalkToExpertForm />}
          </div>

          {/* Right Side - Background Image */}
          <div className="hidden lg:flex p-0 relative overflow-hidden min-h-100 items-center justify-center order-2">
            {/* Background Image */}
            <div className="w-180 h-100">
              <img
                src="/bg.png"
                alt="Background"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalkTabbedSection;
