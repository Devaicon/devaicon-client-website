"use client";

import { Fragment, useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { KeyRoundIcon, LogOutIcon } from "lucide-react";
import type { Me } from "@/lib/types";
import { staggerItem } from "../motion";
import Group from "./Group";

type Access = {
  key: string;
  group: string;
  label: string;
  description: string;
  source: "role" | "personal";
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
 * The signed-in person's own account: their name, password, other sessions,
 * and a plain list of what their access lets them do. Unlike the rest of the
 * Settings tab, all of this lives on the account, not in this browser.
 */
export default function ProfileSettings({
  apiBase,
  onMeChange,
}: {
  apiBase: string;
  onMeChange: (me: Me) => void;
}) {
  const reduced = useReducedMotion();
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
    <>
      <motion.div variants={staggerItem(!!reduced)}>
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
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <Group
          title="Password and devices"
          description="Change your password, or sign out everywhere except here."
          footnote="Both sign you out on every other device you use. This one stays signed in."
        >
          <PasswordForm apiBase={apiBase} />
          <SignOutOthers apiBase={apiBase} />
        </Group>
      </motion.div>

      <motion.div variants={staggerItem(!!reduced)}>
        <Group
          title="Your access"
          description={
            profile
              ? `What you can do as ${profile.user.role.name}.`
              : "What your role lets you do."
          }
          footnote="Set by an admin. Ask one if you need something that isn't here."
        >
          {profile ? <AccessList access={profile.access} /> : (
            <div className="h-16 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
          )}
        </Group>
      </motion.div>
    </>
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

function AccessList({ access }: { access: Access[] }) {
  if (access.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Your account has no permissions switched on.
      </p>
    );
  }
  const groups = [...new Set(access.map((a) => a.group))];
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <Fragment key={group}>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              {group}
            </h3>
            <ul className="mt-1 space-y-1.5">
              {access
                .filter((a) => a.group === group)
                .map((a) => (
                  <li key={a.key} className="text-sm">
                    <span className="font-medium">{a.label}</span>
                    {a.source === "personal" && (
                      <span className="ml-2 rounded-full bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 text-[11px] text-violet-700 dark:text-violet-300">
                        added for you
                      </span>
                    )}
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      {a.description}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
