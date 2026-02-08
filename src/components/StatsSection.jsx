import {
  Rocket,
  Award,
  Handshake,
  Zap,
  Target,
  Star,
  Lightbulb,
  Wrench,
} from "lucide-react";

const StatsSection = () => {
  const scrollingText = [
    { icon: Rocket, text: "Innovation" },
    { icon: Award, text: "Excellence" },
    { icon: Handshake, text: "Partnership" },
    { icon: Zap, text: "Quality" },
    { icon: Target, text: "Reliability" },
    { icon: Star, text: "Trust" },
    { icon: Lightbulb, text: "Solutions" },
    { icon: Wrench, text: "Technology" },
  ];

  return (
    <section className="bg-gray-50 section-padding-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-4">
        {/* Heading */}
        <h2 className="section-heading text-gray-900 leading-tight px-2">
          A Journey of <span className="text-brand">5 years</span> with{" "}
          <span className="text-brand">100+</span> projects and{" "}
          <span className="text-brand">20+</span> tech partnerships
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
                Avg. 2 Years
              </div>
              <div className="text-purple-100 text-sm">Client Relationship</div>
            </div>
          </div>
        </div>

        {/* Scrolling Text */}
        <div className="relative overflow-hidden py-8">
          <div className="flex stats-scroll-animation whitespace-nowrap">
            <div className="flex gap-16 text-2xl font-semibold text-gray-700">
              {scrollingText.concat(scrollingText).map((item, index) => {
                const Icon = item.icon;
                return (
                  <span key={index} className="flex items-center gap-2">
                    <Icon className="w-6 h-6" />
                    {item.text}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
