"use client";

import { motion } from "framer-motion";
import { Target, Users, Lightbulb } from "lucide-react";

/**
 * Careers Introduction Section
 * Showcases company vision and what makes Devaicon a great place to work
 */
const CareersIntro = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-[#3d234b]" />,
      title: "Purpose-Driven Work",
      description:
        "Work on meaningful projects that transform businesses and impact lives across multiple industries.",
    },
    {
      icon: <Users className="w-8 h-8 text-[#3d234b]" />,
      title: "Collaborative Culture",
      description:
        "Join a diverse team of passionate professionals who believe in sharing knowledge and growing together.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-[#3d234b]" />,
      title: "Innovation First",
      description:
        "Shape the future with cutting-edge technologies including AI, machine learning, and cloud solutions.",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
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
            Why Choose Devaicon?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            At Devaicon, we believe in empowering our people to do their best
            work. We foster an environment where innovation thrives, ideas are
            valued, and careers flourish.
          </motion.p>
        </div>

        {/* Values Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-[#3d234b]/10 rounded-xl flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareersIntro;
