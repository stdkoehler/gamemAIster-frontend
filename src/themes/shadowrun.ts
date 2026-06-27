import { createTheme, Theme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import {
  baseCssBaselineRules,
  getSafePaletteColor,
  inputLabelFocusMaskStyle,
  linkHoverStyle,
  resolveButtonPalette,
  resolveButtonTextColor,
  spinButtonArrowSvg,
} from "./helper";

function neonTextShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  return `0 0 1px ${color}, 0 0 4px ${color}, 0 0 12px ${color}`;
}

// A neon tube buzzing — long steady stretches with a couple of quick,
// shallow dips, not a slow ember-style breathing glow. Only touches
// opacity so the glow color/shape from `neonTextShadow` never shifts.
const neonFlicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.8; }
  94% { opacity: 1; }
  96% { opacity: 0.65; }
  97% { opacity: 1; }
`;

const shadowrunBodyFontFamily = '"Share Tech Mono", "Courier New", monospace';
const shadowrunHeadingFontFamily = '"Orbitron", "Share Tech Mono", sans-serif';

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
    fontFamily: shadowrunBodyFontFamily,
    allVariants: {
      fontFamily: shadowrunBodyFontFamily,
      color: "#e0e0e0",
    },
    h1: {
      fontFamily: shadowrunHeadingFontFamily,
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "2.3rem",
      color: "#f392ff",
    },
    h2: {
      fontFamily: shadowrunHeadingFontFamily,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "1.8rem",
      color: "#d500f9",
    },
    h3: {
      fontFamily: shadowrunHeadingFontFamily,
      fontWeight: 600,
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      fontSize: "1.4rem",
      color: "#ffc400",
    },
    h4: {
      fontFamily: shadowrunHeadingFontFamily,
      fontWeight: 500,
      fontSize: "1.15rem",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "#fff350",
    },
    h5: {
      fontFamily: shadowrunBodyFontFamily,
      fontWeight: 500,
      fontSize: "1.05rem",
      letterSpacing: "0.03em",
      color: "#a0a0a0",
    },
    h6: {
      fontFamily: shadowrunBodyFontFamily,
      fontWeight: 500,
      fontSize: "0.95rem",
      letterSpacing: "0.02em",
      color: "#a0a0a0",
    },
    subtitle1: {
      fontFamily: shadowrunBodyFontFamily,
      fontStyle: "italic",
      fontSize: "1.05rem",
      color: "#e0e0e0",
    },
    subtitle2: {
      fontFamily: shadowrunBodyFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#a0a0a0",
    },
    button: {
      fontFamily: shadowrunHeadingFontFamily,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 600,
      fontSize: "0.95rem",
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
      fontFamily: shadowrunBodyFontFamily,
      fontStyle: "italic",
      fontSize: "0.85rem",
      color: "#616161",
    },
    tagLabel: {
      fontSize: "1rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    },
    chatText: {
      fontFamily: shadowrunBodyFontFamily,
      fontSize: "1.05rem",
      lineHeight: 1.7,
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
            radial-gradient(ellipse at 10% 0%, ${theme.palette.primary.dark}26 0%, transparent 45%),
            radial-gradient(ellipse at 90% 100%, ${theme.palette.info.dark}22 0%, transparent 50%),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px),
            ${theme.palette.background.default}`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }),
        a: ({ theme }: { theme: Theme }) =>
          linkHoverStyle(theme.palette.info.light, theme.palette.primary.light),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M0 0h24M0 0v24' stroke='%23d500f9' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E"),
            linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F5)`,
          boxShadow:
            "0 4px 22px rgba(0,0,0,0.75), inset 0 1px 0 rgba(213,0,249,0.06)",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.primary.dark}33`,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}66, ${theme.palette.info.main}55, transparent)`,
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: shadowrunBodyFontFamily,
          textShadow: neonTextShadow(theme, ownerState.color || "primary"), // ownerState.color is not standard on MenuItem, will use 'primary'
          color: theme.palette.text.primary,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "5%",
            width: "90%",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}55, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            backgroundColor: theme.palette.primary.dark + "66",
            color: theme.palette.primary.light,
            "&::after": { opacity: 1 },
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
          const textColor = resolveButtonTextColor(buttonPalette);

          return {
            fontFamily: shadowrunHeadingFontFamily,
            textShadow: neonTextShadow(theme, ownerState.color), // ownerState.color is ButtonProps['color']
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: mainColor + "33",
            boxShadow: `0 0 5px ${mainColor}33`,
            borderRadius: theme.shape.borderRadius,
            padding: "6px 18px",
            color: textColor,
            "&:hover": {
              borderColor: lightColor + "33",
              backgroundColor: mainColor + "33", // 33 specifies opacity in hex 0x33 = 0.2
              boxShadow: `0 0 10px ${mainColor}99`, // 99 specifies opacity in hex 0x99 = 0.6
            },
            // MUI dims disabled button text to a translucent white, but
            // without this the full-strength colored glow stayed behind,
            // leaving a colored halo around washed-out text.
            "&.Mui-disabled": {
              textShadow: "none",
              borderColor: mainColor + "1a",
              boxShadow: "none",
            },
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "textPrimary",
        variantMapping: { tagLabel: "span", chatText: "div" },
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          // ownerState.color for Typography can be 'primary', 'textPrimary', 'error', etc.
          textShadow: neonTextShadow(theme, ownerState.color),
          // If defaultProps.color is "primary", ownerState.color will be "primary".
          // If it's explicitly set e.g. <Typography color="textSecondary">, ownerState.color is "textSecondary".
          // getSafePaletteColor will handle these.
        }),
        h1: () => ({
          animation: `${neonFlicker} 6s linear infinite`,
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontFamily: shadowrunBodyFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1700px",
          },
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: `${theme.palette.primary.dark}55`,
          "&::before, &::after": {
            borderTop: `thin solid ${theme.palette.primary.dark}55`,
          },
          "&.MuiDivider-textAlignCenter": {
            "&::before, &::after": {
              borderTop: `thin solid ${theme.palette.primary.dark}55`,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}DD`,
          backgroundImage: `linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F0)`,
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(213,0,249,0.06)",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.primary.dark}33`,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}66, ${theme.palette.info.main}55, transparent)`,
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: () => ({ padding: "16px 16px 0 16px" }),
        title: ({ theme }) => ({
          fontFamily: shadowrunHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "1.05rem",
          textTransform: "uppercase",
          textShadow: neonTextShadow(theme, "primary"),
        }),
        subheader: ({ theme }) => ({
          fontFamily: shadowrunBodyFontFamily,
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
            boxShadow: "0 3px 15px rgba(0,0,0,0.6)",
          },
          borderLeft: `2px solid ${theme.palette.primary.dark}55`,
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.dark}44`,
          "&.Mui-expanded": {
            minHeight: 48,
            background: `${theme.palette.primary.dark}1a`,
          },
        }),
        content: () => ({ "&.Mui-expanded": { margin: "12px 0" } }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          borderBottom: `1px solid ${theme.palette.primary.dark}22`,
          "&::before": {
            content: '"\\00bb"',
            color: theme.palette.info.main,
            position: "absolute",
            left: 0,
            opacity: 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transform: "translateX(-10px)",
            fontSize: "0.9em",
          },
          "&:hover::before": { opacity: 1, transform: "translateX(0)" },
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
          color: theme.palette.primary.light,
          fontFamily: shadowrunHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.9rem",
          fontWeight: 600,
          textTransform: "uppercase",
          textShadow: neonTextShadow(theme, "primary"),
          background: `${theme.palette.primary.dark}22`,
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: shadowrunBodyFontFamily,
          background: "rgba(0,0,0,0.4)",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.primary.dark}44`,
          transition:
            "border-color 0.1s ease, box-shadow 0.1s ease, background-color 0.3s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.info.main}77, 0 0 10px ${theme.palette.info.main}44`,
            borderColor: `${theme.palette.info.main}77`,
          },
          "&:hover": { borderColor: `${theme.palette.primary.main}66` },
        }),
        input: ({ theme, ownerState }) => ({
          padding: "10px 14px",
          // Matches chatText (the narrative display variant) at default
          // size so toggling a chat message between display/edit doesn't
          // shift its apparent size; the compact MAIN_SEND send-bar uses
          // MUI's "small" size to ask for the smaller variant instead.
          fontSize: ownerState.size === "small" ? "0.95rem" : "1.05rem",
          // Same default magenta glow Typography/MenuItem/Select text get
          // — a plain <input> isn't a Typography, so it doesn't inherit
          // that automatically. ownerState.color reflects whatever color
          // the field was actually given (e.g. FieldContainer's player/GM
          // instances), defaulting to magenta when unset, same as
          // everywhere else.
          textShadow: neonTextShadow(theme, ownerState.color),
          "&::placeholder": {
            color: theme.palette.text.disabled,
            fontStyle: "italic",
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({ theme }) => ({
          borderColor: `${theme.palette.primary.dark}44`,
          transition: "border-color 0.1s ease",
        }),
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.primary.main}66`,
          },
          // Cyan fully takes over on focus — important that nothing else
          // (e.g. a per-instance base color from FieldContainer's own sx)
          // also paints this border, or the two colors muddy together.
          // See FieldContainer.tsx's `theme.accentColor` use.
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.info.main}88`,
          },
          // The field's value text matches the default magenta glow used
          // everywhere else, but switches to cyan to match the border
          // while actually focused/active. Covers both a plain text input
          // and a closed Select's value (which is also a `.MuiInputBase-input`
          // under the hood).
          "&.Mui-focused .MuiInputBase-input": {
            textShadow: neonTextShadow(theme, "info"),
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
          borderBottom: `1px solid ${theme.palette.primary.dark}55`,
        }),
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.info.main,
          height: 2,
          boxShadow: `0 0 8px ${theme.palette.info.main}88`,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: shadowrunHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.85rem",
          minHeight: 48,
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.primary.light,
            textShadow: neonTextShadow(theme, "primary"),
          },
          "&.Mui-selected": {
            color: theme.palette.info.light,
            textShadow: neonTextShadow(theme, "info"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: shadowrunBodyFontFamily,
          fontSize: "0.78rem",
          background: "rgba(0,0,0,0.4)",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.primary.dark}44`,
          "&.MuiChip-colorPrimary": {
            backgroundColor: `${theme.palette.primary.main}28`,
            borderColor: `${theme.palette.primary.main}60`,
            color: theme.palette.primary.light,
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: `${theme.palette.secondary.dark}30`,
            borderColor: `${theme.palette.secondary.main}60`,
            color: theme.palette.secondary.light,
          },
        }),
        label: () => ({ paddingLeft: 12, paddingRight: 12 }),
      },
    },
  },
  spinButtonBackgroundImage: (color) =>
    spinButtonArrowSvg(color, { strokeWidth: 2, doublePolyline: true }),
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
      border: `1px solid ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark + "AA",
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/shadowrun/sr_00096_.png", // User's original logo
  trackColors: { low: "#11ea7b", mid: "#ffc400", high: "#e53f7e" },
  // Matrix-cyan, matching the active character-sheet tab and the dice.
  accentColor: "#00e5ff",
});
