import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toCsv } from "@/lib/export/csv";
import { isStaffRole } from "@/lib/auth/roles";
import { listContactsForStaff } from "@/lib/queries/submissions-staff";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !isStaffRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const fromYmd = url.searchParams.get("from") ?? undefined;
  const toYmd = url.searchParams.get("to") ?? undefined;
  const format = url.searchParams.get("format");

  const { rows } = await listContactsForStaff({
    fromYmd,
    toYmd,
    page: 1,
    pageSize: 50_000,
  });

  if (format === "xlsx") {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Contacts");
    ws.columns = [
      { header: "Log date", key: "logDate", width: 12 },
      { header: "Member", key: "memberName", width: 24 },
      { header: "Contact", key: "contactName", width: 22 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Location", key: "location", width: 22 },
      { header: "Status", key: "status", width: 12 },
    ];
    for (const r of rows) {
      ws.addRow(r);
    }
    const buf = await wb.xlsx.writeBuffer();
    return new NextResponse(Buffer.from(buf), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="contacts.xlsx"',
      },
    });
  }

  const csv = toCsv(rows.map((r) => ({ ...r })));

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="contacts.csv"',
    },
  });
}
