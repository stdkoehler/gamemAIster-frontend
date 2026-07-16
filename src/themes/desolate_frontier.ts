import { createTheme, Theme } from "@mui/material/styles";
import {
  baseCssBaselineRules,
  getSafePaletteColor,
  inputLabelFocusMaskStyle,
  linkHoverStyle,
  resolveButtonPalette,
  spinButtonArrowSvg,
} from "./helper";

function dustyGlowShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  return `0 0 3px ${color}AA, 0 0 8px rgba(180, 110, 40, 0.35), 0 0 16px rgba(180, 110, 40, 0.12)`;
}

function sunbleachedShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  return `1px 1px 2px rgba(0,0,0,0.85), 0 0 5px ${baseColor}66`;
}

function subtleFrontierShadow(): string {
  return `0px 1px 2px rgba(0,0,0,0.8)`;
}

const frontierBodyFontFamily =
  '"Special Elite", "Courier New", "Georgia", monospace';
const frontierHeadingFontFamily = '"Rye", "Georgia", serif';
const frontierMonoFontFamily = '"Courier Prime", "Courier New", monospace';

export const desolateFrontierTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#c8a878", // sun-bleached tan
      main: "#9a7848", // weathered wood <- theme 1
      dark: "#5a4020", // dark saddle leather
      contrastText: "#f0e0c0", // dusty parchment
    },
    secondary: {
      light: "#d88838", // desert clay
      main: "#b0601a", // rust / ochre <- theme 2
      dark: "#6a3608", // dried rust
      contrastText: "#ffe8c8",
    },
    warning: {
      light: "#c89858", // cracked earth
      main: "#9a6828", // dry riverbed
      dark: "#5c3810", // dark clay
      contrastText: "#ffe8d0",
    },
    error: {
      light: "#b83828", // sun-faded blood
      main: "#821c18", // dried blood
      dark: "#4a0e08", // dark rust
      contrastText: "#ffe0d0",
    },
    info: {
      light: "#8098a8", // faded denim
      main: "#586878", // gunmetal blue
      dark: "#303c48", // shadow steel
      contrastText: "#e0e8f0",
    },
    success: {
      light: "#98a068", // sagebrush
      main: "#687838", // dry scrub
      dark: "#384818", // deep sage
      contrastText: "#eef0d8",
    },
    background: {
      default: "#100c08", // moonless prairie night
      paper: "#1e160c", // sun-baked adobe
    },
    text: {
      primary: "#e0cca0", // dusty parchment
      secondary: "#b09868", // saddle leather <. theme 3
      disabled: "#5c4c30", // faded ash
    },
  },
  typography: {
    fontFamily: frontierBodyFontFamily,
    allVariants: {
      fontFamily: frontierBodyFontFamily,
      color: "#e0cca0",
    },
    h1: {
      fontFamily: frontierHeadingFontFamily,
      fontWeight: 700,
      fontSize: "2.4rem",
      letterSpacing: "0.03em",
      margin: "0.5em 0 0.7em",
      color: "#f0e0c0",
    },
    h2: {
      fontFamily: frontierHeadingFontFamily,
      fontWeight: 600,
      letterSpacing: "0.02em",
      fontSize: "2rem",
      color: "#e0cca0",
    },
    h3: {
      fontFamily: frontierHeadingFontFamily,
      fontWeight: 500,
      fontSize: "1.7rem",
      letterSpacing: "0.02em",
      color: "#d0bc88",
    },
    h4: {
      fontFamily: frontierHeadingFontFamily,
      fontWeight: 500,
      fontSize: "1.4rem",
      letterSpacing: "0.03em",
      color: "#c0ac78",
    },
    h5: {
      fontFamily: frontierBodyFontFamily,
      fontSize: "1.2rem",
      letterSpacing: "0.02em",
      color: "#b09868",
      fontStyle: "italic",
    },
    h6: {
      fontFamily: frontierBodyFontFamily,
      fontSize: "1.1rem",
      letterSpacing: "0.01em",
      color: "#b09868",
      fontStyle: "italic",
    },
    subtitle1: {
      fontFamily: frontierBodyFontFamily,
      fontStyle: "italic",
      fontSize: "1.1rem",
      color: "#c0a878",
    },
    subtitle2: {
      fontFamily: frontierBodyFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#a08868",
    },
    button: {
      fontFamily: frontierHeadingFontFamily,
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.04em",
      color: "#f0e0c0",
    },
    body1: {
      lineHeight: 1.8,
      letterSpacing: "0.01em",
      fontSize: "1.2rem",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "1.1rem",
      color: "#b09868",
    },
    caption: {
      fontFamily: frontierMonoFontFamily,
      fontStyle: "italic",
      fontSize: "1.05rem",
      color: "#887038",
    },
    tagLabel: {
      fontSize: "1rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    },
    chatText: {
      fontFamily: frontierBodyFontFamily,
      fontSize: "1.25rem",
      lineHeight: 1.3,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...baseCssBaselineRules(),
        body: ({ theme }: { theme: Theme }) => ({
          background: `
            radial-gradient(ellipse at 50% 0%, ${theme.palette.secondary.dark}22 0%, transparent 55%),
            linear-gradient(180deg, ${theme.palette.background.default} 0%, #0a0805 100%)`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }),
        a: ({ theme }: { theme: Theme }) =>
          linkHoverStyle(
            theme.palette.secondary.light,
            theme.palette.secondary.main,
          ),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath fill='%23705828' fill-opacity='0.05' d='M0 4l4-4 4 4-4 4z'/%3E%3C/svg%3E"),
            linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F5)`,
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(200,150,70,0.06)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(180, 130, 50, 0.12)",
          borderLeft: "1px solid rgba(180, 130, 50, 0.08)",
          borderRight: "1px solid rgba(0,0,0,0.4)",
          borderBottom: "1px solid rgba(0,0,0,0.5)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}55, transparent)`,
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: frontierBodyFontFamily,
          textShadow: subtleFrontierShadow(),
          color: theme.palette.text.secondary,
          fontSize: "1.25rem",
          transition: "all 0.3s ease",
          position: "relative",
          paddingTop: "0.65rem",
          paddingBottom: "0.65rem",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "5%",
            width: "90%",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.dark}60, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            backgroundColor: `${theme.palette.secondary.dark}22`,
            color: theme.palette.text.primary,
            textShadow: dustyGlowShadow(theme, "secondary"),
            "&::after": {
              opacity: 1,
            },
          },
          "&.Mui-selected": {
            backgroundColor: `${theme.palette.secondary.dark}30`,
            color: theme.palette.secondary.light,
            "&:hover": {
              backgroundColor: `${theme.palette.secondary.dark}48`,
            },
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const buttonPalette = resolveButtonPalette(theme, ownerState.color);
          const mainColor = buttonPalette.main;
          const lightColor = buttonPalette.light;
          const contrastTextColor = buttonPalette.contrastText;

          return {
            fontFamily: frontierHeadingFontFamily,
            textShadow: subtleFrontierShadow(),
            letterSpacing: "0.03em",
            fontSize: "0.95rem",
            borderRadius: "1px",
            // Weathered board border — heavier on bottom like a nailed plank
            border: `1px solid ${mainColor}88`,
            borderBottom: `2px solid ${mainColor}55`,
            padding: "7px 20px",
            minHeight: "40px",
            color: contrastTextColor,
            position: "relative",
            overflow: "hidden",
            // Sun-bleached wood gradient
            background: `linear-gradient(180deg,
              rgba(255,255,255,0.03) 0%,
              ${mainColor}18 40%,
              ${mainColor}10 70%,
              rgba(0,0,0,0.25) 100%)`,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.05),
              inset 0 -1px 0 rgba(0,0,0,0.4),
              0 3px 6px rgba(0,0,0,0.6)`,
            // Faint dusty line at top — like sun glare on tin
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "1px",
              background: `linear-gradient(to right, transparent, ${lightColor}44, transparent)`,
              pointerEvents: "none",
            },
            "&:hover": {
              borderColor: `${lightColor}AA`,
              borderBottomColor: `${lightColor}77`,
              background: `linear-gradient(180deg, ${mainColor}30 0%, ${mainColor}20 100%)`,
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.07),
                0 0 14px ${mainColor}44,
                0 0 28px ${mainColor}18,
                0 4px 8px rgba(0,0,0,0.6)`,
              textShadow: dustyGlowShadow(theme, ownerState.color),
            },
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "primary", // this MUST stay primary, not textPrimary. We base our theme on primary.
        variantMapping: { tagLabel: "span", chatText: "div" },
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const palette = resolveButtonPalette(theme, ownerState.color);
          const mainColor = palette.main;

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith("h")
              ? sunbleachedShadow(theme, ownerState.color)
              : subtleFrontierShadow(),
          };
        },
        h1: ({ theme }) => ({
          textShadow: dustyGlowShadow(theme, "secondary"),
          position: "relative",
          "&::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "2px",
            marginTop: "0.4em",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}88, ${theme.palette.primary.main}66, ${theme.palette.secondary.main}88, transparent)`,
          },
        }),
        h2: ({ theme }) => ({
          textShadow: sunbleachedShadow(theme, "secondary"),
          position: "relative",
          "&::after": {
            content: '""',
            display: "block",
            width: "70%",
            height: "1px",
            marginTop: "0.3em",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.dark}88, transparent)`,
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontFamily: frontierBodyFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1400px",
          },
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: `${theme.palette.secondary.dark}55`,
          "&::before, &::after": {
            borderTop: `thin solid ${theme.palette.secondary.dark}55`,
          },
          "&.MuiDivider-textAlignCenter": {
            "&::before, &::after": {
              borderTop: `thin solid ${theme.palette.secondary.dark}55`,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}DD`,
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath fill='%23705828' fill-opacity='0.05' d='M0 4l4-4 4 4-4 4z'/%3E%3C/svg%3E"),
            linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F0)`,
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.75), inset 0 1px 0 rgba(200,150,70,0.06)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(180, 130, 50, 0.12)",
          borderLeft: "1px solid rgba(180, 130, 50, 0.08)",
          borderRight: "1px solid rgba(0,0,0,0.4)",
          borderBottom: "1px solid rgba(0,0,0,0.5)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.dark}55, transparent)`,
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
          fontFamily: frontierHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "1.1rem",
          textShadow: sunbleachedShadow(theme, "secondary"),
        }),
        subheader: ({ theme }) => ({
          fontFamily: frontierBodyFontFamily,
          fontStyle: "italic",
          fontSize: "0.9rem",
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: () => ({
          padding: "16px",
          "&:last-child": { paddingBottom: "16px" },
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
          background: `${theme.palette.background.default}EE`,
          boxShadow: "none",
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            margin: "16px 0",
            boxShadow: "0 3px 15px rgba(0,0,0,0.5)",
          },
          borderLeft: `2px solid ${theme.palette.secondary.dark}55`,
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.secondary.dark}44`,
          "&.Mui-expanded": {
            minHeight: 48,
            background: `${theme.palette.secondary.dark}18`,
          },
        }),
        content: () => ({
          "&.Mui-expanded": { margin: "12px 0" },
        }),
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          borderBottom: `1px solid ${theme.palette.secondary.dark}22`,
          "&::before": {
            content: '"—"',
            color: theme.palette.secondary.main,
            position: "absolute",
            left: 0,
            opacity: 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transform: "translateX(-10px)",
            fontSize: "1.1em",
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
          fontFamily: frontierHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.95rem",
          fontWeight: 600,
          textShadow: sunbleachedShadow(theme, "secondary"),
          background: `${theme.palette.primary.dark}22`,
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: frontierBodyFontFamily,
          background: "rgba(0,0,0,0.35)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(180, 130, 50, 0.18)",
          transition: "all 0.3s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.secondary.main}77, 0 0 10px ${theme.palette.secondary.main}33`,
            borderColor: `${theme.palette.secondary.main}77`,
          },
          "&:hover": {
            borderColor: `${theme.palette.secondary.dark}66`,
          },
        }),
        input: ({ ownerState, theme }) => ({
          padding: "10px 14px",
          // Matches chatText (the narrative display variant) at default
          // size so toggling a chat message between display/edit doesn't
          // shift its apparent size; the compact MAIN_SEND send-bar uses
          // MUI's "small" size to ask for the smaller variant instead.
          fontSize: ownerState.size === "small" ? "1.05rem" : "1.25rem",
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
          borderColor: "rgba(180, 130, 50, 0.2)",
          transition: "all 0.3s ease",
        }),
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.secondary.dark}77`,
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
          "&.Mui-focused": inputLabelFocusMaskStyle(theme),
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.secondary.dark}55`,
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
          fontFamily: frontierHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.9rem",
          minHeight: 48,
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.secondary.light,
            textShadow: dustyGlowShadow(theme, "secondary"),
          },
          "&.Mui-selected": {
            color: theme.palette.secondary.light,
            textShadow: dustyGlowShadow(theme, "secondary"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: frontierBodyFontFamily,
          fontSize: "0.78rem",
          background: "rgba(0,0,0,0.4)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(180, 130, 50, 0.18)",
          "&.MuiChip-colorPrimary": {
            backgroundColor: `${theme.palette.primary.main}30`,
            borderColor: `${theme.palette.primary.main}60`,
            color: theme.palette.primary.light,
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: `${theme.palette.secondary.dark}30`,
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
    spinButtonArrowSvg(color, { strokeWidth: 1.5 }),
  scrollbarStyles: (theme: Theme) => ({
    "&::-webkit-scrollbar": {
      width: "0.5em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0,0,0,0.35)",
      boxShadow: `inset 0 0 6px ${theme.palette.background.default}`,
      borderRadius: "2px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.dark + "AA",
      border: `1px solid ${theme.palette.secondary.dark}55`,
      borderRadius: "2px",
      background: `linear-gradient(45deg, ${theme.palette.primary.dark}90, ${theme.palette.secondary.dark}60)`,
      "&:hover": {
        backgroundColor: theme.palette.primary.main + "CC",
        boxShadow: `0 0 6px ${theme.palette.secondary.dark}66`,
      },
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-corner": {
      backgroundColor: theme.palette.background.default,
    },
  }),
  // Placeholder pointing at an existing generated asset until the project
  // owner drops in a purpose-made western hero image under
  // src/assets/desolate_frontier/ (see other themes' `logo` for the pattern).
  logo: "/src/assets/desolate_frontier/ComfyUI_temp_uovqn_00008_.png",
  trackColors: { low: "#687838", mid: "#9a6828", high: "#821c18" },
});
