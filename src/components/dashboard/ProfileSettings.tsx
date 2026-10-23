"use client";

import { useEffect, useId, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  KeyRoundIcon,
  LogOutIcon,
  MinusIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import type { Me } from "@/lib/types";
import Group from "@/components/time-logger/settings/Group";
import AppearanceSettings from "./AppearanceSettings";

type Access = {
  key: string;
  group: string;
  label: string;
  description: string;
  /** Absent from servers that only sent held permissions. */
  held?: boolean;
  /** Why it is held or not: from the role, added or removed for this person. */
  source: "role" | "personal" | "removed" | null;
};

type Profile = { user: Me; access: Access[]; lastLoginAt: string; createdAt: string };

type Note = { tone: "ok" | "error"; text: string } | null;

const INPUT =
  "w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500";
const OUTLINE_BUTTON =
  "flex cursor-pointer items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-50";

async function send(url: string, method: string, body?: unknown) {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data, message: typeof data?.message === "string" ? data.message : undefined };
  } catch {
    return { ok: false, data: null, message: "Could not reach the server. Check your connection." };
  }
}

function NoteLine({ note }: { note: Note }) {
  return (
    <p
      aria-live="polite"
      className={`mt-3 text-xs empty:hidden ${
        note?.tone === "error" ? "text-red-700 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400"
      }`}
    >
      {note?.text ?? ""}
    </p>
  );
}

/**
 * The signed-in person's own settings: their name, the theme, their password
 * and other sessions, and what their access lets them do. Everything except
 * the theme lives on the account, so it follows them to every device.
 */
export default function ProfileSettings({
  apiBase,
  onMeChange,
}: {
  apiBase: string;
  onMeChange: (me: Me) => void;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await send(`${apiBase}/profile`, "GET");
      if (!cancelled && res.ok) setProfile(res.data as Profile);
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  return (
    <div className="anim-stagger max-w-2xl space-y-4">
      <div>
        <Group
          title="Profile"
          description="How you appear to the rest of the team."
          footnote="Saved on your account."
        >
          {profile ? (
            <NameForm
              key={profile.user.displayName}
              profile={profile}
              apiBase={apiBase}
              onSaved={(next) => {
                setProfile(next);
                onMeChange(next.user);
              }}
            />
          ) : (
            <div className="h-24 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
          )}
        </Group>
      </div>

      <AppearanceSettings />

      <div>
        <Group
          title="Password and devices"
          description="Change your password, or sign out everywhere except here."
          footnote="Both sign you out on every other device you use. This one stays signed in."
        >
          <PasswordForm apiBase={apiBase} />
          <SignOutOthers apiBase={apiBase} />
        </Group>
      </div>

      <div>
        <Group
          title="Your access"
          description="What you can do in the dashboard, and where each permission comes from."
          footnote="Set by an admin. Ask one if you need something that isn't here."
        >
          {profile ? (
            <AccessOverview role={profile.user.role} access={profile.access} />
          ) : (
            <div className="h-40 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
          )}
        </Group>
      </div>
    </div>
  );
}

function NameForm({
  profile,
  apiBase,
  onSaved,
}: {
  profile: Profile;
  apiBase: string;
  onSaved: (profile: Profile) => void;
}) {
  const id = useId();
  const [name, setName] = useState(profile.user.displayName);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(null);
  const unchanged = name.trim() === profile.user.displayName;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await send(`${apiBase}/profile`, "PATCH", { displayName: name.trim() });
    setBusy(false);
    if (!res.ok) {
      setNote({ tone: "error", text: res.message ?? "Could not save your name." });
      return;
    }
    onSaved(res.data as Profile);
  }

  return (
    <div>
      <dl className="grid grid-cols-[6rem_1fr] gap-y-1 text-sm">
        <dt className="text-neutral-500 dark:text-neutral-400">Username</dt>
        <dd className="font-medium">{profile.user.username}</dd>
        <dt className="text-neutral-500 dark:text-neutral-400">Role</dt>
        <dd>{profile.user.role.name}</dd>
      </dl>

      <form onSubmit={save} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={id} className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Display name
          </label>
          <input
            id={id}
            maxLength={60}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNote(null);
            }}
            placeholder={profile.user.username}
            className={INPUT}
          />
        </div>
        <button type="submit" disabled={busy || unchanged} className={OUTLINE_BUTTON}>
          {busy ? "Saving…" : "Save name"}
        </button>
      </form>
      <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
        Shown instead of your username. Leave it empty to use your username.
      </p>
      <NoteLine note={note} />
    </div>
  );
}

