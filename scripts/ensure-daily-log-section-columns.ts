/**
 * Idempotent: adds daily_logs section columns if missing (same as migration 0002).
 * Run: npx tsx scripts/ensure-daily-log-section-columns.ts
 */
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

async function main() {
  const pool = new pg.Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      ALTER TABLE "daily_logs" ADD COLUMN IF NOT EXISTS "salat_saved" boolean DEFAULT false NOT NULL;
    `);
    await client.query(`
      ALTER TABLE "daily_logs" ADD COLUMN IF NOT EXISTS "quran_saved" boolean DEFAULT false NOT NULL;
    `);
    await client.query(`
      ALTER TABLE "daily_logs" ADD COLUMN IF NOT EXISTS "hadith_saved" boolean DEFAULT false NOT NULL;
    `);
    await client.query("COMMIT");
    console.log("daily_logs section columns OK.");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
