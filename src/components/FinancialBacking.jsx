import { UserRound, Trophy, Globe } from "lucide-react";

const FinancialBacking = () => {
  const financial = [
    {
      title: "20+ Years",
      description: "Proven industry experience",
      icon: UserRound,
    },
    {
      title: "Strong Client Base",
      description: "Delivered in multiple industries",
      icon: Trophy,
    },
    {
      title: "Global Partner",
      description: "Worldwide collaboration reach",
      icon: Globe,
    },
  ];

  return (
    <section className="pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 md:p-12">
          {/* Title */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-b from-[#3d234b] to-[#2a1834] bg-clip-text text-transparent mb-4">
              Empowering enterprise transformation through cutting-edge
              technology
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {financial.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-4 group">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-b from-[#3d234b] to-[#2a1834] flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-b from-[#3d234b] to-[#2a1834] bg-clip-text text-transparent mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialBacking;
