import { MemberTopBarClient } from "@/components/member/member-top-bar-client";
import { getUnreadNotificationCount } from "@/lib/queries/notifications";

export async function MemberTopBar() {
  const unread = await getUnreadNotificationCount();
  const now = new Date();
  const dateLine = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return <MemberTopBarClient unread={unread} dateLine={dateLine} />;
}
