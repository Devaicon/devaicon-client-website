import IndustryPage, {
  industryPageMetadata,
} from "@/components/industries/IndustryPage";

export const metadata = industryPageMetadata("hospitality");

/**
 * Hospitality Industry Page
 * Hotels, restaurants, and tourism solutions
 */
const HospitalityIndustryPage = () => <IndustryPage id="hospitality" />;

export default HospitalityIndustryPage;
