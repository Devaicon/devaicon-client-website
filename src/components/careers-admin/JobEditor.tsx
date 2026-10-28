"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, ExternalLink, Inbox, Lock, Send, Trash2, Undo2 } from "lucide-react";
import { can } from "@/lib/types";
import {
  EMPLOYMENT_TYPES,
  WORKPLACES,
  type AdminJob,
  type EmploymentType,
  type JobStatus,
  type JobSummary,
  type Workplace,
} from "@/lib/careers/types";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import { JobStatusPill } from "./pills";

const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm disabled:opacity-60";
const LABEL = "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";
const CARD = "rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900";

const LISTS = [
  { key: "responsibilities", label: "What they'll do", hint: "Responsibilities. Required to publish." },
  { key: "requirements", label: "What they'll need", hint: "Requirements. Required to publish." },
  { key: "niceToHave", label: "Nice to have", hint: "Optional." },
  { key: "benefits", label: "What we offer", hint: "Optional. Anything specific to this role; the careers page already lists company-wide benefits." },
] as const;

type ListKey = (typeof LISTS)[number]["key"];

/** What the form edits. Lists are kept as text, one item per line. */
type Form = {
  title: string;
  slug: string;
  department: string;
  location: string;
  workplace: Workplace;
  employmentType: EmploymentType;
  experience: string;
  summary: string;
  description: string;
} & Record<ListKey, string>;

const BLANK: Form = {
  title: "",
  slug: "",
  department: "",
  location: "",
  workplace: "On-site",
  employmentType: "Full-time",
  experience: "",
  summary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  niceToHave: "",
  benefits: "",
};

function toForm(job: AdminJob): Form {
  return {
    title: job.title,
    slug: job.slug,
    department: job.department,
    location: job.location,
    workplace: job.workplace,
    employmentType: job.employmentType,
    experience: job.experience,
    summary: job.summary,
    description: job.description,
    responsibilities: job.responsibilities.join("\n"),
    requirements: job.requirements.join("\n"),
    niceToHave: job.niceToHave.join("\n"),
    benefits: job.benefits.join("\n"),
  };
}

