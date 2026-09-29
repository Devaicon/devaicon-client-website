"use client";

import { Fragment, useState } from "react";
import {
  nameOf,
  type Me,
  type Permission,
  type PermissionOverrides,
  type RoleRef,
} from "@/lib/types";
import {
  KeyRound,
  Lock,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import IconButton from "@/components/dashboard/IconButton";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import Toggle from "@/components/time-logger/settings/Toggle";

type TeamUser = {
  id: string;
  username: string;
  displayName: string;
  permissions: Permission[];
  overrides: PermissionOverrides;
  role: RoleRef | null;
  active: boolean;
  lastLoginAt: string;
  createdAt: string;
};

type RoleOption = RoleRef & { description: string; permissions: Permission[] };

type PermissionInfo = { key: Permission; group: string; label: string; description: string };

const PASSWORD_MIN_LENGTH = 8;

const inputClass =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm";
const primaryButton =
  "rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50";

// Unambiguous characters only, so a password read out loud survives.
function generatePassword(length = 14): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export default function TeamPage() {
  return (
    <SectionGate anyOf={["users.manage"]}>
      <Team />
    </SectionGate>
  );
}

function initials(user: { username: string; displayName: string }): string {
  const parts = nameOf(user).split(/[\s_]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function relativeDate(iso: string): string {
  if (!iso) return "Never";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

function Team() {
  const { me } = useDashboardSession();
  const usersRes = useApi<{ users: TeamUser[] }>("/users");
  const rolesRes = useApi<{ roles: RoleOption[]; permissions: PermissionInfo[] }>("/roles");
  const users = usersRes.data?.users ?? [];
  const roles = rolesRes.data?.roles ?? [];
  const catalogue = rolesRes.data?.permissions ?? [];
  const loading = usersRes.loading;
  const reloadUsers = usersRes.reload;
  const load = () => {
    reloadUsers();
    rolesRes.reload();
  };
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [resetting, setResetting] = useState<TeamUser | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = users.find((u) => u.id === editingId) ?? null;
  const shown = msg ?? (usersRes.error ? { kind: "error" as const, text: usersRes.error } : null);

  // Owners can only be created, changed or re-assigned by an Owner.
  const assignable = roles.filter((r) => !r.isOwner || me?.role.isOwner);

  const q = query.trim().toLowerCase();
  const visible = users.filter(
    (u) =>
      (status === "all" || (status === "active" ? u.active : !u.active)) &&
      (!q ||
        u.username.includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        (u.role?.name.toLowerCase().includes(q) ?? false)),
  );

  async function setActive(user: TeamUser, active: boolean) {
    if (
      !active &&
      !confirm(
        `Deactivate ${nameOf(user)}? They are signed out straight away and can't sign in again until reactivated. Their time logs are kept.`,
      )
    ) {
      return;
    }
    setMsg(null);
    const res = await api(`/users/${user.id}`, { method: "PATCH", body: { active } });
    if (!res.ok) setMsg({ kind: "error", text: res.message });
    else
      setMsg({
        kind: "ok",
        text: `${nameOf(user)} ${active ? "can sign in again" : "has been deactivated"}.`,
      });
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Everyone who can sign in, and what each person's access allows."
        actions={
          !adding && (
            <button onClick={() => setAdding(true)} className={`${primaryButton} inline-flex items-center gap-2`}>
              <UserPlus className="h-4 w-4" aria-hidden />
              Add person
            </button>
          )
        }
      />

      {adding && (
        <AddUser
          roles={assignable}
          onCancel={() => setAdding(false)}
          onAdded={(text) => {
            setMsg({ kind: "ok", text });
            setAdding(false);
            load();
          }}
        />
      )}

      {shown && (
        <div
          key={shown.text}
          role="status"
          className={`anim-drop text-sm rounded-md px-3 py-2 border ${
            shown.kind === "error"
              ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900"
              : "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900"
          }`}
        >
          {shown.text}
        </div>
      )}

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
          <div className="relative flex-1 min-w-[12rem]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
            <label htmlFor="team-search" className="sr-only">
              Search people
            </label>
            <input
              id="team-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, username or role"
              className={`${inputClass} pl-8`}
            />
          </div>
          <div role="group" aria-label="Status" className="inline-flex rounded-md border border-neutral-200 dark:border-neutral-800 p-0.5 text-xs">
            {(["all", "active", "inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={`rounded px-2.5 py-1 capitalize ${
                  status === s
                    ? "bg-neutral-900 text-white dark:bg-neutral-700"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {s === "inactive" ? "Deactivated" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
              <tr>
                <th scope="col" className="text-left px-4 py-2 font-medium">Person</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Access</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Status</th>
                <th scope="col" className="text-left px-4 py-2 font-medium">Last sign-in</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody key={`${status}-${loading}`} className="anim-fade">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800 animate-pulse">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                    </td>
                  </tr>
                ))
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                    No one matches.
                  </td>
                </tr>
              ) : (
                visible.map((u) => {
                  const isSelf = u.id === me?.id;
                  // Mirrors the server's rules, so the controls someone sees
                  // are the ones that will work.
                  const locked = Boolean(u.role?.isOwner && !me?.role.isOwner);
                  const custom = u.overrides.granted.length + u.overrides.revoked.length;
                  const accessBlock = isSelf
                    ? "You can't change your own access."
                    : locked
                      ? "Only an Owner can change an Owner."
                      : null;
                  return (
                    <tr
                      key={u.id}
                      className={`border-t border-neutral-100 dark:border-neutral-800 ${
                        u.active ? "" : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              u.active
                                ? "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                                : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                            }`}
                          >
                            {initials(u)}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {nameOf(u)}
                              {isSelf && <span className="ml-1 text-xs font-normal text-neutral-400">(you)</span>}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingId(u.id)}
                          disabled={Boolean(accessBlock)}
                          title={accessBlock ?? "Change role and permissions"}
                          className="group text-left rounded-md -mx-2 px-2 py-1 enabled:hover:bg-neutral-100 dark:enabled:hover:bg-neutral-800 disabled:cursor-default"
                        >
                          <span className="flex items-center gap-1.5 font-medium">
                            {u.role?.isOwner && <Lock className="h-3 w-3" aria-label="Owner" />}
                            {u.role?.name ?? "No role"}
                            {custom > 0 && (
                              <span className="rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900 px-1.5 py-px text-[11px] font-medium">
                                Custom
                              </span>
                            )}
                          </span>
                          <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                            {u.permissions.length} of {catalogue.length || u.permissions.length} permissions
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {u.active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" aria-hidden />
                            Deactivated
                          </span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 whitespace-nowrap"
                        title={u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : undefined}
                      >
                        {relativeDate(u.lastLoginAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <IconButton
                            icon={SlidersHorizontal}
                            label="Edit access"
                            onClick={() => setEditingId(u.id)}
                            disabled={Boolean(accessBlock)}
                            disabledReason={accessBlock ?? undefined}
                          />
                          <IconButton
                            icon={KeyRound}
                            label="Reset password"
                            onClick={() => setResetting(u)}
                            disabled={locked}
                            disabledReason="Only an Owner can change an Owner."
                          />
                          {u.active ? (
                            <IconButton
                              icon={UserX}
                              label="Deactivate"
                              tone="danger"
                              onClick={() => setActive(u, false)}
                              disabled={isSelf || locked}
                              disabledReason={isSelf ? "You can't deactivate yourself." : "Only an Owner can change an Owner."}
                            />
                          ) : (
                            <IconButton
                              icon={UserCheck}
                              label="Reactivate"
                              onClick={() => setActive(u, true)}
                              disabled={locked}
                              disabledReason="Only an Owner can change an Owner."
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editing && me && (
        <AccessDialog
          key={`${editing.id}-${editing.role?.id}`}
          user={editing}
          role={roles.find((r) => r.id === editing.role?.id) ?? null}
          roles={assignable}
          catalogue={catalogue}
          me={me}
          onChanged={load}
          onClose={() => setEditingId(null)}
        />
      )}

      {resetting && (
        <ResetPasswordDialog
          user={resetting}
          isSelf={resetting.id === me?.id}
          onClose={(text) => {
            setResetting(null);
            if (text) setMsg({ kind: "ok", text });
          }}
        />
      )}
    </div>
  );
}

function AddUser({
  roles,
  onAdded,
  onCancel,
}: {
  roles: RoleOption[];
  onAdded: (message: string) => void;
  onCancel: () => void;
}) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Default to the least-privileged-looking role once roles arrive.
  const fallbackRole = roles.find((r) => r.name === "Developer") ?? roles[roles.length - 1];
  const chosenRole = roleId || fallbackRole?.id || "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }
    setBusy(true);
    const res = await api("/users", {
      method: "POST",
      body: {
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        password,
        roleId: chosenRole,
      },
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    onAdded(`${username.trim().toLowerCase()} can now sign in. Share their password with them privately.`);
    setUsername("");
    setDisplayName("");
    setPassword("");
  }

  return (
    <section className="anim-drop rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Add a person</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Cancel
        </button>
      </div>
      <form
        onSubmit={submit}
        className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr_10rem_auto] md:items-end"
      >
        <div>
          <label htmlFor="new-username" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Username
          </label>
          <input
            id="new-username"
            required
            autoFocus
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. devsara"
            pattern="[A-Za-z0-9_]{2,32}"
            title="2–32 letters, numbers or underscores"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="new-display-name" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Name (optional)
          </label>
          <input
            id="new-display-name"
            autoComplete="off"
            maxLength={60}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Sara Khan"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="new-password" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Password
          </label>
          <div className="flex gap-2">
            <input
              id="new-password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} font-mono`}
            />
            <button
              type="button"
              onClick={() => setPassword(generatePassword())}
              className="shrink-0 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Generate
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="new-role" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Role
          </label>
          <select
            id="new-role"
            value={chosenRole}
            onChange={(e) => setRoleId(e.target.value)}
            className={inputClass}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={busy || !chosenRole} className={primaryButton}>
          {busy ? "Adding…" : "Add user"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </section>
  );
}

function ResetPasswordDialog({
  user,
  isSelf,
  onClose,
}: {
  user: TeamUser;
  isSelf: boolean;
  onClose: (message?: string) => void;
}) {
  const [password, setPassword] = useState(() => generatePassword());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }
    setBusy(true);
    const res = await api(`/users/${user.id}/password`, { method: "POST", body: { password } });
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    onClose(
      isSelf
        ? "Your password has been changed. Other devices have been signed out."
        : `${user.username}'s password has been changed and they have been signed out everywhere.`,
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      className="anim-fade fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <form
        onSubmit={submit}
        className="anim-pop w-full max-w-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg space-y-4"
      >
        <div>
          <h2 id="reset-title" className="font-semibold">
            Reset password for {user.username}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {isSelf
              ? "You stay signed in here; other devices are signed out."
              : "They are signed out everywhere. Share the new password with them privately."}
          </p>
        </div>
        <div className="flex gap-2">
          <label htmlFor="reset-password" className="sr-only">
            New password
          </label>
          <input
            id="reset-password"
            autoFocus
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} font-mono`}
          />
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className="shrink-0 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Generate
          </button>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onClose()}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button type="submit" disabled={busy} className={primaryButton}>
            {busy ? "Saving…" : "Set password"}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * One person's name and permissions. Each switch shows the effective value;
 * the tag beside it says whether that comes from their role or was changed
 * for them. Flipping a switch back to the role's value removes the change
 * rather than recording a redundant one.
 */
function AccessDialog({
  user,
  role,
  roles,
  catalogue,
  me,
  onChanged,
  onClose,
}: {
  user: TeamUser;
  role: RoleOption | null;
  /** Roles this viewer may assign. */
  roles: RoleOption[];
  catalogue: PermissionInfo[];
  me: Me;
  onChanged: () => void;
  onClose: () => void;
}) {
  const [overrides, setOverrides] = useState<PermissionOverrides>(user.overrides);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [note, setNote] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const fromRole = role?.permissions ?? [];
  const groups = [...new Set(catalogue.map((p) => p.group))];
  const changedCount = overrides.granted.length + overrides.revoked.length;

  // Mirrors the server: a non-Owner can only change what they hold.
  const mayChange = (key: Permission) =>
    !role?.isOwner && (me.role.isOwner || me.permissions.includes(key));

  async function save(next: PermissionOverrides) {
    const previous = overrides;
    setOverrides(next);
    setNote(null);
    const res = await api<{ user: TeamUser }>(`/users/${user.id}/permissions`, {
      method: "PUT",
      body: next,
    });
    if (!res.ok) {
      setOverrides(previous);
      setNote({ kind: "error", text: res.message });
      return;
    }
    setOverrides(res.data.user.overrides);
    onChanged();
  }

  function setPermission(key: Permission, on: boolean) {
    const granted = overrides.granted.filter((k) => k !== key);
    const revoked = overrides.revoked.filter((k) => k !== key);
    const roleHas = fromRole.includes(key);
    if (on && !roleHas) granted.push(key);
    if (!on && roleHas) revoked.push(key);
    save({ granted, revoked });
  }

  // The dialog is keyed on the role, so a successful change remounts it with
  // the new role's defaults and the cleared overrides.
  async function changeRole(roleId: string) {
    if (
      changedCount > 0 &&
      !confirm("Changing the role clears this person's custom permissions. Continue?")
    ) {
      return;
    }
    setNote(null);
    const res = await api(`/users/${user.id}`, { method: "PATCH", body: { roleId } });
    if (!res.ok) setNote({ kind: "error", text: res.message });
    onChanged();
  }

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await api(`/users/${user.id}`, {
      method: "PATCH",
      body: { displayName: displayName.trim() },
    });
    setBusy(false);
    setNote(res.ok ? { kind: "ok", text: "Name saved." } : { kind: "error", text: res.message });
    if (res.ok) onChanged();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-title"
      className="anim-fade fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4 overflow-y-auto"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="anim-pop w-full max-w-xl rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
        <div className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 id="access-title" className="font-semibold">
            {nameOf(user)}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            The role sets the starting permissions. Switch anything below on or off for
            this person alone; changes apply straight away.
          </p>

          <div className="mt-4">
            <label htmlFor="access-role" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Role
            </label>
            <select
              id="access-role"
              value={role?.id ?? ""}
              onChange={(e) => changeRole(e.target.value)}
              className={inputClass}
            >
              {!role && <option value="">No role</option>}
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {r.description ? ` — ${r.description}` : ""}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={saveName} className="mt-3 flex gap-2 items-end">
            <div className="flex-1">
              <label htmlFor="access-name" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Name shown for {user.username}
              </label>
              <input
                id="access-name"
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={user.username}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={busy || displayName.trim() === user.displayName}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              Save name
            </button>
          </form>
        </div>

        <div className="px-6 py-2 max-h-[50vh] overflow-y-auto">
          {role?.isOwner && (
            <p className="mt-3 rounded-md bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400">
              Owners always have every permission, so these can&apos;t be changed.
            </p>
          )}
          {groups.map((group) => (
            <Fragment key={group}>
              <h3 className="pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {group}
              </h3>
              {catalogue
                .filter((p) => p.group === group)
                .map((p) => {
                  const added = overrides.granted.includes(p.key);
                  const removed = overrides.revoked.includes(p.key);
                  const on = (fromRole.includes(p.key) || added) && !removed;
                  return (
                    <div
                      key={p.key}
                      className="flex items-center justify-between gap-4 py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{p.label}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {added ? (
                            <span className="text-violet-700 dark:text-violet-300">Added for them</span>
                          ) : removed ? (
                            <span className="text-amber-700 dark:text-amber-400">Removed for them</span>
                          ) : (
                            "From role"
                          )}
                          {(added || removed) && mayChange(p.key) && (
                            <button
                              onClick={() => setPermission(p.key, fromRole.includes(p.key))}
                              className="ml-2 underline hover:text-neutral-900 dark:hover:text-neutral-100"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                      <Toggle
                        checked={on}
                        onChange={(v) => setPermission(p.key, v)}
                        label={`${p.label} for ${nameOf(user)}`}
                        disabled={!mayChange(p.key)}
                      />
                    </div>
                  );
                })}
            </Fragment>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-3">
          {note && (
            <p
              key={note.text}
              role="status"
              className={`anim-fade text-sm ${note.kind === "error" ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
            >
              {note.text}
            </p>
          )}
          <div className="ml-auto flex gap-2">
            {changedCount > 0 && (
              <button
                onClick={() => save({ granted: [], revoked: [] })}
                className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Reset all to role
              </button>
            )}
            <button onClick={onClose} className={primaryButton}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
