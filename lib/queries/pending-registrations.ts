import { and, desc, eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { isStaffRole } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const pendingMember = and(
  eq(users.status, "PENDING"),
  eq(users.role, "MEMBER"),
);

export async function getPendingRegistrations() {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    return [];
  }

  if (session.user.role === "ADMIN") {
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        halqa: users.halqa,
        genderUnit: users.genderUnit,
        language: users.language,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(pendingMember)
      .orderBy(desc(users.createdAt));
  }

  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      halqa: users.halqa,
      genderUnit: users.genderUnit,
      language: users.language,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      and(
        pendingMember,
        eq(users.halqa, session.user.halqa),
        eq(users.genderUnit, session.user.genderUnit),
      ),
    )
    .orderBy(desc(users.createdAt));
}

export async function getPendingRegistrationCount() {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    return 0;
  }

  if (session.user.role === "ADMIN") {
    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(users)
      .where(pendingMember);
    return row?.n ?? 0;
  }

  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(users)
    .where(
      and(
        pendingMember,
        eq(users.halqa, session.user.halqa),
        eq(users.genderUnit, session.user.genderUnit),
      ),
    );
  return row?.n ?? 0;
}
