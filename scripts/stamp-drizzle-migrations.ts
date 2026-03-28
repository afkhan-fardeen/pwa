/**
 * If the database was created with `db:push` or manually, `drizzle-kit migrate` can fail
 * on duplicate ENUMs/tables. This script records migration hashes in drizzle.__drizzle_migrations
 * so future migrate runs are no-ops, and applies the 0002 data backfill (section flags = true for legacy rows).
 *
 * Run once: npx tsx scripts/stamp-drizzle-migrations.ts
 */
import { config } from "dotenv";
import { readMigrationFiles } from "drizzle-orm/migrator";
import path from "node:path";
import pg from "pg";

const root = path.join(process.cwd());

config({ path: path.join(root, ".env.local") });
config({ path: path.join(root, ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

async function main() {
  const metas = readMigrationFiles({
    migrationsFolder: path.join(root, "lib/db/migrations"),
    migrationsSchema: "drizzle",
  });

  const pool = new pg.Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    for (const m of metas) {
      await client.query(
        `INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
         SELECT $1::text, $2::bigint
         WHERE NOT EXISTS (
           SELECT 1 FROM drizzle.__drizzle_migrations WHERE hash = $1::text
         )`,
        [m.hash, m.folderMillis],
      );
    }
    const r = await client.query(
      `UPDATE daily_logs SET salat_saved = true, quran_saved = true, hadith_saved = true`,
    );
    console.log(
      `Stamped ${metas.length} migration(s); legacy daily_logs rows updated: ${r.rowCount ?? 0}.`,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
