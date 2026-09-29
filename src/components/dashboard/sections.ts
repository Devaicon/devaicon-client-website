import {
  Clock,
  FileText,
  FolderKanban,
  Library,
  House,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { can, type Me, type Permission } from "@/lib/types";

export type DashboardSection = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Any one of these opens the section; empty means everyone signed in. */
  anyOf: Permission[];
  /** One line for the Home page's shortcut card. */
  blurb: string;
};

export type SectionGroup = { label: string | null; sections: DashboardSection[] };

/** Sidebar order, in groups. A group with nothing visible is left out. */
export const SECTION_GROUPS: SectionGroup[] = [
  {
    label: null,
    sections: [
      { href: "/dashboard", label: "Home", icon: House, anyOf: [], blurb: "" },
    ],
  },
  {
    label: "Time",
    sections: [
      {
        href: "/dashboard/time-logs",
        label: "Team time logs",
        icon: Clock,
        anyOf: ["timelogs.review"],
        blurb: "Review, approve and flag everyone's entries.",
      },
      {
        href: "/dashboard/projects",
        label: "Projects",
        icon: FolderKanban,
        anyOf: ["projects.manage"],
        blurb: "The projects people log time against.",
      },
    ],
  },
  {
    label: "Insights",
    sections: [
      {
        href: "/dashboard/insights",
        label: "Posts",
        icon: FileText,
        anyOf: ["posts.write", "posts.publish", "posts.delete"],
        blurb: "Write, schedule and publish articles for the Insights section.",
      },
      {
        href: "/dashboard/insights/library",
        label: "Blog library",
        icon: Library,
        anyOf: ["blog.library"],
        blurb: "Authors, calls to action and categories that posts use.",
      },
    ],
  },
  {
    label: "People",
    sections: [
      {
        href: "/dashboard/team",
        label: "Team",
        icon: Users,
        anyOf: ["users.manage"],
        blurb: "Add people, reset passwords and set each person's access.",
      },
      {
        href: "/dashboard/roles",
        label: "Roles",
        icon: ShieldCheck,
        anyOf: ["users.manage", "roles.manage"],
        blurb: "The starting set of permissions for each kind of user.",
      },
    ],
  },
  {
    label: null,
    sections: [
      {
        href: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
        anyOf: [],
        blurb: "Your name, password and signed-in devices.",
      },
    ],
  },
];

export function canOpen(me: Me | null, section: DashboardSection): boolean {
  return section.anyOf.length === 0 || section.anyOf.some((p) => can(me, p));
}

/** Groups trimmed to what `me` may open, with empty groups dropped. */
export function visibleGroups(me: Me | null): SectionGroup[] {
  return SECTION_GROUPS.map((g) => ({
    ...g,
    sections: g.sections.filter((s) => canOpen(me, s)),
  })).filter((g) => g.sections.length > 0);
}
