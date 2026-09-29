"use client";

import { Fragment, useState } from "react";
import { Lock } from "lucide-react";
import { can } from "@/lib/types";
import { SectionGate } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/components/admin/AdminSession";
import { api } from "@/components/admin/api";
import { useApi } from "@/components/admin/useApi";
import Toggle from "@/components/time-logger/settings/Toggle";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isOwner: boolean;
  userCount: number;
};

type PermissionInfo = {
  key: string;
  group: string;
  label: string;
  description: string;
};

export default function RolesPage() {
  return (
    <SectionGate anyOf={["users.manage", "roles.manage"]}>
      <Roles />
    </SectionGate>
  );
}

function Roles() {
  const { me } = useAdminSession();
  const canManage = can(me, "roles.manage");
  const {
    data,
    error: loadError,
    loading,
    reload: load,
    setData,
  } = useApi<{ roles: Role[]; permissions: PermissionInfo[] }>("/roles");
  const roles = data?.roles ?? [];
  const catalogue = data?.permissions ?? [];
  const [msg, setMsg] = useState<string | null>(null);

  // Mirrors the server: Owner is locked for everyone, and only an Owner may
  // edit the role they hold (otherwise roles.manage could grant itself more).
  function editable(role: Role): boolean {
    if (!canManage || role.isOwner) return false;
    return role.id !== me?.role.id || Boolean(me?.role.isOwner);
  }

  async function toggle(role: Role, key: string, on: boolean) {
    setMsg(null);
    const permissions = on
      ? [...role.permissions, key]
      : role.permissions.filter((k) => k !== key);
    // Optimistic: the switch moves at once and snaps back if the save fails.
    setData((prev) =>
      prev && {
        ...prev,
        roles: prev.roles.map((r) => (r.id === role.id ? { ...r, permissions } : r)),
      },
    );
    const res = await api(`/roles/${role.id}`, { method: "PATCH", body: { permissions } });
    if (!res.ok) {
      setMsg(res.message);
      load();
    }
  }

  async function rename(role: Role) {
    const name = prompt("Rename role", role.name);
    if (name === null || !name.trim() || name.trim() === role.name) return;
    setMsg(null);
    const res = await api(`/roles/${role.id}`, { method: "PATCH", body: { name: name.trim() } });
    if (!res.ok) setMsg(res.message);
    load();
  }

  async function remove(role: Role) {
    if (!confirm(`Delete the ${role.name} role?`)) return;
    setMsg(null);
    const res = await api(`/roles/${role.id}`, { method: "DELETE" });
    if (!res.ok) setMsg(res.message);
    load();
  }

  const groups = [...new Set(catalogue.map((p) => p.group))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Roles</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {canManage
            ? "Switch permissions on or off for each role. Changes reach everyone with that role straight away, except where someone has their own setting for that permission (see Team)."
            : "What each role allows. Only people who can manage roles can change these."}
        </p>
      </div>

      {canManage && <NewRole onCreated={load} onError={setMsg} />}

      {(msg || loadError) && (
        <div
          role="status"
          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2"
        >
          {msg || loadError}
        </div>
      )}

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        {loading ? (
          <div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-950">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 font-medium text-neutral-600 dark:text-neutral-400 min-w-[16rem]">
                    Permission
                  </th>
                  {roles.map((r) => (
                    <th key={r.id} scope="col" className="px-4 py-3 text-center align-top min-w-[8rem]">
                      <div className="font-semibold inline-flex items-center gap-1" title={r.description}>
                        {r.isOwner && <Lock className="w-3 h-3" aria-label="Locked" />}
                        {r.name}
                      </div>
                      <div className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                        {r.userCount} {r.userCount === 1 ? "person" : "people"}
                      </div>
                      {editable(r) && (
                        <div className="mt-1 flex justify-center gap-2 text-xs font-normal">
                          <button
                            onClick={() => rename(r)}
                            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => remove(r)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <Fragment key={group}>
                    <tr className="border-t border-neutral-200 dark:border-neutral-800">
                      <th
                        scope="colgroup"
                        colSpan={roles.length + 1}
                        className="text-left px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                      >
                        {group}
                      </th>
                    </tr>
                    {catalogue
                      .filter((p) => p.group === group)
                      .map((p) => (
                        <tr key={p.key} className="border-t border-neutral-100 dark:border-neutral-800">
                          <th scope="row" className="text-left px-4 py-2 font-normal">
                            <div className="font-medium">{p.label}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {p.description}
                            </div>
                          </th>
                          {roles.map((r) => (
                            <td key={r.id} className="px-4 py-2 text-center">
                              <Toggle
                                checked={r.permissions.includes(p.key)}
                                onChange={(on) => toggle(r, p.key, on)}
                                label={`${p.label} for ${r.name}`}
                                disabled={!editable(r)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function NewRole({
  onCreated,
  onError,
}: {
  onCreated: () => void;
  onError: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const res = await api("/roles", {
      method: "POST",
      body: { name: name.trim(), description: description.trim(), permissions: [] },
    });
    setBusy(false);
    if (!res.ok) {
      onError(res.message);
      return;
    }
    setName("");
    setDescription("");
    onCreated();
  }

  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      <h2 className="font-semibold">New role</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        Starts with nothing switched on.
      </p>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-[14rem_1fr_auto] md:items-end">
        <div>
          <label htmlFor="role-name" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Name
          </label>
          <input
            id="role-name"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Team lead"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="role-description" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Description (optional)
          </label>
          <input
            id="role-description"
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create role"}
        </button>
      </form>
    </section>
  );
}
