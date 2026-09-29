"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export type ApiResource<T> = {
  data: T | null;
  error: string | null;
  /** True until the first response arrives; reloads keep showing the old data. */
  loading: boolean;
  reload: () => void;
  /** Local edit, e.g. an optimistic toggle. The next reload overwrites it. */
  setData: (update: (prev: T | null) => T | null) => void;
};

/** GET an admin API path, and again whenever `reload()` is called. */
export function useApi<T>(path: string): ApiResource<T> {
  const [data, setDataState] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api<T>(path);
      if (cancelled) return;
      if (res.ok) {
        setDataState(res.data);
        setError(null);
      } else {
        setError(res.message);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (update: (prev: T | null) => T | null) => setDataState(update),
    [],
  );

  return { data, error, loading, reload, setData };
}
