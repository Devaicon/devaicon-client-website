"use client";

import { useState } from "react";

const RequestCallbackForm = ({ onSubmit, compact = false }) => {
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
      {/* Title and Description */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Request a Callback
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Fill out the form below and we'll get back to you shortly.
        </p>
      </div>

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
          <option value="mobile-development">Mobile Development</option>
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
  );
};

export default RequestCallbackForm;
