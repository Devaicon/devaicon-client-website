import IndustryPage, {
  industryPageMetadata,
} from "@/components/industries/IndustryPage";

export const metadata = industryPageMetadata("manufacturing");

/**
 * Manufacturing Industry Page
 * Production, operations, and supply chain solutions
 */
const ManufacturingIndustryPage = () => <IndustryPage id="manufacturing" />;

export default ManufacturingIndustryPage;
