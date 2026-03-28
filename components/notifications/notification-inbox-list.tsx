"use client";

import Link from "next/link";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { NOTIFICATION_TYPES } from "@/lib/constants/notification-types";
import { partitionNotificationsByToday } from "@/lib/utils/notification-groups";
import { NotificationTypeIcon } from "@/components/notifications/notification-type-icon";
import { MarkReadButton } from "@/components/notifications/mark-read-button";

type Row = {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

function formatWhen(d: Date, compact: boolean) {
  if (compact) {
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Section({
  title,
  rows,
  compactTime,
  readLabel,
}: {
  title: string;
  rows: Row[];
  compactTime: boolean;
  readLabel: string;
}) {
  if (rows.length === 0) return null;
  return (
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
          px: 0.5,
        }}
      >
        {title}
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Stack divider={<Divider flexItem sx={{ borderColor: "divider" }} />} sx={{ m: 0 }}>
          {rows.map((n) => {
            const created =
              n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt);
            return (
              <Box
                key={n.id}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  px: 2,
                  py: 2,
                  bgcolor: n.read ? "transparent" : "action.hover",
                }}
              >
                <NotificationTypeIcon type={n.type} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: n.read ? 500 : 600,
                      color: n.read ? "text.secondary" : "text.primary",
                      lineHeight: 1.45,
                      fontSize: "0.9375rem",
                    }}
                  >
                    {n.message}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 0.75, display: "block" }}>
                    {n.type.replaceAll("_", " ")} · {formatWhen(created, compactTime)}
                  </Typography>
                  {n.type === NOTIFICATION_TYPES.DAILY_REMINDER ? (
                    <Typography
                      component={Link}
                      href="/submit"
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        mt: 1.25,
                        display: "inline-block",
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Open daily log
                    </Typography>
                  ) : null}
                </Box>
                {!n.read ? (
                  <MarkReadButton notificationId={n.id} label={readLabel} />
                ) : null}
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
}

export function NotificationInboxList({
  rows,
  readLabel = "Read",
}: {
  rows: Row[];
  readLabel?: string;
}) {
  if (rows.length === 0) {
    return (
      <Stack spacing={1} sx={{ py: 6, px: 2, textAlign: "center" }}>
        <Typography variant="body1" fontWeight={600}>
          You&apos;re all caught up
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Nothing in your inbox. Reminders and registration updates from your halqa team will appear
          here.
        </Typography>
      </Stack>
    );
  }

  const { today, earlier } = partitionNotificationsByToday(rows);

  return (
    <Stack spacing={3}>
      <Section title="Today" rows={today} compactTime readLabel={readLabel} />
      <Section title="Earlier" rows={earlier} compactTime={false} readLabel={readLabel} />
    </Stack>
  );
}
