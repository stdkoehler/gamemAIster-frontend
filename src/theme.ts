import { createTheme, Theme } from "@mui/material";

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

export const darkTheme = createTheme({
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
        })
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }: { theme: Theme, ownerState: any }) => ({
            fontFamily: fontFamily,
            textShadow:  textShadow(theme, ownerState.color),
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
            "&::-webkit-scrollbar": {
              width: "0.4em",
              cursor: "default !important",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              outline: "1px solid",
              color: theme.palette.primary.dark,
              cursor: "default !important",
            },
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
          "&::-webkit-scrollbar": {
            width: "0.4em",
            cursor: "default !important",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            outline: "1px solid",
            color: theme.palette.primary.dark,
            cursor: "default !important",
          },
        }),
      },
    },
  },
});
