// Local fallback for a backend that can't be reached (the Google Sheets one,
// in practice). New entries and deletions made while it is down are queued in
// this browser, per user, until a sync replays them; alongside the queue sits
// a mirror of the last projects and logs the server returned, so the dashboard
// still has something to show. Defensive throughout, like the stopwatch store:
// a corrupt or older payload is dropped rather than allowed to crash the page.

import type { Project, TimeLog } from "@/lib/types";
import type { NewLogInput } from "./useLoggerData";
import type { Scope } from "./stopwatch/storage";

const SCHEMA = 1;

export type QueuedEntry = {
  /** Generated here and kept by the server, so a replayed sync can't duplicate. */
  id: string;
  input: NewLogInput;
  /** What the dashboard shows until the entry reaches the spreadsheet. */
  log: TimeLog;
  /** The server's last refusal, when a sync couldn't place this entry. */
  error?: string;
};

export type OfflineQueue = {
  entries: QueuedEntry[];
  /** Ids of server-side logs deleted while the backend was down. */
  deletes: string[];
};

export type Mirror = { projects: Project[]; logs: TimeLog[] };

export const EMPTY_QUEUE: OfflineQueue = { entries: [], deletes: [] };

function queueKey(scope: Scope, username: string) {
  return `devaicon.offline.${scope}.${username}.queue.v1`;
}
function mirrorKey(scope: Scope, username: string) {
  return `devaicon.offline.${scope}.${username}.mirror.v1`;
}

/** Whether a storage event touched this user's queue, for cross-tab refresh. */
export function isQueueKey(key: string | null, scope: Scope, username: string) {
  return key === null || key === queueKey(scope, username);
}

function read(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { schema?: number; data?: unknown };
    if (parsed?.schema !== SCHEMA) return null;
    return parsed.data ?? null;
  } catch {
    return null;
  }
}

/** False when the write was refused (quota, private mode), so callers can say so. */
function write(key: string, data: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify({ schema: SCHEMA, data }));
    return true;
  } catch {
    return false;
  }
}

function isQueuedEntry(v: unknown): v is QueuedEntry {
  if (typeof v !== "object" || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.input === "object" &&
    e.input !== null &&
    typeof e.log === "object" &&
    e.log !== null
  );
}

export function readQueue(scope: Scope, username: string): OfflineQueue {
  const data = read(queueKey(scope, username)) as Record<string, unknown> | null;
  if (!data) return EMPTY_QUEUE;
  return {
    entries: Array.isArray(data.entries) ? data.entries.filter(isQueuedEntry) : [],
    deletes: Array.isArray(data.deletes)
      ? data.deletes.filter((d): d is string => typeof d === "string")
      : [],
  };
}

export function writeQueue(
  scope: Scope,
  username: string,
  queue: OfflineQueue,
): boolean {
  if (queue.entries.length === 0 && queue.deletes.length === 0) {
    try {
      window.localStorage.removeItem(queueKey(scope, username));
    } catch {
      // ignore
    }
    return true;
  }
  return write(queueKey(scope, username), queue);
}

export function readMirror(scope: Scope, username: string): Mirror | null {
  const data = read(mirrorKey(scope, username)) as Record<string, unknown> | null;
  if (!data || !Array.isArray(data.projects) || !Array.isArray(data.logs)) {
    return null;
  }
  return { projects: data.projects as Project[], logs: data.logs as TimeLog[] };
}

export function writeMirror(scope: Scope, username: string, mirror: Mirror): void {
  // Best effort: a mirror that doesn't fit only means a blanker offline view.
  write(mirrorKey(scope, username), mirror);
}

export function pendingCount(queue: OfflineQueue): number {
  return queue.entries.length + queue.deletes.length;
}

/** The server's logs as this browser believes they now stand. */
export function applyQueue(logs: TimeLog[], queue: OfflineQueue): TimeLog[] {
  if (pendingCount(queue) === 0) return logs;
  const deleted = new Set(queue.deletes);
  const kept = logs.filter((l) => !deleted.has(l.id));
  const present = new Set(kept.map((l) => l.id));
  // An entry the server already has (a sync whose reply was lost) shows once.
  const local = queue.entries
    .filter((e) => !present.has(e.id))
    .map((e) => e.log)
    .sort((a, b) => (a.loggedAt < b.loggedAt ? 1 : -1));
  return [...local, ...kept];
}

/**
 * Projects named in the logs, for when the real list never loaded in this
 * browser. Enough to keep the project pickers usable until the sheet is back.
 */
export function projectsFromLogs(logs: TimeLog[]): Project[] {
  const names = Array.from(new Set(logs.map((l) => l.project).filter(Boolean)));
  return names.sort().map((name) => ({
    id: `local:${name}`,
    name,
    addedAt: "",
    addedBy: "",
  }));
}

/** RFC 4122 v4. randomUUID is missing outside secure contexts, e.g. a LAN IP. */
export function newEntryId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
