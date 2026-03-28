/** Walk nested error.cause chains (Drizzle, pg) for Postgres error code. */
export function getPostgresErrorCode(error: unknown): string | undefined {
  let cur: unknown = error;
  for (let i = 0; i < 8 && cur; i++) {
    if (typeof cur === "object" && cur !== null && "code" in cur) {
      const c = (cur as { code?: unknown }).code;
      if (typeof c === "string" && /^[0-9A-Z]+$/.test(c)) return c;
    }
    if (typeof cur === "object" && cur !== null && "cause" in cur) {
      cur = (cur as { cause: unknown }).cause;
      continue;
    }
    break;
  }
  return undefined;
}

export function isUndefinedColumnError(error: unknown): boolean {
  return getPostgresErrorCode(error) === "42703";
}

/** Node/pg connection failures (Postgres not running, wrong host, etc.) */
export function isDbConnectionError(error: unknown): boolean {
  const codes = new Set(["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT"]);
  let cur: unknown = error;
  for (let i = 0; i < 10 && cur; i++) {
    if (typeof cur === "object" && cur !== null && "code" in cur) {
      const c = (cur as { code?: unknown }).code;
      if (typeof c === "string" && codes.has(c)) return true;
    }
    if (cur instanceof AggregateError && Array.isArray(cur.errors)) {
      for (const e of cur.errors) {
        if (isDbConnectionError(e)) return true;
      }
    }
    if (typeof cur === "object" && cur !== null && "cause" in cur) {
      cur = (cur as { cause: unknown }).cause;
      continue;
    }
    break;
  }
  return false;
}
