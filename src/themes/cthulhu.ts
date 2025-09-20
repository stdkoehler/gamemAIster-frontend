import { createTheme, Theme } from "@mui/material/styles";
import { getSafePaletteColor, ThemeColorWithMain } from "./helper";

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
            ownerState.color || "primary"
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
          const darkColor =
            (buttonPalette as any).dark || theme.palette.primary.dark;
          const contrastTextColor =
            (buttonPalette as any).contrastText ||
            theme.palette.primary.contrastText;

          return {
            fontFamily: cthulhuFontFamily,
            textShadow:
              theme.palette.mode === "light"
                ? "none"
                : antiquarianTextShadow(theme, ownerState.color),
            borderRadius: "2px",
            border: `1px solid ${darkColor}66`,
            padding: "8px 16px",
            color:
              theme.palette.mode === "light" ? darkColor : contrastTextColor,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.paper
                : "transparent",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 2px 4px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)"
                : "none",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: darkColor,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.background.default
                  : darkColor + "33",
              boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(1px)",
              boxShadow: `0 1px 3px rgba(0,0,0,0.1)`,
            },
            ...theme.scrollbarStyles(theme),
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "textPrimary", // Using text.primary instead of primary.main
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          textShadow: antiquarianTextShadow(theme, ownerState.color),
          ...theme.scrollbarStyles(theme),
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
          ...theme.scrollbarStyles(theme),
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
      },
    },
  },
  spinButtonBackgroundImage: (color) =>
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'><path d='M6 30 L12 36 L18 30 M6 18 L12 12 L18 18'/></svg>`
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
  logo: "/src/assets/callofcthulhu/coc_00354_.png",
});