function PasswordForm({ apiBase }: { apiBase: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(null);
  const ids = { current: useId(), next: useId(), confirm: useId() };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) {
      setNote({ tone: "error", text: "Your new password needs at least 8 characters." });
      return;
    }
    if (next !== confirm) {
      setNote({ tone: "error", text: "The two new passwords don't match." });
      return;
    }
    setBusy(true);
    const res = await send(`${apiBase}/profile/password`, "POST", {
      currentPassword: current,
      newPassword: next,
    });
    setBusy(false);
    if (!res.ok) {
      setNote({ tone: "error", text: res.message ?? "Could not change your password." });
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    setNote({ tone: "ok", text: "Password changed. Your other devices have been signed out." });
  }

  const field = (id: string, label: string, value: string, set: (v: string) => void, auto: string) => (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="password"
        autoComplete={auto}
        value={value}
        onChange={(e) => {
          set(e.target.value);
          setNote(null);
        }}
        className={INPUT}
      />
    </div>
  );

  return (
    <form onSubmit={submit} className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {field(ids.current, "Current password", current, setCurrent, "current-password")}
        {field(ids.next, "New password", next, setNext, "new-password")}
        {field(ids.confirm, "Repeat new password", confirm, setConfirm, "new-password")}
      </div>
      <div className="mt-3">
        <button type="submit" disabled={busy || !current || !next} className={OUTLINE_BUTTON}>
          <KeyRoundIcon className="h-3.5 w-3.5" />
          {busy ? "Changing…" : "Change password"}
        </button>
      </div>
      <NoteLine note={note} />
    </form>
  );
}

function SignOutOthers({ apiBase }: { apiBase: string }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(null);

  async function run() {
    setBusy(true);
    const res = await send(`${apiBase}/profile/sign-out-others`, "POST");
    setBusy(false);
    setNote(
      res.ok
        ? { tone: "ok", text: "Signed out everywhere else." }
        : { tone: "error", text: res.message ?? "Could not sign out your other devices." },
    );
  }

  return (
    <div className="pt-4">
      <button type="button" onClick={run} disabled={busy} className={OUTLINE_BUTTON}>
        <LogOutIcon className="h-3.5 w-3.5" />
        {busy ? "Signing out…" : "Sign out other devices"}
      </button>
      <NoteLine note={note} />
    </div>
  );
}

const GROUP_ICONS: Record<string, LucideIcon> = {
  "Time logs": ClockIcon,
  Insights: NewspaperIcon,
  Team: UsersIcon,
};

const BADGE = "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium";

function AccessOverview({ role, access }: { role: Me["role"]; access: Access[] }) {
  const isHeld = (a: Access) => a.held !== false;
  const heldCount = access.filter(isHeld).length;
  const added = access.filter((a) => a.source === "personal").length;
  const removed = access.filter((a) => a.source === "removed").length;
  // An older server sends only what is held, so there is no "of N" to show.
  const complete = access.some((a) => a.held !== undefined);
  const groups = [...new Set(access.map((a) => a.group))];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-sm font-medium dark:bg-neutral-800">
          <ShieldCheckIcon aria-hidden className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          {role.name}
        </span>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {complete
            ? `${heldCount} of ${access.length} permissions`
            : `${heldCount} permission${heldCount === 1 ? "" : "s"}`}
        </span>
        {added > 0 && (
          <span className={`${BADGE} bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300`}>
            {added} added for you
          </span>
        )}
        {removed > 0 && (
          <span className={`${BADGE} bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300`}>
            {removed} removed for you
          </span>
        )}
      </div>
      {role.isOwner && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          As an Owner you always hold every permission, including ones added in future.
        </p>
      )}

      <div className="grid gap-2">
        {/* One area open at first; the rest fold away until wanted. */}
        {groups.map((group, gi) => {
          const items = access.filter((a) => a.group === group);
          const on = items.filter(isHeld).length;
          const Icon = GROUP_ICONS[group] ?? ShieldCheckIcon;
          return (
            <details
              key={group}
              open={gi === 0}
              className="anim-details group overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <summary className="flex cursor-pointer list-none items-center gap-2 bg-neutral-50 px-3 py-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:bg-neutral-950/40 dark:hover:bg-neutral-800/60 [&::-webkit-details-marker]:hidden">
                <Icon aria-hidden className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="text-sm font-semibold">{group}</span>
                {complete && (
                  <span className="ml-auto flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span
                      aria-hidden
                      className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200 sm:block dark:bg-neutral-800"
                    >
                      <span
                        className="block h-full rounded-full bg-violet-500"
                        style={{ width: `${(on / items.length) * 100}%` }}
                      />
                    </span>
                    {on} of {items.length}
                  </span>
                )}
                <ChevronDownIcon
                  aria-hidden
                  className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180 ${
                    complete ? "" : "ml-auto"
                  }`}
                />
              </summary>
              <ul className="divide-y divide-neutral-100 border-t border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                {items.map((a) => {
                  const held = isHeld(a);
                  return (
                    <li key={a.key} className="flex items-start gap-3 px-3 py-2.5">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          held
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500"
                        }`}
                      >
                        {held ? (
                          <CheckIcon className="h-3 w-3" strokeWidth={3} aria-label="You have this" />
                        ) : (
                          <MinusIcon className="h-3 w-3" strokeWidth={3} aria-label="Not part of your access" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium ${
                            held ? "" : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        >
                          {a.label}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {a.description}
                        </p>
                      </div>
                      {a.source === "personal" && (
                        <span className={`${BADGE} bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300`}>
                          Added for you
                        </span>
                      )}
                      {a.source === "removed" && (
                        <span className={`${BADGE} bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300`}>
                          Removed for you
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </div>
  );
}
