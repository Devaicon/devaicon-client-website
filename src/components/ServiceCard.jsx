import Link from "next/link";

const urlMap = {
  "Assess & Envision": "/whatwedo#assess-envision",
  "Build & Implement": "/whatwedo#build-implement",
  "Run & Optimize": "/whatwedo#run-optimize",
  "Global Rollouts": "/whatwedo#global-rollouts",
  "Managed Services": "/whatwedo#managed-services",
  "AI & Automation": "/whatwedo#ai-automation",
};

const ServiceCard = ({ tag, title, description, icon: Icon }) => {
  const url = urlMap[title] || "/whatwedo";

  return (
    <div className="bg-white rounded-[16px] shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative flex items-center justify-center py-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#3d234b] to-[#2a1834] flex items-center justify-center shadow-lg">
          <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
        </div>
      </div>

      <div className="p-6 pt-2 flex flex-col gap-3 flex-1 text-center">
        <h3 className="text-xl sm:text-2xl md:text-[24px] font-normal text-[#0e1726]">
          {title}
        </h3>

        <p className="text-sm sm:text-base md:text-[15.9px] text-[#17253d] font-normal">
          {description}
        </p>

        <Link
          href={url}
          aria-label={`Learn more about ${title}`}
          className="mt-auto"
          scroll={true}
        >
          <span className="inline-flex items-center justify-center w-full h-11 rounded-[8px] font-semibold text-white bg-gradient-to-b from-[#3d234b] to-[#2a1834] hover:shadow-lg hover:from-[#4a3a6e] hover:to-[#3a1a4a] transition-all duration-300">
            Learn more
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
