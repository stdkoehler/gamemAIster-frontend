import { PaletteColor, Theme } from "@mui/material/styles";

// Declare custom theme properties
declare module "@mui/material/styles" {
  interface Theme {
    spinButtonBackgroundImage: (color: string) => string;
    scrollbarStyles: (theme: Theme) => Record<string, any>;
    logo: string;
    titleOverlayStyle?: Record<string, any>;
    trackColors: { low: string; mid: string; high: string };
    // Highlight color for chrome that should follow a theme's "active"
    // accent (e.g. the selected character-sheet tab) rather than its
    // dominant primary color. Falls back to primary when unset.
    accentColor?: string;
  }
  interface ThemeOptions {
    spinButtonBackgroundImage?: (color: string) => string;
    scrollbarStyles?: (theme: Theme) => Record<string, any>;
    logo?: string;
    titleOverlayStyle?: Record<string, any>;
    trackColors?: { low: string; mid: string; high: string };
    accentColor?: string;
  }
  // Allow new color names if you add them to palette
  interface PaletteOptions {
    // Example: if you add a 'tertiary' color
    // tertiary?: PaletteColorOptions;
  }
  interface Palette {
    // tertiary: PaletteColor;
  }
}

// --- TYPE-SAFE HELPER FOR GETTING PALETTE COLORS ---

// Define a union type for known palette color keys that have a 'main' shade
export type ThemeColorWithMain =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success";

/**
 * Safely retrieves a 'main' color string from the theme palette.
 * @param theme The MUI theme object.
 * @param colorPropValue The color string, usually from ownerState.color.
 * @returns The main shade of the color, or a fallback.
 */
export function getSafePaletteColor(
  theme: Theme,
  colorPropValue?: string
): string {
  const defaultColor =
    theme.palette.primary?.main || theme.palette.text.primary || "#000000";

  if (!colorPropValue) {
    return defaultColor;
  }

  // Check if it's a standard palette color key (primary, secondary, etc.)
  if (
    ["primary", "secondary", "error", "warning", "info", "success"].includes(
      colorPropValue
    )
  ) {
    const key = colorPropValue as ThemeColorWithMain;
    const paletteColor = theme.palette[key];
    if (
      paletteColor &&
      typeof paletteColor === "object" &&
      "main" in paletteColor
    ) {
      return (paletteColor as { main: string }).main;
    }
  }

  // Check if it refers to a text color (e.g., Typography ownerState.color might be 'textPrimary')
  if (colorPropValue === "textPrimary" && theme.palette.text?.primary) {
    return theme.palette.text.primary;
  }
  if (colorPropValue === "textSecondary" && theme.palette.text?.secondary) {
    return theme.palette.text.secondary;
  }
  if (colorPropValue === "inherit") {
    // For inherit, we can't easily determine the shadow color without context,
    // so fall back to a sensible default like text.primary or the theme's primary.
    return theme.palette.text.primary || defaultColor;
  }

  // If colorPropValue was something like "primary" (e.g. from a default prop)
  // and it wasn't caught above but is a valid key.
  const keyCheck = colorPropValue as ThemeColorWithMain;
  if (
    theme.palette[keyCheck] &&
    typeof theme.palette[keyCheck] === "object" &&
    "main" in theme.palette[keyCheck]
  ) {
    return (theme.palette[keyCheck] as { main: string }).main;
  }

  return defaultColor;
}

// --- SHARED BUILDING BLOCKS FOR PER-SYSTEM THEMES ---
//
// Every theme in src/themes/<system>.ts independently re-derives the same
// handful of structural pieces (a color-key resolver for MuiButton, the
// MuiCssBaseline transition/scroll-behavior reset, the focus-glow mask on
// MuiInputLabel, the spin-button arrow SVG). Those pieces are identical in
// *shape* across themes and differ only in which colors/numbers get passed
// in — exactly the kind of thing that gets silently missed in one theme
// when a fix lands in another (see CLAUDE.md's "CSS specificity gotcha").
// Pulling them out here means a future fix only needs to land once.
//
// What's deliberately NOT here: anything that encodes a theme's actual
// creative identity (its text-shadow "feel", card textures, animations,
// clipPaths, font choices, Typography scale). Those vary too much in
// substance — not just in color — to generalize without flattening what
// makes each theme distinct.

