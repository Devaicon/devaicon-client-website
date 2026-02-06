"use client";

import { useState } from "react";
import CallNowTab from "./CallNowTab";
import RequestCallbackForm from "./RequestCallbackForm";
import TalkToExpertForm from "./TalkToExpertForm";

const TabbedContactCard = () => {
  const [activeTab, setActiveTab] = useState("callNow");

  const tabs = [
    { id: "callNow", label: "Call Now", icon: "📞" },
    { id: "requestCallback", label: "Request Call Back", icon: "📋" },
    { id: "talkToExpert", label: "Talk to Expert", icon: "💬" },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
            Have Questions? Let&apos;s <span className="text-brand">Talk.</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            We have got the answers to your questions.
          </p>
        </div>

        {/* Card with Tabs and Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Vertical Tabs Sidebar - 2 columns */}
            <div className="lg:col-span-2 bg-gradient-to-b from-gray-50 to-white border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex flex-row lg:flex-col p-2 lg:p-4 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-2 p-3 sm:p-4 rounded-xl transition-all duration-300 text-center lg:text-left ${
                      activeTab === tab.id
                        ? "bg-brand text-white shadow-lg scale-105"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-brand border border-gray-200"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{tab.icon}</span>
                    <span className="font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area - 10 columns */}
            <div className="lg:col-span-10 p-6 sm:p-8 md:p-10 lg:p-12">
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

export default TabbedContactCard;
