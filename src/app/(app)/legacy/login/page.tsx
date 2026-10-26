"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { ArrowRightIcon } from "lucide-react";

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
      <div className="fixed top-0 left-0 right-0 z-10 bg-grey-50 dark:bg-grey-950/50 border-b border-grey-200 dark:border-grey-900 px-6 py-2 text-xs text-grey-900 dark:text-grey-300 flex items-center justify-between gap-4">
        <span>
          <strong>Legacy backend</strong> · Google Sheets · for data migration only.
        </span>
        <a href="/login" className="underline hover:text-grey-950 dark:hover:text-grey-200 whitespace-nowrap">
          Go to new backend <ArrowRightIcon className="inline-block w-3 h-3 ml-1" />
        </a>
      </div>
      <main className="min-h-screen text-neutral-900 dark:text-neutral-100 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
        <div className="fixed bottom-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Devaicon Time Tracker
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Sign in to log your hours (legacy / Google Sheets).
            </p>
          </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/20 ${
                usernameError
                  ? "border-red-500"
                  : "border-neutral-300 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100"
              }`}
            />
            {usernameError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{usernameError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/20 pr-10 ${
                  passwordError
                    ? "border-red-500"
                    : "border-neutral-300 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{passwordError}</p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50"
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
