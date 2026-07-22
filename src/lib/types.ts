// Shared types and constants for the time tracker.

export const CATEGORIES = [
  'Coding',
  'Meeting',
  'Planning',
  'Training',
  'Code Review',
  'Bug Fix',
  'Docs',
  'Research',
  'Other',
  // Non-working days. Entries in these categories mark a date as "off" rather
  // than as work: they're excluded from every hour total and chart, and they
  // stop the dashboard reporting the day as a missed log.
  // Keep in sync with server/src/constants.js.
  'Leave',
  'Holiday',
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Categories that mark a date as a non-working day rather than as work done.
 * Such entries carry nominal hours only because the backends require
 * `hours > 0`; they must be excluded from every hour total, average and chart,
 * and they stop a day being reported as a missed log.
 */
export const NON_WORKING_CATEGORIES = ['Leave', 'Holiday'] as const;

export type NonWorkingCategory = (typeof NON_WORKING_CATEGORIES)[number];

export function isNonWorkingCategory(category: string): boolean {
  return (NON_WORKING_CATEGORIES as readonly string[]).includes(category);
}

export type Role = 'dev' | 'admin';

export type SessionUser = {
  username: string;
  role: Role;
};

export type TimeLog = {
  id: string;
  date: string;        // YYYY-MM-DD
  username: string;
  project: string;
  category: Category | string;
  hours: number;
  description: string;
  loggedAt: string;    // ISO timestamp
  approvedAt: string;  // ISO timestamp; '' means pending
  approvedBy: string;  // admin username; '' means pending
};

export type Project = {
  id: string;
  name: string;
  addedAt: string;
  addedBy: string;
};

// Sheet tab names + header rows. If you change these, update the Google Sheet too.
export const SHEET_LOGS = 'TimeLogs';
export const SHEET_PROJECTS = 'Projects';

export const HEADERS_LOGS = [
  'ID',
  'Date',
  'Username',
  'Project',
  'Category',
  'Hours',
  'Description',
  'LoggedAt',
  'ApprovedAt',
  'ApprovedBy',
];

export const HEADERS_PROJECTS = ['ID', 'Name', 'AddedAt', 'AddedBy'];

// Listing / pagination defaults (shared by the logs listing endpoint).
export const PAGE_SIZE_DEFAULT = 12;
export const PAGE_SIZE_MAX = 100;
export const BULK_IDS_MAX = 500;
