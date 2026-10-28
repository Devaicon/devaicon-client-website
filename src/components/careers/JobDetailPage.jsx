import Link from "next/link";
import { ArrowLeft, ChevronRight, CircleAlert } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { jobPostingSchema } from "@/lib/seo/structured-data";
import { placeOf } from "@/lib/careers/types";
import { ApplyButton, CopyLink } from "./JobApply";

const posted = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

function ListSection({ id, title, items, marker = "dot" }) {
  if (!items?.length) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      <ul className="mt-5 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 leading-relaxed text-gray-700">
            <span
              aria-hidden
              className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${marker === "ring" ? "border border-[#3d234b]" : "bg-[#3d234b]"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * One role's page. A closed role keeps its page so shared links still work,
 * but says it's filled and offers no Apply button.
 *
 * @param {{ job: import("@/lib/careers/types").PublicJobDetail }} props
 */
export default function JobDetailPage({ job }) {
  const open = job.status === "open";
  // Only what the form shows goes to the browser as props.
  const applyFor = {
    title: job.title,
    slug: job.slug,
    department: job.department,
    workplace: job.workplace,
    location: job.location,
    employmentType: job.employmentType,
  };
  const path = `/careers/${job.slug}`;
  const paragraphs = job.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const facts = [
    ["Team", job.department],
    ["Where", placeOf(job)],
    ["Type", job.employmentType],
    ["Experience", job.experience],
    ["Posted", posted(job.publishedAt)],
  ].filter(([, value]) => value);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd schema={jobPostingSchema({ job, path })} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#3d234b] via-[#4a2d5a] to-[#5a3464] pb-12 pt-32 text-white lg:pb-16 lg:pt-36">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-6 xl:px-15">
          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Careers", path: "/careers" },
              { name: job.title, path },
            ]}
            className="mb-8"
          />
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{job.title}</h1>
          {job.summary && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/90">{job.summary}</p>}

          <dl className="mt-8 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-white/70">{label}</dt>
                <dd className="mt-0.5 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          {open && <ApplyButton job={applyFor} tone="light" className="mt-8 lg:hidden" />}
        </div>
      </section>

      {!open && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-6 xl:px-15">
            <p className="flex items-start gap-3 text-amber-900">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              This role has been filled and is no longer taking applications.
            </p>
            <Link href="/careers#open-roles" className="shrink-0 font-semibold text-amber-900 underline hover:text-amber-950">
              See open roles
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:px-6 lg:py-20 xl:px-15">
        <div className="grid gap-12 lg:grid-cols-12">
          <article className="space-y-12 lg:col-span-8">
            {paragraphs.length > 0 && (
              <section aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-2xl font-bold tracking-tight text-gray-900">
                  About the role
                </h2>
                <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-gray-700">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}
            <ListSection id="responsibilities-heading" title="What you'll do" items={job.responsibilities} />
            <ListSection id="requirements-heading" title="What you'll need" items={job.requirements} />
            <ListSection id="nice-heading" title="Nice to have" items={job.niceToHave} marker="ring" />
            <ListSection id="offer-heading" title="What we offer" items={job.benefits} />
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              {open ? (
                <div className="rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Interested?</h2>
                  <p className="mt-2 text-gray-600">
                    Applying takes about five minutes. You&apos;ll need your résumé as a PDF or Word file.
                  </p>
                  <ApplyButton job={applyFor} className="mt-5 w-full" />
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Looking for something similar?</h2>
                  <p className="mt-2 text-gray-600">See what&apos;s open now, or send us your résumé from the careers page.</p>
                  <Link
                    href="/careers#open-roles"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#3d234b] px-6 py-3 font-semibold text-white hover:bg-[#2d1a3b]"
                  >
                    See open roles
                  </Link>
                </div>
              )}
              <div className="space-y-3 px-1">
                <CopyLink />
                <Link href="/careers#open-roles" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#3d234b]">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  All open roles
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section aria-labelledby="next-heading" className="border-t border-gray-200 bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-6 xl:px-15">
          <h2 id="next-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            What happens after you apply
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-600">
            Our hiring team reads every application and replies within two weeks. If your experience matches,
            we&apos;ll set up a short screening call, followed by interviews with the team.
          </p>
          <Link
            href="/careers#hiring-process"
            className="mt-5 inline-flex items-center gap-1 font-semibold text-[#3d234b] hover:text-[#2d1a3b]"
          >
            How hiring works
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
