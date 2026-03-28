import webpush from "web-push";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pushSubscriptions } from "@/lib/db/schema";

const PUSH_BODY_MAX = 180;

let vapidConfigured = false;

function ensureVapidConfigured(): boolean {
  if (vapidConfigured) return true;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return false;
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:support@localhost",
    publicKey,
    privateKey,
  );
  vapidConfigured = true;
  return true;
}

/** Fire push notifications for all stored subscriptions for this user. No-op if VAPID is not configured. */
export async function sendWebPushToUser(options: {
  userId: string;
  title: string;
  body: string;
  url?: string;
}): Promise<void> {
  if (!ensureVapidConfigured()) {
    return;
  }

  const body =
    options.body.length > PUSH_BODY_MAX
      ? `${options.body.slice(0, PUSH_BODY_MAX - 1)}…`
      : options.body;

  const payload = JSON.stringify({
    title: options.title,
    body,
    url: options.url ?? "/notifications",
  });

  const rows = await db
    .select({
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      authKey: pushSubscriptions.authKey,
    })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, options.userId));

  for (const row of rows) {
    const subscription = {
      endpoint: row.endpoint,
      keys: {
        p256dh: row.p256dh,
        auth: row.authKey,
      },
    };

    try {
      await webpush.sendNotification(subscription, payload, {
        TTL: 60 * 60 * 12,
      });
    } catch (err: unknown) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[web-push] send failed", row.endpoint.slice(0, 48), err);
      }
      const statusCode =
        typeof err === "object" && err !== null && "statusCode" in err
          ? (err as { statusCode?: number }).statusCode
          : undefined;
      if (statusCode === 404 || statusCode === 410) {
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.endpoint, row.endpoint));
      }
    }
  }
}
