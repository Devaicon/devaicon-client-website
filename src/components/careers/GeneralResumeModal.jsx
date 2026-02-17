"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, CheckCircle } from "lucide-react";

/**
 * General Resume Submission Modal Component
 * Modal dialog with form for general job applications
 */
const GeneralResumeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    areaOfInterest: "",
    message: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after 3 seconds and close modal
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        linkedIn: "",
        portfolio: "",
        areaOfInterest: "",
        message: "",
        resume: null,
      });
      setFileName("");
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              >
                {/* Success State */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Resume Submitted!
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
                      Thank you for your interest in joining our team. We&apos;ll
                      review your resume and reach out if there&apos;s a good match.
                    </p>
                  </motion.div>
                )}

                {/* Header */}
                <div className="bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white p-6 lg:p-8">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    Submit Your Resume
                  </h2>
                  <p className="text-white/80">
                    We&apos;re always looking for talented individuals to join our team
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-200px)]"
                >
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Links */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Professional Links
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="linkedIn"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          id="linkedIn"
                          name="linkedIn"
                          value={formData.linkedIn}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all"
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="portfolio"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Portfolio / Website
                        </label>
                        <input
                          type="url"
                          id="portfolio"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all"
                          placeholder="https://johndoe.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Area of Interest */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Area of Interest
                    </h3>
                    <div>
                      <label
                        htmlFor="areaOfInterest"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        What type of role are you interested in?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="areaOfInterest"
                        name="areaOfInterest"
                        value={formData.areaOfInterest}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all"
                      >
                        <option value="">Select an area</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Product">Product</option>
                        <option value="Design">Design</option>
                        <option value="Business Development">Business Development</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Resume / CV
                    </h3>
                    <div>
                      <label
                        htmlFor="resume"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Upload Resume <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          required
                          className="hidden"
                        />
                        <label
                          htmlFor="resume"
                          className="flex items-center justify-center gap-3 w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#3d234b] transition-all cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <Upload className="w-6 h-6 text-gray-400" />
                          <div className="text-center">
                            <span className="text-gray-700 font-medium">
                              {fileName || "Click to upload resume"}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOC, DOCX (Max 5MB)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Additional Information
                    </h3>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Tell us about yourself
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d234b] focus:border-transparent transition-all resize-none"
                        placeholder="Share any relevant experience, skills, or information that would help us understand your background and career interests..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#3d234b] text-white px-6 py-3 rounded-lg hover:bg-[#2d1a3b] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Resume"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GeneralResumeModal;
