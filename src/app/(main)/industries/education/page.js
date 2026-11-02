import IndustryPage, {
  industryPageMetadata,
} from "@/components/industries/IndustryPage";

export const metadata = industryPageMetadata("education");

/**
 * Education Industry Page
 * Schools, universities, and learning management solutions
 */
const EducationIndustryPage = () => <IndustryPage id="education" />;

export default EducationIndustryPage;
