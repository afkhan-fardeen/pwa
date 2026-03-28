"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { InboxLink } from "@/components/notifications/inbox-link";
import { DashboardSidebarNav } from "@/components/dashboard/dashboard-sidebar-nav";
import { AppBar, Box, Paper, Toolbar, Typography } from "@mui/material";

export function DashboardLayoutClient({
  unread,
  children,
}: {
  unread: number;
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Paper
        component="aside"
        elevation={0}
        square
        sx={{
          display: { xs: "none", md: "flex" },
          width: 224,
          flexDirection: "column",
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Toolbar sx={{ gap: 1, justifyContent: "space-between", borderBottom: 1, borderColor: "divider" }}>
          <Typography
            variant="h6"
            component={Link}
            href="/dashboard"
            color="primary"
            sx={{ fontWeight: 800, textDecoration: "none" }}
            dir="rtl"
            lang="ar"
          >
            قلبي
          </Typography>
          <InboxLink href="/dashboard/notifications" unread={unread} />
        </Toolbar>
        <DashboardSidebarNav />
        <Box sx={{ mt: "auto", borderTop: 1, borderColor: "divider", p: 1 }}>
          <SignOutButton className="w-full" />
        </Box>
      </Paper>
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" color="inherit" elevation={1} sx={{ display: { md: "none" } }}>
          <Toolbar>
            <Typography variant="subtitle1" fontWeight={800} sx={{ flex: 1 }}>
              Dashboard
            </Typography>
            <InboxLink href="/dashboard/notifications" unread={unread} />
            <SignOutButton variant="ghost" />
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
          <Box sx={{ mx: "auto", width: "100%", maxWidth: 1152 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
