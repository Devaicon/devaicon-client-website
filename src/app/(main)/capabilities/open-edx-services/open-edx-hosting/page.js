import ServicePage, {
  servicePageMetadata,
} from "@/components/service-page/ServicePage";
import { OPEN_EDX_HOSTING } from "@/lib/service-pages/open-edx-hosting";

export const metadata = servicePageMetadata(OPEN_EDX_HOSTING);

/**
 * Managed Open edX Hosting service page
 * Content is set in code (see lib/service-pages) and rendered at build time
 */
const OpenEdXHostingPage = () => <ServicePage page={OPEN_EDX_HOSTING} />;

export default OpenEdXHostingPage;
