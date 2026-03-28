import { auth } from "@/auth";
import { MarkAllReadButton } from "@/components/notifications/mark-all-read-button";
import { NotificationInboxList } from "@/components/notifications/notification-inbox-list";
import { listNotificationsForCurrentUser } from "@/lib/queries/notifications";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isStaffRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function DashboardNotificationsPage() {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    redirect("/login");
  }

  const rows = await listNotificationsForCurrentUser();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Notifications
        </h1>
        {rows.some((r) => !r.read) ? <MarkAllReadButton /> : null}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Alerts for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationInboxList rows={rows} readLabel="Mark read" />
        </CardContent>
      </Card>
    </div>
  );
}
