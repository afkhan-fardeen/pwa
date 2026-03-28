import type { ReactNode } from "react";
import { DM_Sans, Poppins } from "next/font/google";
import { MemberLayoutShell } from "@/components/member/member-layout-shell";
import { MemberStyleRoot } from "@/components/member/member-style-root";
import { MemberTopBar } from "@/components/member/member-top-bar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-member-body",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-member-heading",
  display: "swap",
});

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={`${dmSans.variable} ${poppins.variable}`}>
      <MemberStyleRoot>
        <MemberLayoutShell>
          <MemberTopBar />
          {children}
        </MemberLayoutShell>
      </MemberStyleRoot>
    </div>
  );
}
