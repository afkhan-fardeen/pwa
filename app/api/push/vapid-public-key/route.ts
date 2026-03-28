import { NextResponse } from "next/server";

/** Public VAPID key for `pushManager.subscribe` (safe to expose). */
export function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json(
      { error: "Push is not configured on this server." },
      { status: 503 },
    );
  }
  return NextResponse.json({ publicKey });
}
