import IndustryPage, {
  industryPageMetadata,
} from "@/components/industries/IndustryPage";

export const metadata = industryPageMetadata("retail");

/**
 * Retail Industry Page
 * E-commerce, POS, and customer experience solutions
 */
const RetailIndustryPage = () => <IndustryPage id="retail" />;

export default RetailIndustryPage;
