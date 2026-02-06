"use client";

const StatsSection = () => {
  return (
    <section className="bg-gray-50 section-padding-lg">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Heading */}
        <h2 className="section-heading text-gray-900 leading-tight px-2">
          A Journey of <span className="text-brand">18 years</span> with{" "}
          <span className="text-brand">550+</span> projects and{" "}
          <span className="text-brand">100+</span> tech partnerships
        </h2>

        {/* Stats Box */}
        <div className="stats-gradient">
          <div className="stats-grid">
            {/* Stat 1 */}
            <div className="stat-item">
              <div className="text-4xl sm:text-5xl font-bold mb-2">95%</div>
              <div className="text-purple-100 text-sm">
                Client Satisfaction Rate
              </div>
            </div>

            {/* Stat 2 */}
            <div className="stat-item">
              <div className="text-4xl sm:text-5xl font-bold mb-2">Zero</div>
              <div className="text-purple-100 text-sm">Detractors</div>
            </div>

            {/* Stat 3 */}
            <div className="stat-item">
              <div className="text-4xl sm:text-5xl font-bold mb-2">81.8</div>
              <div className="text-purple-100 text-sm">Net Promoter Score</div>
            </div>

            {/* Stat 4 */}
            <div className="stat-item">
              <div className="text-4xl sm:text-5xl font-bold mb-2">
                Avg. 5 Years
              </div>
              <div className="text-purple-100 text-sm">Client Relationship</div>
            </div>
          </div>
        </div>

        {/* Scrolling Text */}
        <div className="relative overflow-hidden py-8">
          <div className="flex animate-scroll whitespace-nowrap">
            <div className="flex gap-16 text-2xl font-semibold text-gray-700">
              <span>🚀 Innovation</span>
              <span>💼 Excellence</span>
              <span>🤝 Partnership</span>
              <span>⚡ Quality</span>
              <span>🎯 Reliability</span>
              <span>🌟 Trust</span>
              <span>💡 Solutions</span>
              <span>🔧 Technology</span>
              <span>🚀 Innovation</span>
              <span>💼 Excellence</span>
              <span>🤝 Partnership</span>
              <span>⚡ Quality</span>
              <span>🎯 Reliability</span>
              <span>🌟 Trust</span>
              <span>💡 Solutions</span>
              <span>🔧 Technology</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
