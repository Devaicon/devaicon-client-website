"use client";

import { useState } from "react";

const ContactPageForm = ({ onSubmit }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information Section */}
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-900"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="John Smith"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3d234b]/20 focus:border-[#3d234b] transition-all duration-200 text-[0.9375rem]"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              Work Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3d234b]/20 focus:border-[#3d234b] transition-all duration-200 text-[0.9375rem]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-900"
            >
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="px-3 py-3.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d234b]/20 focus:border-[#3d234b] transition-all duration-200 text-base w-25 font-medium text-gray-700"
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
                id="phone"
                placeholder="(300) 1234567"
                value={formData.phone}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3d234b]/20 focus:border-[#3d234b] transition-all duration-200 text-base"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="service"
              className="block text-sm font-semibold text-gray-900"
            >
              Service Needed
            </label>
            <select
              name="service"
              id="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d234b]/20 focus:border-[#3d234b] transition-all duration-200 text-[0.9375rem] text-gray-700 font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12"
            >
              <option value="">Select a service</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="ui-ux-design">UI/UX Design</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="space-y-5 pt-5 border-t border-gray-100">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="budget"
              className="block text-sm font-semibold text-gray-900"
            >
              Project Budget
            </label>
            <select
              name="budget"
              id="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d234b]/20 focus:border-[#3d234b] transition-all duration-200 text-base text-gray-700 font-medium appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12"
            >
              <option value="">Select budget range</option>
              <option value="less-than-50k">Less than USD 50,000</option>
              <option value="50k-100k">USD 50,000 - USD 100,000</option>
              <option value="100k-200k">USD 100,000 - USD 200,000</option>
              <option value="200k-500k">USD 200,000 - USD 500,000</option>
              <option value="above-500k">Above USD 500,000</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex items-center h-13">
              <input
                type="checkbox"
                name="requestNDA"
                id="requestNDA"
                checked={formData.requestNDA}
                onChange={handleChange}
                className="w-5 h-5 text-[#3d234b] border-gray-300 rounded focus:ring-[#3d234b] focus:ring-2 focus:ring-offset-0 cursor-pointer transition-all"
              />
              <label
                htmlFor="requestNDA"
                className="ml-3 text-base font-semibold text-gray-900 cursor-pointer select-none"
              >
                Request NDA
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="project"
            className="block text-sm font-semibold text-gray-900"
          >
            Project Description
          </label>
          <textarea
            name="project"
            id="project"
            placeholder="Tell us about your project goals, timeline, and specific requirements..."
            value={formData.project}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3d234b]/20 focus:border-[#3d234b] transition-all duration-200 resize-none text-base leading-relaxed"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-5">
        <button
          type="submit"
          className="w-full sm:w-auto min-w-48 bg-[#3d234b] text-white px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-[#2d1a3b] focus:outline-none focus:ring-4 focus:ring-[#3d234b]/30 transition-all duration-200 shadow-lg shadow-[#3d234b]/20 hover:shadow-xl hover:shadow-[#3d234b]/30"
        >
          Submit Inquiry
        </button>
      </div>
    </form>
  );
};

export default ContactPageForm;
