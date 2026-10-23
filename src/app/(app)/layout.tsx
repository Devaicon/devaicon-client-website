import type { ReactNode } from "react";
import ThemeScript from "@/components/theme/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TimeFormatProvider } from "@/components/time-logger/TimeFormatProvider";
import ChangelogWidget from "@/components/changelog/ChangelogWidget";

// Layout for the signed-in app: login, the dashboard and the Time Logger
// inside it. Theming is scoped here so the marketing site is unaffected, and
// the changelog widget mounts once for all of them.
//
// The time-format preference sits alongside the theme: both are display-only
// choices and both persist in localStorage.
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
