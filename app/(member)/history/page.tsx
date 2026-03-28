import { auth } from "@/auth";
import { MemberPageShell } from "@/components/member/member-page-shell";
import { MemberScreenHeader } from "@/components/member/member-screen-header";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { listDailyLogsForMember } from "@/lib/queries/daily-log";
import { formatHistoryDateHeading } from "@/lib/utils/member-display";
import { redirect } from "next/navigation";

const PAGE_SIZE = 50;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const { page: pageStr } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageStr ?? "1", 10) || 1);

  const { rows, total } = await listDailyLogsForMember(
    session.user.id,
    requestedPage,
    PAGE_SIZE,
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(requestedPage, totalPages);

  if (total > 0 && requestedPage > totalPages) {
    redirect(`/history?page=${totalPages}`);
  }
  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;

  return (
    <MemberPageShell>
      <MemberScreenHeader
        eyebrow="Your activity"
        title="Past logs"
        description="Newest first. Tap a row to open Log for that day and edit your full report."
      />

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden" }}>
        <CardHeader
          sx={{ pb: 0 }}
          title={
            <Typography variant="h6" component="h2" fontWeight={700}>
              All entries
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {total === 0
                ? "No entries yet"
                : `${total} entr${total === 1 ? "y" : "ies"} — page ${safePage} of ${totalPages}. Tap a row to edit.`}
            </Typography>
          }
        />
        <CardContent sx={{ pt: 2, px: { xs: 2, sm: 2.5 } }}>
          {rows.length === 0 ? (
            <Box
              sx={{
                borderRadius: 2,
                border: 2,
                borderStyle: "dashed",
                borderColor: "divider",
                bgcolor: "action.hover",
                px: 2,
                py: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                Nothing here yet. Submit your first daily report from{" "}
                <Typography
                  component="a"
                  href="/submit"
                  color="primary"
                  fontWeight={700}
                  sx={{ textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  Log
                </Typography>{" "}
                — it will show up in this list.
              </Typography>
            </Box>
          ) : (
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {rows.map((row) => (
                <Box component="li" key={row.id}>
                  <Box
                    component="a"
                    href={`/submit?date=${encodeURIComponent(row.date)}`}
                    aria-label={`View or edit log for ${row.date}`}
                    sx={{
                      display: "flex",
                      minHeight: 56,
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      borderRadius: 2,
                      border: 1,
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      px: 2,
                      py: 1.75,
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background-color 0.15s",
                      "&:hover": { bgcolor: "action.hover" },
                      "&:active": { bgcolor: "action.selected" },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={700} sx={{ lineHeight: 1.25 }}>
                        {formatHistoryDateHeading(row.date)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ display: "block", mt: 0.35, fontVariantNumeric: "tabular-nums" }}
                      >
                        {row.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {[
                          row.prayerSummary,
                          `${row.quranPages} Quran page${row.quranPages === 1 ? "" : "s"}`,
                          row.hadith ? "Hadith" : "No hadith",
                          row.contactCount > 0
                            ? `${row.contactCount} contact${row.contactCount === 1 ? "" : "s"}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25, flexShrink: 0 }}>
                      <Typography variant="caption" color="primary" fontWeight={700}>
                        Edit
                      </Typography>
                      <ChevronRightIcon sx={{ color: "text.disabled" }} fontSize="small" />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {totalPages > 1 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                pt: 2.5,
              }}
            >
              <Button
                component="a"
                href={hasPrev ? `/history?page=${String(safePage - 1)}` : undefined}
                variant="outlined"
                disabled={!hasPrev}
                sx={{ minWidth: 100, minHeight: 44 }}
              >
                Previous
              </Button>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Page {safePage} / {totalPages}
              </Typography>
              <Button
                component="a"
                href={hasNext ? `/history?page=${String(safePage + 1)}` : undefined}
                variant="outlined"
                disabled={!hasNext}
                sx={{ minWidth: 100, minHeight: 44 }}
              >
                Next
              </Button>
            </Box>
          ) : null}
        </CardContent>
      </Card>
    </MemberPageShell>
  );
}
