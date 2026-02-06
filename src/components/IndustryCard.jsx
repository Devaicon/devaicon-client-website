const IndustryCard = ({ id, title, description, Icon, className = "" }) => {
  return (
    <div
      className={`group relative bg-white rounded-2xl p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-brand-primary/30 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      {/* Icon Container */}
      <div className="relative mb-5 flex justify-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-brand-primary/10 group-hover:bg-brand-primary flex items-center justify-center transition-all duration-500">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-brand-primary group-hover:text-white transition-colors duration-500" />
        </div>
      </div>

      {/* Content */}
      <div className="relative text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-3 group-hover:text-brand-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default IndustryCard;
