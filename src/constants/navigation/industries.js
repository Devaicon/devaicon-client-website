import {
  DollarSign,
  Building2,
  MapPin,
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
} from "lucide-react";

/**
 * Industries navigation data
 * Maps industry sectors to their metadata (icon, description, route)
 */
export const industriesData = [
  {
    name: "Banking & Financial Services",
    id: "bfsi",
    icon: DollarSign,
    description:
      "Devaicon serves banks and financial institutions across the UAE and GCC with secure and compliant digital platforms. Financial organizations manage complex operations every day. These include finance control, customer data, risk management, and regulatory reporting.",
  },
  {
    name: "Public Sector",
    id: "public-sector",
    icon: Building2,
    description:
      "Devaicon helps public sector organizations modernize services and improve governance. Government entities manage large volumes of data, finance, and citizen services. Devaicon delivers digital platforms that support transparency, efficiency, and accountability.",
  },
  {
    name: "Tourism & Hospitality",
    id: "hospitality",
    icon: MapPin,
    description:
      "Devaicon supports hotels, resorts, and travel businesses with connected digital systems. The hospitality industry faces high service expectations and operational pressure. Devaicon helps manage bookings, guest engagement, finance, and daily operations.",
  },
  {
    name: "Trading & Manufacturing",
    id: "manufacturing",
    icon: Factory,
    description:
      "Devaicon helps trading and manufacturing companies manage supply chains and production systems. These businesses require accuracy, speed, and visibility. Devaicon connects inventory, production, logistics, and finance into a single digital view.",
  },
  {
    name: "Retail",
    id: "retail",
    icon: Store,
    description:
      "Devaicon supports retailers in managing sales, inventory, and customer engagement. Retail businesses operate across physical and digital channels. Devaicon connects these channels through unified commerce platforms.",
  },
  {
    name: "Professional Services",
    id: "professional-services",
    icon: Briefcase,
    description:
      "Devaicon supports professional service firms with structured digital platforms. These firms manage projects, clients, billing, and compliance. Devaicon helps simplify operations while improving service delivery and transparency.",
  },
  {
    name: "Non Profit",
    id: "nonprofit",
    icon: Heart,
    description:
      "Devaicon helps non-profit organizations manage funding, programs, and reporting. These organizations need transparency and accountability. Devaicon delivers platforms that support impact tracking and compliance while keeping operations efficient.",
  },
  {
    name: "Education",
    id: "education",
    icon: GraduationCap,
    description:
      "Devaicon empowers educational institutions with integrated digital platforms for student management, learning, and administration. Schools and universities manage complex academic operations, student data, and teaching resources.",
  },
];
