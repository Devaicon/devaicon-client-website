"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Me } from "@/lib/types";

type DashboardSession = {
  me: Me | null;
  /** Re-read /auth/me, e.g. after changing your own role's permissions. */
  reload: () => void;
  logout: () => Promise<void>;
};

const Ctx = createContext<DashboardSession | null>(null);

/**
 * Loads the signed-in user once for the whole admin area. Permissions here
 * only decide what to show; Express checks them again on every request.
 */
export function DashboardSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/me").catch(() => null);
      if (cancelled) return;
      if (res?.status === 401) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (res?.ok) setMe((await res.json()).user);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  }, [router]);

  return <Ctx.Provider value={{ me, reload, logout }}>{children}</Ctx.Provider>;
}

export function useDashboardSession(): DashboardSession {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDashboardSession must be used inside the dashboard layout");
  return ctx;
}
