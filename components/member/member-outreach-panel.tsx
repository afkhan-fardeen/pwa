"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  addOutreachContact,
  deleteOutreachContact,
} from "@/lib/actions/outreach";
import type { OutreachRow } from "@/lib/queries/outreach";
import { todayYmdLocal } from "@/lib/utils/date";
import { toast } from "sonner";

export function MemberOutreachPanel({ rows }: { rows: OutreachRow[] }) {
  const router = useRouter();
  const [date, setDate] = useState(todayYmdLocal());
  const [pending, startTransition] = useTransition();
  const [delPending, setDelPending] = useState<string | null>(null);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await addOutreachContact(fd);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Contact added");
      (e.target as HTMLFormElement).reset();
      setDate(todayYmdLocal());
      router.refresh();
    });
  }

  async function onDelete(id: string) {
    setDelPending(id);
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteOutreachContact(fd);
    setDelPending(null);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Removed");
    router.refresh();
  }

  return (
    <Stack spacing={2.5} sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "rgba(28,25,23,0.02)",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
          Add contact
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mb: 2, lineHeight: 1.5 }}>
          Name, phone, location, and Muslim / non-Muslim status. The date ties this entry to that day
          (often the same day as your daily log).
        </Typography>
        <form onSubmit={onAdd}>
          <input type="hidden" name="logDate" value={date} />
          <Stack spacing={2}>
            <TextField
              id="o-date"
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: todayYmdLocal() },
              }}
              required
              fullWidth
              size="small"
            />
            <TextField
              id="o-name"
              name="name"
              label="Name"
              required
              autoComplete="name"
              fullWidth
              size="small"
            />
            <TextField
              id="o-phone"
              name="phone"
              label="Phone"
              type="tel"
              required
              autoComplete="tel"
              fullWidth
              size="small"
            />
            <TextField
              id="o-loc"
              name="location"
              label="Location"
              required
              fullWidth
              size="small"
            />
            <TextField
              id="o-status"
              name="status"
              label="Status"
              select
              required
              fullWidth
              size="small"
              defaultValue="MUSLIM"
            >
              <MenuItem value="MUSLIM">Muslim</MenuItem>
              <MenuItem value="NON_MUSLIM">Non-Muslim</MenuItem>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={pending}
              fullWidth
              sx={{ mt: 0.5, py: 1.25, fontWeight: 600 }}
            >
              {pending ? "Adding…" : "Add contact"}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            fontWeight: 600,
            display: "block",
            mb: 1.25,
          }}
        >
          Recent
        </Typography>
        {rows.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              borderStyle: "dashed",
              textAlign: "center",
              borderColor: "divider",
              bgcolor: "action.hover",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No contacts yet. Add someone you reached above.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.25}>
            {rows.map((r) => (
              <Paper
                key={r.id}
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1.5,
                  borderColor: "divider",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={600} sx={{ fontSize: "1rem" }}>
                    {r.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
                    {r.logDate} · {r.phone} · {r.location}
                  </Typography>
                  <Chip
                    size="small"
                    label={r.status === "MUSLIM" ? "Muslim" : "Non-Muslim"}
                    sx={{
                      mt: 1,
                      height: 24,
                      fontSize: 11,
                      fontWeight: 600,
                      bgcolor: (t) =>
                        r.status === "MUSLIM"
                          ? t.palette.mode === "dark"
                            ? "rgba(6,78,59,0.5)"
                            : "#D1FAE5"
                          : t.palette.mode === "dark"
                            ? "rgba(30,58,138,0.45)"
                            : "#DBEAFE",
                      color: (t) =>
                        r.status === "MUSLIM"
                          ? t.palette.mode === "dark"
                            ? "#6EE7B7"
                            : "#065F46"
                          : t.palette.mode === "dark"
                            ? "#93C5FD"
                            : "#1E40AF",
                    }}
                  />
                </Box>
                <IconButton
                  type="button"
                  size="small"
                  aria-label="Delete contact"
                  disabled={delPending === r.id}
                  onClick={() => onDelete(r.id)}
                  sx={{
                    color: "error.main",
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: (t) =>
                        t.palette.mode === "dark"
                          ? "rgba(239, 68, 68, 0.12)"
                          : "rgba(239, 68, 68, 0.08)",
                    },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
