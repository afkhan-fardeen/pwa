"use client";

import Link from "next/link";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Badge, IconButton } from "@mui/material";

export function InboxLink({
  href,
  unread,
  className,
}: {
  href: string;
  unread: number;
  className?: string;
}) {
  const label =
    unread > 0
      ? `${unread} unread notification${unread === 1 ? "" : "s"}`
      : "Notifications";

  return (
    <IconButton
      component={Link}
      href={href}
      aria-label={label}
      color={unread > 0 ? "primary" : "default"}
      className={className}
      size="medium"
    >
      <Badge badgeContent={unread > 99 ? "99+" : unread} color="error" invisible={unread === 0}>
        {unread > 0 ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
      </Badge>
    </IconButton>
  );
}
