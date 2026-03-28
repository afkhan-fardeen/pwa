/**
 * Applies migrations, truncates app data, then seeds demo users/logs/contacts.
 * Usage: npm run db:reset:seed
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const cwd = resolve(__dirname, "..");
const tsx = resolve(cwd, "node_modules/.bin/tsx");

console.log("→ db:migrate (schema up to date)\n");
execFileSync(tsx, ["scripts/db-migrate.ts"], { stdio: "inherit", cwd });
console.log("\n→ db:reset (truncate data)\n");
execFileSync(tsx, ["scripts/reset-db.ts"], { stdio: "inherit", cwd });
console.log("\n→ db:seed:demo\n");
execFileSync(tsx, ["scripts/seed-demo-data.ts"], { stdio: "inherit", cwd });
console.log("\nDone. Database is migrated, empty, and demo-seeded.");
