export type StaffRole = "ADMIN" | "INCHARGE" | "SECRETARY";

/** Admin, Incharge, and Secretary — dashboard/staff access. */
export function isStaffRole(
  role: string | undefined,
): role is StaffRole {
  return role === "ADMIN" || role === "INCHARGE" || role === "SECRETARY";
}
