import { createTheme, Theme } from "@mui/material/styles";
import {
  baseCssBaselineRules,
  getSafePaletteColor,
  inputLabelFocusMaskStyle,
  resolveButtonPalette,
  spinButtonArrowSvg,
} from "./helper";

function antiquarianTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  // Subtle sepia-toned shadow for an aged paper effect
  return theme.palette.mode === "light"
    ? `1px 1px 1px rgba(98, 74, 46, 0.3), 0 0 2px ${baseColor}40`
    : `1px 1px 2px rgba(0, 0, 0, 0.5), 0 0 3px ${baseColor}60`;
}

const cthulhuFontFamily = '"Libre Baskerville", "Times New Roman", serif'; // Classic serif for 1920s feel
const cthulhuHeadingFontFamily = '"Playfair Display", "Times New Roman", serif'; // Elegant serif for headings
const cthulhuMonoFontFamily = '"Courier Prime", "Courier New", monospace'; // Typewriter-like font

export const cthulhuTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#6b705c", // #6b705c Muted sage green
      main: "#3a3a3a", // #3a3a3a Nearly black - for text
      dark: "#1f1f1f", // #1f1f1f Deep black - for emphasis
      contrastText: "#f0eee4", // #f0eee4 Off-white parchment
    },
    secondary: {
      light: "#b56576", // #b56576 Dusty rose
      main: "#6d597a", // #6d597a Muted purple
      dark: "#355070", // #355070 Deep navy blue
      contrastText: "#f0eee4", // #f0eee4 Off-white parchment
    },
    warning: {
      light: "#cb997e", // #cb997e Faded terracotta
      main: "#a07855", // #a07855 Aged leather brown
      dark: "#774936", // #774936 Deep mahogany
      contrastText: "#f0eee4", // #f0eee4 Off-white
    },
    error: {
      light: "#bc4749", // #bc4749 Faded crimson
      main: "#9a031e", // #9a031e Dark blood red
      dark: "#540b0e", // #540b0e Deep maroon
      contrastText: "#f0eee4", // #f0eee4 Off-white parchment
    },
    info: {
      light: "#829399", // #829399 Slate blue-gray
      main: "#5f6f78", // #5f6f78 Darker blue-gray
      dark: "#2e4756", // #2e4756 Deep blue-gray
      contrastText: "#f0eee4", // #f0eee4 Off-white parchment
    },
    success: {
      light: "#84a98c", // #84a98c Sage green
      main: "#52796f", // #52796f Darker green
      dark: "#354f52", // #354f52 Deep forest green
      contrastText: "#f0eee4", // #f0eee4 Off-white parchment
    },
    background: {
      default: "#e9e7de", // #e9e7de Aged parchment
      paper: "#f5f3e9", // #f5f3e9 Lighter parchment/paper
    },
    text: {
      primary: "#2e2e2e", // #2e2e2e Nearly black
      secondary: "#5a5a58", // #5a5a58 Dark gray
      disabled: "#a5a5a2", // #a5a5a2 Medium gray
    },
  },
  typography: {
    fontFamily: cthulhuFontFamily,
    allVariants: {
      fontFamily: cthulhuFontFamily,
      color: "#2e2e2e",
    },
    h1: {
      fontFamily: cthulhuHeadingFontFamily,
      fontWeight: 700,
      letterSpacing: "0.01em",
      textTransform: "none",
      fontSize: "2.2rem",
      color: "#1a1a1a",
    },
    h2: {
      fontFamily: cthulhuHeadingFontFamily,
      fontWeight: 600,
      letterSpacing: "0.01em",
      fontSize: "1.8rem",
      color: "#1a1a1a",
    },
    h3: {
      fontFamily: cthulhuHeadingFontFamily,
      fontWeight: 600,
      fontStyle: "normal",
      fontSize: "1.5rem",
      color: "#1a1a1a",
    },
    h4: {
      fontFamily: cthulhuHeadingFontFamily,
      fontWeight: 600,
      fontSize: "1.3rem",
      color: "#1f1f1f",
    },
    h5: {
      fontFamily: cthulhuFontFamily,
      fontStyle: "italic",
      fontSize: "1.15rem",
      color: "#3a3a3a",
    },
    h6: {
      fontFamily: cthulhuFontFamily,
      fontStyle: "italic",
      fontSize: "1.05rem",
      color: "#3a3a3a",
    },
    button: {
      fontFamily: cthulhuFontFamily,
      textTransform: "capitalize",
      fontWeight: 500,
      letterSpacing: "0.03em",
    },
    body1: {
      lineHeight: 1.8,
      fontSize: "1rem",
      letterSpacing: "0.01em",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem",
    },
    caption: {
      fontFamily: cthulhuMonoFontFamily,
      fontSize: "0.85rem",
      color: "#5f5f5f",
    },
    tagLabel: {
      fontSize: "0.65rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    },
    chatText: {
      fontFamily: cthulhuFontFamily,
      fontSize: "1.05rem",
      lineHeight: 1.7,
      letterSpacing: "0.02em",
    },
    subtitle1: {
      fontFamily: cthulhuHeadingFontFamily,
      fontStyle: "italic",
      fontSize: "1.1rem",
    },
    subtitle2: {
      fontFamily: cthulhuFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#5f5f5f",
    },
  },
  shape: {
    borderRadius: 2, // Slightly rounded corners for a vintage feel
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage:
            theme.palette.mode === "light"
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a9a9a9' fill-opacity='0.05' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")"
              : "none",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 2px 8px rgba(98, 74, 46, 0.15), 0 1px 3px rgba(0,0,0,0.05)"
              : "0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0,0,0,0.1)",
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: cthulhuFontFamily,
          textShadow: antiquarianTextShadow(
            theme,
            ownerState.color || "primary",
          ),
          color: theme.palette.text.primary,
          position: "relative",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.dark,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "3px",
              left: "10%",
              width: "80%",
              height: "1px",
              backgroundColor: theme.palette.secondary.main + "99",
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
          const darkColor = buttonPalette.dark;
          const contrastTextColor = buttonPalette.contrastText;

          return {
            // Playfair Display gives the formal, antiquarian 1920s academic look
            fontFamily: cthulhuHeadingFontFamily,
            fontStyle: "italic",
            letterSpacing: "0.04em",
            textShadow:
              theme.palette.mode === "light"
                ? "none"
                : antiquarianTextShadow(theme, ownerState.color),
            borderRadius: "1px",
            // Double-rule border: inner rule via box-shadow, outer via border — like a printed header box
            border: `1px solid ${darkColor}88`,
            padding: "7px 18px",
            minHeight: "40px",
            color:
              theme.palette.mode === "light" ? darkColor : contrastTextColor,
            // Parchment/paper gradient background
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(180deg,
                    rgba(255,255,255,0.6) 0%,
                    ${theme.palette.background.paper} 30%,
                    rgba(200,190,170,0.2) 100%)`
                : "transparent",
            // Letterpress stamp shadow — raises the button off the page
            boxShadow:
              theme.palette.mode === "light"
                ? `inset 0 1px 0 rgba(255,255,255,0.8),
                   0 2px 4px rgba(98,74,46,0.18),
                   0 1px 1px rgba(0,0,0,0.08)`
                : "none",
            transition: "all 0.2s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: "2px",
              border: `1px solid ${darkColor}22`,
              borderRadius: "1px",
              pointerEvents: "none",
            },
            "&:hover": {
              borderColor: `${mainColor}BB`,
              background:
                theme.palette.mode === "light"
                  ? `linear-gradient(180deg,
                      rgba(255,255,255,0.5) 0%,
                      rgba(200,190,170,0.35) 100%)`
                  : darkColor + "33",
              boxShadow:
                theme.palette.mode === "light"
                  ? `inset 0 1px 0 rgba(255,255,255,0.6),
                     0 3px 8px rgba(98,74,46,0.22),
                     0 1px 2px rgba(0,0,0,0.1)`
                  : `0 2px 8px rgba(0,0,0,0.15)`,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0px)",
              boxShadow:
                theme.palette.mode === "light"
                  ? `inset 0 1px 3px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.06)`
                  : `0 1px 3px rgba(0,0,0,0.1)`,
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
          textShadow: antiquarianTextShadow(theme, ownerState.color),
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontFamily: cthulhuFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1400px", // Slightly narrower for readability
          },
          "& a": {
            color: theme.palette.secondary.dark,
            textDecoration: "none",
            borderBottom: `1px solid ${theme.palette.secondary.main}66`,
            transition: "all 0.2s ease",
            "&:hover": {
              color: theme.palette.secondary.main,
              borderBottomColor: theme.palette.secondary.main,
            },
          },
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&::before, &::after": {
            borderTop: `thin solid ${theme.palette.text.secondary}33`,
          },
          "&.MuiDivider-textAlignCenter::before, &.MuiDivider-textAlignCenter::after":
            {
              borderTop: `thin solid ${theme.palette.text.secondary}33`,
            },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage:
            theme.palette.mode === "light"
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a9a9a9' fill-opacity='0.06' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")"
              : "none",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
          border: `1px solid ${theme.palette.text.secondary}11`,
          // Slightly yellowish border for aged paper look
          borderColor:
            theme.palette.mode === "light"
              ? "rgba(98, 74, 46, 0.15)"
              : "transparent",
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: "none",
          border: `1px solid ${theme.palette.text.secondary}22`,
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
          },
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          "&::before": {
            content: '"•"',
            color: theme.palette.secondary.main,
            position: "absolute",
            left: "-0.8em",
            fontSize: "1.2em",
            opacity: 0,
            transition: "opacity 0.2s ease",
          },
          "&:hover::before": {
            opacity: 1,
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.text.secondary}22`,
          // Very subtle texture for tables
          backgroundImage:
            theme.palette.mode === "light"
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a9a9a9' fill-opacity='0.03' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")"
              : "none",
        }),
        head: ({ theme }) => ({
          fontFamily: cthulhuHeadingFontFamily,
          color: theme.palette.primary.dark,
          fontWeight: 600,
          fontSize: "0.95rem",
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: cthulhuFontFamily,
          background:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.55)"
              : "rgba(0,0,0,0.3)",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.text.secondary}33`,
          transition: "all 0.2s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.secondary.main}77, 0 0 8px ${theme.palette.secondary.main}33`,
            borderColor: `${theme.palette.secondary.main}77`,
          },
          "&:hover": {
            borderColor: `${theme.palette.secondary.main}55`,
          },
        }),
        input: ({ ownerState, theme }) => ({
          padding: "10px 14px",
          // Matches chatText (the narrative display variant) at default
          // size so toggling a chat message between display/edit doesn't
          // shift its apparent size; the compact MAIN_SEND send-bar uses
          // MUI's "small" size to ask for the smaller variant instead.
          fontSize: ownerState.size === "small" ? "0.95rem" : "1.05rem",
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
          borderColor: `${theme.palette.text.secondary}33`,
          transition: "all 0.2s ease",
        }),
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.secondary.main}55`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.secondary.main}77`,
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
          borderBottom: `1px solid ${theme.palette.text.secondary}33`,
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
          fontFamily: cthulhuFontFamily,
          letterSpacing: "0.02em",
          fontSize: "0.9rem",
          textTransform: "none",
          minHeight: 48,
          transition: "all 0.2s ease",
          "&:hover": {
            color: theme.palette.primary.dark,
            textShadow: antiquarianTextShadow(theme, "primary"),
          },
          "&.Mui-selected": {
            color: theme.palette.secondary.dark,
            textShadow: antiquarianTextShadow(theme, "secondary"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: cthulhuFontFamily,
          fontSize: "0.78rem",
          background:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.5)"
              : "rgba(0,0,0,0.3)",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.text.secondary}33`,
          "&.MuiChip-colorPrimary": {
            backgroundColor: `${theme.palette.primary.main}1f`,
            borderColor: `${theme.palette.primary.main}55`,
            color: theme.palette.primary.dark,
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: `${theme.palette.secondary.main}1f`,
            borderColor: `${theme.palette.secondary.main}55`,
            color: theme.palette.secondary.dark,
          },
        }),
        label: () => ({ paddingLeft: 12, paddingRight: 12 }),
      },
    },
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
        ...baseCssBaselineRules(),
      },
    },
  },
  spinButtonBackgroundImage: (color) => spinButtonArrowSvg(color),
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
  logo: "/src/assets/callofcthulhu/coc_00354_.png",
  titleOverlayStyle: {
    color: "#f0e6c8",
    fontStyle: "italic",
    textShadow:
      "1px 2px 6px rgba(0,0,0,0.9), 0 1px 12px rgba(0,0,0,0.75), 2px 2px 2px rgba(0,0,0,0.8)",
  },
  trackColors: { low: "#52796f", mid: "#a07855", high: "#9a031e" },
});
