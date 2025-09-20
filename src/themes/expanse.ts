import { createTheme, Theme } from "@mui/material/styles";
import { ThemeColorWithMain } from "./helper";

// Sci-fi glow text shadow for futuristic elements
function techGlowShadow(theme: Theme): string {
  const baseColor = theme.palette.info.light;
  return `0 0 2px ${baseColor}DD, 0 0 8px ${baseColor}99, 0 0 12px ${baseColor}55`;
}

// Enhanced holographic text shadow for important elements
function holoTextShadow(theme: Theme, _?: string): string {
  const baseColor = theme.palette.info.light; // Use cyan-blue for holo effect
  const lightColor = theme.palette.info.light; // Lighter shade for glow
  return `0 0 2px ${lightColor}, 0 0 4px ${baseColor}CC, 0 0 8px ${baseColor}77, 0 0 12px ${baseColor}44`;
}

// Subtle tech shadow for body text
function subtleTechShadow(theme: Theme): string {
  return `0 1px 3px rgba(0,0,0,0.6), 0 0 1px ${theme.palette.info.main}33`;
}

const expanseModernFontFamily =
  '"Orbitron", "Roboto Condensed", "Arial", sans-serif'; // Primary sci-fi font
const expanseDisplayFontFamily = '"Audiowide", "Orbitron", sans-serif'; // Bold display font for headings
const expanseBodyFontFamily = '"Roboto", "Arial", sans-serif'; // Clean readable font for body text
const expanseMonoFontFamily = '"Roboto Mono", "Courier New", monospace'; // Monospace for tech/data displays
const expanseHeadingFontFamily = '"Exo 2", "Audiowide", "Orbitron", sans-serif'; // Main heading font

