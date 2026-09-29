// Thin fetch wrapper for the admin pages. Every call resolves — errors come
// back as `{ ok: false, message }` in words a person can act on — so pages
// never need their own try/catch.

export type ApiResult<T> = { ok: boolean; data?: T; message?: string; status?: number };

export async function api<T = unknown>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      method: init?.method ?? "GET",
      headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : res.status === 403
            ? "You don't have permission to do that."
            : "Something went wrong. Try again.";
      return { ok: false, message, status: res.status };
    }
    return { ok: true, data: data as T, status: res.status };
  } catch {
    return { ok: false, message: "Could not reach the server. Check your connection." };
  }
}
