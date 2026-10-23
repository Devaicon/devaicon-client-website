"use client";

import { useState } from "react";
import { ChevronDown, Copy, Lock, Plus, Search, Trash2 } from "lucide-react";
import { can } from "@/lib/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import IconButton from "@/components/dashboard/IconButton";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
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

const CARD =
  "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900";
const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm";

export default function RolesPage() {
  return (
    <SectionGate anyOf={["users.manage", "roles.manage"]}>
      <Roles />
    </SectionGate>
  );
}

/**
 * A list of roles beside the one being edited. The old grid put every role
 * side by side against every permission, which stops being readable after a
 * handful of either; here only one role's permissions are ever on screen,
 * grouped, with a switch per group for the common "all of this area" case.
 */
function Roles() {
  const { me } = useDashboardSession();
  const canManage = can(me, "roles.manage");
  const { data, error: loadError, loading, reload, setData } = useApi<{
    roles: Role[];
    permissions: PermissionInfo[];
  }>("/roles");
  const roles = data?.roles ?? [];
  const catalogue = data?.permissions ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Default to the first role that can be edited, else the first one.
  const fallback = roles.find((r) => !r.isOwner) ?? roles[0] ?? null;
  const selected = roles.find((r) => r.id === selectedId) ?? fallback;

  const q = query.trim().toLowerCase();
  const listed = roles.filter(
    (r) => !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
  );

  // Mirrors the server: Owner is locked for everyone, and only an Owner may
  // edit the role they hold (otherwise roles.manage could grant itself more).
  function lockReason(role: Role): string | null {
    if (role.isOwner) return "The Owner role always has every permission and can't be changed.";
    if (!canManage) return "You can see roles but not change them.";
    if (role.id === me?.role.id && !me?.role.isOwner) {
      return "This is your own role. Ask an Owner to change it.";
    }
    return null;
  }

  async function savePermissions(role: Role, permissions: string[]) {
    setMsg(null);
    // Optimistic: switches move at once and snap back if the save fails.
    setData((prev) =>
      prev && {
        ...prev,
        roles: prev.roles.map((r) => (r.id === role.id ? { ...r, permissions } : r)),
      },
    );
    const res = await api(`/roles/${role.id}`, { method: "PATCH", body: { permissions } });
    if (!res.ok) {
      setMsg(res.message);
      reload();
    }
  }

  async function saveDetails(role: Role, patch: { name?: string; description?: string }) {
    setMsg(null);
    const res = await api(`/roles/${role.id}`, { method: "PATCH", body: patch });
    if (!res.ok) setMsg(res.message);
    reload();
  }

  async function create(body: { name: string; description?: string; permissions: string[] }) {
    setMsg(null);
    const res = await api<{ role: Role }>("/roles", { method: "POST", body });
    if (!res.ok) {
      setMsg(res.message);
      return false;
    }
    setSelectedId(res.data.role.id);
    reload();
    return true;
  }

  async function remove(role: Role) {
    if (!confirm(`Delete the ${role.name} role?`)) return;
    setMsg(null);
    const res = await api(`/roles/${role.id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg(res.message);
      return;
    }
    setSelectedId(null);
    reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="A role is the starting set of permissions for everyone given it. Individual people can still be adjusted in Team."
      />

      {(msg || loadError) && (
        <div
          role="status"
          className="anim-drop text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2"
        >
          {msg || loadError}
        </div>
      )}

      {loading ? (
        <div className={`h-96 animate-pulse ${CARD}`} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
          {/* Role list */}
          <aside className={`${CARD} overflow-hidden`}>
            <div className="flex items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
              <h2 className="text-sm font-semibold">
                {roles.length} {roles.length === 1 ? "role" : "roles"}
              </h2>
              {canManage && !creating && (
                <button
                  onClick={() => setCreating(true)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  New role
                </button>
              )}
            </div>

            {creating && (
              <NewRoleForm
                onCancel={() => setCreating(false)}
                onCreate={async (name) => {
                  if (await create({ name, permissions: [] })) setCreating(false);
                }}
              />
            )}

            {roles.length > 6 && (
              <div className="relative border-b border-neutral-200 dark:border-neutral-800 p-3">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
                <label htmlFor="role-search" className="sr-only">
                  Search roles
                </label>
                <input
                  id="role-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roles"
                  className={`${INPUT} pl-8`}
                />
              </div>
            )}

            <ul className="max-h-[32rem] overflow-y-auto p-2" aria-label="Roles">
              {listed.map((r) => {
                const active = selected?.id === r.id;
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedId(r.id)}
                      aria-current={active ? "true" : undefined}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "bg-neutral-900 text-white dark:bg-neutral-700"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        {r.isOwner && <Lock className="h-3 w-3" aria-label="Locked" />}
                        {r.name}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs ${
                          active ? "text-white/70" : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {r.userCount} {r.userCount === 1 ? "person" : "people"} ·{" "}
                        {r.permissions.length}/{catalogue.length} permissions
                      </span>
                    </button>
                  </li>
                );
              })}
              {listed.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-neutral-500">No roles match.</li>
              )}
            </ul>
          </aside>

          {/* Selected role */}
          {selected && (
            <RoleEditor
              key={selected.id}
              role={selected}
              catalogue={catalogue}
              lockReason={lockReason(selected)}
              canManage={canManage}
              onPermissions={(p) => savePermissions(selected, p)}
              onDetails={(patch) => saveDetails(selected, patch)}
              onDuplicate={() =>
                create({
                  name: `${selected.name} copy`,
                  description: selected.description,
                  permissions: selected.permissions,
                })
              }
              onDelete={() => remove(selected)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function NewRoleForm({
  onCreate,
  onCancel,
}: {
  onCreate: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onCreate(name.trim());
      }}
      className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 p-3"
    >
      <label htmlFor="new-role-name" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
        New role name
      </label>
      <input
        id="new-role-name"
        autoFocus
        required
        maxLength={50}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Content writer"
        className={INPUT}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600"
        >
          Create
        </button>
      </div>
    </form>
  );
}

function RoleEditor({
  role,
  catalogue,
  lockReason,
  canManage,
  onPermissions,
  onDetails,
  onDuplicate,
  onDelete,
}: {
  role: Role;
  catalogue: PermissionInfo[];
  lockReason: string | null;
  canManage: boolean;
  onPermissions: (permissions: string[]) => void;
  onDetails: (patch: { name?: string; description?: string }) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const editable = !lockReason;
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const groups = [...new Set(catalogue.map((p) => p.group))];

  function setMany(keys: string[], on: boolean) {
    const next = on
      ? [...new Set([...role.permissions, ...keys])]
      : role.permissions.filter((k) => !keys.includes(k));
    // Keep catalogue order, so the stored list reads the same way as the page.
    onPermissions(catalogue.map((p) => p.key).filter((k) => next.includes(k)));
  }

  function commitDetails() {
    const patch: { name?: string; description?: string } = {};
    if (name.trim() && name.trim() !== role.name) patch.name = name.trim();
    if (description.trim() !== role.description) patch.description = description.trim();
    if (Object.keys(patch).length > 0) onDetails(patch);
  }

  return (
    <section className={`anim-fade ${CARD}`} aria-label={`${role.name} role`}>
      <div className="flex flex-wrap items-start gap-4 border-b border-neutral-200 dark:border-neutral-800 p-5">
        <div className="flex-1 min-w-[14rem] space-y-2">
          {editable ? (
            <>
              <label htmlFor="role-name" className="sr-only">
                Role name
              </label>
              <input
                id="role-name"
                value={name}
                maxLength={50}
                onChange={(e) => setName(e.target.value)}
                onBlur={commitDetails}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 -mx-2 text-lg font-semibold hover:border-neutral-200 focus:border-neutral-300 dark:hover:border-neutral-700 dark:focus:border-neutral-600 focus:outline-none"
              />
              <label htmlFor="role-description" className="sr-only">
                Description
              </label>
              <input
                id="role-description"
                value={description}
                maxLength={200}
                placeholder="Add a short description"
                onChange={(e) => setDescription(e.target.value)}
                onBlur={commitDetails}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 -mx-2 text-sm text-neutral-600 dark:text-neutral-400 hover:border-neutral-200 focus:border-neutral-300 dark:hover:border-neutral-700 dark:focus:border-neutral-600 focus:outline-none"
              />
            </>
          ) : (
            <>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                {role.isOwner && <Lock className="h-4 w-4" aria-hidden />}
                {role.name}
              </h2>
              {role.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{role.description}</p>
              )}
            </>
          )}
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {role.userCount} {role.userCount === 1 ? "person has" : "people have"} this role ·{" "}
            {role.permissions.length} of {catalogue.length} permissions on
          </p>
        </div>
        {canManage && (
          <div className="flex gap-1">
            <IconButton icon={Copy} label="Duplicate role" onClick={onDuplicate} disabled={role.isOwner} disabledReason="The Owner role can't be copied." />
            <IconButton
              icon={Trash2}
              label="Delete role"
              tone="danger"
              onClick={onDelete}
              disabled={!editable || role.userCount > 0}
              disabledReason={
                lockReason ?? `Move the ${role.userCount} ${role.userCount === 1 ? "person" : "people"} with this role first.`
              }
            />
          </div>
        )}
      </div>

      {lockReason && (
        <p className="mx-5 mt-4 flex items-center gap-2 rounded-md bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {lockReason}
        </p>
      )}

      <div className="space-y-3 p-5">
        {groups.map((group) => {
          const items = catalogue.filter((p) => p.group === group);
          const keys = items.map((p) => p.key);
          const onCount = keys.filter((k) => role.permissions.includes(k)).length;
          const open = !collapsed.has(group);
          const panelId = `group-${group.replace(/\W+/g, "-")}`;
          return (
            <div key={group} className="rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() =>
                    setCollapsed((prev) => {
                      const next = new Set(prev);
                      if (next.has(group)) next.delete(group);
                      else next.add(group);
                      return next;
                    })
                  }
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform ${open ? "" : "-rotate-90"}`}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold">{group}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {onCount} of {keys.length} on
                  </span>
                </button>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">All</span>
                <Toggle
                  checked={onCount === keys.length}
                  onChange={(v) => setMany(keys, v)}
                  label={`All ${group} permissions for ${role.name}`}
                  disabled={!editable}
                />
              </div>
              {open && (
                <ul id={panelId} className="anim-drop border-t border-neutral-100 dark:border-neutral-800">
                  {items.map((p) => (
                    <li
                      key={p.key}
                      className="flex items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 pl-10 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{p.label}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{p.description}</div>
                      </div>
                      <Toggle
                        checked={role.permissions.includes(p.key)}
                        onChange={(v) => setMany([p.key], v)}
                        label={`${p.label} for ${role.name}`}
                        disabled={!editable}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
