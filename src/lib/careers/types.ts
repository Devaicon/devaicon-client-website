// Job postings and applications, as the Express API sends them.

export const WORKPLACES = ["On-site", "Hybrid", "Remote"] as const;
export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
export type Workplace = (typeof WORKPLACES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export type JobStatus = "draft" | "published" | "closed";

/** A role on the careers page. `status` is "closed" once it stops taking applications. */
export type PublicJob = {
  title: string;
  slug: string;
  department: string;
  location: string;
  workplace: Workplace;
  employmentType: EmploymentType;
  experience: string;
  summary: string;
  status: "open" | "closed";
  publishedAt: string;
  updatedAt: string;
};

export type PublicJobDetail = PublicJob & {
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
};

/** One row of the dashboard's postings list. */
export type JobSummary = {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workplace: Workplace;
  employmentType: EmploymentType;
  status: JobStatus;
  publishedAt: string;
  closedAt: string;
  updatedAt: string;
  updatedBy: string;
  applications: { total: number; new: number };
};

export type AdminJob = JobSummary & {
  experience: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  createdAt: string;
  createdBy: string;
};

export const APPLICATION_STATUSES = ["new", "reviewing", "shortlisted", "rejected", "hired"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  rejected: "Not progressing",
  hired: "Hired",
};

export type ApplicationSummary = {
  id: string;
  /** '' for a general résumé, or when its role has been deleted. */
  jobId: string;
  /** '' for a general résumé. */
  jobTitle: string;
  areaOfInterest: string;
  firstName: string;
  lastName: string;
  email: string;
  status: ApplicationStatus;
  submittedAt: string;
};

export type Application = ApplicationSummary & {
  phone: string;
  linkedIn: string;
  portfolio: string;
  coverLetter: string;
  resume: { name: string; mime: string; size: number };
  notes: string;
  statusUpdatedBy: string;
  statusUpdatedAt: string;
};

// Choices for a résumé sent without a particular role in mind.
// Keep in sync with server/src/models/Application.js.
export const AREAS_OF_INTEREST = [
  "Engineering",
  "Data & AI",
  "Cloud & Infrastructure",
  "Product",
  "Design",
  "Business Development",
  "Marketing",
  "Other",
] as const;

/** "Hybrid, Sharjah" — how a role's place of work reads in one line. */
export function placeOf(job: { workplace: string; location: string }): string {
  return job.location ? `${job.workplace}, ${job.location}` : job.workplace;
}
