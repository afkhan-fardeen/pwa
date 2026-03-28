import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { contacts, dailyLogs, dailyUnitStats, users } from "@/lib/db/schema";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

type UserRow = typeof users.$inferSelect;
type Halqa = UserRow["halqa"];
type GenderUnit = UserRow["genderUnit"];

/** Recompute and replace the stats row for one unit and calendar date. */
export async function refreshDailyUnitStats(
  tx: Transaction,
  date: Date,
  halqa: Halqa,
  genderUnit: GenderUnit,
): Promise<void> {
  const [totalRow] = await tx
    .select({ n: sql<number>`count(*)::int` })
    .from(users)
    .where(
      and(
        eq(users.halqa, halqa),
        eq(users.genderUnit, genderUnit),
        eq(users.status, "ACTIVE"),
        eq(users.role, "MEMBER"),
      ),
    );
  const totalMembers = totalRow?.n ?? 0;

  const logs = await tx
    .select({
      quranPages: dailyLogs.quranPages,
      fajr: dailyLogs.fajr,
      dhuhr: dailyLogs.dhuhr,
      asr: dailyLogs.asr,
      maghrib: dailyLogs.maghrib,
      isha: dailyLogs.isha,
      salatSaved: dailyLogs.salatSaved,
      quranSaved: dailyLogs.quranSaved,
    })
    .from(dailyLogs)
    .innerJoin(users, eq(dailyLogs.userId, users.id))
    .where(
      and(
        eq(dailyLogs.date, date),
        eq(users.halqa, halqa),
        eq(users.genderUnit, genderUnit),
        eq(users.role, "MEMBER"),
      ),
    );

  const submittedCount = logs.length;
  const quranPagesTotal = logs.reduce(
    (s, r) => (r.quranSaved ? s + r.quranPages : s),
    0,
  );
  const qazaCount = logs.reduce((sum, row) => {
    if (!row.salatSaved) return sum;
    const prayers = [row.fajr, row.dhuhr, row.asr, row.maghrib, row.isha];
    return sum + prayers.filter((p) => p === "QAZA").length;
  }, 0);

  const memberRows = await tx
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.halqa, halqa),
        eq(users.genderUnit, genderUnit),
        eq(users.status, "ACTIVE"),
        eq(users.role, "MEMBER"),
      ),
    );
  const ids = memberRows.map((m) => m.id);

  let contactsCount = 0;
  if (ids.length > 0) {
    const [cRow] = await tx
      .select({ n: sql<number>`count(*)::int` })
      .from(contacts)
      .where(and(eq(contacts.logDate, date), inArray(contacts.userId, ids)));
    contactsCount = cRow?.n ?? 0;
  }

  await tx
    .delete(dailyUnitStats)
    .where(
      and(
        eq(dailyUnitStats.date, date),
        eq(dailyUnitStats.halqa, halqa),
        eq(dailyUnitStats.genderUnit, genderUnit),
      ),
    );

  await tx.insert(dailyUnitStats).values({
    id: crypto.randomUUID(),
    date,
    halqa,
    genderUnit,
    totalMembers,
    submittedCount,
    quranPagesTotal,
    qazaCount,
    contactsCount,
    updatedAt: new Date(),
  });
}
