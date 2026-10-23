"use client";

import { PageHeader } from "@/components/dashboard/DashboardShell";
import { useDashboardSession } from "@/components/dashboard/DashboardSession";
import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function SettingsPage() {
  const { reload } = useDashboardSession();
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your account, how the dashboard looks, and what your access covers." />
      {/* Re-read the session so the header shows a new name straight away. */}
      <ProfileSettings apiBase="/api" onMeChange={() => reload()} />
    </div>
  );
}
