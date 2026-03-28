import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toCsv } from "@/lib/export/csv";
import { isStaffRole } from "@/lib/auth/roles";
import { listDailyLogsForStaff } from "@/lib/queries/submissions-staff";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const fromYmd = url.searchParams.get("from") ?? undefined;
  const toYmd = url.searchParams.get("to") ?? undefined;
  const format = url.searchParams.get("format");

  const { rows } = await listDailyLogsForStaff({
    fromYmd,
    toYmd,
    page: 1,
    pageSize: 50_000,
  });

  if (format === "xlsx") {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Submissions");
    ws.columns = [
      { header: "Date", key: "date", width: 12 },
      { header: "Member", key: "memberName", width: 24 },
      { header: "Email", key: "memberEmail", width: 28 },
      { header: "Halqa", key: "halqa", width: 14 },
      { header: "Unit", key: "genderUnit", width: 10 },
      { header: "Quran pages", key: "quranPages", width: 12 },
      { header: "Hadith", key: "hadith", width: 8 },
    ];
    for (const r of rows) {
      ws.addRow({
        date: r.date,
        memberName: r.memberName,
        memberEmail: r.memberEmail,
        halqa: r.halqa,
        genderUnit: r.genderUnit,
        quranPages: r.quranPages,
        hadith: r.hadith ? "Yes" : "No",
      });
    }
    const buf = await wb.xlsx.writeBuffer();
    return new NextResponse(Buffer.from(buf), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="submissions.xlsx"',
      },
    });
  }

  const csv = toCsv(
    rows.map((r) => ({
      date: r.date,
      memberName: r.memberName,
      memberEmail: r.memberEmail,
      halqa: r.halqa,
      genderUnit: r.genderUnit,
      quranPages: r.quranPages,
      hadith: r.hadith ? "Yes" : "No",
    })),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="submissions.csv"',
    },
  });
}
