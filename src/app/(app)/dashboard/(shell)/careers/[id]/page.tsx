"use client";

import { use } from "react";
import { SectionGate } from "@/components/dashboard/DashboardShell";
import JobEditorPage from "@/components/careers-admin/JobEditor";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <SectionGate anyOf={["careers.manage"]}>
      <JobEditorPage id={id} />
    </SectionGate>
  );
}
