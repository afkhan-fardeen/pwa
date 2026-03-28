"use client";

import type { ReactNode } from "react";
import { MemberThemeProvider } from "@/components/member/member-theme-provider";

/** Wraps member routes with amber/DM theme + light/dark (localStorage). */
export function MemberStyleRoot({ children }: { children: ReactNode }) {
  return <MemberThemeProvider>{children}</MemberThemeProvider>;
}
