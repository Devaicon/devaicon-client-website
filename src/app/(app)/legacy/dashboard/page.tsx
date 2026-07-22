import TimeLoggerDashboard from "@/components/time-logger/TimeLoggerDashboard";
import { LEGACY_CONFIG } from "@/components/time-logger/config";
import { ArrowRightIcon } from "lucide-react";

function LegacyBanner() {
  return (
    <div className="bg-grey-50 dark:bg-grey-950/50 border-b border-grey-200 dark:border-grey-900 px-6 py-2 text-xs text-grey-900 dark:text-grey-300 flex items-center justify-between gap-4">
      <span>
        <strong>Legacy backend</strong> · Google Sheets · for data migration only.
      </span>
      <a
        href="/dashboard"
        className="underline hover:text-grey-950 dark:hover:text-grey-200 whitespace-nowrap"
      >
        Go to new backend <ArrowRightIcon className="inline-block w-3 h-3 ml-1" />
      </a>
    </div>
  );
}

export default function LegacyDashboardPage() {
  return <TimeLoggerDashboard config={LEGACY_CONFIG} banner={<LegacyBanner />} />;
}
