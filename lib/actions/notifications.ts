"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

export async function markNotificationRead(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, session.user.id)),
    );

  revalidatePath("/notifications");
  revalidatePath("/dashboard/notifications");
  revalidatePath("/");
}

export async function markAllNotificationsRead(
  _formData: FormData,
): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(eq(notifications.userId, session.user.id), eq(notifications.read, false)),
    );

  revalidatePath("/notifications");
  revalidatePath("/dashboard/notifications");
  revalidatePath("/");
}
