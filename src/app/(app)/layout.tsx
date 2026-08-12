import type { ReactNode } from "react";
import ThemeScript from "@/components/theme/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TimeFormatProvider } from "@/components/time-logger/TimeFormatProvider";
import ChangelogWidget from "@/components/changelog/ChangelogWidget";

// Layout for the time-logger app pages (login / dashboard / admin, legacy and
// new). Theming is scoped here so the marketing site is unaffected, and the
// changelog widget mounts once for all four logger pages.
//
// The time-format preference sits alongside the theme: both are display-only
// choices, both persist in localStorage, and both are shared by the new and
// legacy clients.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeScript />
      <ThemeProvider>
        <TimeFormatProvider>
          {children}
          <ChangelogWidget />
        </TimeFormatProvider>
      </ThemeProvider>
    </>
  );
}
