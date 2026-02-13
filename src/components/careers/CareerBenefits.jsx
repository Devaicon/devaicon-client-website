"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  Plane,
  GraduationCap,
  Clock,
  UtensilsCrossed,
  Gift,
} from "lucide-react";

/**
 * Career Benefits Section
 * Showcases employee benefits and perks
 */
const CareerBenefits = () => {
  const benefits = [
    {
      icon: <HeartPulse className="w-8 h-8" />,
      title: "Health & Wellness",
      items: [
        "Comprehensive medical insurance",
        "Dental and vision coverage",
        "Mental health support",
        "Annual health checkups",
      ],
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Learning & Development",
      items: [
        "Professional certifications",
        "Conference attendance",
        "Online learning platforms",
        "Mentorship programs",
      ],
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Work Flexibility",
      items: [
        "Hybrid work model",
        "Flexible working hours",
        "Paid time off",
        "Parental leave",
      ],
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Travel & Mobility",
      items: [
        "International assignments",
        "Travel opportunities",
        "Relocation assistance",
        "Transportation allowance",
      ],
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Perks & Amenities",
      items: [
        "Meal allowances",
        "Coffee & snacks",
        "Team building events",
        "Recreational activities",
      ],
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Financial Benefits",
      items: [
        "Competitive salaries",
        "Performance bonuses",
        "Retirement plans",
        "Stock options",
      ],
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Benefits That Matter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            We invest in our people with comprehensive benefits designed to
            support your health, wealth, and overall well-being.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#3d234b]/20 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white rounded-xl flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <ul className="space-y-3">
                {benefit.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-[#3d234b] mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerBenefits;
