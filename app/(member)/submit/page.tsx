import { auth } from "@/auth";
import { DailyLogForm } from "@/components/member/daily-log-form";
import { MemberPageShell } from "@/components/member/member-page-shell";
import { getDailyLogForEdit } from "@/lib/queries/daily-log";
import { redirect } from "next/navigation";

const YMD = /^\d{4}-\d{2}-\d{2}$/;

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const { date: dateParam } = await searchParams;
  const date =
    dateParam && YMD.test(dateParam) ? dateParam : undefined;
  const initial = date
    ? await getDailyLogForEdit(session.user.id, session.user.genderUnit, date)
    : null;

  const defaultDateYmd =
    date && !initial ? date : undefined;

  return (
    <MemberPageShell>
      <DailyLogForm
        userId={session.user.id}
        genderUnit={session.user.genderUnit}
        initial={initial}
        defaultDateYmd={defaultDateYmd}
      />
    </MemberPageShell>
  );
}
