"use client";

import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

export function MemberScreenHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "flex-start" }}
      sx={{ pb: 2.5 }}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow ? (
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700, letterSpacing: "0.12em", display: "block" }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography
          variant="h4"
          component="h1"
          sx={{ lineHeight: 1.22, fontWeight: 700, mt: eyebrow ? 0.5 : 0 }}
        >
          {title}
        </Typography>
        {description ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: "42rem", fontSize: "1.0625rem", lineHeight: 1.65 }}
          >
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Stack>
  );
}
