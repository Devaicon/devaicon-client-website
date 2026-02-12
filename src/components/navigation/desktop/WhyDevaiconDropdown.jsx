import Link from "next/link";
import { MegaMenuDropdown } from "./MegaMenuDropdown";
import { whyDevaiconData } from "@/constants/navigation";

/**
 * Why Devaicon mega menu dropdown
 * Three-column grid layout with quick links to company pages
 */
export function WhyDevaiconDropdown({ isOpen, handlers }) {
  return (
    <MegaMenuDropdown isOpen={isOpen} {...handlers}>
      <div className="p-8 px-64">
        <div className="grid grid-cols-3 gap-6 stagger-animation">
          {whyDevaiconData.map((item) => {
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#3d234b]"
              >
                <div className="text-[#3d234b] group-hover:scale-110 transition-transform duration-300 p-3 rounded-full group-hover:bg-[#3d234b] group-hover:text-white group-hover:shadow-lg">
                  <IconComponent className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </MegaMenuDropdown>
  );
}
