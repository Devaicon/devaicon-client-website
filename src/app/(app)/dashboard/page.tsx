import TimeLoggerDashboard from "@/components/time-logger/TimeLoggerDashboard";
import { NEW_CONFIG } from "@/components/time-logger/config";

export default function DashboardPage() {
  return <TimeLoggerDashboard config={NEW_CONFIG} />;
}
