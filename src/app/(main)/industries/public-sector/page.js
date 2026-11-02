import IndustryPage, {
  industryPageMetadata,
} from "@/components/industries/IndustryPage";

export const metadata = industryPageMetadata("public-sector");

/**
 * Public Sector Industry Page
 * Government and public service solutions
 */
const PublicSectorIndustryPage = () => <IndustryPage id="public-sector" />;

export default PublicSectorIndustryPage;
