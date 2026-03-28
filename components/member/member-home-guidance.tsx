"use client";

import { Alert, Stack } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export function MemberHomeGuidance({
  submittedToday,
}: {
  submittedToday: boolean;
}) {
  return (
    <Stack spacing={1}>
      {submittedToday ? (
        <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="inherit" />}>
          Today&apos;s log is complete. You can still edit any card.
        </Alert>
      ) : (
        <Alert severity="info">
          Daily log has three cards — save each when ready. A draft stays on this device. Outreach is
          under <strong>Contacts</strong> in the nav.
        </Alert>
      )}
    </Stack>
  );
}
