import Link from "next/link";
import { auth } from "@/auth";
import { StaffAnnouncementComposeForm } from "@/components/dashboard/staff-announcement-compose-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { isStaffRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function DashboardNotifyMembersPage() {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/notifications"
          className={buttonVariants({ variant: "link", className: "text-muted-foreground h-auto p-0 text-sm" })}
        >
          ← Back to notifications
        </Link>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Notify members
        </h1>
        <p className="text-muted-foreground text-sm">
          Send an in-app message to active members’ notification inbox.
          {isAdmin
            ? " Optionally limit by halqa and/or gender."
            : " Only members in your halqa and gender receive it."}
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Compose</CardTitle>
          <CardDescription>
            Members see this under Notifications in the app. No email is sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffAnnouncementComposeForm isAdmin={isAdmin} />
        </CardContent>
      </Card>
    </div>
  );
}
