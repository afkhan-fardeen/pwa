"use client";

import Link from "next/link";
import {
  CalendarCheck2,
  History,
  Sparkles,
  UserPlus,
  UserRound,
} from "lucide-react";
import { alpha } from "@mui/material/styles";
import { Box, Card, CardActionArea, Typography } from "@mui/material";

const QUICK_ACTION_ICONS = {
  dailyLog: CalendarCheck2,
  pastLogs: History,
  contacts: UserPlus,
  aiyanat: Sparkles,
  profile: UserRound,
} as const;

export type MemberQuickActionIcon = keyof typeof QUICK_ACTION_ICONS;

export function MemberQuickActions({
  actions,
}: {
  actions: {
    href: string;
    icon: MemberQuickActionIcon;
    label: string;
    highlight?: boolean;
  }[];
}) {
  return (
    <section aria-labelledby="actions-heading">
      <Typography
        id="actions-heading"
        variant="subtitle2"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        Quick actions
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
          gap: 1.5,
        }}
      >
        {actions.map((a) => {
          const Icon = QUICK_ACTION_ICONS[a.icon];
          return (
          <Card
            key={a.href}
            variant="outlined"
            sx={(theme) => ({
              borderColor: a.highlight ? "success.main" : "divider",
              bgcolor: a.highlight
                ? alpha(theme.palette.success.main, 0.08)
                : "background.paper",
            })}
          >
            <CardActionArea
              component={Link}
              href={a.href}
              sx={{
                py: 2,
                px: 1.5,
                minHeight: 88,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Icon className="size-6 shrink-0" aria-hidden />
              <Typography variant="caption" fontWeight={700} lineHeight={1.2}>
                {a.label}
              </Typography>
            </CardActionArea>
          </Card>
          );
        })}
      </Box>
    </section>
  );
}
