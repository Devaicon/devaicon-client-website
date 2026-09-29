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
  'Testing',
  'Deployment',
  'Project Management',
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

/**
 * A permission key. The catalogue itself lives on the server and arrives with
 * GET /api/roles; these are only the keys the client checks by name.
 */
export type Permission =
  | 'timelogs.log'
  | 'timelogs.review'
  | 'timelogs.delete_any'
  | 'timelogs.export'
  | 'projects.manage'
  | 'users.manage'
  | 'roles.manage';

export type RoleRef = { id: string; name: string; isOwner: boolean };

/** The signed-in user, as GET /api/auth/me returns it. */
export type Me = {
  id: string;
  username: string;
  /** Optional; '' when unset. Prefer `nameOf()` for display. */
  displayName: string;
  role: RoleRef;
  /** Effective: the role's, plus personal grants, minus personal removals. */
  permissions: Permission[];
};

/** Personal changes on top of a role's permissions. */
export type PermissionOverrides = { granted: Permission[]; revoked: Permission[] };

/** The name to show for a person: their display name, else their username. */
export function nameOf(user: { username: string; displayName?: string } | null): string {
  return user?.displayName?.trim() || user?.username || "";
}

export function can(me: Me | null, permission: Permission): boolean {
  return Boolean(me?.permissions.includes(permission));
}

/** Permissions that open some part of the admin panel. */
export const ADMIN_PANEL_PERMISSIONS: Permission[] = [
  'timelogs.review',
  'projects.manage',
  'users.manage',
  'roles.manage',
];

export function canUseAdmin(me: Me | null): boolean {
  return ADMIN_PANEL_PERMISSIONS.some((p) => can(me, p));
}

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
  approvedBy: string;  // reviewer username; '' means pending
  flagged?: boolean;
  flaggedAt?: string;  // ISO timestamp; '' when not flagged
  flaggedBy?: string;
  flagReason?: string;
};

export type Project = {
  id: string;
  name: string;
  addedAt: string;
  addedBy: string;
};

// Listing / pagination defaults (shared by the logs listing endpoint).
export const PAGE_SIZE_DEFAULT = 12;
export const PAGE_SIZE_MAX = 100;
export const BULK_IDS_MAX = 500;
