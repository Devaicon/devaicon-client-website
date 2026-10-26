// Types for the legacy Google Sheets time logger, restored while its users
// move to the Express backend. Everything here goes once LEGACY_TIME_LOGGER
// is switched off for good.

import type { Me, Permission } from '@/lib/types';

export type Role = 'dev' | 'admin';

export type SessionUser = {
  username: string;
  role: Role;
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

const ADMIN_PERMISSIONS: Permission[] = [
  'timelogs.log',
  'timelogs.review',
  'timelogs.delete_any',
  'timelogs.export',
  'projects.manage',
];

/**
 * The shared time logger reads the signed-in user in the Express shape, with a
 * role object and permissions. Legacy users only have a username and
 * dev/admin, so this describes them in that shape.
 */
export function toMe(user: SessionUser): Me {
  const admin = user.role === 'admin';
  return {
    id: user.username,
    username: user.username,
    displayName: '',
    role: { id: user.role, name: admin ? 'Admin' : 'Developer', isOwner: admin },
    permissions: admin ? ADMIN_PERMISSIONS : ['timelogs.log'],
  };
}
