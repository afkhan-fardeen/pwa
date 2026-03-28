import { createTheme } from "@mui/material/styles";

/** Semantic palette: danger = red, success = green, warning = yellow/amber. */
export const muiTheme = createTheme({
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#5e35b1",
    },
    error: {
      main: "#c62828",
    },
    warning: {
      main: "#f9a825",
    },
    success: {
      main: "#2e7d32",
    },
    info: {
      main: "#0277bd",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
