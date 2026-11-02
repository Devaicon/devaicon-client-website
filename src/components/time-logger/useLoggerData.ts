"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { startProgress } from "@/lib/progress";
import { useRouter } from "next/navigation";
import { BULK_IDS_MAX, type Me, type Project, type TimeLog } from "@/lib/types";
import {
  composeDescription,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
} from "@/lib/description";
import type { LoggerConfig } from "./config";
import { storageAvailable } from "./stopwatch/storage";
import {
  applyQueue,
  EMPTY_QUEUE,
  isQueueKey,
  newEntryId,
  pendingCount,
  projectsFromLogs,
  readMirror,
  readQueue,
  writeMirror,
  writeQueue,
  type OfflineQueue,
} from "./offline";

export type NewLogInput = {
  date: string;
  project: string;
  category: string;
  hours: number;
  description: string;
  tools: string[];
  areas: string[];
  status: string;
  reference: string;
};

// Deliberately not a discriminated union: this project compiles with
// `strict: false`, and without strictNullChecks TypeScript won't narrow a
// boolean-literal discriminant. A flat shape keeps call sites type-safe.
// `warning` rides on a success: the change was kept, but only in this browser.
export type MutationResult = { ok: boolean; message?: string; warning?: string };

export type LoggerData = {
  me: Me | null;
  projects: Project[];
  logs: TimeLog[];
  loading: boolean;
  loadError: string | null;
  reload: () => Promise<void>;
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  deleteLog: (id: string) => Promise<MutationResult>;
  bulkDeleteLogs: (ids: string[]) => Promise<MutationResult>;
  logout: () => Promise<void>;
  /** The backend couldn't be reached on the last request; data is this browser's copy. */
  offline: boolean;
  /** Entries and deletions held in this browser, waiting for a sync. */
  pendingSync: number;
  /** Entries that exist only in this browser, mapped to the server's last refusal ('' if none). */
  unsynced: Map<string, string>;
  syncing: boolean;
  /** Replay everything held in this browser against the backend. */
  sync: () => Promise<MutationResult>;
};

async function messageFrom(res: Response, fallback: string): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const m = data?.message ?? data?.error;
  return typeof m === "string" ? m : fallback;
}

/** A 5xx is the backend failing (e.g. sheets_error), not the request being wrong. */
function unavailable(res: Response): boolean {
  return res.status >= 500;
}

const SAVED_LOCALLY =
  "The spreadsheet couldn't be reached, so this entry is saved in this browser only. Use Sync now once it's back.";
const DELETED_LOCALLY =
  "The spreadsheet couldn't be reached, so this deletion is held in this browser. Use Sync now once it's back.";
