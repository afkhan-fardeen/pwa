"use client";

import type { ReactNode } from "react";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

export function AuthPage({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        borderRadius: 2,
        maxWidth: 440,
        mx: "auto",
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: (t) =>
          t.palette.mode === "dark"
            ? "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 8px 40px rgba(28,25,23,0.08), 0 0 0 1px rgba(28,25,23,0.06)",
      }}
    >
      <Stack spacing={3} sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {description ? (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.25, maxWidth: 360, mx: "auto", lineHeight: 1.65 }}
              >
                {description}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        <Box sx={{ minWidth: 0 }}>{children}</Box>
        {footer ? (
          <>
            <Divider />
            <Box sx={{ textAlign: "center" }}>{footer}</Box>
          </>
        ) : null}
      </Stack>
    </Paper>
  );
}
