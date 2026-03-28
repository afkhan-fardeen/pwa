import { auth } from "@/auth";
import { MemberHomeContent } from "@/components/member/home/member-home-content";
import { getMemberHomeDashboard } from "@/lib/queries/member-home";

export default async function MemberHomePage() {
  const session = await auth();
  const userId = session?.user?.id;
  const isActiveMember =
    session?.user?.role === "MEMBER" && session.user.status === "ACTIVE";

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!userId || !isActiveMember) {
    return (
      <p className="py-8 text-center text-sm text-stone-500">
        Sign in with an active member account to use this home.
      </p>
    );
  }

  const data = await getMemberHomeDashboard(userId);

  return <MemberHomeContent data={data} todayLabel={todayLabel} />;
}
