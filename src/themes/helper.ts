import { Theme } from "@mui/material/styles";

// Declare custom theme properties
declare module "@mui/material/styles" {
  interface Theme {
    spinButtonBackgroundImage: (color: string) => string;
    scrollbarStyles: (theme: Theme) => Record<string, any>;
    logo: string;
  }
  interface ThemeOptions {
    spinButtonBackgroundImage?: (color: string) => string;
    scrollbarStyles?: (theme: Theme) => Record<string, any>;
    logo?: string;
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
