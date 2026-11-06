import ServicePage, {
  servicePageMetadata,
} from "@/components/service-page/ServicePage";
import { AI_AUTOMATION_PAKISTAN } from "@/lib/service-pages/ai-automation-pakistan";

export const metadata = servicePageMetadata(AI_AUTOMATION_PAKISTAN);

/**
 * AI Automation Services in Pakistan service page
 * Content is set in code (see lib/service-pages) and rendered at build time
 */
const AiAutomationPakistanPage = () => <ServicePage page={AI_AUTOMATION_PAKISTAN} />;

export default AiAutomationPakistanPage;
