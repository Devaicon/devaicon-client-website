import { notFound } from "next/navigation";
import JobDetailPage from "@/components/careers/JobDetailPage";
import { getJob, getOpenJobs } from "@/lib/careers/api";
import { brandedTitle, metaDescription } from "@/lib/seo";

// Rebuilt when the role is changed or closed; see /api/revalidate. Roles
// published after a build are rendered on their first visit.
export const revalidate = 300;

/**
 * Open roles are rendered at build time. An unreachable API builds none of
 * them rather than failing the build; each is then rendered on first visit.
 */
export async function generateStaticParams() {
  const jobs = await getOpenJobs().catch(() => []);
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return {
      title: brandedTitle("Job Not Found"),
      robots: { index: false, follow: true },
    };
  }

  const description = metaDescription(job.summary || job.description);
  return {
    title: brandedTitle(`${job.title} Careers`),
    description,
    alternates: {
      canonical: `/careers/${slug}`,
    },
    // A filled role stays reachable for anyone holding the link, but drops
    // out of search.
    ...(job.status === "closed" ? { robots: { index: false, follow: true } } : {}),
    keywords: [
      job.title,
      job.department,
      job.location || job.workplace,
      "careers",
      "Devaicon jobs",
      "technology careers",
    ].filter(Boolean),
    openGraph: {
      title: `${job.title} at Devaicon`,
      description,
      type: "website",
    },
  };
}

export default async function JobPage({ params }) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return <JobDetailPage job={job} />;
}
