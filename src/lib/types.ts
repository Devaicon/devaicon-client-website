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
] as const;

export type Category = (typeof CATEGORIES)[number];

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
