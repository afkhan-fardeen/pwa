import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pushSubscriptions } from "@/lib/db/schema";
import { sendWebPushToUser } from "@/lib/push/send-web-push";
import { NextResponse } from "next/server";

/**
 * Sends a single test Web Push to the current user's registered device(s).
 * Requires an existing push subscription (enable notifications first).
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "Push is not configured on this server." },
      { status: 503 },
    );
  }

  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, session.user.id));

  const count = row?.n ?? 0;
  if (count === 0) {
    return NextResponse.json(
      {
        error:
          "No push subscription for this account. Enable notifications on this device first.",
      },
      { status: 400 },
    );
  }

  await sendWebPushToUser({
    userId: session.user.id,
    title: "Qalbee",
    body: "Test notification — if you see this, Web Push is working.",
    url: "/notifications",
  });

  return NextResponse.json({ ok: true as const, devices: count });
}
