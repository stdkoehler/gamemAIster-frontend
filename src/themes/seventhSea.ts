import { createTheme, Theme } from "@mui/material/styles";
import { getSafePaletteColor, ThemeColorWithMain } from "./helper";

// Specific text shadow style for a "nautical glow" effect (good for 7th Sea)
function nauticalTextShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  // A warm, lantern-like glow reminiscent of ship's lanterns
  return `0 0 2px ${color}, 0 0 6px ${color}88, 0 0 10px ${color}44`;
}

// Specific text shadow for weathered/aged effect (good for old maritime documents)
function weatheredTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  return theme.palette.mode === "dark"
    ? `1px 1px 2px rgba(0,0,0,0.8), 0 0 4px ${baseColor}66`
    : `1px 1px 3px rgba(139, 116, 85, 0.6), 0 0 6px ${baseColor}77`;
}

// Enhanced ocean text shadow for important elements
function oceanTextShadow(theme: Theme, _?: string): string {
  const baseColor = theme.palette.primary.main; // Always use primary (ocean blue) for this effect
  return `0px 0px 1px rgba(0,0,0,0.6), 0 0 4px ${baseColor}AA, 0 0 8px ${baseColor}55`;
}

// Subtle text shadow for body text
function subtleMaritimeShadow(theme: Theme): string {
  return theme.palette.mode === "dark"
    ? `0px 1px 2px rgba(0,0,0,0.7)`
    : `0px 1px 2px rgba(101, 87, 67, 0.4)`;
}

const seventhSeaFontFamily =
  '"Libre Baskerville", "Baskerville", "Times New Roman", serif'; // Base serif for readability
const seventhSeaModernFontFamily = '"Crimson Text", "Georgia", serif'; // More modern elegant serif
const seventhSeaDisplayFontFamily = '"Pirata One", "Blackadder ITC", cursive'; // Pirate-style display font
const seventhSeaSansFontFamily = '"Cinzel", "Optima", "Gill Sans", sans-serif'; // Elegant caps font for headers
const seventhSeaScriptFontFamily =
  '"Kaushan Script", "Brush Script MT", cursive'; // Handwritten script for flavor
const seventhSeaHeadingFontFamily =
  '"Pirata One", "Cinzel", "Libre Baskerville", serif'; // Primary heading font

