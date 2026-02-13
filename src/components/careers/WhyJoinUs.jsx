"use client";

import { motion } from "framer-motion";
import { Rocket, Heart, Shield, Award, Globe, Zap } from "lucide-react";

/**
 * Why Join Us Section
 * Highlights company culture and values
 */
const WhyJoinUs = () => {
  const reasons = [
    {
      icon: <Rocket className="w-7 h-7" />,
      title: "Cutting-Edge Projects",
      description:
        "Work with the latest technologies in AI, cloud computing, and enterprise solutions.",
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Work-Life Balance",
      description:
        "Flexible working hours, remote work options, and a supportive environment.",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Recognition & Rewards",
      description:
        "Performance-based bonuses, employee recognition programs, and career advancement.",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Comprehensive Benefits",
      description:
        "Health insurance, retirement plans, and wellness programs for you and your family.",
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Global Opportunities",
      description:
        "Work with international clients and collaborate with teams across the globe.",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Continuous Learning",
      description:
        "Access to training, certifications, conferences, and skill development programs.",
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
              Our Culture
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 mt-6"
          >
            What Makes Us Different
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Join a workplace that values innovation, collaboration, and your
            personal growth. Here&apos;s what sets Devaicon apart.
          </motion.p>
        </div>

        {/* Reasons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3d234b]/5 to-transparent rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative bg-white border border-gray-200 rounded-2xl p-8 h-full hover:border-[#3d234b]/30 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUs;
