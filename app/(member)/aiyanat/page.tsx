import { auth } from "@/auth";
import { MemberAiyanatPanel } from "@/components/member/member-aiyanat-panel";
import { MemberPageShell } from "@/components/member/member-page-shell";
import { MemberScreenHeader } from "@/components/member/member-screen-header";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import {
  countAiyanatYesMonthsForYear,
  listAiyanatForMember,
} from "@/lib/queries/aiyanat";
import { redirect } from "next/navigation";

export default async function MemberAiyanatPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const year = new Date().getFullYear();
  const [rows, yesMonths] = await Promise.all([
    listAiyanatForMember(session.user.id),
    countAiyanatYesMonthsForYear(session.user.id, year),
  ]);

  return (
    <MemberPageShell>
      <MemberScreenHeader
        eyebrow="Contributions"
        title="Aiyanat"
        description="Mark whether you paid each month. You can change any past month anytime."
      />

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardHeader
          sx={{ pb: 0 }}
          title={
            <Typography variant="h6" component="h2" fontWeight={700}>
              Monthly
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Pick the month, choose Yes or No for paid this month, then save.
            </Typography>
          }
        />
        <CardContent sx={{ pt: 2 }}>
          <MemberAiyanatPanel rows={rows} year={year} yesMonths={yesMonths} />
        </CardContent>
      </Card>
    </MemberPageShell>
  );
}
