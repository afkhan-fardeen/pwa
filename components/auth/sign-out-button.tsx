"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

type Props = {
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

export function SignOutButton({ variant = "outline", className }: Props) {
  const muiVariant =
    variant === "ghost" ? "text" : variant === "outline" ? "outlined" : "contained";
  return (
    <Button
      type="button"
      variant={muiVariant}
      color="error"
      className={className}
      fullWidth={variant !== "ghost"}
      onClick={() => signOut({ callbackUrl: "/login" })}
      startIcon={<LogoutIcon />}
      sx={{
        borderRadius: 999,
        py: 1.35,
        fontWeight: 600,
        textTransform: "none",
        ...(variant === "outline" && {
          borderWidth: 2,
        }),
      }}
    >
      Sign out
    </Button>
  );
}
