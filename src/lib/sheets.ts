import { google, sheets_v4 } from "googleapis";
import { randomUUID } from "crypto";
import {
  HEADERS_LOGS,
  HEADERS_PROJECTS,
  SHEET_LOGS,
  SHEET_PROJECTS,
  type Project,
  type TimeLog,
} from "./types";

let cachedClient: sheets_v4.Sheets | null = null;

function getSheetsClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
    );
  }
  // ...
  // If they stored it as base64 to avoid \n issues on Vercel:
  // const privateKey = rawKey.includes("-----BEGIN PRIVATE KEY-----")
  //   ? rawKey.replace(/\\n/g, "\n")
  //   : Buffer.from(rawKey, "base64").toString("utf-8");

  // When stored in env, newlines in the private key are usually escaped as \n.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) {
    console.error("❌ ERROR: Missing GOOGLE_SHEET_ID env var.");
    throw new Error("Missing GOOGLE_SHEET_ID env var.");
  }
  return id;
}

/* ------------------------------------------------------------------ */
/*  One-time setup: ensure the two tabs and headers exist             */
/* ------------------------------------------------------------------ */

export async function ensureSheets(): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingTitles = new Set(
    (meta.data.sheets ?? [])
      .map((s) => s.properties?.title)
      .filter(Boolean) as string[],
  );

  const requests: sheets_v4.Schema$Request[] = [];
  if (!existingTitles.has(SHEET_LOGS)) {
    requests.push({ addSheet: { properties: { title: SHEET_LOGS } } });
  }
  if (!existingTitles.has(SHEET_PROJECTS)) {
    requests.push({ addSheet: { properties: { title: SHEET_PROJECTS } } });
  }
  if (requests.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  }

  // Make sure header rows exist
  await ensureHeaderRow(SHEET_LOGS, HEADERS_LOGS);
  await ensureHeaderRow(SHEET_PROJECTS, HEADERS_PROJECTS);
}

async function ensureHeaderRow(tab: string, headers: string[]): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const range = `${tab}!A1:${columnLetter(headers.length)}1`;
  const got = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const row = got.data.values?.[0] ?? [];
  const matches =
    row.length === headers.length && headers.every((h, i) => row[i] === h);
  if (!matches) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }
}

function columnLetter(n: number): string {
  // 1 -> A, 26 -> Z, 27 -> AA  (only handles up to ZZ which is plenty)
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function withSheetFallback<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error: any) {
    // Treat as fallback: ensure sheets and try again
    await ensureSheets();
    return await action();
  }
}

/* ------------------------------------------------------------------ */
/*  Time logs                                                         */
/* ------------------------------------------------------------------ */

export async function appendLog(
  log: Omit<TimeLog, "id" | "loggedAt" | "approvedAt" | "approvedBy">,
): Promise<TimeLog> {
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const full: TimeLog = {
      id: randomUUID(),
      loggedAt: new Date().toISOString(),
      approvedAt: "",
      approvedBy: "",
      ...log,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_LOGS}!A:J`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            full.id,
            full.date,
            full.username,
            full.project,
            full.category,
            full.hours,
            full.description,
            full.loggedAt,
            full.approvedAt,
            full.approvedBy,
          ],
        ],
      },
    });

    return full;
  });
}

export async function readLogs(filter?: {
  username?: string;
}): Promise<TimeLog[]> {
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_LOGS}!A2:J`,
    });

    const rows = res.data.values ?? [];
    const logs: TimeLog[] = rows
      .filter((r) => r && r.length >= 7 && r[0])
      .map((r) => ({
        id: String(r[0] ?? ""),
        date: String(r[1] ?? ""),
        username: String(r[2] ?? "").toLowerCase(),
        project: String(r[3] ?? ""),
        category: String(r[4] ?? ""),
        hours: Number(r[5] ?? 0),
        description: String(r[6] ?? ""),
        loggedAt: String(r[7] ?? ""),
        approvedAt: String(r[8] ?? ""),
        approvedBy: String(r[9] ?? ""),
      }));

    if (filter?.username) {
      const u = filter.username.toLowerCase();
      return logs.filter((l) => l.username === u);
    }
    return logs;
  });
}

export async function findLogById(id: string): Promise<TimeLog | null> {
  const logs = await readLogs();
  return logs.find((l) => l.id === id) ?? null;
}

