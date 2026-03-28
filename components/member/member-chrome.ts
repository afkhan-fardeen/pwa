import type { SxProps, Theme } from "@mui/material/styles";

/** Shared frosted bar for sticky header strip and fixed bottom nav (match visually). */
export const memberFogBarSx: SxProps<Theme> = {
  backdropFilter: "saturate(180%) blur(12px)",
  WebkitBackdropFilter: "saturate(180%) blur(12px)",
  borderColor: "divider",
  backgroundColor: (t) =>
    t.palette.mode === "dark"
      ? "rgba(17, 17, 16, 0.88)"
      : "rgba(250, 250, 249, 0.88)",
};

/** Primary row height for toolbar and bottom nav grid (aligned). */
export const MEMBER_BAR_ROW_MIN_HEIGHT_PX = 64;
