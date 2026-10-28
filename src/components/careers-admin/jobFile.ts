import {
  EMPLOYMENT_TYPES,
  WORKPLACES,
  type AdminJob,
  type EmploymentType,
  type Workplace,
} from "@/lib/careers/types";

/**
 * Job postings as files: JSON for moving roles between sites or tools, CSV
 * for writing them in a spreadsheet.
 *
 * Both hold the same fields. In the CSV, each list (responsibilities and so
 * on) is one cell with an item per line, which every spreadsheet keeps
 * inside quotes; " | " between items works too, for tools that can't put a
 * line break in a cell.
 *
 * An import always makes new drafts. Nothing in a file can publish, close or
 * overwrite a role, and its URL is made unique rather than refused.
 */

export const JOB_FILE_FORMAT = "devaicon-jobs";
export const JOB_FILE_VERSION = 1;

/** One role in a file. */
export type JobFields = {
  title: string;
  slug: string;
  department: string;
  location: string;
  workplace: Workplace;
  employmentType: EmploymentType;
  experience: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
};

const TEXT_FIELDS = ["title", "slug", "department", "location", "experience", "summary", "description"] as const;
const LIST_FIELDS = ["responsibilities", "requirements", "niceToHave", "benefits"] as const;

/** CSV columns, in order. */
export const COLUMNS = [
  "title",
  "slug",
  "department",
  "location",
  "workplace",
  "employmentType",
  "experience",
  "summary",
  "description",
  ...LIST_FIELDS,
] as const;

// Matches the server's caps, so an import isn't cut short without a word.
const LIMITS: Partial<Record<keyof JobFields, number>> = {
  title: 120,
  department: 60,
  location: 80,
  experience: 60,
  summary: 300,
  description: 5000,
};
const MAX_LIST_ITEMS = 30;
const MAX_ITEM = 300;
export const MAX_JOBS_PER_IMPORT = 100;

function toFields(job: AdminJob): JobFields {
  return {
    title: job.title,
    slug: job.slug,
    department: job.department,
    location: job.location,
    workplace: job.workplace,
    employmentType: job.employmentType,
    experience: job.experience,
    summary: job.summary,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    niceToHave: job.niceToHave,
    benefits: job.benefits,
  };
}

// ---------------------------------------------------------------- export

export function buildJobsJson(jobs: JobFields[], now = new Date()): string {
  return JSON.stringify(
    { format: JOB_FILE_FORMAT, version: JOB_FILE_VERSION, exportedAt: now.toISOString(), jobs },
    null,
    2,
  );
}

/**
 * A spreadsheet would run a cell starting with = + - or @ as a formula. Such
 * cells get a leading apostrophe, which spreadsheets hide and the importer
 * strips, so a value goes out and comes back unchanged.
 */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) || /^\s|\s$/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function buildJobsCsv(jobs: JobFields[]): string {
  const rows = [
    COLUMNS.join(","),
    ...jobs.map((j) =>
      COLUMNS.map((c) => csvCell(Array.isArray(j[c]) ? (j[c] as string[]).join("\n") : String(j[c] ?? ""))).join(","),
    ),
  ];
  // The byte-order mark tells Excel the file is UTF-8 (é, –, ’ survive).
  return `﻿${rows.join("\r\n")}\r\n`;
}

export function exportJobs(jobs: AdminJob[]): JobFields[] {
  return jobs.map(toFields);
}

export function jobsFileName(ext: "csv" | "json", single?: { slug: string }): string {
  const day = new Date().toISOString().slice(0, 10);
  return single ? `${single.slug || "role"}.${ext}` : `job-postings-${day}.${ext}`;
}

