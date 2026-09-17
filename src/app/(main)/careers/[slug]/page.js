import { notFound } from "next/navigation";
import JobDetailPage from "@/components/careers/JobDetailPage";
import { getJobBySlug, getAllJobSlugs } from "@/lib/jobs-data";
import { brandedTitle, metaDescription } from "@/lib/seo";

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
      title: brandedTitle("Job Not Found"),
      robots: { index: false, follow: true },
    };
  }

  return {
    title: brandedTitle(`${job.title} Careers`),
    description: metaDescription(job.description || job.shortDescription),
    alternates: {
      canonical: `/careers/${slug}`,
    },
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
      description: metaDescription(job.shortDescription),
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
