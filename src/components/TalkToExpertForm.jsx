"use client";

import { useState } from "react";

const TalkToExpertForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    countryCode: "+92",
    phone: "",
    project: "",
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
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  return (
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
          <option value="mobile-development">Mobile Development</option>
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
  );
};

export default TalkToExpertForm;
