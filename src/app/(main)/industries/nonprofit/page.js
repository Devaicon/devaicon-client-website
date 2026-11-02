import IndustryPage, {
  industryPageMetadata,
} from "@/components/industries/IndustryPage";

export const metadata = industryPageMetadata("nonprofit");

/**
 * Non-Profit Industry Page
 * NGO, charity, and social organization solutions
 */
const NonProfitIndustryPage = () => <IndustryPage id="nonprofit" />;

export default NonProfitIndustryPage;
