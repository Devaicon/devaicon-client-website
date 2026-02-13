"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Briefcase,
  Code,
  Brain,
  Cloud,
  Database,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

/**
 * Job Openings Section
 * Displays current job opportunities with filtering
 */
const JobOpenings = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      icon: <Code className="w-5 h-5" />,
      description:
        "Build scalable web applications using modern frameworks and cloud technologies.",
      requirements: [
        "5+ years of experience",
        "React, Node.js, TypeScript",
        "Cloud platforms (Azure/AWS)",
      ],
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      department: "Data Science",
      location: "Hybrid",
      type: "Full-time",
      icon: <Brain className="w-5 h-5" />,
      description:
        "Develop and deploy machine learning models to solve complex business problems.",
      requirements: [
        "3+ years ML experience",
        "Python, TensorFlow, PyTorch",
        "NLP and Computer Vision",
      ],
    },
    {
      id: 3,
      title: "Cloud Solutions Architect",
      department: "Infrastructure",
      location: "On-site",
      type: "Full-time",
      icon: <Cloud className="w-5 h-5" />,
      description:
        "Design and implement cloud infrastructure solutions for enterprise clients.",
      requirements: [
        "Azure/AWS certified",
        "6+ years experience",
        "DevOps expertise",
      ],
    },
    {
      id: 4,
      title: "Data Engineer",
      department: "Data Science",
      location: "Remote",
      type: "Full-time",
      icon: <Database className="w-5 h-5" />,
      description:
        "Build and maintain data pipelines and analytics infrastructure.",
      requirements: [
        "4+ years experience",
        "SQL, Python, Spark",
        "ETL/ELT processes",
      ],
    },
    {
      id: 5,
      title: "Product Manager",
      department: "Product",
      location: "Hybrid",
      type: "Full-time",
      icon: <Users className="w-5 h-5" />,
      description:
        "Lead product strategy and work with cross-functional teams to deliver impactful solutions.",
      requirements: [
        "5+ years PM experience",
        "Agile methodology",
        "Stakeholder management",
      ],
    },
    {
      id: 6,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      icon: <Code className="w-5 h-5" />,
      description:
        "Create beautiful, responsive user interfaces using modern frontend technologies.",
      requirements: [
        "3+ years experience",
        "React, Next.js, Tailwind",
        "UI/UX principles",
      ],
    },
  ];

  const departments = [
    "All",
    "Engineering",
    "Data Science",
    "Infrastructure",
    "Product",
  ];

  const filteredJobs =
    selectedDepartment === "All"
      ? jobOpenings
      : jobOpenings.filter((job) => job.department === selectedDepartment);

  return (
    <section id="job-openings" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 xl:px-15">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Open Positions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Explore exciting opportunities to work on cutting-edge projects with
            a talented team.
          </motion.p>
        </div>

        {/* Department Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedDepartment === dept
                  ? "bg-[#3d234b] text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </motion.div>

        {/* Job Listings */}
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#3d234b]/30 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3d234b] to-[#5a3464] text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {job.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <span className="text-sm text-[#3d234b] font-medium">
                        {job.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                </div>

                {/* Job Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {job.description}
                </p>

                {/* Requirements */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Key Requirements:
                  </h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-[#3d234b] rounded-full"></div>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Button */}
                <Link
                  href={`/contact-us?position=${encodeURIComponent(job.title)}`}
                  className="inline-flex items-center gap-2 text-[#3d234b] font-semibold hover:gap-3 transition-all duration-300"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Jobs Message */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">
              No positions available in this department at the moment.
            </p>
          </motion.div>
        )}

        {/* Can't Find Position CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center bg-white rounded-2xl p-8 border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Don&apos;t See the Right Role?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals. Send us your
            resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <Link
            href="/contact-us?subject=General Application"
            className="inline-flex items-center gap-2 bg-[#3d234b] text-white px-8 py-3.5 rounded-lg hover:bg-[#2d1a3b] transition-colors font-medium"
          >
            <span>Submit Your Resume</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default JobOpenings;
