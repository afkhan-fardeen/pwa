import { and, eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { isStaffRole } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { aiyanat, dailyUnitStats, users } from "@/lib/db/schema";
import { parseYmdToUtcDate, todayYmdLocal } from "@/lib/utils/date";

function currentMonthYmd(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export type DashboardOverview = {
  submissionRatePct: number | null;
  submittedToday: number;
  totalMembersUnit: number;
  aiyanatMonthLabel: string;
  aiyanatPaidMembers: number;
  aiyanatEligibleMembers: number;
};

export async function getDashboardOverview(): Promise<DashboardOverview | null> {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    return null;
  }

  const today = parseYmdToUtcDate(todayYmdLocal());
  const monthStr = currentMonthYmd();

  let submittedToday = 0;
  let totalMembersUnit = 0;

  if (session.user.role === "ADMIN") {
    const rows = await db
      .select()
      .from(dailyUnitStats)
      .where(eq(dailyUnitStats.date, today));
    for (const r of rows) {
      submittedToday += r.submittedCount;
      totalMembersUnit += r.totalMembers;
    }
  } else {
    const [row] = await db
      .select()
      .from(dailyUnitStats)
      .where(
        and(
          eq(dailyUnitStats.date, today),
          eq(dailyUnitStats.halqa, session.user.halqa),
          eq(dailyUnitStats.genderUnit, session.user.genderUnit),
        ),
      )
      .limit(1);
    if (row) {
      submittedToday = row.submittedCount;
      totalMembersUnit = row.totalMembers;
    }
  }

  const submissionRatePct =
    totalMembersUnit > 0
      ? Math.round((submittedToday / totalMembersUnit) * 100)
      : null;

  const memberScope =
    session.user.role === "ADMIN"
      ? and(eq(users.role, "MEMBER"), eq(users.status, "ACTIVE"))
      : and(
          eq(users.role, "MEMBER"),
          eq(users.status, "ACTIVE"),
          eq(users.halqa, session.user.halqa),
          eq(users.genderUnit, session.user.genderUnit),
        );

  const [eligible] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(users)
    .where(memberScope);
  const aiyanatEligibleMembers = eligible?.n ?? 0;

  const [paidDistinct] = await db
    .select({
      n: sql<number>`count(distinct ${aiyanat.userId})::int`,
    })
    .from(aiyanat)
    .innerJoin(users, eq(aiyanat.userId, users.id))
    .where(
      and(
        eq(aiyanat.month, monthStr),
        eq(aiyanat.status, "PAID"),
        memberScope,
      ),
    );

  const aiyanatPaidMembers = paidDistinct?.n ?? 0;

  return {
    submissionRatePct,
    submittedToday,
    totalMembersUnit,
    aiyanatMonthLabel: monthStr,
    aiyanatPaidMembers,
    aiyanatEligibleMembers,
  };
}
