import { auth } from "@/auth";
import { MemberPageShell } from "@/components/member/member-page-shell";
import { MemberScreenHeader } from "@/components/member/member-screen-header";
import { MarkAllReadButton } from "@/components/notifications/mark-all-read-button";
import { NotificationInboxList } from "@/components/notifications/notification-inbox-list";
import { listNotificationsForCurrentUser } from "@/lib/queries/notifications";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default async function MemberNotificationsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const rows = await listNotificationsForCurrentUser();
  const hasUnread = rows.some((r) => !r.read);

  return (
    <MemberPageShell>
      <MemberScreenHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Registration updates and reminders. Daily reminders include a link to open your log."
        action={hasUnread ? <MarkAllReadButton /> : undefined}
      />

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardHeader
          sx={{ pb: 0 }}
          title={
            <Typography variant="h6" component="h2" fontWeight={700}>
              Messages
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Tap read on a row to clear it from your badge in the header.
            </Typography>
          }
        />
        <CardContent sx={{ pt: 2, px: { xs: 1.5, sm: 2 } }}>
          <NotificationInboxList rows={rows} />
        </CardContent>
      </Card>
    </MemberPageShell>
  );
}
