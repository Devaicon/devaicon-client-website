"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { placeOf } from "@/lib/careers/types";
import ApplyDialog from "./ApplyDialog";
import Reveal from "./Reveal";

const ALL = "All teams";

/**
 * The open roles, with a team filter once there's more than one team, and
 * a way to send a résumé when nothing fits. `jobs` is null when the roles
 * couldn't be loaded.
 *
 * @param {{ jobs: import("@/lib/careers/types").PublicJob[] | null }} props
 */
export default function OpenRoles({ jobs }) {
  const [team, setTeam] = useState(ALL);
  const [resumeOpen, setResumeOpen] = useState(false);

  const roles = jobs ?? [];
  const teams = [...new Set(roles.map((j) => j.department).filter(Boolean))].sort();
  const shown = team === ALL ? roles : roles.filter((j) => j.department === team);

  return (
    <section id="open-roles" aria-labelledby="open-roles-heading" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-6 xl:px-15">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <h2 id="open-roles-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Open roles
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              {jobs === null
                ? "Our open roles couldn't be loaded just now."
                : roles.length === 0
                  ? "We aren't hiring for a specific role right now."
                  : `${roles.length} ${roles.length === 1 ? "role is" : "roles are"} open. Each one lists what the work involves and what we're looking for.`}
            </p>
          </Reveal>

          {teams.length > 1 && (
            <Reveal delay={80} role="group" aria-label="Filter roles by team" className="flex flex-wrap gap-2">
              {[ALL, ...teams].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTeam(t)}
                  aria-pressed={team === t}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d234b] focus-visible:ring-offset-2 ${
                    team === t
                      ? "border-[#3d234b] bg-[#3d234b] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </Reveal>
          )}
        </div>

        {shown.length > 0 && (
          <ul key={team} className="careers-fade mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {shown.map((job, i) => (
              <Reveal as="li" key={job.slug} delay={Math.min(i, 5) * 60}>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group -mx-4 grid gap-x-8 gap-y-2 rounded-xl px-4 py-6 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]"
                >
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3d234b] sm:text-xl">
                      {job.title}
                    </h3>
                    {job.summary && <p className="mt-1 text-gray-600">{job.summary}</p>}
                  </div>
                  <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 lg:flex-col lg:gap-y-0.5">
                    {job.department && (
                      <div>
                        <dt className="sr-only">Team</dt>
                        <dd className="font-medium text-gray-900">{job.department}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="sr-only">Where</dt>
                      <dd>{placeOf(job)}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Type</dt>
                      <dd>
                        {job.employmentType}
                        {job.experience && `, ${job.experience}`}
                      </dd>
                    </div>
                  </dl>
                  <span className="hidden items-center gap-1 text-sm font-semibold text-[#3d234b] sm:inline-flex">
                    View role
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}

        <Reveal className="mt-10 flex flex-col gap-4 rounded-2xl bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {roles.length === 0 ? "Send us your résumé" : "Don't see a role that fits?"}
            </h3>
            <p className="mt-1 text-gray-600">
              {jobs === null ? (
                <>
                  You can still send your résumé, or email{" "}
                  <a href="mailto:careers@devaicon.com" className="font-medium text-[#3d234b] underline">careers@devaicon.com</a>.
                </>
              ) : (
                "We keep every résumé on file and get in touch when something opens up that matches your experience."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            className="shrink-0 rounded-lg bg-[#3d234b] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#2d1a3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d234b] focus-visible:ring-offset-2"
          >
            Send your résumé
          </button>
        </Reveal>
      </div>

      <ApplyDialog open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}
