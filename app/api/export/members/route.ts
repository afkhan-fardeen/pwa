import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toCsv } from "@/lib/export/csv";
import { isStaffRole } from "@/lib/auth/roles";
import { listMembersForStaff } from "@/lib/queries/members-directory";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;

  const { rows } = await listMembersForStaff({
    q,
    status,
    page: 1,
    pageSize: 50_000,
  });

  const csv = toCsv(
    rows.map((r) => ({
      name: r.name,
      email: r.email,
      phone: r.phone,
      halqa: r.halqa,
      genderUnit: r.genderUnit,
      status: r.status,
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : String(r.createdAt),
    })),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="members.csv"',
    },
  });
}
