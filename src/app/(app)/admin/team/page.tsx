"use client";

import { Fragment, useState } from "react";
import {
  nameOf,
  type Me,
  type Permission,
  type PermissionOverrides,
  type RoleRef,
} from "@/lib/types";
import { SectionGate } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/components/admin/AdminSession";
import { api } from "@/components/admin/api";
import { useApi } from "@/components/admin/useApi";
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

function Team() {
  const { me } = useAdminSession();
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
  const [resetting, setResetting] = useState<TeamUser | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = users.find((u) => u.id === editingId) ?? null;
  const shown = msg ?? (usersRes.error ? { kind: "error" as const, text: usersRes.error } : null);

  // Owners can only be created, changed or re-assigned by an Owner.
  const assignable = roles.filter((r) => !r.isOwner || me?.role.isOwner);

  async function changeRole(user: TeamUser, roleId: string) {
    setMsg(null);
    const res = await api(`/users/${user.id}`, { method: "PATCH", body: { roleId } });
    if (!res.ok) setMsg({ kind: "error", text: res.message });
    load();
  }

  async function setActive(user: TeamUser, active: boolean) {
    if (
      !active &&
      !confirm(
        `Deactivate ${user.username}? They are signed out straight away and can't sign in again until reactivated. Their time logs are kept.`,
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
        text: `${user.username} ${active ? "can sign in again" : "has been deactivated"}.`,
      });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Everyone who can sign in, and the role that decides what they can do.
        </p>
      </div>

      <AddUser
        roles={assignable}
        onAdded={(text) => {
          setMsg({ kind: "ok", text });
          load();
        }}
      />

      {shown && (
        <div
          role="status"
          className={`text-sm rounded-md px-3 py-2 border ${
            shown.kind === "error"
              ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900"
              : "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900"
          }`}
        >
          {shown.text}
        </div>
      )}

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
              <tr>
                <th className="text-left px-4 py-2 font-medium">User</th>
                <th className="text-left px-4 py-2 font-medium">Role</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="text-left px-4 py-2 font-medium">Last sign-in</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800 animate-pulse">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                    </td>
                  </tr>
                ))
              ) : (
                users.map((u) => {
                  const isSelf = u.id === me?.id;
                  // Mirrors the server's rules, so the controls someone sees
                  // are the ones that will work.
                  const locked = Boolean(u.role?.isOwner && !me?.role.isOwner);
                  return (
                    <tr
                      key={u.id}
                      className={`border-t border-neutral-100 dark:border-neutral-800 ${
                        u.active ? "" : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="font-medium">
                          {nameOf(u)}
                          {isSelf && (
                            <span className="ml-1 text-xs font-normal text-neutral-400">(you)</span>
                          )}
                        </div>
                        {u.displayName && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{u.username}</div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {isSelf || locked ? (
                          <span title={isSelf ? "You can't change your own role." : "Only an Owner can change an Owner."}>
                            {u.role?.name ?? "—"}
                          </span>
                        ) : (
                          <select
                            aria-label={`Role for ${u.username}`}
                            value={u.role?.id ?? ""}
                            onChange={(e) => changeRole(u, e.target.value)}
                            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-sm"
                          >
                            {assignable.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {u.overrides.granted.length + u.overrides.revoked.length > 0 && (
                          <span
                            title="This person has permissions that differ from their role."
                            className="ml-2 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900 px-2 py-0.5 text-xs font-medium"
                          >
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {u.active ? (
                          <span className="rounded-full bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900 px-2 py-0.5 text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 text-xs font-medium">
                            Deactivated
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        {!locked && !isSelf && (
                          <button
                            onClick={() => setEditingId(u.id)}
                            className="mr-3 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                          >
                            Profile &amp; access
                          </button>
                        )}
                        {!locked && (
                          <button
                            onClick={() => setResetting(u)}
                            className="text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                          >
                            Reset password
                          </button>
                        )}
                        {!locked && !isSelf && (
                          <button
                            onClick={() => setActive(u, !u.active)}
                            className={`ml-3 text-xs ${
                              u.active
                                ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                            }`}
                          >
                            {u.active ? "Deactivate" : "Reactivate"}
                          </button>
                        )}
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
          user={editing}
          role={roles.find((r) => r.id === editing.role?.id) ?? null}
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
}: {
  roles: RoleOption[];
  onAdded: (message: string) => void;
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
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      <h2 className="font-semibold mb-4">Add someone</h2>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg space-y-4"
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
  catalogue,
  me,
  onChanged,
  onClose,
}: {
  user: TeamUser;
  role: RoleOption | null;
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
  const mayChange = (key: Permission) => me.role.isOwner || me.permissions.includes(key);

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
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4 overflow-y-auto"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="w-full max-w-xl rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
        <div className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 id="access-title" className="font-semibold">
            {nameOf(user)}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Starts from the <strong className="font-medium">{role?.name ?? "—"}</strong> role.
            Switch anything on or off for this person alone; changes apply straight away.
          </p>

          <form onSubmit={saveName} className="mt-4 flex gap-2 items-end">
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

        <div className="px-6 py-2 max-h-[55vh] overflow-y-auto">
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
              role="status"
              className={`text-sm ${note.kind === "error" ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
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
