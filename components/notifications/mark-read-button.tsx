"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { markNotificationRead } from "@/lib/actions/notifications";

export function MarkReadButton({
  notificationId,
  label = "Read",
}: {
  notificationId: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outlined"
      color="primary"
      size="small"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const fd = new FormData();
          fd.set("id", notificationId);
          await markNotificationRead(fd);
          toast.success("Marked as read");
        })
      }
      startIcon={<DoneIcon sx={{ fontSize: 16 }} />}
      sx={{
        flexShrink: 0,
        borderRadius: 999,
        textTransform: "none",
        fontWeight: 600,
        px: 1.5,
        minWidth: 0,
      }}
    >
      {pending ? "…" : label}
    </Button>
  );
}
