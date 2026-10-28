"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Mail, Phone, Trash2 } from "lucide-react";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/lib/careers/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import { ApplicationStatusPill } from "@/components/careers-admin/pills";

const CARD = "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900";
const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm disabled:opacity-60";

const sizeOf = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <SectionGate anyOf={["careers.applications"]}>
      <LoadApplication id={id} />
    </SectionGate>
  );
}

function LoadApplication({ id }: { id: string }) {
  const { data, error } = useApi<{ application: Application }>(`/applications/${id}`);
  if (error) {
    return (
      <div className={`${CARD} p-8 text-center`}>
        <p className="font-medium">{error}</p>
        <Link href="/dashboard/careers/applications" className="mt-3 inline-block text-sm underline">
          Back to applications
        </Link>
      </div>
    );
  }
  if (!data) return <div className={`h-96 animate-pulse ${CARD}`} />;
  return <ApplicationView key={data.application.id} initial={data.application} />;
}

function ApplicationView({ initial }: { initial: Application }) {
  const router = useRouter();
  const [app, setApp] = useState(initial);
  const [notes, setNotes] = useState(initial.notes);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const name = `${app.firstName} ${app.lastName}`;

  async function update(body: { status?: ApplicationStatus; notes?: string }, done: string) {
    setBusy(body.status ? "status" : "notes");
    setNote(null);
    const res = await api<{ application: Application }>(`/applications/${app.id}`, { method: "PATCH", body });
    setBusy(null);
    if (!res.ok || !res.data) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return;
    }
    setApp(res.data.application);
    setNote({ kind: "ok", text: done });
  }

  async function remove() {
    if (!confirm(`Delete ${name}'s application and résumé for good?`)) return;
    const res = await api(`/applications/${app.id}`, { method: "DELETE" });
    if (!res.ok) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return;
    }
    router.push("/dashboard/careers/applications");
  }

  const links = [
    { label: "LinkedIn", href: app.linkedIn },
    { label: "Portfolio", href: app.portfolio },
  ].filter((l) => l.href);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/careers/applications" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Applications
      </Link>

      <PageHeader
        title={name}
        description={`${app.jobTitle || `General résumé${app.areaOfInterest ? `: ${app.areaOfInterest}` : ""}`}. Received ${when(app.submittedAt)}.`}
        actions={<ApplicationStatusPill status={app.status} />}
      />

      {note && (
        <div
          role="status"
          className={`anim-drop rounded-md border px-3 py-2 text-sm ${
            note.kind === "ok"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
          }`}
        >
          {note.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <section className={`${CARD} p-5`} aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-sm font-semibold">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`mailto:${app.email}`} className="inline-flex items-center gap-2 hover:underline">
                  <Mail className="h-4 w-4 text-neutral-400" aria-hidden />
                  {app.email}
                </a>
              </li>
              <li>
                <a href={`tel:${app.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 hover:underline">
                  <Phone className="h-4 w-4 text-neutral-400" aria-hidden />
                  {app.phone}
                </a>
              </li>
              {links.map((l) => (
                <li key={l.label}>
                  {/* Links the applicant typed: opened without passing on who sent them there. */}
                  <a href={l.href} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-2 break-all hover:underline">
                    <ExternalLink className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
                    {l.label}: {l.href}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${CARD} p-5`} aria-labelledby="resume-heading">
            <h2 id="resume-heading" className="text-sm font-semibold">Résumé</h2>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="min-w-0 text-sm">
                <span className="block truncate font-medium">{app.resume.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{sizeOf(app.resume.size)}</span>
              </p>
              <a
                href={`/api/applications/${app.id}/resume`}
                download={app.resume.name}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <Download className="h-4 w-4" aria-hidden />
                Download
              </a>
            </div>
          </section>

          <section className={`${CARD} p-5`} aria-labelledby="letter-heading">
            <h2 id="letter-heading" className="text-sm font-semibold">
              {app.jobTitle ? "Why this role" : "About them"}
            </h2>
            {app.coverLetter ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{app.coverLetter}</p>
            ) : (
              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">They didn&apos;t add a message.</p>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className={`${CARD} space-y-2 p-4`}>
            <label htmlFor="application-status" className="block text-sm font-semibold">
              Status
            </label>
            <select
              id="application-status"
              value={app.status}
              disabled={busy !== null}
              onChange={(e) => {
                const status = e.target.value as ApplicationStatus;
                update({ status }, `Marked as ${APPLICATION_STATUS_LABELS[status].toLowerCase()}.`);
              }}
              className={INPUT}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {APPLICATION_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            {app.statusUpdatedBy && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Last changed by {app.statusUpdatedBy}, {when(app.statusUpdatedAt)}.
              </p>
            )}
          </section>

          <section className={`${CARD} space-y-2 p-4`}>
            <label htmlFor="application-notes" className="block text-sm font-semibold">
              Notes
            </label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">For the hiring team only. The applicant never sees these.</p>
            <textarea
              id="application-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={5000}
              rows={6}
              className={INPUT}
            />
            <button
              onClick={() => update({ notes }, "Notes saved.")}
              disabled={busy !== null || notes === app.notes}
              className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
            >
              {busy === "notes" ? "Saving…" : "Save notes"}
            </button>
          </section>

          <button
            onClick={remove}
            disabled={busy !== null}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete application
          </button>
        </aside>
      </div>
    </div>
  );
}
