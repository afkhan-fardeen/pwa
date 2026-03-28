"use client";

import type { ReactNode } from "react";
import { Stack } from "@mui/material";

export function MemberPageShell({ children }: { children: ReactNode }) {
  return (
    <Stack spacing={3.5} sx={{ pb: 2 }}>
      {children}
    </Stack>
  );
}
