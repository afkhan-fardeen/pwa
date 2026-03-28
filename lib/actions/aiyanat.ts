"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aiyanat } from "@/lib/db/schema";
import { aiyanatUpsertSchema } from "@/lib/validations/aiyanat";

export type AiyanatActionState = { error?: string; success?: boolean };

export async function upsertMemberAiyanat(data: unknown): Promise<AiyanatActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    return { error: "Only members can manage Aiyanat." };
  }
  if (session.user.status !== "ACTIVE") {
    return { error: "Your account is not active." };
  }

  const parsed = aiyanatUpsertSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Invalid data." };
  }

  const { month, contributed } = parsed.data;
  const status = contributed ? "PAID" : "NOT_PAID";
  const amountStr = "0.00";

  const userId = session.user.id;

  try {
    const [existing] = await db
      .select({ id: aiyanat.id })
      .from(aiyanat)
      .where(and(eq(aiyanat.userId, userId), eq(aiyanat.month, month)))
      .limit(1);

    if (existing) {
      await db
        .update(aiyanat)
        .set({
          amount: amountStr,
          status,
          paymentDate: null,
          updatedAt: new Date(),
        })
        .where(eq(aiyanat.id, existing.id));
    } else {
      await db.insert(aiyanat).values({
        id: crypto.randomUUID(),
        userId,
        month,
        amount: amountStr,
        status,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (e) {
    console.error(e);
    return { error: "Could not save. Please try again." };
  }

  revalidatePath("/aiyanat");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/aiyanat");
  return { success: true };
}
