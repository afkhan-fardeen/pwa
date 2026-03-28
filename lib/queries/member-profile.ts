import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { contacts, dailyLogs, users } from "@/lib/db/schema";

export async function getMemberProfileExtras(userId: string) {
  const [u] = await db
    .select({
      phone: users.phone,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const [daysRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(dailyLogs)
    .where(eq(dailyLogs.userId, userId));

  const [contactRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(contacts)
    .where(eq(contacts.userId, userId));

  return {
    phone: u?.phone ?? "",
    daysLogged: daysRow?.n ?? 0,
    contactsTotal: contactRow?.n ?? 0,
  };
}
