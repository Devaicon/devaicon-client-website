"use client";

import { use } from "react";
import { SectionGate } from "@/components/dashboard/DashboardShell";
import ServicePageEditorPage from "@/components/service-pages-admin/ServicePageEditor";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <SectionGate anyOf={["services.manage"]}>
      <ServicePageEditorPage id={id} />
    </SectionGate>
  );
}
