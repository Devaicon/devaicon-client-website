import Link from "next/link";

export default function InsightNotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Insight not found</h1>
        <p className="text-gray-600 mb-8">
          The insight you&apos;re looking for doesn&apos;t exist, or has moved.
        </p>
        <Link
          href="/insights"
          className="px-6 py-3 text-white font-semibold rounded-lg"
          style={{ background: "#37469E" }}
        >
          Back to Insights
        </Link>
      </div>
    </main>
  );
}
