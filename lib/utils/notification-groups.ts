/** Split notifications into today (local midnight) vs earlier. */

export function partitionNotificationsByToday<T extends { createdAt: Date }>(
  rows: T[],
): { today: T[]; earlier: T[] } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today: T[] = [];
  const earlier: T[] = [];
  for (const r of rows) {
    const d =
      r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt);
    if (d >= start) today.push(r);
    else earlier.push(r);
  }
  return { today, earlier };
}
