import type { ReactNode } from "react";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { getUnreadNotificationCount } from "@/lib/queries/notifications";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const unread = await getUnreadNotificationCount();

  return <DashboardLayoutClient unread={unread}>{children}</DashboardLayoutClient>;
}
