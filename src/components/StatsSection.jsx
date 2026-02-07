const StatsSection = () => {
  const scrollingText = [
    "🚀 Innovation",
    "💼 Excellence",
    "🤝 Partnership",
    "⚡ Quality",
    "🎯 Reliability",
    "🌟 Trust",
    "💡 Solutions",
    "🔧 Technology",
  ];

  return (
    <section className="bg-gray-50 section-padding-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-4">
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
          <div className="flex stats-scroll-animation whitespace-nowrap">
            <div className="flex gap-16 text-2xl font-semibold text-gray-700">
              {scrollingText.concat(scrollingText).map((text, index) => (
                <span key={index}>{text}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
