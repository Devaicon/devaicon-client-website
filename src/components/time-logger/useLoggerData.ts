"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, TimeLog } from "@/lib/types";
import type { LoggerConfig } from "./config";

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
export type MutationResult = { ok: boolean; message?: string };

export type LoggerData = {
  me: { username: string; role: string } | null;
  projects: Project[];
  logs: TimeLog[];
  loading: boolean;
  loadError: string | null;
  reload: () => Promise<void>;
  createLog: (input: NewLogInput) => Promise<MutationResult>;
  deleteLog: (id: string) => Promise<MutationResult>;
  bulkDeleteLogs: (ids: string[]) => Promise<MutationResult>;
  logout: () => Promise<void>;
};

async function messageFrom(res: Response, fallback: string): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const m = data?.message ?? data?.error;
  return typeof m === "string" ? m : fallback;
}

export function useLoggerData(config: LoggerConfig): LoggerData {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { apiBase, loginPath, bulkDelete } = config;

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
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
      setMe(meData.user);
      if (pRes.ok) setProjects((await pRes.json()).projects ?? []);
      if (lRes.ok) setLogs((await lRes.json()).logs ?? []);
    } catch {
      setLoadError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [apiBase, loginPath, router]);

  useEffect(() => {
    reload();
  }, [reload]);

  const createLog = useCallback(
    async (input: NewLogInput): Promise<MutationResult> => {
      try {
        const res = await fetch(`${apiBase}/logs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          return { ok: false, message: await messageFrom(res, "Failed.") };
        }
        await reload();
        return { ok: true };
      } catch {
        return { ok: false, message: "Network error. Nothing was saved." };
      }
    },
    [apiBase, reload],
  );

  const deleteLog = useCallback(
    async (id: string): Promise<MutationResult> => {
      try {
        const res = await fetch(`${apiBase}/logs?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          return {
            ok: false,
            message: await messageFrom(res, "Could not delete this entry."),
          };
        }
        await reload();
        return { ok: true };
      } catch {
        return { ok: false, message: "Network error. Nothing was deleted." };
      }
    },
    [apiBase, reload],
  );

  const bulkDeleteLogs = useCallback(
    async (ids: string[]): Promise<MutationResult> => {
      if (ids.length === 0) return { ok: true };
      try {
        const res =
          bulkDelete === "post-body"
            ? await fetch(`${apiBase}/logs/bulk-delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
              })
            : await fetch(
                `${apiBase}/logs?ids=${encodeURIComponent(ids.join(","))}`,
                { method: "DELETE" },
              );
        if (!res.ok) {
          return {
            ok: false,
            message: await messageFrom(res, "Could not delete selected entries."),
          };
        }
        await reload();
        return { ok: true };
      } catch {
        return { ok: false, message: "Network error. Nothing was deleted." };
      }
    },
    [apiBase, bulkDelete, reload],
  );

  const logout = useCallback(async () => {
    await fetch(`${apiBase}/auth/logout`, { method: "POST" }).catch(() => {});
    router.push(loginPath);
  }, [apiBase, loginPath, router]);

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
  };
}
