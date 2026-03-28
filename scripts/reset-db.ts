/**
 * Truncates all application tables (PostgreSQL). Destructive — dev/local use.
 *
 * Usage: npm run db:reset
 *
 * Loads `.env.local` first (same as other scripts).
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { sql } = await import("drizzle-orm");
  const { db } = await import("../lib/db");

  console.log("Truncating all application tables…");

  await db.execute(sql`
    TRUNCATE TABLE daily_unit_stats, users RESTART IDENTITY CASCADE
  `);

  console.log("Done. All rows removed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
