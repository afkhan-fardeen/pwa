import { auth } from "@/auth";
import { PendingRegistrationsTable } from "@/components/dashboard/pending-registrations";
import { getPendingRegistrations } from "@/lib/queries/pending-registrations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardRegistrationsPage() {
  const session = await auth();
  const raw = await getPendingRegistrations();
  const rows = raw.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Pending registrations
        </h1>
        <p className="text-muted-foreground text-sm">
          Review people who signed up to join your halqa.{" "}
          {session?.user?.role !== "ADMIN"
            ? "You only see requests that match your halqa and gender."
            : "You see all pending requests across halqas."}
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Queue</CardTitle>
          <CardDescription>
            {rows.length} waiting for review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PendingRegistrationsTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
