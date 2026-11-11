"use client";

import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import AiPromptDialog, { SECONDARY_BUTTON, type BriefField } from "@/components/dashboard/AiPromptDialog";
import { EMPTY_POST_BRIEF, buildPostPrompt, type PostBrief } from "./aiPrompt";
import { downloadJson, loadLibrary, samplePostFile, type Library } from "./postFile";

const FIELDS: BriefField<PostBrief>[] = [
  { key: "topic", label: "Topic or working title", placeholder: "e.g. How to plan a cloud migration without downtime" },
  { key: "keyphrase", label: "Focus keyphrase", placeholder: "e.g. cloud migration plan" },
  { key: "audience", label: "Audience", placeholder: "e.g. IT managers at mid-sized organisations" },
  { key: "market", label: "Market or location (optional)", placeholder: "e.g. United Arab Emirates" },
  {
    key: "points",
    label: "Points to cover, facts and sources",
    placeholder: "The angle, the points to make, real figures with their source links. The agent is told to invent nothing.",
    rows: 5,
  },
  { key: "links", label: "Extra pages to link to (optional)", placeholder: "/services/some-page: why it's relevant", rows: 2 },
  { key: "images", label: "Image URLs it may use (optional)", placeholder: "https://… or /image-on-this-site.webp, one per line", rows: 2 },
];

/**
 * Builds the prompt an admin gives their own AI agent. The agent replies
 * with a post file, which Import turns into a draft. The Blog library is
 * loaded first so the prompt names this site's own authors, categories and
 * calls to action, which is what lets the reply import without warnings.
 */
export default function PostPromptDialog({
  livePosts,
  onClose,
}: {
  livePosts: { title: string; slug: string }[];
  onClose: () => void;
}) {
  const [library, setLibrary] = useState<Library | undefined>(undefined);

  useEffect(() => {
    let current = true;
    loadLibrary().then((res) => {
      if (current && res.ok) setLibrary(res.library);
    });
    return () => {
      current = false;
    };
  }, []);

  return (
    <AiPromptDialog
      title="Write a post with your AI agent"
      intro="Fill in what you know, copy the prompt into ChatGPT, Claude or any agent, save its reply as a .json file, then use Import. The post arrives as a draft for you to check before publishing."
      fields={FIELDS}
      initialBrief={EMPTY_POST_BRIEF}
      build={(brief) => buildPostPrompt(brief, library, livePosts)}
      promptFileName="post-prompt.md"
      actions={
        <button
          type="button"
          onClick={() => downloadJson("post-sample.json", samplePostFile(library))}
          title="An example post file, showing every field an import reads"
          className={SECONDARY_BUTTON}
        >
          <FileDown className="h-4 w-4" aria-hidden />
          Sample .json
        </button>
      }
      onClose={onClose}
    />
  );
}
