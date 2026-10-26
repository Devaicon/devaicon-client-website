import { timingSafeEqual } from "crypto";
import type { Role, SessionUser } from "./types";

/**
 * Users are defined entirely through env vars, following the pattern:
 *   DEV1_PASSWORD=...
 *   DEV2_PASSWORD=...
 *   ADMIN1_PASSWORD=...
 *
 * To add a person you just add another env var and redeploy. No DB.
 */

const USER_ENV_PATTERN = /^([A-Za-z0-9_]+)_PASSWORD$/;

export function listUsernames(): SessionUser[] {
  const users: SessionUser[] = [];
  for (const key of Object.keys(process.env)) {
    const m = key.match(USER_ENV_PATTERN);
    if (!m) continue;
    const name = m[1].toLowerCase();
    // For the role, if the username starts with 'admin', assign admin. Otherwise dev.
    const role: Role = name.startsWith("admin") ? "admin" : "dev";

    // Avoid adding duplicates if they somehow added multiple casings
    if (!users.find((u) => u.username === name)) {
      users.push({ username: name, role });
    }
  }
  // stable order: admins first, then devs, then by name
  return users.sort((a, b) => {
    if (a.role !== b.role) return a.role === "admin" ? -1 : 1;
    return a.username.localeCompare(b.username, undefined, { numeric: true });
  });
}

export function verifyCredentials(
  rawUsername: string,
  password: string,
): { user?: SessionUser; error?: "invalid_username" | "invalid_password" } {
  if (typeof rawUsername !== "string" || typeof password !== "string")
    return { error: "invalid_username" };

  const username = rawUsername.trim().toLowerCase();
  // We only require it to match letters/numbers/underscores
  const m = username.match(/^[a-z0-9_]+$/);
  if (!m) return { error: "invalid_username" };

  // Case-insensitive lookup for the environment variable
  const targetEnvKey = `${username}_password`;
  const actualEnvKey = Object.keys(process.env).find(
    (k) => k.toLowerCase() === targetEnvKey,
  );
  const expected = actualEnvKey ? process.env[actualEnvKey] : undefined;

  if (!expected) return { error: "invalid_username" };

  // constant-time compare to avoid leaking length / prefix info
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  let matches = false;
  try {
    matches = a.length === b.length && timingSafeEqual(a, b);
  } catch {
    matches = false;
  }

  if (!matches) return { error: "invalid_password" };

  const role: Role = username.startsWith("admin") ? "admin" : "dev";
  return { user: { username, role } };
}
