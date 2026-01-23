import { createTheme, Theme } from "@mui/material/styles";
import { getSafePaletteColor, ThemeColorWithMain } from "./helper";

function gothicTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  return `1px 1px 2px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)"
  }, 0 0 6px ${baseColor}99`;
}

// Enhanced blood text shadow for important elements
function bloodTextShadow(theme: Theme, _?: string): string {
  const baseColor = theme.palette.primary.main; // Always use primary (blood red) for this effect
  return `0px 0px 1px rgba(0,0,0,0.7), 0 0 3px ${baseColor}99, 0 0 7px ${baseColor}60`;
}

// Subtle text shadow for body text
function subtleGothicShadow(_: Theme): string {
  return `0px 1px 2px rgba(0,0,0,0.5)`;
}

const vampireFontFamily = '"IM Fell English SC", "Georgia", serif'; // Base font for that classic vampire feel
const vampireModernFontFamily = '"Cormorant Garamond", "Georgia", serif'; // More modern elegant serif
const vampireDisplayFontFamily = '"Cinzel Decorative", serif'; // Ornate display font for headings
const vampireSansFontFamily = '"Trajan Pro", "Trajan", "Optima", sans-serif'; // Clan-like sans font
const vampireHeadingFontFamily =
  '"Merlinn", Cinzel Decorative, "IM Fell English SC", "Georgia", serif'; // Use Merlinn as primary heading font

