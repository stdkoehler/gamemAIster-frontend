import { createTheme, Theme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import {
  baseCssBaselineRules,
  getSafePaletteColor,
  inputLabelFocusMaskStyle,
  linkHoverStyle,
  resolveButtonPalette,
  spinButtonArrowSvg,
  titleOutlineTextShadow,
} from "./helper";

// Slow ember flicker for headings — a heraldic title catching torchlight,
// not a strobing effect, so the easing lingers near the bright end.
const emberFlicker = keyframes`
  0%, 100% { text-shadow: 0 0 6px rgba(216,84,40,0.5), 0 0 14px rgba(168,34,42,0.32); }
  45% { text-shadow: 0 0 11px rgba(255,156,64,0.85), 0 0 24px rgba(200,40,40,0.5); }
  60% { text-shadow: 0 0 8px rgba(232,116,40,0.7), 0 0 18px rgba(184,36,42,0.4); }
`;

// A turbulence-displaced ring (stroke, not a filled disc) at a given
// radius — same viewBox, same turbulence, same `stroke-width` every time,
// only `r` differs. `preserveAspectRatio='none'` is what makes this map
// onto any button's own (often very wide/short) aspect ratio at
// `mask-size: 100% 100%` instead of being letterboxed into a small square.
function emberRingMask(r: number): string {
  return `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' preserveAspectRatio='none'><filter id='t'><feTurbulence type='fractalNoise' baseFrequency='0.025 0.035' numOctaves='8' seed='11' result='n'/><feDisplacementMap in='SourceGraphic' in2='n' scale='20' xChannelSelector='R' yChannelSelector='G'/></filter><circle cx='100' cy='100' r='${r}' fill='none' stroke='white' stroke-width='7' filter='url(#t)'/></svg>`,
  )}")`;
}

// Radius to use at rest (effectively a dot) — also the animation's 0%
// frame, so there's no visible jump the instant a hover starts.
const EMBER_RING_MIN_R = 2;
// 100 * sqrt(2), so the ring clears every corner of the (possibly
// preserveAspectRatio-stretched) button by the end, not just its edges.
const EMBER_RING_MAX_R = 142;
const EMBER_RING_REST_MASK = emberRingMask(EMBER_RING_MIN_R);

// A thin, jagged ember line crawling outward from the button's center to
// its edges and corners, then fading — a lit fuse, not a filled spreading
// blob. Plays once on hover-in.
//
// This only ever touches `mask-image` (which radius-step's ring is shown)
// and `opacity` (the fade near the end) — never color, brightness, or
// size. Color comes from the (unanimated) `backgroundColor`/`filter` set
// alongside this animation in MuiButton below, so it never shifts.
//
// Critically, `mask-size` stays fixed at 100% 100% throughout — only the
// *mask image itself* changes, swapping between several rings of
// increasing radius but IDENTICAL stroke-width. Animating `mask-size` (or
// a `transform: scale()`) on a single static ring would have blown up the
// whole rendered image proportionally as it grew, stroke included, which
// is why the line kept broadening. CSS can't smoothly morph between two
// different images, so enough discrete steps are generated here that the
// jumps between them read as smooth, constant-speed motion at normal hover
// speed instead of a flipbook.
const EMBER_RING_STEPS = 14;
function emberLineKeyframesCss(): string {
  return Array.from({ length: EMBER_RING_STEPS }, (_, i) => {
    const t = i / (EMBER_RING_STEPS - 1);
    const r = EMBER_RING_MIN_R + (EMBER_RING_MAX_R - EMBER_RING_MIN_R) * t;
    const mask = emberRingMask(r);
    // Holds fully visible for the first 70% of the crawl, then fades over
    // the remaining 30% instead of cutting off abruptly on the last step.
    const start_opacity = 0.3;
    const opacity =
      t < 0.7 ? start_opacity : Math.max(0, start_opacity - (t - 0.7) / 0.3);
    return `${t * 100}% { mask-image: ${mask}; -webkit-mask-image: ${mask}; opacity: ${opacity}; }`;
  }).join(" ");
}
const emberLineSpread = keyframes`${emberLineKeyframesCss()}`;

function firelightTextShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  return `0 0 3px ${color}AA, 0 0 8px rgba(200, 70, 30, 0.45), 0 0 16px rgba(168, 34, 42, 0.2)`;
}

