"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { AREAS_OF_INTEREST, placeOf } from "@/lib/careers/types";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx";

const INPUT =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#3d234b] focus:outline-none focus:ring-2 focus:ring-[#3d234b]/25";
const LABEL = "mb-1.5 block text-sm font-medium text-gray-800";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  linkedIn: "",
  portfolio: "",
  areaOfInterest: "",
  coverLetter: "",
  website: "",
};

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function sizeOf(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** A problem with a chosen résumé, or null when it can be sent. */
function fileProblem(file) {
  if (!file) return "Attach your résumé.";
  if (!/\.(pdf|docx?)$/i.test(file.name)) return "Your résumé must be a PDF or Word document.";
  if (file.size > MAX_BYTES) return "Your résumé must be 5 MB or smaller.";
  return null;
}

function Field({ id, label, required, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {required ? <span className="text-red-600"> *</span> : <span className="font-normal text-gray-500"> (optional)</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

/**
 * The application form, in a dialog. With a `job` it applies for that role;
 * without one it sends a general résumé and asks what kind of role.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   job?: { title: string, slug: string, department: string, workplace: string, location: string, employmentType: string } | null,
 * }} props
 */
export default function ApplyDialog({ open, onClose, job = null }) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const [values, setValues] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const doneRef = useRef(null);

  // Read by the key handler, so the effect below runs once per opening.
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current = () => {
      if (!sending) onClose();
    };
  });

  // Escape closes; the page behind stays still; focus returns where it was.
  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      if (returnTo instanceof HTMLElement) returnTo.focus();
    };
  }, [open]);

  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  function reset() {
    setValues(EMPTY);
    setFile(null);
    setError(null);
    setSent(false);
  }

  function close() {
    if (sending) return;
    onClose();
  }

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  function pickFile(e) {
    const chosen = e.target.files?.[0] ?? null;
    setFile(chosen);
    setError(chosen ? fileProblem(chosen) : null);
  }

  async function submit(e) {
    e.preventDefault();
    const problem = fileProblem(file);
    if (problem) {
      setError(problem);
      return;
    }
    setSending(true);
    setError(null);
    try {
      const data = await readAsBase64(file);
      const res = await fetch("/api/public/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          jobSlug: job?.slug,
          areaOfInterest: job ? undefined : values.areaOfInterest,
          resume: { name: file.name, data },
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(
          typeof body.message === "string"
            ? body.message
            : res.status === 413
              ? "Your résumé is too large to send. Use a file of 5 MB or less."
              : "Your application wasn't sent. Check your connection and try again.",
        );
      }
    } catch {
      setError("Your application wasn't sent. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence onExitComplete={() => sent && reset()}>
      {open && (
        <motion.div
          key="apply"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="fixed inset-0 bg-gray-950/60" aria-hidden onClick={close} />
          <div className="relative flex min-h-full items-start justify-center p-4 sm:items-center sm:p-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 sm:px-8">
                <div className="min-w-0">
                  <h2 id={titleId} className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {job ? `Apply for ${job.title}` : "Send us your résumé"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {job
                      ? [job.department, placeOf(job), job.employmentType].filter(Boolean).join(", ")
                      : "We'll keep it on file and contact you when a role fits."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="-mr-2 shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d234b]"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {sent ? (
                <div className="px-6 py-12 text-center sm:px-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {job ? "Application sent" : "Résumé sent"}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-gray-600">
                    Thanks, {values.firstName}. Our team reads every application and replies to the email
                    address you gave within two weeks.
                  </p>
                  <button
                    ref={doneRef}
                    type="button"
                    onClick={onClose}
                    className="mt-8 rounded-lg bg-[#3d234b] px-6 py-2.5 font-semibold text-white hover:bg-[#2d1a3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d234b] focus-visible:ring-offset-2"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-8 px-6 py-6 sm:px-8">
                  <fieldset className="space-y-4">
                    <legend className="mb-3 text-base font-semibold text-gray-900">About you</legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id={`${uid}-first`} label="First name" required>
                        <input autoFocus id={`${uid}-first`} name="firstName" value={values.firstName} onChange={set} required maxLength={80} autoComplete="given-name" className={INPUT} />
                      </Field>
                      <Field id={`${uid}-last`} label="Last name" required>
                        <input id={`${uid}-last`} name="lastName" value={values.lastName} onChange={set} required maxLength={80} autoComplete="family-name" className={INPUT} />
                      </Field>
                      <Field id={`${uid}-email`} label="Email" required>
                        <input id={`${uid}-email`} type="email" name="email" value={values.email} onChange={set} required maxLength={200} autoComplete="email" className={INPUT} />
                      </Field>
                      <Field id={`${uid}-phone`} label="Phone" required>
                        <input id={`${uid}-phone`} type="tel" name="phone" value={values.phone} onChange={set} required maxLength={40} autoComplete="tel" placeholder="+971 50 123 4567" className={INPUT} />
                      </Field>
                      <Field id={`${uid}-linkedin`} label="LinkedIn profile">
                        <input id={`${uid}-linkedin`} type="url" name="linkedIn" value={values.linkedIn} onChange={set} maxLength={300} placeholder="https://linkedin.com/in/…" className={INPUT} />
                      </Field>
                      <Field id={`${uid}-portfolio`} label="Portfolio or website">
                        <input id={`${uid}-portfolio`} type="url" name="portfolio" value={values.portfolio} onChange={set} maxLength={300} placeholder="https://" className={INPUT} />
                      </Field>
                    </div>
                    {/* Hidden from people; bots fill it in. */}
                    <div className="hidden" aria-hidden>
                      <label htmlFor={`${uid}-website`}>Leave this empty</label>
                      <input id={`${uid}-website`} name="website" value={values.website} onChange={set} tabIndex={-1} autoComplete="off" />
                    </div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="mb-3 text-base font-semibold text-gray-900">Your application</legend>
                    {!job && (
                      <Field id={`${uid}-area`} label="The kind of role you're looking for" required>
                        <select id={`${uid}-area`} name="areaOfInterest" value={values.areaOfInterest} onChange={set} required className={INPUT}>
                          <option value="">Choose one</option>
                          {AREAS_OF_INTEREST.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </Field>
                    )}

                    <div>
                      <span id={`${uid}-resume-label`} className={LABEL}>
                        Résumé<span className="text-red-600"> *</span>
                      </span>
                      {/* Visually hidden but focusable, so it works from the keyboard. */}
                      <input id={`${uid}-resume`} type="file" accept={ACCEPT} onChange={pickFile} aria-labelledby={`${uid}-resume-label`} aria-describedby={`${uid}-resume-hint`} className="peer sr-only" />
                      <label
                        htmlFor={`${uid}-resume`}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-4 hover:border-[#3d234b] hover:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#3d234b]/40"
                      >
                        {file ? (
                          <FileText className="h-6 w-6 shrink-0 text-[#3d234b]" aria-hidden />
                        ) : (
                          <Upload className="h-6 w-6 shrink-0 text-gray-400" aria-hidden />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-gray-900">{file ? file.name : "Choose a file"}</span>
                          <span id={`${uid}-resume-hint`} className="block text-xs text-gray-500">
                            {file ? `${sizeOf(file.size)}. Choose again to replace it.` : "PDF or Word, up to 5 MB"}
                          </span>
                        </span>
                      </label>
                    </div>

                    <Field
                      id={`${uid}-letter`}
                      label={job ? "Why this role?" : "Tell us about yourself"}
                      required={Boolean(job)}
                      hint={job ? "A few sentences on why you're interested and what you'd bring." : undefined}
                    >
                      <textarea id={`${uid}-letter`} name="coverLetter" value={values.coverLetter} onChange={set} required={Boolean(job)} minLength={job ? 20 : undefined} maxLength={5000} rows={5} className={`${INPUT} resize-y`} />
                    </Field>
                  </fieldset>

                  {error && (
                    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-500">
                      Only our hiring team can see what you send. See our{" "}
                      <a href="/privacy" className="underline hover:text-gray-900">privacy policy</a>.
                    </p>
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#3d234b] px-6 py-3 font-semibold text-white hover:bg-[#2d1a3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d234b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                      {sending ? "Sending…" : job ? "Send application" : "Send résumé"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