export function downloadFile(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  // Revoked on the next task: some browsers start the download after click()
  // returns, and would find the URL already gone.
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

// ---------------------------------------------------------------- samples

const SAMPLE: JobFields[] = [
  {
    title: "Senior Backend Engineer",
    slug: "senior-backend-engineer",
    department: "Engineering",
    location: "Sharjah, UAE",
    workplace: "Hybrid",
    employmentType: "Full-time",
    experience: "5+ years",
    summary: "Design and build the APIs and services behind our clients' core systems.",
    description:
      "You'll join a delivery team building systems for banks, retailers and public-sector clients.\n\nLeave a blank line between paragraphs, as here.",
    responsibilities: [
      "Design, build and maintain APIs and back-end services",
      "Review code and mentor other engineers",
      "Work with clients to turn requirements into technical plans",
    ],
    requirements: ["5+ years building production back-end systems", "Strong Node.js or .NET experience", "Good written and spoken English"],
    niceToHave: ["Experience with Azure or AWS", "Arabic"],
    benefits: ["Laptop and equipment of your choice"],
  },
  {
    title: "Data Analyst Intern",
    slug: "",
    department: "Data & AI",
    location: "",
    workplace: "Remote",
    employmentType: "Internship",
    experience: "",
    summary: "Turn messy data into reports our clients act on. Leave slug empty to make one from the title.",
    description: "A three-month internship working alongside our data team.",
    responsibilities: ["Clean and prepare data sets", "Build dashboards and reports"],
    requirements: ["Studying for a degree in a numerate subject", "Comfortable with SQL or Python"],
    niceToHave: [],
    benefits: [],
  },
];

export const sampleJobsJson = () => buildJobsJson(SAMPLE);
export const sampleJobsCsv = () => buildJobsCsv(SAMPLE);

// ---------------------------------------------------------------- import

export type ParsedJob = { fields: JobFields; warnings: string[] };
export type JobFileResult = { ok: boolean; jobs?: ParsedJob[]; warnings?: string[]; message?: string };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const quote = (v: string) => `“${v}”`;
/** "Employment type", "employment_type" and "employmentType" all read the same. */
const squash = (v: string) => v.toLowerCase().replace(/[^a-z]/g, "");

// Spreadsheet headings people are likely to write, by the field they mean.
const HEADERS: Record<string, keyof JobFields> = {
  ...Object.fromEntries(COLUMNS.map((c) => [squash(c), c])),
  jobtitle: "title",
  role: "title",
  url: "slug",
  team: "department",
  type: "employmentType",
  employment: "employmentType",
  workplacetype: "workplace",
  about: "description",
  abouttherole: "description",
  whatyoulldo: "responsibilities",
  whatyoullneed: "requirements",
  whatweoffer: "benefits",
};

/** Undo csvCell's apostrophe, and tidy a value. */
const cellText = (v: unknown) => {
  const s = typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
  return s.replace(/^'(?=[=+\-@\t\r])/, "").trim();
};

function listOf(v: unknown): string[] {
  const items = Array.isArray(v)
    ? v.map(cellText)
    : cellText(v)
        .split(/\r?\n|\s\|\s/)
        // Pasted bullet lists keep their markers otherwise.
        .map((l) => l.replace(/^\s*(?:[-*•·]|\d+[.)])\s+/, "").trim());
  return items.filter(Boolean);
}

function pick<T extends string>(choices: readonly T[], value: string, aliases: Record<string, T>): T | null {
  const v = squash(value);
  return choices.find((c) => squash(c) === v) ?? aliases[v] ?? null;
}

/** One role from a JSON object or a CSV row, with what had to change. */
function readJob(raw: Obj, label: string): { job?: ParsedJob; error?: string } {
  const warnings: string[] = [];
  const fields = {} as JobFields;

  for (const key of TEXT_FIELDS) {
    let value = cellText(raw[key]);
    const max = LIMITS[key];
    if (max && value.length > max) {
      warnings.push(`The ${key} was cut to ${max} characters.`);
      value = value.slice(0, max);
    }
    fields[key] = value;
  }
  if (!fields.title) return { error: `${label} has no title.` };
  fields.slug = fields.slug.toLowerCase();

  const workplace = cellText(raw.workplace);
  fields.workplace = pick(WORKPLACES, workplace || "On-site", { onsite: "On-site", office: "On-site", inoffice: "On-site", wfh: "Remote" }) ?? "On-site";
  if (workplace && !pick(WORKPLACES, workplace, { onsite: "On-site", office: "On-site", inoffice: "On-site", wfh: "Remote" })) {
    warnings.push(`Workplace ${quote(workplace)} isn't on-site, hybrid or remote, so it was set to on-site.`);
  }
  const type = cellText(raw.employmentType);
  const typeAliases: Record<string, EmploymentType> = {
    fulltime: "Full-time",
    permanent: "Full-time",
    parttime: "Part-time",
    contractor: "Contract",
    freelance: "Contract",
    intern: "Internship",
  };
  fields.employmentType = pick(EMPLOYMENT_TYPES, type || "Full-time", typeAliases) ?? "Full-time";
  if (type && !pick(EMPLOYMENT_TYPES, type, typeAliases)) {
    warnings.push(`Employment type ${quote(type)} isn't one of ${EMPLOYMENT_TYPES.join(", ")}, so it was set to full-time.`);
  }

  for (const key of LIST_FIELDS) {
    let items = listOf(raw[key]);
    if (items.some((i) => i.length > MAX_ITEM)) {
      warnings.push(`Some ${key} items were cut to ${MAX_ITEM} characters.`);
      items = items.map((i) => i.slice(0, MAX_ITEM));
    }
    if (items.length > MAX_LIST_ITEMS) {
      warnings.push(`Only the first ${MAX_LIST_ITEMS} ${key} were kept.`);
      items = items.slice(0, MAX_LIST_ITEMS);
    }
    fields[key] = items;
  }

  const missing = [
    !fields.summary && "a summary",
    !fields.description && "a description",
    fields.responsibilities.length === 0 && "responsibilities",
    fields.requirements.length === 0 && "requirements",
  ].filter(Boolean);
  if (missing.length > 0) warnings.push(`Add ${missing.join(", ")} before publishing.`);

  return { job: { fields, warnings } };
}

/**
 * Parse CSV (RFC 4180: quoted cells may hold commas, quotes and line
 * breaks). Semicolons are taken as the separator when the header row has
 * them and no commas, as some Excel locales save.
 */
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  const sep = !firstLine.includes(",") && firstLine.includes(";") ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"' && cell === "") {
      quoted = true;
    } else if (ch === sep) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function fromCsv(text: string): JobFileResult {
  const rows = parseCsv(text);
  if (rows.length === 0) return { ok: false, message: "It's empty." };
  const [header, ...body] = rows;
  const keys = header.map((h) => HEADERS[squash(h)] ?? null);
  if (!keys.includes("title")) {
    return { ok: false, message: "It has no title column. Download the sample CSV to see the columns it needs." };
  }
  const warnings: string[] = [];
  const unknown = header.filter((h, i) => h.trim() && !keys[i]);
  if (unknown.length > 0) warnings.push(`Ignored the columns ${unknown.map(quote).join(", ")}.`);
  if (body.length === 0) return { ok: false, message: "It has a header row but no roles." };
  return collect(
    body.map((cells) => Object.fromEntries(keys.flatMap((k, i) => (k ? [[k, cells[i] ?? ""]] : [])))),
    (i) => `Row ${i + 2}`,
    warnings,
  );
}