export const vampireTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#ff6659", // Blood red, slightly brighter
      main: "#c00000", // Deep blood red
      dark: "#870000", // Dark dried blood
      contrastText: "#e6c5c1", //"#e8e6e3", // Off-white, easier on eyes than pure white
    },
    secondary: {
      light: "#c095d5", // Light purple - more vibrant for accents
      main: "#7b1fa2", // Rich purple (Lasombra/Tremere vibes)
      dark: "#4a0072", // Deep purple
      contrastText: "#d8c1e6", //"#e8e6e3", // Off-white, easier on eyes than pure white
    },
    warning: {
      light: "#ffc947", // Gold (Ventrue)
      main: "#a98f5b", // Antique gold
      dark: "#6d5a38", // Tarnished gold
      contrastText: "#e6e2c1",
    },
    error: {
      light: "#ff5252", // Brighter red
      main: "#b71c1c", // Deep crimson
      dark: "#7f0000", // Very dark red
      contrastText: "#ffffff", // White
    },
    info: {
      light: "#90a4ae", // Blueish gray
      main: "#546e7a", // Steel blue-gray (Nosferatu)
      dark: "#29434e", // Dark navy
      contrastText: "#f5f5f5",
    },
    success: {
      light: "#81c784",
      main: "#3a5741", // Forest green (Gangrel)
      dark: "#1b4032", // Deep green
      contrastText: "#f5f5f5",
    },
    background: {
      default: "#14100f", // Very dark reddish-black
      paper: "#1d1515", // Dark burgundy-black
    },
    text: {
      primary: "#e6c5c1", //"#e8e6e3", // Off-white, easier on eyes than pure white
      secondary: "#bdb3ad", // Muted cream
      disabled: "#6c5f5f", // Muted red-gray
    },
  },
  typography: {
    fontFamily: vampireModernFontFamily,
    allVariants: {
      fontFamily: vampireModernFontFamily,
      color: "#e8e6e3",
    },
    h1: {
      fontFamily: vampireHeadingFontFamily,
      fontWeight: 700,
      letterSpacing: "0.03em",
      fontSize: "2.5rem",
      margin: "0.5em 0 0.7em",
    },
    h2: {
      fontFamily: vampireDisplayFontFamily,
      fontWeight: 600,
      letterSpacing: "0.01em",
      fontSize: "2rem",
    },
    h3: {
      fontFamily: vampireSansFontFamily,
      fontWeight: 500,
      fontSize: "1.7rem",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    },
    h4: {
      fontFamily: vampireSansFontFamily,
      fontWeight: 500,
      fontSize: "1.4rem",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
    h5: {
      fontFamily: vampireFontFamily,
      fontSize: "1.2rem",
      letterSpacing: "0.03em",
    },
    h6: {
      fontFamily: vampireFontFamily,
      fontSize: "1.1rem",
      letterSpacing: "0.02em",
    },
    subtitle1: {
      fontFamily: vampireModernFontFamily,
      fontStyle: "italic",
      fontSize: "1.1rem",
    },
    subtitle2: {
      fontFamily: vampireModernFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#bdb3ad",
    },
    button: {
      fontFamily: vampireSansFontFamily,
      textTransform: "uppercase",
      fontWeight: 500,
      letterSpacing: "0.08em",
    },
    body1: {
      lineHeight: 1.7,
      letterSpacing: "0.01em",
      fontSize: "1rem",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem",
    },
    caption: {
      fontFamily: vampireModernFontFamily,
      fontStyle: "italic",
      fontSize: "0.85rem",
      color: "#9c8e87",
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": [
          {
            fontFamily: "Merlinn",
            src: 'url(/src/assets/Merlinn.ttf) format("truetype")',
            fontWeight: "normal",
            fontStyle: "normal",
          },
        ],
        "*, *::before, *::after": {
          transition:
            "background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s",
        },
        "html, body": {
          height: "100%",
          scrollBehavior: "smooth",
        },
        body: ({ theme }: { theme: Theme }) => ({
          background: `radial-gradient(circle at 50% 50%, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }),
        a: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.primary.main,
          textDecoration: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.primary.light,
            textShadow: `0 0 8px ${theme.palette.primary.light}80`,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}B3, ${theme.palette.background.default}E6)`,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(255, 255, 255, 0.07)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
          borderRight: "1px solid rgba(0, 0, 0, 0.2)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.light}4D, transparent)`,
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: vampireSansFontFamily,
          textShadow: subtleGothicShadow(theme),
          color: theme.palette.text.secondary,
          letterSpacing: "0.05em",
          fontSize: "0.9rem",
          textTransform: "uppercase",
          transition: "all 0.3s ease",
          position: "relative",
          paddingTop: "0.7rem",
          paddingBottom: "0.7rem",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "5%",
            width: "90%",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}4D, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            backgroundColor: `${theme.palette.primary.main}14`, // rgba(192, 0, 0, 0.08) equivalent
            color: theme.palette.text.primary,
            textShadow: bloodTextShadow(theme, ownerState.color),
            letterSpacing: "0.06em",
            "&::after": {
              opacity: 1,
            },
          },
          "&.Mui-selected": {
            backgroundColor: `${theme.palette.primary.main}26`, // rgba(192, 0, 0, 0.15) equivalent
            color: theme.palette.primary.light,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}40`, // rgba(192, 0, 0, 0.25) equivalent
            },
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
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
            ownerState.color !== "inherit"
              ? (ownerState.color as ThemeColorWithMain)
              : "primary";

          const buttonPalette =
            theme.palette[colorKey] || theme.palette.primary;
          const mainColor = buttonPalette.main;
          const lightColor = buttonPalette.light;
          const contrastTextColor = buttonPalette.contrastText;

          return {
            fontFamily: vampireSansFontFamily,
            textShadow: subtleGothicShadow(theme),
            letterSpacing: "0.1em",
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${mainColor}77`,
            padding: "8px 20px",
            minHeight: "44px",
            color: contrastTextColor,
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              borderColor: lightColor,
              backgroundColor: `${mainColor}26`, // Converting hex to rgba with 0.15 opacity
              boxShadow: `0 0 10px ${mainColor}55, inset 0 0 8px ${mainColor}33`,
            },
            ...theme.scrollbarStyles(theme),
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "textPrimary", // Using text.primary for better contrast
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          // if we don't overwrite color here, if color = "primary" is passed, primary.main will be used.
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
            ownerState.color !== "inherit"
              ? (ownerState.color as ThemeColorWithMain)
              : "primary";

          const buttonPalette =
            theme.palette[colorKey] || theme.palette.primary;
          const mainColor = buttonPalette.main;

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith("h")
              ? gothicTextShadow(theme, ownerState.color)
              : subtleGothicShadow(theme),
            ...theme.scrollbarStyles(theme),
          };
        },
        h1: ({ theme }) => ({
          textShadow: bloodTextShadow(theme, "primary"),
          "&::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "1px",
            marginTop: "0.2em",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}77, transparent)`,
          },
        }),
        h2: ({ theme }) => ({
          textShadow: bloodTextShadow(theme, "primary"),
          "&::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "1px",
            marginTop: "0.2em",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}55, transparent)`,
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontFamily: vampireModernFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1500px",
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: `${theme.palette.primary.main}33`, // rgba(192, 0, 0, 0.2) equivalent
          "&::before, &::after": {
            borderTop: `thin solid ${theme.palette.primary.main}33`,
          },
          "&.MuiDivider-textAlignCenter": {
            "&::before, &::after": {
              borderTop: `thin solid ${theme.palette.primary.main}33`,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}B3`,
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}B3, ${theme.palette.background.default}E6)`,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(255, 255, 255, 0.07)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
          borderRight: "1px solid rgba(0, 0, 0, 0.2)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}4D, transparent)`,
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({}) => ({
          padding: "16px 16px 0 16px",
        }),
        title: ({ theme }) => ({
          fontFamily: vampireSansFontFamily,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontSize: "1.1rem",
          textShadow: bloodTextShadow(theme, "primary"),
        }),
        subheader: ({ theme }) => ({
          fontFamily: vampireModernFontFamily,
          fontStyle: "italic",
          fontSize: "0.9rem",
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({}) => ({
          padding: "16px",
          "&:last-child": {
            paddingBottom: "16px",
          },
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({}) => ({
          padding: "8px 16px 16px 16px",
          justifyContent: "flex-end",
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `${theme.palette.background.default}CC`, // rgba(20, 12, 12, 0.8) equivalent
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "16px 0",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          },
          borderLeft: `1px solid ${theme.palette.primary.main}33`, // rgba(192, 0, 0, 0.2) equivalent
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.main}26`, // rgba(192, 0, 0, 0.15) equivalent
          "&.Mui-expanded": {
            minHeight: 48,
            background: `${theme.palette.primary.main}14`, // rgba(192, 0, 0, 0.08) equivalent
          },
        }),
        content: ({}) => ({
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          borderBottom: `1px solid ${theme.palette.primary.main}1A`, // rgba(192, 0, 0, 0.1) equivalent
          "&::before": {
            content: '"•"',
            color: theme.palette.primary.main,
            position: "absolute",
            left: 0,
            opacity: 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transform: "translateX(-8px)",
          },
          "&:hover::before": {
            opacity: 1,
            transform: "translateX(0)",
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.dark}33`,
          padding: "12px 16px",
        }),
        head: ({ theme }) => ({
          color: theme.palette.primary.light,
          fontFamily: vampireSansFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "0.9rem",
          fontWeight: 500,
          textShadow: bloodTextShadow(theme, "primary"),
          background: `${theme.palette.primary.dark}1A`, // rgba(135, 0, 0, 0.1) equivalent
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: vampireModernFontFamily,
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.primary.main}77, 0 0 8px ${theme.palette.primary.main}33`,
            borderColor: `${theme.palette.primary.main}77`,
          },
          "&:hover": {
            borderColor: `${theme.palette.primary.main}44`,
          },
        }),
        input: ({ theme }) => ({
          padding: "10px 14px",
          "&::placeholder": {
            color: theme.palette.text.disabled,
            fontStyle: "italic",
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({}) => ({
          borderColor: "rgba(255, 255, 255, 0.15)",
          transition: "all 0.3s ease",
        }),
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.primary.main}66`, // rgba(192, 0, 0, 0.4) equivalent
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.primary.main}77`,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.main}33`, // rgba(192, 0, 0, 0.2) equivalent
        }),
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          height: 2,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: vampireSansFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "0.85rem",
          minHeight: 48,
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.primary.light,
            textShadow: bloodTextShadow(theme, "primary"),
          },
          "&.Mui-selected": {
            color: theme.palette.primary.light,
            textShadow: bloodTextShadow(theme, "primary"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: vampireSansFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.75rem",
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          "&.MuiChip-colorPrimary": {
            backgroundColor: `${theme.palette.primary.main}26`, // rgba(192, 0, 0, 0.15) equivalent
            borderColor: `${theme.palette.primary.main}4D`, // rgba(192, 0, 0, 0.3) equivalent
            color: theme.palette.primary.light,
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: `${theme.palette.secondary.main}26`, // rgba(123, 31, 162, 0.15) equivalent
            borderColor: `${theme.palette.secondary.main}4D`, // rgba(123, 31, 162, 0.3) equivalent
            color: theme.palette.secondary.light,
          },
        }),
        label: ({}) => ({
          paddingLeft: 12,
          paddingRight: 12,
        }),
      },
    },
  },
  spinButtonBackgroundImage: (color) =>
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 30 L12 36 L18 30 M6 18 L12 12 L18 18'/></svg>`
    )}")`,
  scrollbarStyles: (theme: Theme) => ({
    "&::-webkit-scrollbar": {
      width: "0.5em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor:
        theme.palette.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.2)",
      boxShadow:
        theme.palette.mode === "light"
          ? "none"
          : `inset 0 0 6px ${theme.palette.background.paper}`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor:
        theme.palette.mode === "light"
          ? theme.palette.primary.main + "40" // Lighter for light mode
          : theme.palette.primary.dark + "80", // Darker for dark mode
      border:
        theme.palette.mode === "light"
          ? `1px solid ${theme.palette.primary.light + "30"}`
          : `1px solid ${theme.palette.primary.dark + "60"}`,
      borderRadius: "2px",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.primary.main + "60"
            : theme.palette.primary.dark + "AA",
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/vampire/vtm_00004_.png",
});
