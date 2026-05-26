"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUsernameError(null);
    setPasswordError(null);

    let hasClientError = false;
    if (!username.trim()) {
      setUsernameError("Username is required.");
      hasClientError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      hasClientError = true;
    }
    if (hasClientError) return;

    setLoading(true);
    try {
      const res = await fetch("/api/legacy/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.error === "invalid_username") {
          setUsernameError("Username not found.");
        } else if (data?.error === "invalid_password") {
          setPasswordError("Incorrect password.");
        } else {
          setError("Login failed. Try again.");
        }
        return;
      }
      const next = params.get("next");
      if (next && next.startsWith("/")) {
        router.push(next);
      } else if (data.user.role === "admin") {
        router.push("/legacy/admin");
      } else {
        router.push("/legacy/dashboard");
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-900 flex items-center justify-between gap-4">
        <span>
          <strong>Legacy backend</strong> · Google Sheets · for data migration only.
        </span>
        <a href="/login" className="underline hover:text-amber-950 whitespace-nowrap">
          Go to new backend →
        </a>
      </div>
      <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Devaicon Time Tracker
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Sign in to log your hours (legacy / Google Sheets).
            </p>
          </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Username
            </label>
            <input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(null);
                setError(null);
              }}
              placeholder="e.g. devarish or administrator"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 ${
                usernameError
                  ? "border-red-500"
                  : "border-neutral-300 focus:border-neutral-900"
              }`}
            />
            {usernameError && (
              <p className="mt-1 text-xs text-red-600">{usernameError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                  setError(null);
                }}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 pr-10 ${
                  passwordError
                    ? "border-red-500"
                    : "border-neutral-300 focus:border-neutral-900"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-neutral-500 hover:text-neutral-700"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
