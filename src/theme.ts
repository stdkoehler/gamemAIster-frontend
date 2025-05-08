import { createTheme, Theme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    spinButtonBackgroundImage: (color: string) => string;
    scrollbarStyles: Record<string, any>;
    logo: string;
  }
  interface ThemeOptions {
    spinButtonBackgroundImage?: (color: string) => string;
    scrollbarStyles?: Record<string, any>;
    logo?: string;
  }
}

const fontFamily = '"Share Tech Mono", monospace';

function textShadow(theme: Theme, color: string): string {
  let textShadowColor = theme.palette.primary.main;
  
  switch (color) {
    case 'secondary.main':
    case 'secondary':
      textShadowColor = theme.palette.secondary.main;
      break;
    case 'warning.main':
    case 'warning':
      textShadowColor = theme.palette.warning.main;
      break;
    default:
      textShadowColor = theme.palette.primary.main;
      break;
  }
  return `0 0 4px ${textShadowColor}`;
}

export const shadowrunTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#e5c8ea",
      main: "#9c27b0",
      dark: "#6d1b7b",
      contrastText: "#000",
    },
    secondary: {
      light: "#fff3cc",
      main: "#ffc400",
      dark: "#b28900",
      contrastText: "#000",
    },
    warning: {
      light: "#f9a5c4",
      main: "#e53f7e",
      dark: "#a0204f",
      contrastText: "#000",
    },
    background: {
      default: "#121212",
    },
  },
  typography: {
    fontFamily: fontFamily,
    allVariants: {
      fontFamily: fontFamily,
    },
  },
  components: {
    MuiMenuItem:{
      styleOverrides: {
        root: ({ theme, ownerState }: { theme: Theme, ownerState: any }) => ({
            fontFamily: fontFamily,
            textShadow: textShadow(theme, ownerState.color),
            ...theme.scrollbarStyles,
        })
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }: { theme: Theme, ownerState: any }) => ({
            fontFamily: fontFamily,
            textShadow:  textShadow(theme, ownerState.color),
            ...theme.scrollbarStyles,
        })
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "primary"
      },
      styleOverrides: {
        root: ({ theme, ownerState }: { theme: Theme, ownerState: any }) => ({
            fontFamily: fontFamily,
            textShadow: textShadow(theme, ownerState.color),
            ...theme.scrollbarStyles,
        })
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.primary.main,
          fontFamily: fontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1700px", // Set the maximum width to 1700px from lg breakpoint onwards
          },
          ...theme.scrollbarStyles,
        }),
      },
    },
  },
  spinButtonBackgroundImage: (color: string) =>
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 30 12 36 18 30'></polyline><polyline points='6 18 12 12 18 18'></polyline></svg>`
    )}")`,
  scrollbarStyles: {
    "&::-webkit-scrollbar": {
      width: "0.4em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,0)",
      outline: "1px solid",
      color: (theme: Theme) => theme.palette.primary.main,
      cursor: "default !important",
    },
  },
  logo: "/src/assets/shadowrun/sr_00096_.png",
});