function fromJson(text: string): JobFileResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text.replace(/^﻿/, ""));
  } catch {
    return { ok: false, message: "It isn't valid JSON." };
  }
  if (isObj(raw) && raw.format !== undefined && raw.format !== JOB_FILE_FORMAT) {
    return { ok: false, message: `It isn't a job postings file (its format is ${quote(String(raw.format))}).` };
  }
  if (isObj(raw) && typeof raw.version === "number" && raw.version > JOB_FILE_VERSION) {
    return { ok: false, message: "It was made for a newer version of the site. Update the site, then import it again." };
  }
  // A postings file, a bare list of roles, or one role on its own.
  const list = Array.isArray(raw) ? raw : isObj(raw) && Array.isArray(raw.jobs) ? raw.jobs : isObj(raw) && "title" in raw ? [raw] : null;
  if (!list) return { ok: false, message: "It doesn't hold any roles." };
  return collect(list, (i) => `Role ${i + 1}`, []);
}

function collect(rows: unknown[], label: (i: number) => string, warnings: string[]): JobFileResult {
  if (rows.length > MAX_JOBS_PER_IMPORT) {
    return { ok: false, message: `It holds ${rows.length} roles; import at most ${MAX_JOBS_PER_IMPORT} at a time.` };
  }
  const jobs: ParsedJob[] = [];
  for (const [i, row] of rows.entries()) {
    if (!isObj(row)) {
      warnings.push(`${label(i)} isn't a role, so it was skipped.`);
      continue;
    }
    const { job, error } = readJob(row, label(i));
    if (error) warnings.push(`${error} It was skipped.`);
    else jobs.push(job);
  }
  if (jobs.length === 0) return { ok: false, message: warnings.join(" ") || "It doesn't hold any roles." };
  return { ok: true, jobs, warnings };
}

/** Read a .csv or .json file of roles, by its name. */
export function parseJobsFile(name: string, text: string): JobFileResult {
  if (/\.csv$/i.test(name)) return fromCsv(text);
  if (/\.json$/i.test(name)) return fromJson(text);
  return { ok: false, message: "It must be a .csv or .json file." };
}
