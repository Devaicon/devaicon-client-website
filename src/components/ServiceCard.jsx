import { ArrowRight } from "lucide-react";

const ServiceCard = ({ tag, title, description, icon: Icon, link = "#" }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-primary/20 group flex flex-col h-full">
      {/* Icon */}
      {Icon && (
        <div className="mb-5 flex justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-all duration-300">
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-brand-primary group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      )}

      {/* Tag */}
      <div className="mb-4">
        <span className="inline-block px-4 py-1.5 bg-brand-primary/5 text-brand-primary text-xs font-semibold rounded-full uppercase tracking-wide">
          {tag}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-3 group-hover:text-brand-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-5">
        {description}
      </p>

      {/* Learn More Button */}
      <a
        href={link}
        className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm sm:text-base hover:gap-3 transition-all duration-300 group/link mt-auto self-center"
      >
        Learn More
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/link:translate-x-1 transition-transform duration-300" />
      </a>
    </div>
  );
};

export default ServiceCard;
