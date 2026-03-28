"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { parseYmdToUtcDate, todayYmdLocal } from "@/lib/utils/date";

const contactEntrySchema = z.object({
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().trim().min(1).max(255),
  phone: z.string().trim().min(5).max(20),
  location: z.string().trim().min(1).max(255),
  status: z.enum(["MUSLIM", "NON_MUSLIM"]),
});

export type OutreachActionState = { error?: string; success?: boolean };

const idSchema = z.string().uuid();

function todayCalendarDate(): Date {
  return parseYmdToUtcDate(todayYmdLocal());
}

export async function addOutreachContact(
  formData: FormData,
): Promise<OutreachActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    return { error: "Unauthorized" };
  }
  if (session.user.status !== "ACTIVE") {
    return { error: "Account not active." };
  }

  const parsed = contactEntrySchema.safeParse({
    logDate: formData.get("logDate"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const logDate = parseYmdToUtcDate(parsed.data.logDate);
  if (logDate.getTime() > todayCalendarDate().getTime()) {
    return { error: "Date cannot be in the future." };
  }

  await db.insert(contacts).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    logDate,
    name: parsed.data.name,
    phone: parsed.data.phone,
    location: parsed.data.location,
    status: parsed.data.status,
    createdAt: new Date(),
  });

  revalidatePath("/outreach");
  return { success: true };
}

export async function deleteOutreachContact(
  formData: FormData,
): Promise<OutreachActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    return { error: "Unauthorized" };
  }

  const parsed = idSchema.safeParse(formData.get("id"));
  if (!parsed.success) {
    return { error: "Invalid request" };
  }

  const [row] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(and(eq(contacts.id, parsed.data), eq(contacts.userId, session.user.id)))
    .limit(1);

  if (!row) {
    return { error: "Not found" };
  }

  await db.delete(contacts).where(eq(contacts.id, parsed.data));

  revalidatePath("/outreach");
  return { success: true };
}
