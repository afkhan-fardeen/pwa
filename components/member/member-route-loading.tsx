"use client";

import { Box, Skeleton, Stack } from "@mui/material";

/** Shown via `app/(member)/loading.tsx` while a member route segment loads. */
export function MemberRouteLoading() {
  return (
    <Stack spacing={2} sx={{ pt: 0.5 }} aria-busy aria-label="Loading">
      <Skeleton variant="rounded" height={40} width="72%" sx={{ borderRadius: 1 }} />
      <Skeleton variant="text" height={18} sx={{ maxWidth: "100%" }} />
      <Skeleton variant="text" height={18} sx={{ maxWidth: "88%" }} />
      <Box sx={{ pt: 2 }}>
        <Skeleton variant="rounded" height={148} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rounded" height={88} sx={{ borderRadius: 2 }} />
    </Stack>
  );
}
