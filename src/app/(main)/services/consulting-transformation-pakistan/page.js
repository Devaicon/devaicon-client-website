import ServicePage, {
  servicePageMetadata,
} from "@/components/service-page/ServicePage";
import { CONSULTING_TRANSFORMATION } from "@/lib/service-pages/consulting-transformation";

export const metadata = servicePageMetadata(CONSULTING_TRANSFORMATION);

/**
 * Strategic Consulting & Transformation service page
 * Content is set in code (see lib/service-pages) and rendered at build time
 */
const ConsultingTransformationPage = () => <ServicePage page={CONSULTING_TRANSFORMATION} />;

export default ConsultingTransformationPage;
