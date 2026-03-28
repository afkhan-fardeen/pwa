/**
 * Applies SQL migrations from lib/db/migrations (same as drizzle-kit migrate, with clear errors).
 * Usage: npm run db:migrate
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import pg from "pg";

const root = path.join(process.cwd());

config({ path: path.join(root, ".env.local") });
config({ path: path.join(root, ".env") });

const useProduction =
  process.env.MIGRATE_USE_PRODUCTION === "1" ||
  process.env.MIGRATE_USE_PRODUCTION === "true";
const url = useProduction
  ? process.env.DATABASE_URL_PRODUCTION?.trim()
  : process.env.DATABASE_URL?.trim();

if (!url) {
  console.error(
    useProduction
      ? "DATABASE_URL_PRODUCTION is not set (needed for Neon / production migrate)."
      : "DATABASE_URL is not set.",
  );
  process.exit(1);
}

if (useProduction) {
  console.log("[db:migrate] Using DATABASE_URL_PRODUCTION (Neon / production).");
}

async function main() {
  const pool = new pg.Pool({ connectionString: url });
  const db = drizzle(pool);
  try {
    await migrate(db, {
      migrationsFolder: path.join(root, "lib/db/migrations"),
      migrationsSchema: "drizzle",
    });
    console.log("Migrations applied successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
