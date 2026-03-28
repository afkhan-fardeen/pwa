const PREFIX = "halqa.dailyLogDraft.v1:";

export function dailyLogDraftKey(userId: string, dateYmd: string): string {
  return `${PREFIX}${userId}:${dateYmd}`;
}

export function readDailyLogDraftRaw(
  userId: string,
  dateYmd: string,
): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(dailyLogDraftKey(userId, dateYmd));
  } catch {
    return null;
  }
}

export function writeDailyLogDraftRaw(
  userId: string,
  dateYmd: string,
  json: string,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(dailyLogDraftKey(userId, dateYmd), json);
  } catch {
    /* quota / private mode */
  }
}

export function clearDailyLogDraft(userId: string, dateYmd: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(dailyLogDraftKey(userId, dateYmd));
  } catch {
    /* ignore */
  }
}