/**
 * Resolves `ownerState.color` (e.g. on a Button) to that color's full
 * `PaletteColor` (main/light/dark/contrastText), defaulting to `primary`
 * for unset/unknown/"inherit" values. Replaces the ~15-line colorKey
 * lookup block duplicated near-verbatim in every theme's MuiButton (and
 * some MuiTypography) `styleOverrides.root`.
 */
export function resolveButtonPalette(
  theme: Theme,
  colorPropValue?: string
): PaletteColor {
  const known: ThemeColorWithMain[] = [
    "primary",
    "secondary",
    "error",
    "warning",
    "info",
    "success",
  ];
  const key = known.includes(colorPropValue as ThemeColorWithMain)
    ? (colorPropValue as ThemeColorWithMain)
    : "primary";
  return theme.palette[key] ?? theme.palette.primary;
}

/**
 * Picks a button's text color from its resolved PaletteColor, preferring
 * `contrastText` but falling back to `main` when contrastText is literal
 * black — MUI's default palette gives warning/info/success a black
 * contrastText, which disappears against the translucent/gradient button
 * backgrounds these themes use.
 */
export function resolveButtonTextColor(paletteColor: PaletteColor): string {
  const { contrastText, main } = paletteColor;
  return contrastText && contrastText !== "#000000" && contrastText !== "#000"
    ? contrastText
    : main;
}

/**
 * The MuiCssBaseline rules every theme sets character-for-character
 * identically: a blanket color/background/border/shadow transition (so
 * switching themes, or any of the focus/hover accent swaps elsewhere in
 * these themes, animates instead of snapping), and `html, body` sized to
 * fill the viewport with smooth-scroll. `transitionDuration` covers the
 * one theme (Expanse) that uses 0.2s instead of the otherwise-universal
 * 0.3s.
 */
export function baseCssBaselineRules(transitionDuration: string = "0.3s") {
  return {
    "*, *::before, *::after": {
      transition: `background-color ${transitionDuration}, color ${transitionDuration}, border-color ${transitionDuration}, box-shadow ${transitionDuration}`,
    },
    "html, body": {
      height: "100%",
      scrollBehavior: "smooth",
    },
  };
}

/**
 * Shape shared by every theme's `a` (link) rule inside MuiCssBaseline:
 * a base color, no underline, and a hover state that shifts to a second
 * color with a matching glow. Each theme picks its own two colors.
 */
export function linkHoverStyle(baseColor: string, hoverColor: string) {
  return {
    color: baseColor,
    textDecoration: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      color: hoverColor,
      textShadow: `0 0 8px ${hoverColor}80`,
    },
  };
}

/**
 * The `&.Mui-focused` mask on MuiInputLabel: every theme whose
 * MuiInputBase/MuiOutlinedInput grows a blurred focus-glow box-shadow
 * needs this, or that glow bleeds up into the floating label sitting on
 * the border line (the label otherwise has nothing else covering it).
 * Fully generic — no per-theme color/number inputs, since it's meant to
 * leave the label's own color alone and just block what's behind it.
 */
export function inputLabelFocusMaskStyle(theme: Theme) {
  return {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    padding: "0 4px",
    borderRadius: theme.shape.borderRadius,
  };
}

/**
 * The up/down spin-button arrow glyph used by `spinButtonBackgroundImage`.
 * Every theme's version is the same `viewBox 0 0 24 48` SVG with
 * round caps/joins; they differ only in stroke width and whether the
 * arrows are drawn as two `<polyline>`s or one two-stroke `<path>`.
 */
export function spinButtonArrowSvg(
  color: string,
  options?: { strokeWidth?: number; doublePolyline?: boolean }
): string {
  const strokeWidth = options?.strokeWidth ?? 1.25;
  const shape = options?.doublePolyline
    ? "<polyline points='6 30 12 36 18 30'></polyline><polyline points='6 18 12 12 18 18'></polyline>"
    : "<path d='M6 30 L12 36 L18 30 M6 18 L12 12 L18 18'/>";
  return `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='${strokeWidth}' stroke-linecap='round' stroke-linejoin='round'>${shape}</svg>`
  )}")`;
}
