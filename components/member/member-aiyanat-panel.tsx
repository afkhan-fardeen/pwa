"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { upsertMemberAiyanat } from "@/lib/actions/aiyanat";

type Row = {
  id: string;
  month: string;
  amount: string;
  status: "PAID" | "NOT_PAID";
  paymentDate: Date | null;
};

function currentMonthYmd(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function MemberAiyanatPanel({
  rows,
  year,
  yesMonths,
}: {
  rows: Row[];
  year: number;
  yesMonths: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [month, setMonth] = useState(currentMonthYmd());
  const [contributed, setContributed] = useState<boolean | null>(null);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => b.month.localeCompare(a.month)),
    [rows],
  );

  const existingForMonth = sorted.find((r) => r.month === month);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (contributed === null) {
      setError("Choose Yes or No.");
      return;
    }
    startTransition(async () => {
      const res = await upsertMemberAiyanat({ month, contributed });
      if (res.error) {
        setError(res.error);
        return;
      }
      setContributed(null);
      router.refresh();
    });
  }

  return (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "rgba(28,25,23,0.02)",
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          Months marked yes in {year}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5, lineHeight: 1.1 }}>
          {yesMonths}
        </Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          This month
        </Typography>
        {error ? (
          <Typography color="error" variant="body2" sx={{ mb: 2 }} role="alert">
            {error}
          </Typography>
        ) : null}
        <form onSubmit={onSubmit}>
          <Stack spacing={2.25}>
            <TextField
              id="aiy-month"
              label="Month"
              type="month"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setContributed(null);
              }}
              required
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            {existingForMonth ? (
              <Typography variant="body2" color="text.secondary">
                Saved:{" "}
                <Box component="span" fontWeight={700} color="text.primary">
                  {existingForMonth.status === "PAID" ? "Yes" : "No"}
                </Box>
              </Typography>
            ) : null}
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Paid this month?
              </Typography>
              <Stack direction="row" gap={1}>
                <Button
                  type="button"
                  fullWidth
                  variant={contributed === true ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setContributed(true)}
                  sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant={contributed === false ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setContributed(false)}
                  sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}
                >
                  No
                </Button>
              </Stack>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={pending}
              fullWidth
              size="large"
              sx={{ fontWeight: 600 }}
            >
              {pending ? "Saving…" : "Save"}
            </Button>
          </Stack>
        </form>
      </Paper>

      {sorted.length > 0 ? (
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 700,
              display: "block",
              mb: 1.25,
            }}
          >
            Past months
          </Typography>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Stack divider={<Divider flexItem sx={{ borderColor: "divider" }} />}>
              {sorted.map((r) => (
                <Box
                  key={r.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 2,
                    py: 1.75,
                  }}
                >
                  <Typography fontWeight={600}>{r.month}</Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color={r.status === "PAID" ? "success.main" : "text.secondary"}
                  >
                    {r.status === "PAID" ? "Yes" : "No"}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : null}
    </Stack>
  );
}
