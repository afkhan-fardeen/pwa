"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarkAllReadButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("min-h-11 w-full sm:w-auto", className)}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markAllNotificationsRead(new FormData());
          toast.success("All notifications marked as read");
        })
      }
    >
      {pending ? "Updating…" : "Mark all read"}
    </Button>
  );
}
