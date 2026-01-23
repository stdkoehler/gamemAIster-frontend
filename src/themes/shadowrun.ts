import { createTheme, Theme } from "@mui/material/styles";
import { getSafePaletteColor, ThemeColorWithMain } from "./helper";

function neonTextShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  return `0 0 1px ${color}, 0 0 4px ${color}, 0 0 12px ${color}`;
}

const defaultMonospaceFontFamily =
  '"Share Tech Mono", "Courier New", monospace';

export const shadowrunTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#f392ff", // #f392ff
      main: "#d500f9", // #d500f9
      dark: "#9e00c5", // #9e00c5
      contrastText: "#f392ff", // #f392ff
    },
    secondary: {
      light: "#fff350", // #fff350
      main: "#ffc400", // #ffc400
      dark: "#b28900", // #b28900
      contrastText: "#fff350", // #fff350
    },
    warning: {
      light: "#ffac42", // #ffac42
      main: "#ff7f00", // #ff7f00 ; Vibrant orange
      dark: "#c55e00", // #c55e00
      contrastText: "#000000", // #000000
    },
    error: {
      light: "#ff6f6f", // #ff6f6f
      main: "#ff0000", // #ff0000
      dark: "#c70000", // #c70000
      contrastText: "#ffffff", // #ffffff
    },
    info: {
      light: "#6effff", // #6effff
      main: "#00e5ff", // #00e5ff
      dark: "#00b2cc", // #00b2cc
      contrastText: "#000000", // #000000
    },
    success: {
      light: "#76ff03", // #76ff03
      main: "#4caf50", // #4caf50
      dark: "#00701a", // #00701a
      contrastText: "#000000", // #000000
    },
    background: {
      default: "#0c0c0f", // #0c0c0f ; Was #121212 in user theme
      paper: "#1a1a1f", // #1a1a1f
    },
    text: {
      primary: "#e0e0e0", // #e0e0e0
      secondary: "#a0a0a0", // #a0a0a0
      disabled: "#616161", // #616161
    },
  },
  typography: {
    fontFamily: defaultMonospaceFontFamily,
    allVariants: {
      fontFamily: defaultMonospaceFontFamily,
      color: "#e0e0e0",
    },
    h1: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "2.3rem",
      color: "#f392ff",
    },
    h2: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "1.8rem",
      color: "#d500f9",
    },
    h3: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 600,
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      fontSize: "1.4rem",
      color: "#ffc400",
    },
    h4: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 500,
      fontSize: "1.15rem",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "#fff350",
    },
    h5: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 500,
      fontSize: "1.05rem",
      letterSpacing: "0.03em",
      color: "#a0a0a0",
    },
    h6: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 500,
      fontSize: "0.95rem",
      letterSpacing: "0.02em",
      color: "#a0a0a0",
    },
    subtitle1: {
      fontFamily: defaultMonospaceFontFamily,
      fontStyle: "italic",
      fontSize: "1.05rem",
      color: "#e0e0e0",
    },
    subtitle2: {
      fontFamily: defaultMonospaceFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#a0a0a0",
    },
    button: {
      fontFamily: defaultMonospaceFontFamily,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 600,
      fontSize: "1rem",
      color: "#fff350",
    },
    body1: {
      lineHeight: 1.7,
      letterSpacing: "0.01em",
      fontSize: "1rem",
      color: "#e0e0e0",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem",
      color: "#a0a0a0",
    },
    caption: {
      fontFamily: defaultMonospaceFontFamily,
      fontStyle: "italic",
      fontSize: "0.85rem",
      color: "#616161",
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: defaultMonospaceFontFamily,
          textShadow: neonTextShadow(theme, ownerState.color || "primary"), // ownerState.color is not standard on MenuItem, will use 'primary'
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark + "66",
            color: theme.palette.primary.light,
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          // Determine the color key safely, defaulting to 'primary'
          const colorKey =
            ownerState.color &&
            [
              "primary",
              "secondary",
              "error",
              "warning",
              "info",
              "success",
            ].includes(ownerState.color) &&
            ownerState.color !== "inherit" // Exclude 'inherit' from direct palette key usage
              ? (ownerState.color as ThemeColorWithMain)
              : "primary";

          const buttonPalette =
            theme.palette[colorKey] || theme.palette.primary;
          const mainColor =
            (buttonPalette as any).main || theme.palette.primary.main;
          const lightColor =
            (buttonPalette as any).light || theme.palette.primary.light;
          // For button text color, prioritize contrastText. If not suitable, use the main color itself (might need adjustment based on bg)
          const textColor =
            (buttonPalette as any).contrastText &&
            (buttonPalette as any).contrastText !== "#000000" &&
            (buttonPalette as any).contrastText !== "#000"
              ? (buttonPalette as any).contrastText
              : mainColor;

          return {
            fontFamily: defaultMonospaceFontFamily,
            textShadow: neonTextShadow(theme, ownerState.color), // ownerState.color is ButtonProps['color']
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: mainColor + "33",
            boxShadow: `0 0 5px ${mainColor}33`,
            borderRadius: "2px",
            padding: "6px 18px",
            color: textColor,
            "&:hover": {
              borderColor: lightColor + "33",
              backgroundColor: mainColor + "33", // 33 specifies opacity in hex 0x33 = 0.2
              boxShadow: `0 0 10px ${mainColor}99`, // 99 specifies opacity in hex 0x99 = 0.6
            },
            ...theme.scrollbarStyles(theme),
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        // User's original had "primary", my suggestion "textPrimary".
        // Let's stick to user's original for this part, though "textPrimary" is often better.
        color: "primary",
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          // ownerState.color for Typography can be 'primary', 'textPrimary', 'error', etc.
          textShadow: neonTextShadow(theme, ownerState.color),
          // If defaultProps.color is "primary", ownerState.color will be "primary".
          // If it's explicitly set e.g. <Typography color="textSecondary">, ownerState.color is "textSecondary".
          // getSafePaletteColor will handle these.
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontFamily: defaultMonospaceFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1700px",
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
  },
  spinButtonBackgroundImage: (
    color // `color` here is expected to be a valid CSS color string
  ) =>
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 30 12 36 18 30'></polyline><polyline points='6 18 12 12 18 18'></polyline></svg>`
    )}")`,
  scrollbarStyles: (theme: Theme) => ({
    "&::-webkit-scrollbar": {
      width: "0.4em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: `inset 0 0 6px ${theme.palette.background.default}`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.background.default,
      outline: "1px solid",
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark + "AA",
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/shadowrun/sr_00096_.png", // User's original logo
});
