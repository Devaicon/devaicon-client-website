// Every difference between the new and legacy time-logger clients lives here.
// Adding a feature to TimeLoggerDashboard ships it to both automatically.
export type LoggerConfig = {
  /** API prefix: "/api" (Express backend) or "/api/legacy" (Google Sheets). */
  apiBase: string;
  loginPath: string;
  adminPath: string;
  /**
   * The one genuine API divergence: the new backend takes
   * `POST /logs/bulk-delete` with an {ids} body, legacy takes
   * `DELETE /logs?ids=a,b,c`.
   */
  bulkDelete: "post-body" | "delete-query";
  /** Namespaces localStorage so a legacy timer never leaks into the new client. */
  storageScope: "new" | "legacy";
};

export const NEW_CONFIG: LoggerConfig = {
  apiBase: "/api",
  loginPath: "/login",
  adminPath: "/admin",
  bulkDelete: "post-body",
  storageScope: "new",
};

export const LEGACY_CONFIG: LoggerConfig = {
  apiBase: "/api/legacy",
  loginPath: "/legacy/login",
  adminPath: "/legacy/admin",
  bulkDelete: "delete-query",
  storageScope: "legacy",
};
