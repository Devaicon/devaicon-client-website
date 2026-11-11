"use client";

import AiPromptDialog, { type BriefField } from "@/components/dashboard/AiPromptDialog";
import { EMPTY_BRIEF, buildAiPrompt, type AiBrief } from "./aiPrompt";

const FIELDS: BriefField<AiBrief>[] = [
  { key: "service", label: "Service", placeholder: "e.g. Cloud migration to AWS and Azure" },
  { key: "keyphrase", label: "Focus keyphrase", placeholder: "e.g. cloud migration services uae" },
  { key: "market", label: "Market or location", placeholder: "e.g. United Arab Emirates" },
  { key: "audience", label: "Audience", placeholder: "e.g. IT directors at mid-sized organisations" },
  {
    key: "facts",
    label: "What we offer, and facts to use",
    placeholder: "Offerings, real figures, technologies, differentiators. The agent is told to invent nothing beyond this.",
    rows: 5,
  },
  { key: "links", label: "Extra pages to link to (optional)", placeholder: "/insights/some-guide: why it's relevant", rows: 2 },
  { key: "images", label: "Image URLs it may use (optional)", placeholder: "https://… or /image-on-this-site.webp, one per line", rows: 2 },
];

/**
 * Builds the prompt an admin gives their own AI agent. The agent replies
 * with a service page file, which Import turns into a draft here.
 */
export default function ServicePagePromptDialog({
  livePages,
  onClose,
}: {
  livePages: { title: string; slug: string }[];
  onClose: () => void;
}) {
  return (
    <AiPromptDialog
      title="Write a service page with your AI agent"
      intro="Fill in what you know, copy the prompt into ChatGPT, Claude or any agent, save its reply as a .json file, then use Import. The page arrives as a draft for you to check before publishing."
      fields={FIELDS}
      initialBrief={EMPTY_BRIEF}
      build={(brief) => buildAiPrompt(brief, livePages)}
      promptFileName="service-page-prompt.md"
      onClose={onClose}
    />
  );
}
