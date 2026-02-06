import {
  Landmark,
  Building2,
  Home,
  MapPin,
  Package,
  ShoppingBag,
  Briefcase,
  Heart,
} from "lucide-react";
import Image from "next/image";
import IndustryCard from "./IndustryCard";

const industries = [
  {
    id: "bfsi",
    title: "Banking & Financial Services",
    description: "Secure compliant systems for regulated financial operations",
    icon: Landmark,
  },
  {
    id: "public-sector",
    title: "Public Sector",
    description: "Digital platforms for transparent and efficient governance",
    icon: Building2,
  },
  {
    id: "education",
    title: "Education & Training",
    description: "Streamlined education management and data driven insights",
    icon: Home,
  },
  {
    id: "hospitality",
    title: "Tourism & Hospitality",
    description: "Smart systems enhancing guest experience and operations",
    icon: MapPin,
  },
  {
    id: "manufacturing",
    title: "Trading & Manufacturing",
    description:
      "Connected supply chains are improving production and visibility",
    icon: Package,
  },
  {
    id: "retail",
    title: "Retail",
    description: "Unified commerce delivering better customer experiences",
    icon: ShoppingBag,
  },
  {
    id: "professional-services",
    title: "Professional Services",
    description: "Process driven systems for service focused firms",
    icon: Briefcase,
  },
  {
    id: "nonprofit",
    title: "Non Profit",
    description: "Technology enabling impact transparency and growth",
    icon: Heart,
  },
];

const IndustriesSection = () => {
  return (
    <section className="flex justify-center py-12 sm:py-16 md:py-20 lg:py-[100px] pb-10 sm:pb-12 md:pb-[60px] px-4 sm:px-6 md:px-8 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative Orbs - Top Left */}
      {/* <Image
        src="/orb-1.webp"
        alt=""
        width={750}
        height={750}
        className="absolute top-[-11] left-1 opacity-0.8 pointer-events-none w-[250px] sm:w-[350px] md:w-[450px] lg:w-[550px] xl:w-[650px] 2xl:w-[750px] h-auto border-none"
        aria-hidden="true"
      />
      <Image
        src="/orb-2.webp"
        alt=""
        width={850}
        height={1850}
        className="absolute top-[-5] left-2 pointer-events-none w-[300px] sm:w-[400px] md:w-[550px] lg:w-[650px] xl:w-[750px] 2xl:w-[850px] h-auto"
        aria-hidden="true"
      /> */}

      <div className="w-full max-w-[1180px] text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-[#333333] mb-2">
          Industries We Serve
        </h2>
        <p className="text-base sm:text-lg md:text-[20px] font-normal text-[#475569] mb-6 sm:mb-8 md:mb-10 px-2">
          Fix core business challenges using secure enterprise technology that
          delivers measurable results.
        </p>

        <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
          {industries.map((industry, index) => (
            <IndustryCard
              key={index}
              id={industry.id}
              title={industry.title}
              description={industry.description}
              Icon={industry.icon}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            />
          ))}
        </div>
      </div>

      {/* Vector decoration under Healthcare card */}
      {/* <Image
        src="/vector-1.webp"
        alt=""
        width={200}
        height={100}
        className="absolute bottom-0 right-[40] sm:right-[60] md:right-[80] lg:right-[100] 2xl:right--[13] pointer-events-none z-0 w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] 2xl:w-[450px] h-auto"
        aria-hidden="true"
      /> */}
    </section>
  );
};

export default IndustriesSection;
