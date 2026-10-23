import type { Cta } from "@/lib/blog/types";

/** Breadcrumb trail above every Open edX service page. */
export const OPEN_EDX_PARENTS = [
  { name: "Home", path: "/" },
  { name: "Capabilities", path: "/whatwedo" },
  { name: "Open edX Services", path: "/capabilities/open-edx-services" },
];

const cta = (fields: Omit<Cta, "name" | "buttonUrl"> & { buttonUrl?: string }): Cta => ({
  name: fields.id,
  buttonUrl: "/contact-us",
  ...fields,
});

/** Calls to action shared by the Open edX pages, in the editor's three styles. */
export const OPEN_EDX_CTAS: Record<string, Cta> = {
  "hosting-inline": cta({
    id: "hosting-inline",
    heading: "Running an older Open edX release?",
    body: "We'll review your platform and plan the upgrade path with you.",
    buttonLabel: "Book a platform review",
    style: "inline",
  }),
  "hosting-closing": cta({
    id: "hosting-closing",
    heading: "Get a fixed monthly quote for your Open edX platform",
    body: "Tell us your peak learner numbers, content and uptime needs. We'll recommend an architecture and price it before anything is built.",
    buttonLabel: "Talk to an Open edX expert",
    style: "banner",
  }),
  "development-inline": cta({
    id: "development-inline",
    heading: "Have a feature in mind?",
    body: "Describe it to us and we'll tell you the upgrade-safe way to build it.",
    buttonLabel: "Discuss your requirements",
    style: "inline",
  }),
  "development-closing": cta({
    id: "development-closing",
    heading: "Build the Open edX platform your learners deserve",
    body: "From a branded launch to custom XBlocks and integrations, our engineers scope, build and support the work end to end.",
    buttonLabel: "Start your Open edX project",
    style: "banner",
  }),
};
