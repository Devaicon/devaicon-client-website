import ServicePage, {
  servicePageMetadata,
} from "@/components/service-page/ServicePage";
import { OPEN_EDX_DEVELOPMENT } from "@/lib/service-pages/open-edx-development";

export const metadata = servicePageMetadata(OPEN_EDX_DEVELOPMENT);

/**
 * Open edX Development & Customization service page
 * Content is set in code (see lib/service-pages) and rendered at build time
 */
const OpenEdXDevelopmentPage = () => <ServicePage page={OPEN_EDX_DEVELOPMENT} />;

export default OpenEdXDevelopmentPage;
