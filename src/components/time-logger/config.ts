// Where the time logger talks to and keeps its state: the Express backend, or
// the Google Sheets one kept behind LEGACY_TIME_LOGGER while its users move.
export type LoggerConfig = {
  /** API prefix: "/api" (Express backend) or "/api/legacy" (Google Sheets). */
  apiBase: string;
  loginPath: string;
  /** The personal dashboard this app lives in. */
  dashboardPath: string;
  /**
   * The one genuine API divergence: the new backend takes
   * `POST /logs/bulk-delete` with an {ids} body, legacy takes
   * `DELETE /logs?ids=a,b,c`.
   */
  bulkDelete: "post-body" | "delete-query";
  /** Namespaces localStorage so a legacy timer never leaks into the new client. */
  storageScope: "new" | "legacy";
  /**
   * Where overview card preferences live. "server" keeps them on the user
   * account so they follow the person between devices; "local" keeps them in
   * this browser only, which is all the Google Sheets backend can offer.
   * Either way localStorage holds a mirror, so the first paint never waits
   * on a fetch.
   */
  preferenceSync: "server" | "local";
  /**
   * When the backend can't be reached, keep new entries and deletions in this
   * browser and offer a sync to replay them. Only the Sheets backend opts in:
   * it is the one that goes down when the spreadsheet loses its sharing.
   */
  localFallback: boolean;
};

export const NEW_CONFIG: LoggerConfig = {
  apiBase: "/api",
  loginPath: "/login",
  dashboardPath: "/dashboard",
  bulkDelete: "post-body",
  storageScope: "new",
  preferenceSync: "server",
  localFallback: false,
};

export const LEGACY_CONFIG: LoggerConfig = {
  apiBase: "/api/legacy",
  loginPath: "/legacy/login",
  dashboardPath: "/legacy/dashboard",
  bulkDelete: "delete-query",
  storageScope: "legacy",
  preferenceSync: "local",
  localFallback: true,
};
