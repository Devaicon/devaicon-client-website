"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users2, Award, Target } from "lucide-react";

/**
 * Career Growth Section
 * Highlights career development and growth opportunities
 */
const CareerGrowth = () => {
  const growthPaths = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Clear Career Progression",
      description:
        "Well-defined career paths with regular performance reviews and promotions based on merit and achievements.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: "Mentorship Programs",
      description:
        "Learn from industry experts and experienced professionals who guide you through your career journey.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Skill Enhancement",
      description:
        "Access to training programs, workshops, and certifications to stay ahead in your field and expand your expertise.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Leadership Opportunities",
      description:
        "Take on leadership roles, manage teams, and drive projects that make a real impact on the business.",
      gradient: "from-green-500 to-emerald-500",
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
              Your Growth
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 mt-6"
          >
            Accelerate Your Career
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            At Devaicon, we&apos;re committed to helping you reach your full
            potential. Explore diverse career paths and grow with us.
          </motion.p>
        </div>

        {/* Growth Paths */}
        <div className="grid md:grid-cols-2 gap-8">
          {growthPaths.map((path, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${path.gradient} text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {path.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {path.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {path.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "85%", label: "Promoted Internally" },
            { value: "40+", label: "Training Programs" },
            { value: "4.8/5", label: "Employee Satisfaction" },
            { value: "50+", label: "Certifications Offered" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#3d234b] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm lg:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CareerGrowth;