export const seventhSeaTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#FAE4A0", // aged parchment
      main: "#D8B868", // golden parchment
      dark: "#8A6B30", // darkened edge parchment
      contrastText: "#FAE4A0", // dark ink
    },
    secondary: {
      light: "#EFB058", // treasure amber
      main: "#B75B27", // worn leather
      dark: "#5A2F18", // scorched wood
      contrastText: "#FDF3D0", // faded sailcloth
    },
    warning: {
      light: "#FFC060", // bright brass
      main: "#D68730", // aged brass
      dark: "#A04E0A",
      contrastText: "#D68730",
    },
    error: {
      light: "#D46A4C", // blood red
      main: "#7A3020", // dried blood
      dark: "#501210",
      contrastText: "#FDF3D0",
    },
    info: {
      light: "#C0A97D", // aged jungle map
      main: "#89754E", // expedition gear
      dark: "#574622",
      contrastText: "#F5F0E6",
    },
    success: {
      light: "#A8A86D", // mossy gold
      main: "#67663A", // faded foliage
      dark: "#36311C",
      contrastText: "#F5F0E6",
    },
    background: {
      default: "#13110f", // Pitch dark wood
      paper: "#1c1a17", // Aged deck planks
    },
    text: {
      primary: "#A39880", // deep ink
      secondary: "#aa8c5e", // faded brown ink
      disabled: "#5C5346", // dusted ink
    },
  },
  typography: {
    fontFamily: seventhSeaFontFamily,
    allVariants: {
      fontFamily: seventhSeaFontFamily,
      color: "#C9B896", // lantern-lit parchment
    },
    h1: {
      fontFamily: seventhSeaHeadingFontFamily,
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "0.02em",
      margin: "0.5em 0 0.7em",
      color: "#E8C97A", // golden parchment glow
    },
    h2: {
      fontFamily: seventhSeaDisplayFontFamily,
      fontWeight: 600,
      letterSpacing: "0.01em",
      fontSize: "2rem",
      color: "#DCC08A",
    },
    h3: {
      fontFamily: seventhSeaSansFontFamily,
      fontWeight: 500,
      fontSize: "1.7rem",
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      color: "#CBAE7E",
    },
    h4: {
      fontFamily: seventhSeaSansFontFamily,
      fontWeight: 500,
      fontSize: "1.4rem",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color: "#BFA378",
    },
    h5: {
      fontFamily: seventhSeaFontFamily,
      fontSize: "1.2rem",
      letterSpacing: "0.02em",
      color: "#AE9972",
    },
    h6: {
      fontFamily: seventhSeaFontFamily,
      fontSize: "1.1rem",
      letterSpacing: "0.01em",
      color: "#AE9972",
    },
    subtitle1: {
      fontFamily: seventhSeaScriptFontFamily,
      fontStyle: "normal",
      fontSize: "1.1rem",
      color: "#B89F76",
    },
    subtitle2: {
      fontFamily: seventhSeaModernFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#9A8666",
    },
    button: {
      fontFamily: seventhSeaSansFontFamily,
      textTransform: "uppercase",
      fontWeight: 500,
      letterSpacing: "0.06em",
      color: "#C9B896",
    },
    body1: {
      lineHeight: 1.7,
      letterSpacing: "0.01em",
      fontSize: "1rem",
      color: "#C9B896",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem",
      color: "#B6A37C",
    },
    caption: {
      fontFamily: seventhSeaModernFontFamily,
      fontStyle: "italic",
      fontSize: "0.85rem",
      color: "#A08868",
    },
  },

  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": [
          {
            fontFamily: "Pirata One",
            src: 'url(/src/assets/PirataOne-Regular.ttf) format("truetype")',
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
          background: `radial-gradient(ellipse at top, ${theme.palette.primary.dark}22 0%, transparent 50%),
            radial-gradient(ellipse at bottom, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }),
        a: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.secondary.main,
          textDecoration: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.secondary.light,
            textShadow: `0 0 8px ${theme.palette.secondary.light}80`,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(135deg, ${theme.palette.background.paper}CC, ${theme.palette.background.default}E6)`,
          boxShadow:
            "0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(245, 243, 240, 0.08)",
          borderLeft: "1px solid rgba(245, 243, 240, 0.06)",
          borderRight: "1px solid rgba(0, 0, 0, 0.3)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}60, transparent)`,
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: seventhSeaSansFontFamily,
          textShadow: subtleMaritimeShadow(theme),
          color: theme.palette.text.secondary,
          letterSpacing: "0.04em",
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
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}60, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            backgroundColor: `${theme.palette.primary.main}18`,
            color: theme.palette.text.primary,
            textShadow: nauticalTextShadow(theme, ownerState.color),
            letterSpacing: "0.05em",
            "&::after": {
              opacity: 1,
            },
          },
          "&.Mui-selected": {
            backgroundColor: `${theme.palette.primary.main}30`,
            color: theme.palette.primary.light,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}48`,
            },
          },
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
            // Pirata One gives that unmistakable pirate scroll/broadside feel
            fontFamily: seventhSeaDisplayFontFamily,
            textShadow: subtleMaritimeShadow(theme),
            letterSpacing: "0.04em",
            fontSize: "0.9rem",
            borderRadius: "2px",
            // Main border + heavier bottom like a carved-wood plank edge
            border: `1px solid ${mainColor}99`,
            borderBottom: `2px solid ${mainColor}66`,
            padding: "7px 20px",
            minHeight: "40px",
            color: contrastTextColor,
            position: "relative",
            overflow: "hidden",
            // Aged wood gradient: subtle highlight at top, dark at bottom
            background: `linear-gradient(180deg,
              rgba(255,255,255,0.04) 0%,
              ${mainColor}1A 30%,
              ${mainColor}14 70%,
              rgba(0,0,0,0.2) 100%)`,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.07),
              inset 0 -1px 0 rgba(0,0,0,0.3),
              0 2px 5px rgba(0,0,0,0.5)`,
            // Faint gold trim line at top, like brass fittings
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "12%",
              right: "12%",
              height: "1px",
              background: `linear-gradient(to right, transparent, ${lightColor}55, transparent)`,
              pointerEvents: "none",
            },
            "&:hover": {
              borderColor: `${lightColor}BB`,
              borderBottomColor: `${lightColor}88`,
              background: `linear-gradient(180deg, ${mainColor}33 0%, ${mainColor}22 100%)`,
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.1),
                0 0 16px ${mainColor}55,
                0 0 30px ${mainColor}22,
                0 3px 8px rgba(0,0,0,0.5)`,
              textShadow: nauticalTextShadow(theme, ownerState.color),
            },
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "textPrimary",
      },
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

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith("h")
              ? weatheredTextShadow(theme, ownerState.color)
              : subtleMaritimeShadow(theme),
          };
        },
        h1: ({ theme }) => ({
          textShadow: oceanTextShadow(theme, "primary"),
          position: "relative",
          "&::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "2px",
            marginTop: "0.3em",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}88, ${theme.palette.primary.main}66, ${theme.palette.secondary.main}88, transparent)`,
          },
        }),
        h2: ({ theme }) => ({
          textShadow: oceanTextShadow(theme, "secondary"),
          position: "relative",
          "&::after": {
            content: '""',
            display: "block",
            width: "80%",
            height: "1px",
            marginTop: "0.2em",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}77, transparent)`,
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontFamily: seventhSeaFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1500px",
          },
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: `${theme.palette.secondary.main}44`,
          "&::before, &::after": {
            borderTop: `thin solid ${theme.palette.secondary.main}44`,
          },
          "&.MuiDivider-textAlignCenter": {
            "&::before, &::after": {
              borderTop: `thin solid ${theme.palette.secondary.main}44`,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}CC`,
          backgroundImage: `
            linear-gradient(135deg, ${theme.palette.background.paper}CC, ${theme.palette.background.default}E6),
            linear-gradient(45deg, transparent 40%, ${theme.palette.secondary.main}08 50%, transparent 60%)
          `,
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 6px 25px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(245, 243, 240, 0.1)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(245, 243, 240, 0.08)",
          borderLeft: "1px solid rgba(245, 243, 240, 0.06)",
          borderRight: "1px solid rgba(0, 0, 0, 0.3)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.4)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}60, transparent)`,
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: () => ({
          padding: "16px 16px 0 16px",
        }),
        title: ({ theme }) => ({
          fontFamily: seventhSeaSansFontFamily,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontSize: "1.1rem",
          textShadow: oceanTextShadow(theme, "primary"),
        }),
        subheader: ({ theme }) => ({
          fontFamily: seventhSeaScriptFontFamily,
          fontStyle: "normal",
          fontSize: "0.95rem",
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: () => ({
          padding: "16px",
          "&:last-child": {
            paddingBottom: "16px",
          },
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: () => ({
          padding: "8px 16px 16px 16px",
          justifyContent: "flex-end",
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `${theme.palette.background.default}DD`,
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "16px 0",
            boxShadow: "0 3px 15px rgba(0, 0, 0, 0.4)",
          },
          borderLeft: `2px solid ${theme.palette.secondary.main}44`,
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.secondary.main}33`,
          "&.Mui-expanded": {
            minHeight: 48,
            background: `${theme.palette.primary.main}18`,
          },
        }),
        content: () => ({
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
          borderBottom: `1px solid ${theme.palette.secondary.main}22`,
          "&::before": {
            content: '"⚓"',
            color: theme.palette.secondary.main,
            position: "absolute",
            left: 0,
            opacity: 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transform: "translateX(-12px)",
            fontSize: "0.8em",
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
          borderBottom: `1px solid ${theme.palette.primary.dark}44`,
          padding: "12px 16px",
        }),
        head: ({ theme }) => ({
          color: theme.palette.secondary.light,
          fontFamily: seventhSeaSansFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.9rem",
          fontWeight: 500,
          textShadow: oceanTextShadow(theme, "secondary"),
          background: `${theme.palette.primary.dark}22`,
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: seventhSeaFontFamily,
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(245, 243, 240, 0.15)",
          transition: "all 0.3s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.secondary.main}88, 0 0 10px ${theme.palette.secondary.main}44`,
            borderColor: `${theme.palette.secondary.main}88`,
          },
          "&:hover": {
            borderColor: `${theme.palette.secondary.main}55`,
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
        notchedOutline: () => ({
          borderColor: "rgba(245, 243, 240, 0.2)",
          transition: "all 0.3s ease",
        }),
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.secondary.main}77`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.secondary.main}88`,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-focused": {
            // Left at the same color as the unfocused label — the focus
            // accent below is for the input itself, not its caption.
            color: theme.palette.text.primary,
            // MuiInputBase's own focus glow is a blurred box-shadow that
            // bleeds outward in every direction, including up into the
            // floating label sitting right on the border line. An opaque
            // backdrop behind just the label text masks that bleed (same
            // idea as the outline's own notch, which only masks the border
            // stroke, not the glow) so the label reads plainly instead of
            // looking like it shares the glow.
            backgroundColor: theme.palette.background.default,
            padding: "0 4px",
            borderRadius: theme.shape.borderRadius,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.secondary.main}44`,
        }),
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.main,
          height: 2,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: seventhSeaSansFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "0.85rem",
          minHeight: 48,
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.secondary.light,
            textShadow: nauticalTextShadow(theme, "secondary"),
          },
          "&.Mui-selected": {
            color: theme.palette.secondary.light,
            textShadow: nauticalTextShadow(theme, "secondary"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: seventhSeaSansFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontSize: "0.75rem",
          background: "rgba(0, 0, 0, 0.4)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(245, 243, 240, 0.15)",
          "&.MuiChip-colorPrimary": {
            backgroundColor: `${theme.palette.primary.main}30`,
            borderColor: `${theme.palette.primary.main}60`,
            color: theme.palette.primary.light,
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: `${theme.palette.secondary.main}30`,
            borderColor: `${theme.palette.secondary.main}60`,
            color: theme.palette.secondary.light,
          },
        }),
        label: () => ({
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
  scrollbarStyles: (theme) => ({
    "&::-webkit-scrollbar": {
      width: "0.5em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor:
        theme.palette.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.3)",
      boxShadow:
        theme.palette.mode === "light"
          ? "none"
          : `inset 0 0 6px ${theme.palette.background.paper}`,
      borderRadius: "2px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor:
        theme.palette.mode === "light"
          ? theme.palette.secondary.main + "50" // Amber for light mode
          : theme.palette.secondary.dark + "90", // Darker amber for dark mode
      border:
        theme.palette.mode === "light"
          ? `1px solid ${theme.palette.secondary.light + "40"}`
          : `1px solid ${theme.palette.secondary.dark + "70"}`,
      borderRadius: "2px",
      background:
        theme.palette.mode === "light"
          ? `linear-gradient(45deg, ${theme.palette.secondary.main}60, ${theme.palette.secondary.light}40)`
          : `linear-gradient(45deg, ${theme.palette.secondary.dark}80, ${theme.palette.secondary.main}60)`,
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.secondary.main + "70"
            : theme.palette.secondary.main + "CC",
        boxShadow: `0 0 4px ${theme.palette.secondary.main}66`,
      },
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-corner": {
      backgroundColor: theme.palette.background.default,
    },
  }),
  logo: "/src/assets/seventh_sea/ComfyUI_temp_kokjp_00005_.png",
  trackColors: { low: "#4a8a6a", mid: "#d68730", high: "#7a3020" },
});