const lines = (text: string) =>
  text
    .split("\n")
    // Pasted bullet lists keep their markers otherwise.
    .map((l) => l.replace(/^\s*(?:[-*•·]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);

function toBody(form: Form) {
  return {
    ...form,
    responsibilities: lines(form.responsibilities),
    requirements: lines(form.requirements),
    niceToHave: lines(form.niceToHave),
    benefits: lines(form.benefits),
  };
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={LABEL}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
}

/** `/dashboard/careers/new` starts a blank role; any other id loads one. */
export default function JobEditorPage({ id }: { id: string }) {
  if (id === "new") return <JobEditor job={null} />;
  return <LoadJob id={id} />;
}

function LoadJob({ id }: { id: string }) {
  const { data, error } = useApi<{ job: AdminJob }>(`/jobs/${id}`);
  if (error) {
    return (
      <div className={`${CARD} p-8 text-center`}>
        <p className="font-medium">{error}</p>
        <Link href="/dashboard/careers" className="mt-3 inline-block text-sm underline">
          Back to job postings
        </Link>
      </div>
    );
  }
  if (!data) return <div className={`h-96 animate-pulse ${CARD}`} />;
  return <JobEditor key={data.job.id} job={data.job} />;
}

function JobEditor({ job: initial }: { job: AdminJob | null }) {
  const router = useRouter();
  const { me } = useDashboardSession();
  const departments = [
    ...new Set((useApi<{ jobs: JobSummary[] }>("/jobs").data?.jobs ?? []).map((j) => j.department).filter(Boolean)),
  ].sort();

  const [job, setJob] = useState<AdminJob | null>(initial);
  const [form, setForm] = useState<Form>(initial ? toForm(initial) : BLANK);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const canManage = can(me, "careers.manage");
  const reviews = can(me, "careers.applications");
  const status: JobStatus = job?.status ?? "draft";
  const slugLocked = Boolean(job?.publishedAt);

  const set = (patch: Partial<Form>) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  };

  /** Saves, creating the role on its first save. Returns the saved role. */
  const save = useCallback(async (): Promise<AdminJob | null> => {
    setBusy("save");
    setNote(null);
    const body = toBody(form);
    const res = job
      ? await api<{ job: AdminJob }>(`/jobs/${job.id}`, { method: "PATCH", body })
      : await api<{ job: AdminJob }>("/jobs", { method: "POST", body });
    setBusy(null);
    if (!res.ok || !res.data) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return null;
    }
    const saved = res.data.job;
    setJob(saved);
    setForm(toForm(saved));
    setDirty(false);
    setNote({ kind: "ok", text: job ? "Saved." : "Saved as a draft." });
    if (!job) router.replace(`/dashboard/careers/${saved.id}`);
    return saved;
  }, [form, job, router]);

  async function transition(action: "publish" | "close" | "unpublish") {
    let target = job;
    if (!target || dirty) target = await save();
    if (!target) return;
    setBusy(action);
    const res = await api<{ job: AdminJob }>(`/jobs/${target.id}/${action}`, { method: "POST", body: {} });
    setBusy(null);
    if (!res.ok || !res.data) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return;
    }
    setJob(res.data.job);
    setNote({
      kind: "ok",
      text:
        action === "publish"
          ? "Published. It's on the careers page and taking applications."
          : action === "close"
            ? "Closed. Its page now says the role is filled, and it no longer takes applications."
            : "Unpublished. It's back to a draft and off the site.",
    });
  }

  async function remove() {
    if (!job) return;
    const kept = job.applications.total > 0 ? ` Its ${job.applications.total} application(s) will stay in Applications.` : "";
    if (!confirm(`Delete “${job.title}” for good?${kept}`)) return;
    const res = await api(`/jobs/${job.id}`, { method: "DELETE" });
    if (!res.ok) {
      setNote({ kind: "error", text: res.message ?? "Something went wrong. Try again." });
      return;
    }
    router.push("/dashboard/careers");
  }

  // Ctrl/Cmd+S saves; leaving with unsaved changes asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && canManage) save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, canManage, save]);

  const disabled = !canManage || busy !== null;
  const button =
    "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50";
  const secondary = `${button} border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/careers" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Job postings
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <JobStatusPill status={status} />
          {dirty && <span className="text-amber-700 dark:text-amber-400">Unsaved changes</span>}
        </div>
      </div>

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
          <section className={`${CARD} space-y-4 p-5`}>
            <Field label="Job title" htmlFor="job-title">
              <input
                id="job-title"
                value={form.title}
                onChange={(e) => set({ title: e.target.value })}
                disabled={disabled}
                maxLength={120}
                placeholder="e.g. Senior Full Stack Developer"
                className={`${INPUT} text-base font-semibold`}
              />
            </Field>
            <Field label="Summary" htmlFor="job-summary" hint="One or two sentences. Shown in the list of open roles and in search results.">
              <textarea
                id="job-summary"
                value={form.summary}
                onChange={(e) => set({ summary: e.target.value })}
                disabled={disabled}
                maxLength={300}
                rows={2}
                className={INPUT}
              />
            </Field>
            <Field label="About the role" htmlFor="job-description" hint="Leave a blank line between paragraphs.">
              <textarea
                id="job-description"
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
                disabled={disabled}
                maxLength={5000}
                rows={7}
                className={INPUT}
              />
            </Field>
          </section>

          <section className={`${CARD} space-y-4 p-5`}>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Put one item on each line. Each line shows as a bullet point.</p>
            {LISTS.map((l) => (
              <Field key={l.key} label={l.label} htmlFor={`job-${l.key}`} hint={l.hint}>
                <textarea
                  id={`job-${l.key}`}
                  value={form[l.key]}
                  onChange={(e) => set({ [l.key]: e.target.value } as Partial<Form>)}
                  disabled={disabled}
                  rows={6}
                  className={`${INPUT} font-mono text-[13px] leading-6`}
                />
              </Field>
            ))}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className={`${CARD} space-y-3 p-4`}>
            <button
              onClick={() => save()}
              disabled={disabled || (!dirty && Boolean(job))}
              className={`${button} w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600`}
            >
              {busy === "save" ? "Saving…" : job ? "Save" : "Save draft"}
            </button>
            {/* A new role opens at its own address on its first save, so it
                is saved once before it can be published. */}
            {status === "draft" && (
              <button
                onClick={() => transition("publish")}
                disabled={disabled || !job}
                title={job ? undefined : "Save the draft first"}
                className={`${secondary} w-full`}
              >
                <Send className="h-4 w-4" aria-hidden />
                {busy === "publish" ? "Publishing…" : "Publish"}
              </button>
            )}
            {status === "published" && (
              <button onClick={() => transition("close")} disabled={disabled} className={`${secondary} w-full`}>
                <Ban className="h-4 w-4" aria-hidden />
                {busy === "close" ? "Closing…" : "Close to applications"}
              </button>
            )}
            {status === "closed" && (
              <button onClick={() => transition("publish")} disabled={disabled} className={`${secondary} w-full`}>
                <Send className="h-4 w-4" aria-hidden />
                {busy === "publish" ? "Reopening…" : "Reopen"}
              </button>
            )}
            {status !== "draft" && (
              <button onClick={() => transition("unpublish")} disabled={disabled} className={`${secondary} w-full`}>
                <Undo2 className="h-4 w-4" aria-hidden />
                {busy === "unpublish" ? "Unpublishing…" : "Unpublish"}
              </button>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {!job
                ? "Save a draft first, then publish it when it's ready."
                : status === "draft"
                ? "Only you and other editors can see a draft."
                : status === "published"
                  ? `Open since ${new Date(job!.publishedAt).toLocaleDateString()}. Closing keeps the page up and stops applications; unpublishing removes it.`
                  : "The page says this role is filled. Reopening dates it from today."}
            </p>
            {job && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-100 pt-3 text-sm dark:border-neutral-800">
                {status !== "draft" && (
                  <a href={`/careers/${job.slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    View on site
                  </a>
                )}
                {reviews && (
                  <Link href={`/dashboard/careers/applications?jobId=${job.id}`} className="inline-flex items-center gap-1.5 hover:underline">
                    <Inbox className="h-3.5 w-3.5" aria-hidden />
                    {job.applications.total} application{job.applications.total === 1 ? "" : "s"}
                  </Link>
                )}
              </div>
            )}
          </section>

          <section className={`${CARD} space-y-4 p-4`}>
            <h2 className="text-sm font-semibold">Details</h2>
            <Field label="Team" htmlFor="job-department">
              <input
                id="job-department"
                list="job-departments"
                value={form.department}
                onChange={(e) => set({ department: e.target.value })}
                disabled={disabled}
                maxLength={60}
                placeholder="e.g. Engineering"
                className={INPUT}
              />
              <datalist id="job-departments">
                {departments.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </Field>
            <Field label="Workplace" htmlFor="job-workplace">
              <select id="job-workplace" value={form.workplace} onChange={(e) => set({ workplace: e.target.value as Workplace })} disabled={disabled} className={INPUT}>
                {WORKPLACES.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </Field>
            <Field label="Location" htmlFor="job-location" hint="City or country, e.g. Sharjah, UAE. Leave empty for a remote role open anywhere.">
              <input id="job-location" value={form.location} onChange={(e) => set({ location: e.target.value })} disabled={disabled} maxLength={80} className={INPUT} />
            </Field>
            <Field label="Employment type" htmlFor="job-type">
              <select id="job-type" value={form.employmentType} onChange={(e) => set({ employmentType: e.target.value as EmploymentType })} disabled={disabled} className={INPUT}>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Experience" htmlFor="job-experience">
              <input id="job-experience" value={form.experience} onChange={(e) => set({ experience: e.target.value })} disabled={disabled} maxLength={60} placeholder="e.g. 3+ years" className={INPUT} />
            </Field>
          </section>

          <section className={`${CARD} space-y-2 p-4`}>
            <Field
              label="Page address"
              htmlFor="job-slug"
              hint={slugLocked ? undefined : job ? "Lowercase letters, numbers and hyphens." : "Made from the title when left empty."}
            >
              <div className="flex items-center gap-1 text-sm">
                <span className="shrink-0 text-neutral-500">/careers/</span>
                <input
                  id="job-slug"
                  value={form.slug}
                  onChange={(e) => set({ slug: e.target.value.toLowerCase() })}
                  disabled={disabled || slugLocked}
                  maxLength={100}
                  className={INPUT}
                />
              </div>
            </Field>
            {slugLocked && (
              <p className="flex gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Lock className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                Fixed now that the role has been published, so shared links keep working.
              </p>
            )}
          </section>

          {job && canManage && (
            <button onClick={remove} disabled={busy !== null} className={`${button} w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50`}>
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete role
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