export async function deleteLogById(id: string): Promise<boolean> {
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_LOGS}!A2:A`,
    });
    const ids = res.data.values ?? [];
    const idx = ids.findIndex((r) => r[0] === id);
    if (idx < 0) return false;

    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const tab = (meta.data.sheets ?? []).find(
      (s) => s.properties?.title === SHEET_LOGS,
    );
    const sheetId = tab?.properties?.sheetId;
    if (sheetId == null) return false;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: idx + 1,
                endIndex: idx + 2,
              },
            },
          },
        ],
      },
    });
    return true;
  });
}

/**
 * Delete many logs at once. Returns the number of rows actually removed
 * (IDs that don't match an existing row are skipped).
 */
export async function deleteLogsByIds(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_LOGS}!A2:A`,
    });
    const rows = res.data.values ?? [];
    const idSet = new Set(ids);

    // 0-based offsets into the data region (row 2 == offset 0).
    const targets: number[] = [];
    rows.forEach((r, i) => {
      if (r[0] && idSet.has(String(r[0]))) targets.push(i);
    });
    if (targets.length === 0) return 0;

    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const tab = (meta.data.sheets ?? []).find(
      (s) => s.properties?.title === SHEET_LOGS,
    );
    const sheetId = tab?.properties?.sheetId;
    if (sheetId == null) return 0;

    // Delete bottom-up so earlier deletions don't shift later row indices.
    const requests = targets
      .sort((a, b) => b - a)
      .map((idx) => ({
        deleteDimension: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: idx + 1,
            endIndex: idx + 2,
          },
        },
      }));

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    return targets.length;
  });
}

/**
 * Batch-update approval status for many logs at once.
 * Returns the number of rows actually updated (IDs that didn't match are skipped).
 */
export async function setLogsApproval(
  ids: string[],
  approved: boolean,
  adminUsername: string,
): Promise<number> {
  if (ids.length === 0) return 0;
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Map ID -> 1-based row number (data starts at row 2).
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_LOGS}!A2:A`,
    });
    const rows = res.data.values ?? [];
    const idToRow = new Map<string, number>();
    rows.forEach((r, i) => {
      if (r[0]) idToRow.set(String(r[0]), i + 2);
    });

    const approvedAt = approved ? new Date().toISOString() : "";
    const approvedBy = approved ? adminUsername : "";

    const data = ids
      .map((id) => idToRow.get(id))
      .filter((row): row is number => typeof row === "number")
      .map((row) => ({
        range: `${SHEET_LOGS}!I${row}:J${row}`,
        values: [[approvedAt, approvedBy]],
      }));

    if (data.length === 0) return 0;

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data,
      },
    });

    return data.length;
  });
}

/* ------------------------------------------------------------------ */
/*  Projects                                                          */
/* ------------------------------------------------------------------ */

export async function readProjects(): Promise<Project[]> {
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_PROJECTS}!A2:D`,
    });
    const rows = res.data.values ?? [];
    return rows
      .filter((r) => r && r[0] && r[1])
      .map((r) => ({
        id: String(r[0]),
        name: String(r[1]),
        addedAt: String(r[2] ?? ""),
        addedBy: String(r[3] ?? ""),
      }));
  });
}

export async function appendProject(
  name: string,
  addedBy: string,
): Promise<Project> {
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const project: Project = {
      id: randomUUID(),
      name: name.trim(),
      addedAt: new Date().toISOString(),
      addedBy,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_PROJECTS}!A:D`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[project.id, project.name, project.addedAt, project.addedBy]],
      },
    });

    return project;
  });
}

export async function deleteProjectById(id: string): Promise<boolean> {
  return withSheetFallback(async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Find the row index (1-based, including header).
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_PROJECTS}!A2:A`,
    });
    const ids = res.data.values ?? [];
    const idx = ids.findIndex((r) => r[0] === id);
    if (idx < 0) return false;

    // Need the sheetId (not the tab name) to delete a row.
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const tab = (meta.data.sheets ?? []).find(
      (s) => s.properties?.title === SHEET_PROJECTS,
    );
    const sheetId = tab?.properties?.sheetId;
    if (sheetId == null) return false;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: idx + 1, // +1 because header is row 0 internally
                endIndex: idx + 2,
              },
            },
          },
        ],
      },
    });
    return true;
  });
}

/* ------------------------------------------------------------------ */
/*  Export                                                            */
/* ------------------------------------------------------------------ */

export function getSpreadsheetUrl(): string {
  const id = getSpreadsheetId();
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

/** Stream the entire spreadsheet as XLSX bytes. */
export async function downloadAsXlsx(): Promise<{
  body: ArrayBuffer;
  filename: string;
}> {
  const drive = google.drive({
    version: "v3",
    auth: new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(
        /\\n/g,
        "\n",
      ),
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    }),
  });

  const fileId = getSpreadsheetId();
  const res = await drive.files.export(
    {
      fileId,
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    { responseType: "arraybuffer" },
  );
  return {
    body: res.data as ArrayBuffer,
    filename: `devaicon-timelogs-${new Date().toISOString().slice(0, 10)}.xlsx`,
  };
}
