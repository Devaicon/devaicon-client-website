"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { SectionGate } from "@/components/dashboard/DashboardShell";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";

export default function ProjectsPage() {
  return (
    <SectionGate anyOf={["projects.manage"]}>
      <Projects />
    </SectionGate>
  );
}

function Projects() {
  const {
    data,
    error: loadError,
    loading,
    reload: load,
  } = useApi<{ projects: Project[] }>("/projects");
  const projects = data?.projects ?? [];
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const trimmed = name.trim();
    if (!trimmed) return;
    const res = await api("/projects", { method: "POST", body: { name: trimmed } });
    if (!res.ok) {
      setMsg(res.status === 409 ? "Project already exists." : res.message);
      return;
    }
    setName("");
    load();
  }

  async function deleteProject(p: Project) {
    if (!confirm(`Delete “${p.name}”? Existing logs are not removed.`)) return;
    const res = await api(`/projects?id=${encodeURIComponent(p.id)}`, { method: "DELETE" });
    if (!res.ok) setMsg(res.message);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          The projects people can log time against.
        </p>
      </div>

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <form onSubmit={addProject} className="flex gap-2 mb-4">
          <label htmlFor="new-project" className="sr-only">
            New project name
          </label>
          <input
            id="new-project"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New project name"
            maxLength={100}
            className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
          >
            Add
          </button>
        </form>
        {(msg || loadError) && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{msg || loadError}</p>
        )}

        {loading ? (
          <div className="space-y-2 animate-pulse mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-md"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">No projects yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-md mt-4">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    Added {new Date(p.addedAt).toLocaleDateString()} by {p.addedBy}
                  </div>
                </div>
                <button
                  onClick={() => deleteProject(p)}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
