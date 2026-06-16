import { createTheme, Theme } from "@mui/material/styles";
import { getSafePaletteColor, ThemeColorWithMain } from "./helper";

function firelightTextShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  return `0 0 3px ${color}AA, 0 0 8px rgba(200, 96, 20, 0.4), 0 0 16px rgba(200, 96, 20, 0.15)`;
}

function runicGlowShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  return `1px 1px 3px rgba(0,0,0,0.9), 0 0 6px ${baseColor}77, 0 0 12px ${baseColor}33`;
}

function subtleSlavicShadow(): string {
  return `0px 1px 2px rgba(0,0,0,0.8)`;
}

const slavicBodyFontFamily = '"IM Fell English", "Georgia", "Times New Roman", serif';
const slavicHeadingFontFamily = '"Uncial Antiqua", "Georgia", serif';
const slavicMonoFontFamily = '"Courier Prime", "Courier New", monospace';

export const slavicTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#a8b8b0", // polished iron
      main: "#6a7e78",  // aged iron
      dark: "#3a4e48",  // dark iron
      contrastText: "#e8d8b0", // aged linen
    },
    secondary: {
      light: "#e8901a", // bright flame
      main: "#c06818",  // ember glow
      dark: "#7a3a0a",  // dying coal
      contrastText: "#ffe8c0", // candlelight
    },
    warning: {
      light: "#c8905a", // river clay
      main: "#9a6030",  // dried mud
      dark: "#683808",  // dark earth
      contrastText: "#ffe8d0",
    },
    error: {
      light: "#c04040", // fresh blood
      main: "#8a1818",  // dried blood
      dark: "#500808",  // dark maroon
      contrastText: "#ffe0d0",
    },
    info: {
      light: "#7aa8b8", // clear river
      main: "#507888",  // deep river
      dark: "#284858",  // river depth
      contrastText: "#d8f0f8",
    },
    success: {
      light: "#70a870", // pine needle
      main: "#3a7a3a",  // deep forest
      dark: "#185018",  // old growth
      contrastText: "#d0f0d0",
    },
    background: {
      default: "#0d0b07", // forest night
      paper: "#1a1508",   // smoldering hearth
    },
    text: {
      primary: "#d8c898",   // aged linen
      secondary: "#a89870", // worn leather
      disabled: "#584828",  // faded ash
    },
  },
  typography: {
    fontFamily: slavicBodyFontFamily,
    allVariants: {
      fontFamily: slavicBodyFontFamily,
      color: "#d8c898",
    },
    h1: {
      fontFamily: slavicHeadingFontFamily,
      fontWeight: 700,
      fontSize: "2.4rem",
      letterSpacing: "0.03em",
      margin: "0.5em 0 0.7em",
      color: "#e8d8b0",
    },
    h2: {
      fontFamily: slavicHeadingFontFamily,
      fontWeight: 600,
      letterSpacing: "0.02em",
      fontSize: "2rem",
      color: "#d8c898",
    },
    h3: {
      fontFamily: slavicHeadingFontFamily,
      fontWeight: 500,
      fontSize: "1.7rem",
      letterSpacing: "0.02em",
      color: "#c8b880",
    },
    h4: {
      fontFamily: slavicHeadingFontFamily,
      fontWeight: 500,
      fontSize: "1.4rem",
      letterSpacing: "0.03em",
      color: "#b8a870",
    },
    h5: {
      fontFamily: slavicBodyFontFamily,
      fontSize: "1.2rem",
      letterSpacing: "0.02em",
      color: "#a89870",
      fontStyle: "italic",
    },
    h6: {
      fontFamily: slavicBodyFontFamily,
      fontSize: "1.1rem",
      letterSpacing: "0.01em",
      color: "#a89870",
      fontStyle: "italic",
    },
    subtitle1: {
      fontFamily: slavicBodyFontFamily,
      fontStyle: "italic",
      fontSize: "1.1rem",
      color: "#b8a070",
    },
    subtitle2: {
      fontFamily: slavicBodyFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#988860",
    },
    button: {
      fontFamily: slavicHeadingFontFamily,
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.04em",
      color: "#e8d8b0",
    },
    body1: {
      lineHeight: 1.8,
      letterSpacing: "0.01em",
      fontSize: "1rem",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem",
      color: "#a89870",
    },
    caption: {
      fontFamily: slavicMonoFontFamily,
      fontStyle: "italic",
      fontSize: "0.85rem",
      color: "#806848",
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": {
          transition:
            "background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s",
        },
        "html, body": {
          height: "100%",
          scrollBehavior: "smooth",
        },
        body: ({ theme }: { theme: Theme }) => ({
          background: `
            radial-gradient(ellipse at 50% 0%, ${theme.palette.secondary.dark}22 0%, transparent 55%),
            linear-gradient(180deg, ${theme.palette.background.default} 0%, #080604 100%)`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }),
        a: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.secondary.light,
          textDecoration: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.secondary.main,
            textShadow: `0 0 8px ${theme.palette.secondary.main}80`,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Cpath fill='%23604020' fill-opacity='0.04' d='M0 0h3v3H0zm3 3h3v3H3z'/%3E%3C/svg%3E"),
            linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F5)`,
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(220,180,80,0.07)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(200, 150, 60, 0.12)",
          borderLeft: "1px solid rgba(200, 150, 60, 0.08)",
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
          fontFamily: slavicBodyFontFamily,
          textShadow: subtleSlavicShadow(),
          color: theme.palette.text.secondary,
          fontSize: "0.95rem",
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
            textShadow: firelightTextShadow(theme, "secondary"),
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
          const colorKey =
            ownerState.color &&
            ["primary", "secondary", "error", "warning", "info", "success"].includes(
              ownerState.color,
            ) &&
            ownerState.color !== "inherit"
              ? (ownerState.color as ThemeColorWithMain)
              : "primary";

          const buttonPalette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = buttonPalette.main;
          const lightColor = buttonPalette.light;
          const contrastTextColor = buttonPalette.contrastText;

          return {
            fontFamily: slavicHeadingFontFamily,
            textShadow: subtleSlavicShadow(),
            letterSpacing: "0.03em",
            fontSize: "0.95rem",
            borderRadius: "1px",
            // Carved plank border — heavier on bottom like chiseled wood
            border: `1px solid ${mainColor}88`,
            borderBottom: `2px solid ${mainColor}55`,
            padding: "7px 20px",
            minHeight: "40px",
            color: contrastTextColor,
            position: "relative",
            overflow: "hidden",
            // Charred wood grain gradient
            background: `linear-gradient(180deg,
              rgba(255,255,255,0.03) 0%,
              ${mainColor}18 40%,
              ${mainColor}10 70%,
              rgba(0,0,0,0.25) 100%)`,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.05),
              inset 0 -1px 0 rgba(0,0,0,0.4),
              0 3px 6px rgba(0,0,0,0.6)`,
            // Faint ember line at top — like iron fittings
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
              textShadow: firelightTextShadow(theme, ownerState.color),
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
            ["primary", "secondary", "error", "warning", "info", "success"].includes(
              ownerState.color,
            ) &&
            ownerState.color !== "inherit"
              ? (ownerState.color as ThemeColorWithMain)
              : "primary";

          const palette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = palette.main;

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith("h")
              ? runicGlowShadow(theme, ownerState.color)
              : subtleSlavicShadow(),
          };
        },
        h1: ({ theme }) => ({
          textShadow: firelightTextShadow(theme, "secondary"),
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
          textShadow: runicGlowShadow(theme, "secondary"),
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
          fontFamily: slavicBodyFontFamily,
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
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Cpath fill='%23604020' fill-opacity='0.04' d='M0 0h3v3H0zm3 3h3v3H3z'/%3E%3C/svg%3E"),
            linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F0)`,
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.75), inset 0 1px 0 rgba(220,180,80,0.07)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(200, 150, 60, 0.12)",
          borderLeft: "1px solid rgba(200, 150, 60, 0.08)",
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
          fontFamily: slavicHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "1.1rem",
          textShadow: runicGlowShadow(theme, "secondary"),
        }),
        subheader: ({ theme }) => ({
          fontFamily: slavicBodyFontFamily,
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
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          borderBottom: `1px solid ${theme.palette.secondary.dark}22`,
          "&::before": {
            content: '"᛫"',
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
          fontFamily: slavicHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.95rem",
          fontWeight: 600,
          textShadow: runicGlowShadow(theme, "secondary"),
          background: `${theme.palette.primary.dark}22`,
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: slavicBodyFontFamily,
          background: "rgba(0,0,0,0.35)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(200, 150, 60, 0.18)",
          transition: "all 0.3s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.secondary.main}77, 0 0 10px ${theme.palette.secondary.main}33`,
            borderColor: `${theme.palette.secondary.main}77`,
          },
          "&:hover": {
            borderColor: `${theme.palette.secondary.dark}66`,
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
          borderColor: "rgba(200, 150, 60, 0.2)",
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
          fontFamily: slavicHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.9rem",
          minHeight: 48,
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.secondary.light,
            textShadow: firelightTextShadow(theme, "secondary"),
          },
          "&.Mui-selected": {
            color: theme.palette.secondary.light,
            textShadow: firelightTextShadow(theme, "secondary"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: slavicBodyFontFamily,
          fontSize: "0.78rem",
          background: "rgba(0,0,0,0.4)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(200, 150, 60, 0.18)",
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
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 30 L12 36 L18 30 M6 18 L12 12 L18 18'/></svg>`,
    )}")`,
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
  logo: "/src/assets/seventh_sea/ComfyUI_temp_kokjp_00005_.png",
});
