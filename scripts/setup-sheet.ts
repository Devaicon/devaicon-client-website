// Optional one-time script: creates the TimeLogs and Projects tabs
// in your Google Sheet and writes the header rows.
//
// Run with:  npx tsx scripts/setup-sheet.ts
// (You only need to run it once. After that the app uses the sheet directly.)
import dotenv from "dotenv";
dotenv.config(); // fall back to .env if .env.local isn't present

import { ensureSheets } from "../src/lib/sheets";

async function main() {
  await ensureSheets();
  console.log("✓ Sheets initialised — TimeLogs and Projects tabs are ready.");
}

main().catch((e) => {
  console.error("Setup failed:", e?.message ?? e);
  process.exit(1);
});
