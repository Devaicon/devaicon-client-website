import type { ReactNode } from "react";
import ThemeScript from "@/components/theme/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

// Layout for the time-logger app pages (login / dashboard / admin, legacy and
// new). Theming is scoped here so the marketing site is unaffected.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeScript />
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