const STILL_DOWN =
  "The spreadsheet still can't be reached. Everything is kept in this browser; try again later.";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function useLoggerData(config: LoggerConfig): LoggerData {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [serverProjects, setServerProjects] = useState<Project[]>([]);
  const [serverLogs, setServerLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [queue, setQueue] = useState<OfflineQueue>(EMPTY_QUEUE);
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);
  // Callbacks read the user from here so they don't re-create on every load.
  const meRef = useRef<Me | null>(null);

  const { apiBase, loginPath, bulkDelete, localFallback, storageScope } = config;

  /** Who the local queue belongs to, or null when there is nowhere to keep it. */
  const queueOwner = useCallback((): string | null => {
    if (!localFallback || !storageAvailable()) return null;
    return meRef.current?.username ?? null;
  }, [localFallback]);

  // Always read-modify-write from storage, not from state: another tab, or a
  // sync in flight, may have changed the queue since this render.
  const updateQueue = useCallback(
    (username: string, fn: (q: OfflineQueue) => OfflineQueue): boolean => {
      const next = fn(readQueue(storageScope, username));
      const ok = writeQueue(storageScope, username, next);
      if (ok) setQueue(next);
      return ok;
    },
    [storageScope],
  );

  const applyMirror = useCallback(
    (username: string) => {
      const mirror = readMirror(storageScope, username);
      if (mirror) {
        setServerProjects(mirror.projects);
        setServerLogs(mirror.logs);
      }
    },
    [storageScope],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const done = startProgress();
    try {
      const [meRes, pRes, lRes] = await Promise.all([
        fetch(`${apiBase}/auth/me`),
        fetch(`${apiBase}/projects`),
        fetch(`${apiBase}/logs`),
      ]);
      if (meRes.status === 401) {
        router.push(loginPath);
        return;
      }
      const meData = await meRes.json();
      const user: Me | null = meData.user ?? null;
      meRef.current = user;
      setMe(user);

      const projects: Project[] | null = pRes.ok
        ? ((await pRes.json()).projects ?? [])
        : null;
      const logs: TimeLog[] | null = lRes.ok ? ((await lRes.json()).logs ?? []) : null;
      if (projects) setServerProjects(projects);
      if (logs) setServerLogs(logs);

      if (localFallback && user) {
        const username = user.username;
        setQueue(readQueue(storageScope, username));
        const mirror = readMirror(storageScope, username);
        if (projects || logs) {
          writeMirror(storageScope, username, {
            projects: projects ?? mirror?.projects ?? [],
            logs: logs ?? mirror?.logs ?? [],
          });
        }
        if (!projects && mirror) setServerProjects(mirror.projects);
        if (!logs && mirror) setServerLogs(mirror.logs);
        setOffline(
          (!pRes.ok && unavailable(pRes)) || (!lRes.ok && unavailable(lRes)),
        );
      }
    } catch {
      // A signed-in user whose connection drops still has this browser's copy.
      const username = localFallback ? meRef.current?.username : null;
      if (username) {
        applyMirror(username);
        setQueue(readQueue(storageScope, username));
        setOffline(true);
      } else {
        setLoadError("Could not reach the server. Check your connection.");
      }
    } finally {
      setLoading(false);
      done();
    }
  }, [apiBase, loginPath, router, localFallback, storageScope, applyMirror]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Keep the queue in step with other tabs of the same dashboard.
  const username = me?.username;
  useEffect(() => {
    if (!localFallback || !username) return;
    const onStorage = (e: StorageEvent) => {
      if (isQueueKey(e.key, storageScope, username)) {
        setQueue(readQueue(storageScope, username));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [localFallback, storageScope, username]);

  const saveLocally = useCallback(
    (input: NewLogInput): MutationResult => {
      const owner = queueOwner();
      if (!owner) {
        return {
          ok: false,
          message:
            "The spreadsheet couldn't be reached and this browser can't hold the entry. Nothing was saved.",
        };
      }
      // The server checks these on sync; catching them now saves a refusal later.
      const summary = String(input.description ?? "").trim();
      if (summary.length < DESCRIPTION_MIN_LENGTH) {
        return {
          ok: false,
          message: `Summary must be at least ${DESCRIPTION_MIN_LENGTH} characters.`,
        };
      }
      const description = composeDescription({
        summary,
        tools: input.tools,
        areas: input.areas,
        status: input.status,
        reference: input.reference,
      });
      if (description.length > DESCRIPTION_MAX_LENGTH) {
        return {
          ok: false,
          message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`,
        };
      }
      if (!Number.isFinite(input.hours) || input.hours <= 0 || input.hours > 24) {
        return { ok: false, message: "Hours must be between 0 and 24." };
      }

      const id = newEntryId();
      const log: TimeLog = {
        id,
        date: input.date,
        username: owner,
        project: input.project.trim(),
        category: input.category,
        hours: input.hours,
        description,
        loggedAt: new Date().toISOString(),
        approvedAt: "",
        approvedBy: "",
      };
      const stored = updateQueue(owner, (q) => ({
        ...q,
        entries: [...q.entries, { id, input: { ...input, project: log.project }, log }],
      }));
      if (!stored) {
        return {
          ok: false,
          message:
            "The spreadsheet couldn't be reached and this browser's storage is full. Nothing was saved.",
        };
      }
      setOffline(true);
      return { ok: true, warning: SAVED_LOCALLY };
    },
    [queueOwner, updateQueue],
  );

  const createLog = useCallback(
    async (input: NewLogInput): Promise<MutationResult> => {
      try {
        const res = await fetch(`${apiBase}/logs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (res.ok) {
          await reload();
          return { ok: true };
        }
        if (!localFallback || !unavailable(res)) {
          return { ok: false, message: await messageFrom(res, "Failed.") };
        }
      } catch {
        if (!localFallback) {
          return { ok: false, message: "Network error. Nothing was saved." };
        }
      }
      return saveLocally(input);
    },
    [apiBase, reload, localFallback, saveLocally],
  );

  const deleteRequest = useCallback(
    (ids: string[]) =>
      bulkDelete === "post-body"
        ? fetch(`${apiBase}/logs/bulk-delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          })
        : fetch(`${apiBase}/logs?ids=${encodeURIComponent(ids.join(","))}`, {
            method: "DELETE",
          }),
    [apiBase, bulkDelete],
  );

  /**
   * Split ids into entries that only exist in this browser, which are simply
   * dropped from the queue, and real server rows.
   */
  const dropLocal = useCallback(
    (ids: string[]): string[] => {
      const owner = queueOwner();
      if (!owner) return ids;
      const localIds = new Set(readQueue(storageScope, owner).entries.map((e) => e.id));
      const local = ids.filter((id) => localIds.has(id));
      if (local.length) {
        const gone = new Set(local);
        updateQueue(owner, (q) => ({
          ...q,
          entries: q.entries.filter((e) => !gone.has(e.id)),
        }));
      }
      return ids.filter((id) => !localIds.has(id));
    },
    [queueOwner, storageScope, updateQueue],
  );

  /** Hold deletions of server rows until the next sync. */
  const deleteLocally = useCallback(
    (ids: string[], fallbackMessage: string): MutationResult => {
      const owner = queueOwner();
      const stored =
        owner &&
        updateQueue(owner, (q) => ({
          ...q,
          deletes: Array.from(new Set([...q.deletes, ...ids])),
        }));
      if (!stored) return { ok: false, message: fallbackMessage };
      setOffline(true);
      return { ok: true, warning: DELETED_LOCALLY };
    },
    [queueOwner, updateQueue],
  );

  const deleteLog = useCallback(
    async (id: string): Promise<MutationResult> => {
      if (dropLocal([id]).length === 0) return { ok: true };
      try {
        const res = await fetch(`${apiBase}/logs?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await reload();
          return { ok: true };
        }
        if (!localFallback || !unavailable(res)) {
          return {
            ok: false,
            message: await messageFrom(res, "Could not delete this entry."),
          };
        }
      } catch {
        if (!localFallback) {
          return { ok: false, message: "Network error. Nothing was deleted." };
        }
      }
      return deleteLocally([id], "Network error. Nothing was deleted.");
    },
    [apiBase, reload, localFallback, dropLocal, deleteLocally],
  );

  const bulkDeleteLogs = useCallback(
    async (ids: string[]): Promise<MutationResult> => {
      if (ids.length === 0) return { ok: true };
      const remote = dropLocal(ids);
      if (remote.length === 0) return { ok: true };
      try {
        const res = await deleteRequest(remote);
        if (res.ok) {
          await reload();
          return { ok: true };
        }
        if (!localFallback || !unavailable(res)) {
          return {
            ok: false,
            message: await messageFrom(res, "Could not delete selected entries."),
          };
        }
      } catch {
        if (!localFallback) {
          return { ok: false, message: "Network error. Nothing was deleted." };
        }
      }
      return deleteLocally(remote, "Network error. Nothing was deleted.");
    },
    [deleteRequest, reload, localFallback, dropLocal, deleteLocally],
  );

  const sync = useCallback(async (): Promise<MutationResult> => {
    const owner = queueOwner();
    if (!owner || syncingRef.current) return { ok: true };
    syncingRef.current = true;
    setSyncing(true);
    const done = startProgress();
    try {
      // Deletions first: they only ever touch rows the server already has.
      for (const ids of chunk(readQueue(storageScope, owner).deletes, BULK_IDS_MAX)) {
        const res = await deleteRequest(ids);
        if (!res.ok) {
          return {
            ok: false,
            message: unavailable(res)
              ? STILL_DOWN
              : await messageFrom(res, "The spreadsheet refused the held deletions."),
          };
        }
        const sent = new Set(ids);
        updateQueue(owner, (q) => ({
          ...q,
          deletes: q.deletes.filter((d) => !sent.has(d)),
        }));
      }

      let synced = 0;
      let refused = 0;
      for (const entry of readQueue(storageScope, owner).entries) {
        const res = await fetch(`${apiBase}/logs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...entry.input, clientId: entry.id }),
        });
        if (res.ok) {
          synced++;
          updateQueue(owner, (q) => ({
            ...q,
            entries: q.entries.filter((e) => e.id !== entry.id),
          }));
        } else if (unavailable(res)) {
          return { ok: false, message: STILL_DOWN };
        } else {
          // Refused on its merits (e.g. a project the sheet doesn't have):
          // keep it, with the reason, for the user to fix or delete.
          refused++;
          const error = await messageFrom(res, "Refused by the spreadsheet.");
          updateQueue(owner, (q) => ({
            ...q,
            entries: q.entries.map((e) => (e.id === entry.id ? { ...e, error } : e)),
          }));
        }
      }

      if (refused > 0) {
        return {
          ok: false,
          message: `${synced} ${synced === 1 ? "entry" : "entries"} synced. ${refused} ${
            refused === 1 ? "was" : "were"
          } refused by the spreadsheet; see the Entries tab to delete or re-enter ${
            refused === 1 ? "it" : "them"
          }.`,
        };
      }
      return { ok: true };
    } catch {
      return { ok: false, message: STILL_DOWN };
    } finally {
      syncingRef.current = false;
      setSyncing(false);
      done();
      // Re-read the sheet so the dashboard shows exactly what it now holds.
      await reload();
    }
  }, [queueOwner, storageScope, deleteRequest, updateQueue, apiBase, reload]);

  const logout = useCallback(async () => {
    await fetch(`${apiBase}/auth/logout`, { method: "POST" }).catch(() => {});
    router.push(loginPath);
  }, [apiBase, loginPath, router]);

  const logs = useMemo(() => applyQueue(serverLogs, queue), [serverLogs, queue]);

  // A browser that never saw the project list while the sheet was up still
  // knows the projects named in its entries, which keeps the pickers usable.
  const projects = useMemo(
    () => (serverProjects.length || !offline ? serverProjects : projectsFromLogs(logs)),
    [serverProjects, offline, logs],
  );

  const unsynced = useMemo(
    () => new Map(queue.entries.map((e) => [e.id, e.error ?? ""])),
    [queue],
  );

  return {
    me,
    projects,
    logs,
    loading,
    loadError,
    reload,
    createLog,
    deleteLog,
    bulkDeleteLogs,
    logout,
    offline,
    pendingSync: pendingCount(queue),
    unsynced,
    syncing,
    sync,
  };
}