export const expanseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#a389d0", // Ion thruster glow
      main: "#70609c", // Protomolecule activation purple
      dark: "#4b3b94", // Uranus station at twilight
      contrastText: "#ede7f6", // Ceres station lighting
    },
    secondary: {
      light: "#ffb74d", // Orange (Mars)
      main: "#f57c00", // Deep orange
      dark: "#e65100", // Burnt orange
      contrastText: "#fff3e0",
    },
    warning: {
      light: "#e57373", // Light red
      main: "#d32f2f", // Alert red
      dark: "#c62828", // Dark red
      contrastText: "#ffffff",
    },
    error: {
      light: "#e57373", // Light red
      main: "#d32f2f", // Alert red
      dark: "#c62828", // Dark red
      contrastText: "#ffffff",
    },
    info: {
      light: "#7c4dff", // Luminous purple (ionized particles)
      main: "#5e35b1", // Core "protomolecule" glow (deep but vibrant)
      dark: "#311b92", // Shadowed radiation (ultra-deep purple)
      contrastText: "#ede7f6", // Soft violet-white (readable on all states)
    },
    success: {
      light: "#81c784",
      main: "#388e3c", // System green
      dark: "#1b5e20",
      contrastText: "#e8f5e8",
    },
    background: {
      default: "#0c071b", // Deep cosmic void (almost black with purple undertones)
      paper: "#1e1038", // Dark "Rocinante hull" purple-gray (elevated surfaces)
    },
    text: {
      primary: "#f3e5f5", // Soft violet-white (like Ceres station lighting)
      secondary: "#b39ddb", // Dusty lavender (muted but legible)
      disabled: "#5e35b1", // Deep purple with 30% opacity (suggest "disabled" state)
    },
  },
  typography: {
    fontFamily: expanseBodyFontFamily,
    allVariants: {
      fontFamily: expanseBodyFontFamily,
      color: "#e1f5fe",
    },
    h1: {
      fontFamily: expanseHeadingFontFamily,
      fontWeight: 700,
      letterSpacing: "0.02em",
      fontSize: "1.8rem",
      margin: "0.5em 0 0.7em",
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: expanseDisplayFontFamily,
      fontWeight: 600,
      letterSpacing: "0.05em",
      fontSize: "2.2rem",
      textTransform: "uppercase",
    },
    h3: {
      fontFamily: expanseModernFontFamily,
      fontWeight: 500,
      fontSize: "1.8rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    h4: {
      fontFamily: expanseModernFontFamily,
      fontWeight: 500,
      fontSize: "1.5rem",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
    h5: {
      fontFamily: expanseModernFontFamily,
      fontSize: "1.3rem",
      letterSpacing: "0.04em",
      fontWeight: 400,
    },
    h6: {
      fontFamily: expanseModernFontFamily,
      fontSize: "1.1rem",
      letterSpacing: "0.03em",
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: expanseBodyFontFamily,
      fontSize: "1.1rem",
      fontWeight: 300,
    },
    subtitle2: {
      fontFamily: expanseBodyFontFamily,
      fontSize: "0.95rem",
      color: "#90caf9",
      fontWeight: 300,
    },
    button: {
      fontFamily: expanseModernFontFamily,
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.1em",
    },
    body1: {
      lineHeight: 1.6,
      letterSpacing: "0.02em",
      fontSize: "1rem",
      fontFamily: expanseBodyFontFamily,
    },
    body2: {
      lineHeight: 1.5,
      fontSize: "0.9rem",
      fontFamily: expanseBodyFontFamily,
    },
    caption: {
      fontFamily: expanseMonoFontFamily,
      fontSize: "0.8rem",
      color: "#546e7a",
      letterSpacing: "0.03em",
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": [
          {
            fontFamily: "Exo 2",
            src: 'url(/src/assets/Exo2-Regular.ttf) format("truetype")',
            fontWeight: "normal",
            fontStyle: "normal",
          },
        ],
        "*, *::before, *::after": {
          transition:
            "background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s",
        },
        "html, body": {
          height: "100%",
          scrollBehavior: "smooth",
        },
        body: ({ theme }: { theme: Theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #0d1117 50%, ${theme.palette.background.paper} 100%)`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at 25% 25%, rgba(1, 87, 155, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(56, 142, 60, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
            zIndex: -1,
          },
        }),
        a: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.primary.light,
          textDecoration: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            color: theme.palette.info.light,
            textShadow: `0 0 8px ${theme.palette.info.light}80`,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(135deg, ${theme.palette.background.paper}E6, ${theme.palette.background.default}CC)`,
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}66, transparent)`,
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: expanseModernFontFamily,
          textShadow: subtleTechShadow(theme),
          color: theme.palette.text.secondary,
          letterSpacing: "0.06em",
          fontSize: "0.85rem",
          textTransform: "uppercase",
          transition: "all 0.2s ease",
          position: "relative",
          paddingTop: "0.8rem",
          paddingBottom: "0.8rem",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "8%",
            width: "84%",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}55, transparent)`,
            opacity: 0,
            transition: "opacity 0.2s ease",
          },
          "&:hover": {
            backgroundColor: `${theme.palette.info.main}18`,
            color: theme.palette.text.primary,
            textShadow: techGlowShadow(theme, ownerState.color),
            letterSpacing: "0.08em",
            "&::after": {
              opacity: 1,
            },
          },
          "&.Mui-selected": {
            backgroundColor: `${theme.palette.info.main}2A`,
            color: theme.palette.info.light,
            "&:hover": {
              backgroundColor: `${theme.palette.info.main}40`,
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
            fontFamily: expanseModernFontFamily,
            textShadow: subtleTechShadow(theme),
            letterSpacing: "0.12em",
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${mainColor}88`,
            padding: "10px 24px",
            minHeight: "44px",
            color: contrastTextColor,
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${mainColor}22, ${mainColor}11)`,
            "&:hover": {
              borderColor: lightColor,
              backgroundColor: `${mainColor}33`,
              boxShadow: `0 0 16px ${mainColor}66, inset 0 0 12px ${mainColor}22`,
              textShadow: `0 0 8px ${lightColor}88`,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${lightColor}33, transparent)`,
              transition: "left 0.5s ease",
            },
            "&:hover::before": {
              left: "100%",
            },
            ...theme.scrollbarStyles(theme),
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

          const palette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = palette.main;

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith("h")
              ? techGlowShadow(theme, ownerState.color)
              : subtleTechShadow(theme),
            ...theme.scrollbarStyles(theme),
          };
        },
        h1: ({ theme }) => ({
          textShadow: holoTextShadow(theme, "info"),
          "&::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "2px",
            marginTop: "0.3em",
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}AA, ${theme.palette.primary.main}AA, transparent)`,
          },
        }),
        h2: ({ theme }) => ({
          textShadow: holoTextShadow(theme, "info"),
          "&::after": {
            content: '""',
            display: "block",
            width: "80%",
            height: "1px",
            marginTop: "0.3em",
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}77, transparent)`,
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontFamily: expanseBodyFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1400px",
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: `${theme.palette.info.main}44`,
          "&::before, &::after": {
            borderTop: `thin solid ${theme.palette.info.main}44`,
          },
          "&.MuiDivider-textAlignCenter": {
            "&::before, &::after": {
              borderTop: `thin solid ${theme.palette.info.main}44`,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}DD`,
          backgroundImage: `linear-gradient(135deg, ${theme.palette.background.paper}E6, ${theme.palette.background.default}CC)`,
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}77, transparent)`,
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({}) => ({
          padding: "20px 20px 0 20px",
        }),
        title: ({ theme }) => ({
          fontFamily: expanseModernFontFamily,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "1.2rem",
          textShadow: techGlowShadow(theme, "info"),
        }),
        subheader: ({ theme }) => ({
          fontFamily: expanseBodyFontFamily,
          fontSize: "0.9rem",
          color: theme.palette.text.secondary,
          fontWeight: 300,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({}) => ({
          padding: "20px",
          "&:last-child": {
            paddingBottom: "20px",
          },
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({}) => ({
          padding: "8px 20px 20px 20px",
          justifyContent: "flex-end",
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `${theme.palette.background.default}EE`,
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "16px 0",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          },
          borderLeft: `2px solid ${theme.palette.info.main}44`,
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.info.main}33`,
          "&.Mui-expanded": {
            minHeight: 48,
            background: `${theme.palette.info.main}18`,
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
          borderBottom: `1px solid ${theme.palette.info.main}22`,
          "&::before": {
            content: '"▶"',
            color: theme.palette.info.main,
            position: "absolute",
            left: 0,
            opacity: 0,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            transform: "translateX(-8px)",
            fontSize: "0.8rem",
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
          borderBottom: `1px solid ${theme.palette.info.dark}44`,
          padding: "14px 18px",
        }),
        head: ({ theme }) => ({
          color: theme.palette.info.light,
          fontFamily: expanseModernFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "0.85rem",
          fontWeight: 600,
          textShadow: techGlowShadow(theme, "info"),
          background: `${theme.palette.info.dark}22`,
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: expanseBodyFontFamily,
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          transition: "all 0.2s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.info.main}88, 0 0 12px ${theme.palette.info.main}44`,
            borderColor: `${theme.palette.info.main}88`,
          },
          "&:hover": {
            borderColor: `${theme.palette.info.main}55`,
          },
        }),
        input: ({ theme }) => ({
          padding: "12px 16px",
          "&::placeholder": {
            color: theme.palette.text.disabled,
            fontFamily: expanseBodyFontFamily,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({}) => ({
          borderColor: "rgba(255, 255, 255, 0.2)",
          transition: "all 0.2s ease",
        }),
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.info.main}77`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.info.main}88`,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.info.main}44`,
        }),
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.info.main,
          height: 3,
          boxShadow: `0 0 8px ${theme.palette.info.main}77`,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: expanseModernFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: "0.8rem",
          minHeight: 48,
          transition: "all 0.2s ease",
          "&:hover": {
            color: theme.palette.info.light,
            textShadow: techGlowShadow(theme, "info"),
          },
          "&.Mui-selected": {
            color: theme.palette.info.light,
            textShadow: techGlowShadow(theme, "info"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: expanseModernFontFamily,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "0.7rem",
          background: "rgba(0, 0, 0, 0.4)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          "&.MuiChip-colorPrimary": {
            backgroundColor: `${theme.palette.primary.main}33`,
            borderColor: `${theme.palette.primary.main}66`,
            color: theme.palette.primary.light,
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: `${theme.palette.secondary.main}33`,
            borderColor: `${theme.palette.secondary.main}66`,
            color: theme.palette.secondary.light,
          },
          "&.MuiChip-colorInfo": {
            backgroundColor: `${theme.palette.info.main}33`,
            borderColor: `${theme.palette.info.main}66`,
            color: theme.palette.info.light,
          },
        }),
        label: ({}) => ({
          paddingLeft: 14,
          paddingRight: 14,
        }),
      },
    },
  },
  spinButtonBackgroundImage: (color) =>
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 30 L12 36 L18 30 M6 18 L12 12 L18 18'/></svg>`
    )}")`,
  scrollbarStyles: (theme: Theme) => ({
    "&::-webkit-scrollbar": {
      width: "0.4em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0,0,0,0.3)",
      boxShadow: `inset 0 0 6px ${theme.palette.background.default}`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.dark + "AA",
      border: `1px solid ${theme.palette.primary.main}66`,
      borderRadius: "2px",
      boxShadow: `0 0 6px ${theme.palette.primary.main}44`,
      "&:hover": {
        backgroundColor: theme.palette.primary.main + "CC",
        boxShadow: `0 0 8px ${theme.palette.primary.main}77`,
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/expanse/ComfyUI_temp_rpdvh_00062_.png",
});
