import { Clock, FolderKanban, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import type { Permission } from "@/lib/types";

export type AdminSection = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Any one of these opens the section. */
  anyOf: Permission[];
};

/** Sidebar order. The first one a user may open is where /admin lands them. */
export const ADMIN_SECTIONS: AdminSection[] = [
  { href: "/admin/time-logs", label: "Time logs", icon: Clock, anyOf: ["timelogs.review"] },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, anyOf: ["projects.manage"] },
  { href: "/admin/team", label: "Team", icon: Users, anyOf: ["users.manage"] },
  {
    href: "/admin/roles",
    label: "Roles",
    icon: ShieldCheck,
    anyOf: ["users.manage", "roles.manage"],
  },
];
