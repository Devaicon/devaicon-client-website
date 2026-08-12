/**
 * CSV building and download, shared by anything in the time logger that offers
 * an export. Mirrors the escaping the admin page has always used (RFC 4180:
 * quote a cell containing a comma, quote or newline, and double its quotes).
 */

export type CsvCell = string | number | null | undefined;

function escapeCell(cell: CsvCell): string {
  const s = String(cell ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: CsvCell[][]): string {
  return [headers, ...rows].map((r) => r.map(escapeCell).join(",")).join("\n");
}

// Written as a code point rather than a literal: a bare U+FEFF is invisible in
// source and the first careless edit would drop it without anyone noticing.
const UTF8_BOM = String.fromCharCode(0xfeff);

/**
 * Triggers a client-side download. The BOM is there so Excel reads the file as
 * UTF-8 — without it, accented characters in a description arrive mangled.
 */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([UTF8_BOM + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
