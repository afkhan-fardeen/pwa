import { NOTIFICATION_TYPES } from "@/lib/constants/notification-types";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { sendWebPushToUser } from "@/lib/push/send-web-push";

export async function insertNotification(options: {
  userId: string;
  type: string;
  message: string;
  /** Overrides default title on the device notification (e.g. announcements). */
  pushTitle?: string;
}) {
  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    userId: options.userId,
    type: options.type,
    message: options.message,
    read: false,
    createdAt: new Date(),
  });

  const pushTitle =
    options.pushTitle ??
    (options.type === NOTIFICATION_TYPES.STAFF_ANNOUNCEMENT
      ? "New announcement"
      : "Qalbee");

  // Await so server actions / serverless requests finish sending push (fire-and-forget was dropped too early).
  await sendWebPushToUser({
    userId: options.userId,
    title: pushTitle,
    body: options.message,
    url: "/notifications",
  }).catch(() => {
    /* push optional */
  });
}
