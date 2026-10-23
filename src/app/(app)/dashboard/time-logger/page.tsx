import type { Metadata } from "next";
import TimeLoggerDashboard from "@/components/time-logger/TimeLoggerDashboard";
import { NEW_CONFIG } from "@/components/time-logger/config";

export const metadata: Metadata = {
  title: "Time Logger",
  robots: { index: false, follow: false },
};

// The time logger is an app inside the dashboard, full-screen rather than in
// the dashboard's sidebar shell; its header links back to /dashboard.
export default function TimeLoggerPage() {
  return <TimeLoggerDashboard config={NEW_CONFIG} />;
}
