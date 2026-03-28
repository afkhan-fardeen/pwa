import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MemberProfileContent } from "@/components/member/profile/member-profile-content";
import { listAiyanatForMember } from "@/lib/queries/aiyanat";
import { getMemberProfileExtras } from "@/lib/queries/member-profile";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [extras, aiyanatRows] = await Promise.all([
    getMemberProfileExtras(session.user.id),
    listAiyanatForMember(session.user.id),
  ]);

  const aiyanatHistory = aiyanatRows.map((r) => ({
    id: r.id,
    month: r.month,
    amount: String(r.amount),
    status: r.status,
    paymentDate: r.paymentDate,
  }));

  return (
    <MemberProfileContent extras={extras} aiyanatHistory={aiyanatHistory} />
  );
}
