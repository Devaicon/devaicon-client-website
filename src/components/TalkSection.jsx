"use client";

import { useState } from "react";

const TalkSection = () => {
  const [activeTab, setActiveTab] = useState("callNow");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    countryCode: "+92",
    phone: "",
    project: "",
    budget: "",
    requestNDA: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

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
            {activeTab === "callNow" && (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Speak directly with our expert team and get immediate answers
                  to your questions.
                </p>
                <div>
                  <a
                    href="tel:8006427676"
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand hover:text-[#3d234b] transition-colors break-all"
                  >
                    03336224007
                  </a>
                </div>
                <button className="btn btn-primary rounded-md group text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 sm:py-3">
                  Call Now
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <div className="border-l-4 border-[#281333] pl-4 py-2">
                  <h3 className="font-bold text-gray-900 mb-2">Available:</h3>
                  <p className="text-gray-700">Monday - Friday</p>
                  <p className="text-gray-700">6:00 AM - 3:00 PM PT</p>
                </div>
              </div>
            )}

            {activeTab === "requestCallback" && (
              <form
                onSubmit={handleSubmit}
                className="space-y-3 sm:space-y-4 md:space-y-6"
              >
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      We recommend using your work email.
                    </p>
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent text-gray-600 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">Select the service you need *</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">
                      Mobile Development
                    </option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="px-2 py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent w-32 text-sm"
                  >
                    <option value="+92">PK +92</option>
                    <option value="+1">US +1</option>
                    <option value="+44">UK +44</option>
                    <option value="+91">IN +91</option>
                    <option value="+971">AE +971</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(xxx) xxxxxxx*"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <textarea
                    name="project"
                    placeholder="Please describe your project. *"
                    value={formData.project}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent resize-none text-sm sm:text-base"
                  ></textarea>
                </div>

                {/* Budget Selection */}
                <div>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent text-gray-600 appearance-none cursor-pointer text-sm sm:text-base"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">What is your budget? *</option>
                    <option value="less-than-50k">Less than USD 50,000</option>
                    <option value="50k-100k">USD 50,000 - USD 100,000</option>
                    <option value="100k-200k">USD 100,000 - USD 200,000</option>
                    <option value="200k-500k">USD 200,000 - USD 500,000</option>
                    <option value="above-500k">Above USD 500,000</option>
                  </select>
                </div>

                {/* NDA Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="requestNDA"
                    id="requestNDA"
                    checked={formData.requestNDA}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#281333] border-gray-300 rounded focus:ring-[#281333]"
                  />
                  <label
                    htmlFor="requestNDA"
                    className="text-gray-600 text-sm cursor-pointer"
                  >
                    Request NDA
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="form-submit-btn group text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 sm:py-3"
                  >
                    Submit
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            )}

            {activeTab === "talkToExpert" && (
              <form
                onSubmit={handleSubmit}
                className="space-y-3 sm:space-y-4 md:space-y-6"
              >
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      We recommend using your work email.
                    </p>
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent text-gray-600 appearance-none cursor-pointer text-sm sm:text-base"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">Select the service you need *</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">
                      Mobile Development
                    </option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div className="flex gap-1 sm:gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="px-1 sm:px-2 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent w-24 sm:w-32 text-xs sm:text-sm"
                  >
                    <option value="+92">PK +92</option>
                    <option value="+1">US +1</option>
                    <option value="+44">UK +44</option>
                    <option value="+91">IN +91</option>
                    <option value="+971">AE +971</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(xxx) xxxxxxx*"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent text-sm sm:text-base"
                  />
                </div>

                {/* How can we help */}
                <div>
                  <textarea
                    name="project"
                    placeholder="How can we help *"
                    value={formData.project}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-200 focus:border-[#281333] outline-none transition-colors bg-transparent resize-none text-sm sm:text-base"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="form-submit-btn w-full sm:w-auto group text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 sm:py-3"
                  >
                    Start Conversation
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Side - Background Image */}
          <div className="hidden lg:flex  p-0 relative overflow-hidden min-h-100 items-center justify-center order-2">
            {/* Background Image */}
            <div className="w-180 h-100">
              <img
                src="/bg.webp"
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

export default TalkSection;
