// Shared "description builder" helpers.
//
// The time-log model still stores a single `description` string. To make entry
// easier and more consistent, the client collects a free-text Summary plus a
// few optional structured fields (tools, area, status, reference). These are
// composed into one well-defined, human-readable string in `description` — so
// no schema/model change is needed and existing logs stay valid.

export const DESCRIPTION_TOOLS = [
  "React",
  "Next.js",
  "Node",
  "Hono",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Drizzle",
  "TypeScript",
  "Tailwind",
  "Docker",
  "Git",
  "Figma",
  "Vercel",
] as const;

export const DESCRIPTION_AREAS = [
  "Frontend",
  "Backend",
  "API",
  "Database",
  "Auth",
  "UI/UX",
  "Infra/DevOps",
  "Testing",
  "Docs",
] as const;

export const DESCRIPTION_STATUSES = [
  "Completed",
  "In progress",
  "Blocked",
] as const;

// Mirror of the server-side limits so the form and the legacy route agree.
export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 1000;

export type DescriptionParts = {
  summary?: string;
  tools?: string[];
  areas?: string[];
  status?: string;
  reference?: string;
};

function uniqClean(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of arr) {
    const s = String(v ?? "").trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

// Compose the structured parts into the canonical labeled-lines format:
//
//   <summary>
//   Tools: A, B
//   Area: X, Y
//   Status: Completed
//   Ref: PR #142
//
// Only non-empty fields produce a line. Summary always comes first.
export function composeDescription(parts: DescriptionParts): string {
  const summary = String(parts.summary ?? "").trim();
  const tools = uniqClean(parts.tools);
  const areas = uniqClean(parts.areas);
  const status = String(parts.status ?? "").trim();
  const reference = String(parts.reference ?? "").trim();

  const lines: string[] = [];
  if (summary) lines.push(summary);
  if (tools.length) lines.push(`Tools: ${tools.join(", ")}`);
  if (areas.length) lines.push(`Area: ${areas.join(", ")}`);
  if (status) lines.push(`Status: ${status}`);
  if (reference) lines.push(`Ref: ${reference}`);
  return lines.join("\n");
}
