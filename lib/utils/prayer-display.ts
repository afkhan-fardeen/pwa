/** Compact labels for prayer status chips (matches design mockups). */
export type PrayerChip = "BJ" | "MF" | "QZ" | "OT";

export function prayerStatusToChip(s: string): PrayerChip {
  if (s === "BA_JAMAAT") return "BJ";
  if (s === "MUNFARID") return "MF";
  if (s === "QAZA") return "QZ";
  if (s === "ON_TIME") return "OT";
  return "QZ";
}
