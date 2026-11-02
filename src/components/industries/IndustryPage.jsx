import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  Building2,
  MapPin,
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import IndustryDetailCard from "./IndustryDetailCard";
import IndustriesGroups from "./IndustriesGroups";
import {
  INDUSTRY_PAGES,
  getAllIndustries,
  getIndustryById,
} from "@/lib/industries-data";

// Icon mapping for string-based icon names
const iconMap = {
  DollarSign,
  Building2,
  MapPin,
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
};

const pathOf = (id) => `/industries/${id}`;

/**
 * Metadata for an /industries/[id] page. Each page covers its own industry,
 * so it is its own canonical rather than the /industries hub.
 *
 * @param {string} id - Industry ID, as in INDUSTRY_PAGES
 */
export function industryPageMetadata(id) {
  const page = INDUSTRY_PAGES[id];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: pathOf(id) },
    openGraph: {
      type: "website",
      url: pathOf(id),
      title: page.title,
      description: page.description,
      images: [{ url: page.heroImage, alt: page.name }],
    },
  };
}

/**
 * IndustryPage Component
 * One industry's page: its hero, its detail section, and links on to the
 * other industries and the hub
 *
 * @param {string} id - Industry ID, as in INDUSTRY_PAGES
 */
const IndustryPage = ({ id }) => {
  const page = INDUSTRY_PAGES[id];
  const industry = getIndustryById(id);
  const others = getAllIndustries().filter((card) => card.id !== id);

  return (
    <main>
      {/* Hero Section */}
      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: page.name, path: pathOf(id) },
        ]}
        title={page.title}
        subtitle={page.description}
        showButton={false}
        backgroundImage={page.heroImage}
      />

      {/* Industry Detail */}
      <IndustryDetailCard
        id={industry.id}
        title={industry.title}
        icon={industry.icon}
        iconAlt={industry.iconAlt}
        image={industry.image}
        industryContext={industry.industryContext}
        painPoints={industry.painPoints}
        ourApproach={industry.ourApproach}
        solutionText={industry.solutionText}
        additionalContent={industry.additionalContent}
        futureHeading={industry.futureHeading}
        futurePoints={industry.futurePoints}
        isOdd={true}
      />

      <IndustriesGroups />

      {/* Other Industries */}
      <section
        className="w-full bg-gradient-to-br from-purple-50 to-blue-50 py-16 md:py-20"
        aria-labelledby="other-industries-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-10 md:mb-12">
            <h2
              id="other-industries-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Other Industries We Serve
            </h2>
            <Link
              href="/industries"
              className="text-base font-medium inline-flex items-center gap-1 text-[#3d234b] hover:text-[#281333] transition-colors"
            >
              See all industries
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {others.map((card) => {
              const IconComponent = iconMap[card.icon];
              return (
                <li key={card.id}>
                  <Link
                    href={pathOf(card.id)}
                    className="h-full flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                  >
                    {IconComponent && (
                      <IconComponent
                        className="w-10 h-10 text-[#3d234b]"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-sm md:text-base font-semibold text-gray-900 text-center">
                      {card.title}
                    </span>
                    <span className="text-xs sm:text-sm font-medium inline-flex items-center gap-1 text-[#3d234b]">
                      Learn more
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default IndustryPage;
