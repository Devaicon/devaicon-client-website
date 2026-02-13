"use client";

import { motion } from "framer-motion";
import { FileText, UserCheck, MessageSquare, Award } from "lucide-react";

/**
 * Application Process Section
 * Outlines the hiring process steps
 */
const ApplicationProcess = () => {
  const steps = [
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Submit Application",
      description:
        "Apply online with your resume and cover letter. Highlight your skills and experience relevant to the position.",
      duration: "Day 1",
    },
    {
      icon: <UserCheck className="w-7 h-7" />,
      title: "Initial Screening",
      description:
        "Our recruitment team reviews applications and reaches out to qualified candidates for a phone screening.",
      duration: "1-2 Weeks",
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: "Interviews",
      description:
        "Meet with hiring managers and team members through technical and behavioral interviews to assess fit.",
      duration: "2-3 Weeks",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Offer & Onboarding",
      description:
        "Receive your offer and join our team! We'll guide you through onboarding and help you get started.",
      duration: "1 Week",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-[#3d234b] font-semibold text-sm uppercase tracking-wider bg-[#3d234b]/10 px-4 py-2 rounded-full">
              Hiring Process
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 mt-6"
          >
            Our Application Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            We&apos;ve designed a transparent and efficient hiring process to
            help you understand what to expect at each stage.
          </motion.p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#3d234b] via-[#5a3464] to-[#3d234b] -translate-y-1/2 z-0"></div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-20">
                  {index + 1}
                </div>

                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#3d234b]/30 transition-all duration-300 h-full shadow-md hover:shadow-xl">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white rounded-xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <span className="inline-block text-xs font-semibold text-[#3d234b] bg-[#3d234b]/10 px-3 py-1 rounded-full">
                      {step.duration}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <svg
                      className="w-6 h-6 text-[#3d234b]"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white rounded-2xl p-8 lg:p-12"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Questions About the Process?
            </h3>
            <p className="text-white/90 leading-relaxed mb-8">
              Our team is here to help! If you have any questions about our
              hiring process or need assistance with your application,
              don&apos;t hesitate to reach out.
            </p>
            <a
              href="mailto:careers@devaicon.com"
              className="inline-flex items-center gap-2 bg-white text-[#3d234b] px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              <span>Contact HR Team</span>
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationProcess;
