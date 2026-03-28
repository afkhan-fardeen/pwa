import { createHash, randomBytes } from "crypto";

export function hashResetToken(plain: string): string {
  return createHash("sha256").update(plain, "utf8").digest("hex");
}

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

function normalizeHttpsBase(input: string): string {
  const t = input.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t.replace(/^\/\//, "")}`;
}

/**
 * Base URL for password-reset and reminder links (no trailing slash).
 * On Vercel, prefer explicit AUTH_URL (especially for a custom domain). Falls back to Vercel system envs.
 */
export function resetLinkBaseUrl(): string {
  const raw = process.env.AUTH_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return normalizeHttpsBase(production);
  }
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}
