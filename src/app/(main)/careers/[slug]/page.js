import { notFound } from "next/navigation";
import JobDetailPage from "@/components/careers/JobDetailPage";
import { getJobBySlug, getAllJobSlugs } from "@/lib/jobs-data";

/**
 * Generate static params for all job detail pages
 */
export async function generateStaticParams() {
  const slugs = getAllJobSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

/**
 * Generate metadata for job detail pages
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found | Devaicon Careers",
    };
  }

  return {
    title: `${job.title} - ${job.location} | Devaicon Careers`,
    description: job.description,
    keywords: [
      job.title,
      job.department,
      job.location,
      "careers",
      "Devaicon jobs",
      "technology careers",
    ],
    openGraph: {
      title: `${job.title} at Devaicon`,
      description: job.shortDescription,
      type: "website",
    },
  };
}

/**
 * Job Detail Page
 * Dynamic route for individual job postings
 */
export default async function JobPage({ params }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return <JobDetailPage job={job} />;
}
