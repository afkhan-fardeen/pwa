/** Avatar initials from a display name (first + last word). */
export function initials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (a + b).toUpperCase().slice(0, 2) || "?";
}

/** Human-readable label for staff dashboard roles. */
export function staffRoleLabel(role: string | undefined): string {
  if (role === "ADMIN") return "Admin";
  if (role === "INCHARGE") return "Incharge";
  if (role === "SECRETARY") return "Secretary";
  return role ?? "";
}

const EMPTY_PLACEHOLDER = "—";

/** Read-only halqa + gender line; single em dash when both missing. */
export function formatHalqaGenderLine(
  halqaDisplay: string,
  gender: string,
): string {
  const h = halqaDisplay.trim();
  const g = gender.trim();
  if (!h && !g) return EMPTY_PLACEHOLDER;
  if (!h) return g;
  if (!g) return h;
  return `${h} · ${g}`;
}