function emberCarvedShadow(): string {
  return `0px 1px 2px rgba(0,0,0,0.85)`;
}

const dragonlanceBodyFontFamily =
  '"EB Garamond", "Georgia", "Times New Roman", serif';
const dragonlanceHeadingFontFamily = '"Cinzel", "Georgia", serif';
const dragonlanceMonoFontFamily = '"Cutive Mono", "Courier New", monospace';

export const dragonlanceTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#e8c873", // polished steel-gold
      main: "#b8924a", // aged brass — Solamnic crest < theme 1
      dark: "#7a5c28", // dark bronze
      // Buttons here render as translucent gradients over the dark page
      // background, not solid fills, so contrastText needs to stay light
      // (like every other palette below) even though primary itself reads
      // as a "light" gold — a dark contrastText was unreadable against it.
      contrastText: "#f5e6c8",
    },
    secondary: {
      light: "#e0454a", // dragonfire bright
      main: "#a8222a", // dragon-scale crimson < theme 2
      dark: "#5c0f14", // dried-blood maroon
      contrastText: "#fbe6c8", // parchment glow
    },
    warning: {
      light: "#ffac4b", // molten ember
      main: "#d97a1f", // forge-coal orange
      dark: "#8a4a0a", // banked coal
      contrastText: "#fff3df",
    },
    error: {
      light: "#ff6b5c",
      main: "#c4291f", // war-blood red
      dark: "#7a140d",
      contrastText: "#fff0e8",
    },
    info: {
      light: "#8fb4c9", // Solamnic steel-blue
      main: "#4f7e94",
      dark: "#27414e",
      contrastText: "#eaf4f8",
    },
    success: {
      light: "#7fc78a", // Mishakal's healing green
      main: "#3f8f4f",
      dark: "#1f4a28",
      contrastText: "#eafbea",
    },
    background: {
      default: "#0c0807", // charred void
      paper: "#170f0a", // ember-warmed hearth-black
    },
    text: {
      primary: "#f0dcb0", // parchment gold
      secondary: "#c9a878", // dim parchment < theme 3
      disabled: "#5c4830",
    },
  },
  typography: {
    fontFamily: dragonlanceBodyFontFamily,
    allVariants: {
      fontFamily: dragonlanceBodyFontFamily,
      color: "#f0dcb0",
    },
    h1: {
      fontFamily: dragonlanceHeadingFontFamily,
      fontWeight: 800,
      fontSize: "2.6rem",
      letterSpacing: "0.04em",
      margin: "0.5em 0 0.7em",
      color: "#e8c873",
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: dragonlanceHeadingFontFamily,
      fontWeight: 700,
      fontSize: "2.05rem",
      letterSpacing: "0.03em",
      color: "#dcb868",
    },
    h3: {
      fontFamily: dragonlanceHeadingFontFamily,
      fontWeight: 600,
      fontSize: "1.7rem",
      letterSpacing: "0.02em",
      color: "#cfa860",
    },
    h4: {
      fontFamily: dragonlanceHeadingFontFamily,
      fontWeight: 600,
      fontSize: "1.4rem",
      letterSpacing: "0.02em",
      color: "#c09a58",
    },
    h5: {
      fontFamily: dragonlanceBodyFontFamily,
      fontSize: "1.2rem",
      fontStyle: "italic",
      color: "#c9a878",
    },
    h6: {
      fontFamily: dragonlanceBodyFontFamily,
      fontSize: "1.1rem",
      fontStyle: "italic",
      color: "#c9a878",
    },
    subtitle1: {
      fontFamily: dragonlanceBodyFontFamily,
      fontStyle: "italic",
      fontSize: "1.1rem",
      color: "#b89868",
    },
    subtitle2: {
      fontFamily: dragonlanceBodyFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#98805c",
    },
    button: {
      fontFamily: dragonlanceHeadingFontFamily,
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.04em",
    },
    body1: {
      lineHeight: 1.75,
      letterSpacing: "0.01em",
      fontSize: "1rem",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem",
      color: "#c9a878",
    },
    caption: {
      fontFamily: dragonlanceMonoFontFamily,
      fontSize: "0.82rem",
      color: "#80684a",
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...baseCssBaselineRules(),
        a: ({ theme }: { theme: Theme }) =>
          linkHoverStyle(theme.palette.secondary.light, theme.palette.primary.light),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath fill='%23a8222a' fill-opacity='0.035' d='M0 4a4 4 0 0 1 8 0 4 4 0 0 1-8 0z'/%3E%3C/svg%3E"),
            linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F5)`,
          boxShadow:
            "0 4px 22px rgba(0,0,0,0.75), inset 0 1px 0 rgba(216,170,80,0.08)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(216, 170, 80, 0.14)",
          borderLeft: "1px solid rgba(216, 170, 80, 0.08)",
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
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}66, ${theme.palette.primary.main}55, transparent)`,
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: dragonlanceBodyFontFamily,
          textShadow: emberCarvedShadow(),
          color: theme.palette.text.secondary,
          fontSize: "0.95rem",
          transition: "all 0.3s ease",
          position: "relative",
          paddingTop: "0.65rem",
          paddingBottom: "0.65rem",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "5%",
            width: "90%",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}55, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            backgroundColor: `${theme.palette.secondary.dark}26`,
            color: theme.palette.text.primary,
            textShadow: firelightTextShadow(theme, "secondary"),
            "&::after": { opacity: 1 },
          },
          "&.Mui-selected": {
            backgroundColor: `${theme.palette.secondary.dark}33`,
            color: theme.palette.primary.light,
            "&:hover": { backgroundColor: `${theme.palette.secondary.dark}4a` },
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
            fontFamily: dragonlanceHeadingFontFamily,
            textShadow: emberCarvedShadow(),
            letterSpacing: "0.04em",
            fontSize: "0.92rem",
            borderRadius: "2px",
            border: `1px solid ${mainColor}88`,
            borderBottom: `2px solid ${mainColor}55`,
            padding: "7px 20px",
            minHeight: "40px",
            color: contrastTextColor,
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, ${mainColor}1c 40%, ${mainColor}10 70%, rgba(0,0,0,0.3) 100%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.45), 0 3px 6px rgba(0,0,0,0.6)`,
            // The "ash" tint lags slightly behind the line's 0.9s travel
            // (see `emberLineSpread`) instead of snapping in immediately,
            // so it reads as settling in just after the ember has passed.
            transition:
              "background-color 0.7s ease 0.15s, border-color 0.3s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "1px",
              background: `linear-gradient(to right, transparent, ${lightColor}55, transparent)`,
              pointerEvents: "none",
            },
            // The ember line itself — sized to exactly match the button
            // (`inset: 0`, whatever its own width/height happen to be) and
            // clipped by `emberRingMask`'s thin, jagged ring silhouette,
            // dormant (resting on the smallest ring) until `&:hover`
            // triggers `emberLineSpread` on it. Color is a flat
            // `lightColor` fill plus a same-color drop-shadow glow — both
            // set here, neither touched by the keyframes, so the line's
            // hue can't drift while it crawls outward.
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundColor: lightColor,
              filter: `drop-shadow(0 0 3px ${lightColor})`,
              WebkitMaskImage: EMBER_RING_REST_MASK,
              maskImage: EMBER_RING_REST_MASK,
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              opacity: 0,
            },
            "&:hover": {
              borderColor: `${lightColor}AA`,
              borderBottomColor: `${lightColor}77`,
              backgroundColor: `${mainColor}22`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 0 10px ${mainColor}40, 0 4px 8px rgba(0,0,0,0.6)`,
              textShadow: firelightTextShadow(theme, ownerState.color),
              "&::after": {
                animation: `${emberLineSpread} 0.9s linear 1 forwards`,
              },
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
          const palette = resolveButtonPalette(theme, ownerState.color);
          return {
            color: palette.main,
            textShadow: ownerState.variant?.startsWith("h")
              ? firelightTextShadow(theme, ownerState.color)
              : emberCarvedShadow(),
          };
        },
        h1: ({ theme }) => ({
          position: "relative",
          animation: `${emberFlicker} 3.6s ease-in-out infinite`,
          "&::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "2px",
            marginTop: "0.4em",
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}88, ${theme.palette.primary.main}77, ${theme.palette.secondary.main}88, transparent)`,
          },
        }),
        h2: ({ theme }) => ({
          position: "relative",
          animation: `${emberFlicker} 4.4s ease-in-out infinite`,
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
          fontFamily: dragonlanceBodyFontFamily,
          [theme.breakpoints.up("lg")]: { maxWidth: "1400px" },
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
          backgroundImage: `linear-gradient(160deg, ${theme.palette.background.paper}EE, ${theme.palette.background.default}F0)`,
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.75), inset 0 1px 0 rgba(216,170,80,0.08)",
          borderRadius: theme.shape.borderRadius,
          borderTop: "1px solid rgba(216, 170, 80, 0.14)",
          borderLeft: "1px solid rgba(216, 170, 80, 0.08)",
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
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.dark}66, transparent)`,
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: () => ({ padding: "16px 16px 0 16px" }),
        title: ({ theme }) => ({
          fontFamily: dragonlanceHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "1.1rem",
          textShadow: firelightTextShadow(theme, "secondary"),
        }),
        subheader: ({ theme }) => ({
          fontFamily: dragonlanceBodyFontFamily,
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
            background: `${theme.palette.secondary.dark}1a`,
          },
        }),
        content: () => ({ "&.Mui-expanded": { margin: "12px 0" } }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          borderBottom: `1px solid ${theme.palette.secondary.dark}22`,
          "&::before": {
            content: '"\\2727"',
            color: theme.palette.primary.main,
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
          fontFamily: dragonlanceHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.95rem",
          fontWeight: 600,
          textShadow: firelightTextShadow(theme, "secondary"),
          background: `${theme.palette.primary.dark}22`,
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: dragonlanceBodyFontFamily,
          background: "rgba(0,0,0,0.35)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(216, 170, 80, 0.2)",
          // Fast on focus specifically — a slow fade here reads as input
          // lag (the cursor lands instantly, but the highlight visibly
          // catching up afterwards looks like the click was sluggish).
          transition: "border-color 0.1s ease, box-shadow 0.1s ease, background-color 0.3s ease",
          "&.Mui-focused": {
            boxShadow: `0 0 0 1px ${theme.palette.secondary.main}77, 0 0 10px ${theme.palette.secondary.main}33`,
            borderColor: `${theme.palette.secondary.main}77`,
          },
          "&:hover": { borderColor: `${theme.palette.primary.dark}77` },
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
          borderColor: "rgba(216, 170, 80, 0.22)",
          transition: "border-color 0.1s ease",
        }),
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.primary.dark}80`,
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
          fontFamily: dragonlanceHeadingFontFamily,
          letterSpacing: "0.04em",
          fontSize: "0.9rem",
          minHeight: 48,
          transition: "all 0.3s ease",
          "&:hover": {
            color: theme.palette.primary.light,
            textShadow: firelightTextShadow(theme, "secondary"),
          },
          "&.Mui-selected": {
            color: theme.palette.primary.light,
            textShadow: firelightTextShadow(theme, "secondary"),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: dragonlanceBodyFontFamily,
          fontSize: "0.78rem",
          background: "rgba(0,0,0,0.4)",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid rgba(216, 170, 80, 0.2)",
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
  spinButtonBackgroundImage: (color) => spinButtonArrowSvg(color),
  scrollbarStyles: (theme: Theme) => ({
    "&::-webkit-scrollbar": { width: "0.5em", cursor: "default !important" },
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
  logo: "/src/assets/dragonlance/ComfyUI_temp_cgiua_00012_.png",
  trackColors: { low: "#3f8f4f", mid: "#d97a1f", high: "#a8222a" },
  // The game-title text rendered over the (often bright — fire, sky,
  // parchment) hero banner in App.tsx. A thin outline in the theme's own
  // dark-red (secondary.dark, "#5c0f14") instead of flat black — guarantees
  // contrast against any background brightness like a black outline would,
  // but reads as a dark blood/dragon-scale edge rather than a cartoon
  // sticker line. Disables the ember-flicker `animation` every other h2
  // gets, since that keyframe animates `text-shadow` itself each frame and
  // would override (undo) this outline on every tick.
  titleOverlayStyle: {
    color: "#fdf0d8",
    // Disables the ember-flicker `animation` every other h2 gets, since
    // that keyframe animates `text-shadow` itself each frame and would
    // override (undo) the static outline below.
    animation: "none",
    textShadow: titleOutlineTextShadow("#5c0f14"),
  },
});
