import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { formatYmdUtc } from "@/lib/utils/date";

export type OutreachRow = {
  id: string;
  logDate: string;
  name: string;
  phone: string;
  location: string;
  status: "MUSLIM" | "NON_MUSLIM";
  createdAt: Date;
};

export async function listOutreachForMember(
  userId: string,
  limit = 80,
): Promise<OutreachRow[]> {
  const rows = await db
    .select({
      id: contacts.id,
      logDate: contacts.logDate,
      name: contacts.name,
      phone: contacts.phone,
      location: contacts.location,
      status: contacts.status,
      createdAt: contacts.createdAt,
    })
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.logDate), desc(contacts.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    logDate: formatYmdUtc(
      r.logDate instanceof Date ? r.logDate : new Date(String(r.logDate)),
    ),
    name: r.name,
    phone: r.phone,
    location: r.location,
    status: r.status,
    createdAt:
      r.createdAt instanceof Date
        ? r.createdAt
        : new Date(String(r.createdAt)),
  }));
}
