"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Building2,
  ArrowLeft,
  Code,
  Brain,
  Cloud,
  Database,
  Users,
  Check,
} from "lucide-react";
import JobApplicationModal from "./JobApplicationModal";

// Icon mapping
const iconMap = {
  Code: Code,
  Brain: Brain,
  Cloud: Cloud,
  Database: Database,
  Users: Users,
};

/**
 * Job Detail Page Component
 * Displays comprehensive information about a specific job opening
 */
const JobDetailPage = ({ job }) => {
  const IconComponent = iconMap[job.icon] || Code;
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.shortDescription,
        url: window.location.href,
      });
    }
    setIsShared(true);
    setTimeout(() => {
      setIsShared(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3d234b] via-[#4a2d5a] to-[#5a3464] text-white py-16 lg:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15 mt-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start gap-6 mb-8"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full">
                  {job.department}
                </span>
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full">
                  {job.type}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {job.title}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
                {job.shortDescription}
              </p>
            </div>
          </motion.div>

          {/* Job Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/70 text-sm">Location</div>
                <div className="text-white font-semibold">{job.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/70 text-sm">Experience</div>
                <div className="text-white font-semibold">{job.experience}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/70 text-sm">Employment Type</div>
                <div className="text-white font-semibold">{job.type}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About the Role */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About the Role
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {job.description}
                </p>
              </motion.div>

              {/* Responsibilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Key Responsibilities
                </h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#3d234b] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 leading-relaxed">
                        {responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Requirements
                </h2>
                <ul className="space-y-4">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#3d234b] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 leading-relaxed">
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Nice to Have */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Nice to Have
                  </h2>
                  <ul className="space-y-4">
                    {job.niceToHave.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#3d234b] rounded-full flex-shrink-0 mt-2.5"></div>
                        <span className="text-gray-600 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What We Offer
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-gray-50 rounded-lg p-4"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#3d234b] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Apply Card (Sticky) */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="sticky top-24"
              >
                <div className="bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold mb-6">Ready to Apply?</h3>
                  <p className="text-white/90 mb-8 leading-relaxed">
                    Join our team and help shape the future of technology. Apply
                    now to start your journey with Devaicon.
                  </p>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="block w-full bg-white text-[#3d234b] text-center px-6 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold mb-6 group"
                  >
                    <span className="inline-flex items-center gap-2">
                      Apply for This Position
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  <div className="border-t border-white/20 pt-6 space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">Posted recently</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Building2 className="w-5 h-5" />
                      <span className="text-sm">Devaicon Technologies</span>
                    </div>
                  </div>
                </div>

                {/* Share this Job */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md mt-6">
                  <h4 className="font-bold text-gray-900 mb-4">
                    Share This Job
                  </h4>
                  <div className="flex gap-3">
                    <button
                      onClick={handleShare}
                      className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm cursor-pointer ${
                        isShared
                          ? "bg-[#3d234b] text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isShared ? (
                          <motion.span
                            key="shared"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Shared!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="share"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Share
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <button
                      onClick={handleCopyUrl}
                      className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm cursor-pointer ${
                        isCopied
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isCopied ? (
                          <motion.span
                            key="copied"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            // className="inline-flex items-center gap-2"
                          >
                            {/* <Check className="w-4 h-4" /> */}
                            URL Copied!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Copy URL
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Preview */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What Happens Next?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              After you apply, our recruitment team will review your application
              within 1-2 weeks. If your qualifications match our requirements,
              we&apos;ll reach out to schedule an initial screening call.
            </p>
            <Link
              href="/careers#application-process"
              className="inline-flex items-center gap-2 text-[#3d234b] font-semibold hover:gap-3 transition-all"
            >
              <span>Learn About Our Hiring Process</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
      />
    </main>
  );
};

export default JobDetailPage;
