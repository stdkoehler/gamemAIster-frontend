import { createTheme, Theme } from "@mui/material/styles";

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
type ThemeColorWithMain = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/**
 * Safely retrieves a 'main' color string from the theme palette.
 * @param theme The MUI theme object.
 * @param colorPropValue The color string, usually from ownerState.color.
 * @returns The main shade of the color, or a fallback.
 */
function getSafePaletteColor(theme: Theme, colorPropValue?: string): string {
  const defaultColor = theme.palette.primary?.main || theme.palette.text.primary || '#000000';

  if (!colorPropValue) {
    return defaultColor;
  }

  // Check if it's a standard palette color key (primary, secondary, etc.)
  if (['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(colorPropValue)) {
    const key = colorPropValue as ThemeColorWithMain;
    const paletteColor = theme.palette[key];
    if (paletteColor && typeof paletteColor === 'object' && 'main' in paletteColor) {
      return (paletteColor as { main: string }).main;
    }
  }

  // Check if it refers to a text color (e.g., Typography ownerState.color might be 'textPrimary')
  if (colorPropValue === 'textPrimary' && theme.palette.text?.primary) {
    return theme.palette.text.primary;
  }
  if (colorPropValue === 'textSecondary' && theme.palette.text?.secondary) {
    return theme.palette.text.secondary;
  }
  if (colorPropValue === 'inherit') {
      // For inherit, we can't easily determine the shadow color without context,
      // so fall back to a sensible default like text.primary or the theme's primary.
      return theme.palette.text.primary || defaultColor;
  }

  // If colorPropValue was something like "primary" (e.g. from a default prop)
  // and it wasn't caught above but is a valid key.
  const keyCheck = colorPropValue as ThemeColorWithMain;
  if (theme.palette[keyCheck] && typeof theme.palette[keyCheck] === 'object' && 'main' in theme.palette[keyCheck]) {
      return (theme.palette[keyCheck] as { main: string }).main;
  }

  return defaultColor;
}

// --- REVISED TEXT SHADOW FUNCTIONS ---

// Generic text shadow (similar to user's original, but safer color retrieval)
function commonTextShadow(theme: Theme, ownerStateColor?: string, intensity: string = '4px'): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  return `0 0 ${intensity} ${color}`;
}

// Specific text shadow style for a more "neon glow" effect (good for Shadowrun)
function neonTextShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  // A slightly more intense glow than before, ensuring visibility
  return `0 0 1px ${color}, 0 0 4px ${color}, 0 0 12px ${color}`;
}

// Specific text shadow for a more "gothic/subtle" effect (good for Vampire)
function gothicTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  return `1px 1px 2px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)'}, 0 0 6px ${baseColor}99`;
}

function antiquarianTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  // Subtle sepia-toned shadow for an aged paper effect
  return theme.palette.mode === 'light' 
    ? `1px 1px 1px rgba(98, 74, 46, 0.3), 0 0 2px ${baseColor}40`
    : `1px 1px 2px rgba(0, 0, 0, 0.5), 0 0 3px ${baseColor}60`;
}



// --- FONT DEFINITIONS (as before) ---
const defaultMonospaceFontFamily = '"Share Tech Mono", "Courier New", monospace';
const vampireFontFamily = '"IM Fell English SC", "Georgia", serif'; // Google Font IM Fell English SC is very thematic

const cthulhuFontFamily = '"Libre Baskerville", "Times New Roman", serif'; // Classic serif for 1920s feel
const cthulhuHeadingFontFamily = '"Playfair Display", "Times New Roman", serif'; // Elegant serif for headings
const cthulhuMonoFontFamily = '"Courier Prime", "Courier New", monospace'; // Typewriter-like font

// --- Your Themes with Fixes ---

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
      paper: "#1a1a1f",   // #1a1a1f
    },
    text: {
      primary: "#e0e0e0", // #e0e0e0
      secondary: "#a0a0a0", // #a0a0a0
      disabled: "#616161", // #616161
    },
  },
  typography: {
    fontFamily: defaultMonospaceFontFamily,
    allVariants: {
      fontFamily: defaultMonospaceFontFamily,
      color: "#e0e0e0",
    },
    h1: { letterSpacing: "0.05em", textTransform: "uppercase" },
    h2: { letterSpacing: "0.05em", textTransform: "uppercase" },
    h3: { letterSpacing: "0.03em", textTransform: "uppercase" },
    button: {
      fontFamily: defaultMonospaceFontFamily,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 600,
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: defaultMonospaceFontFamily,
          textShadow: neonTextShadow(theme, ownerState.color || 'primary'), // ownerState.color is not standard on MenuItem, will use 'primary'
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark + '66',
            color: theme.palette.primary.light,
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          // Determine the color key safely, defaulting to 'primary'
          const colorKey = (ownerState.color &&
            ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(ownerState.color) &&
            ownerState.color !== 'inherit') // Exclude 'inherit' from direct palette key usage
            ? ownerState.color as ThemeColorWithMain
            : 'primary';

          const buttonPalette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = (buttonPalette as any).main || theme.palette.primary.main;
          const lightColor = (buttonPalette as any).light || theme.palette.primary.light;
          // For button text color, prioritize contrastText. If not suitable, use the main color itself (might need adjustment based on bg)
          const textColor = (buttonPalette as any).contrastText && (buttonPalette as any).contrastText !== '#000000' && (buttonPalette as any).contrastText !== '#000'
                            ? (buttonPalette as any).contrastText
                            : mainColor;


          return {
            fontFamily: defaultMonospaceFontFamily,
            textShadow: neonTextShadow(theme, ownerState.color), // ownerState.color is ButtonProps['color']
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: mainColor + '33',
            boxShadow: `0 0 5px ${mainColor}33`,
            borderRadius: "2px",
            padding: "6px 18px",
            color: textColor,
            '&:hover': {
              borderColor: lightColor + '33',
              backgroundColor: mainColor + '33', // 33 specifies opacity in hex 0x33 = 0.2
              boxShadow: `0 0 10px ${mainColor}99`, // 99 specifies opacity in hex 0x99 = 0.6
            },
            ...theme.scrollbarStyles(theme),
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        // User's original had "primary", my suggestion "textPrimary".
        // Let's stick to user's original for this part, though "textPrimary" is often better.
        color: "primary",
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: defaultMonospaceFontFamily,
          // ownerState.color for Typography can be 'primary', 'textPrimary', 'error', etc.
          textShadow: neonTextShadow(theme, ownerState.color),
          // If defaultProps.color is "primary", ownerState.color will be "primary".
          // If it's explicitly set e.g. <Typography color="textSecondary">, ownerState.color is "textSecondary".
          // getSafePaletteColor will handle these.
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontFamily: defaultMonospaceFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1700px",
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
  },
  spinButtonBackgroundImage: (color) => // `color` here is expected to be a valid CSS color string
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 30 12 36 18 30'></polyline><polyline points='6 18 12 12 18 18'></polyline></svg>`
    )}")`,
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
      outline: "1px solid",
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark + 'AA',
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/shadowrun/sr_00096_.png", // User's original logo
});


export const vampireTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#ff6659", // #ff6659
      main: "#c00000",  // #c00000
      dark: "#870000",  // #870000
      contrastText: "#ff6659", // #ff6659
    },
    secondary: {
      light: "#ab47bc", // #ab47bc
      main: "#7b1fa2",  // #7b1fa2
      dark: "#4a0072",  // #4a0072
      contrastText: "#ab47bc", // #ab47bc
    },
    warning: {
      light: "#ffc947", // #ffc947
      main: "#b8860b",  // #b8860b
      dark: "#825a00",  // #825a00
      contrastText: "#000000", // #000000
    },
    error: {
      light: "#ef5350", // #ef5350
      main: "#d32f2f",  // #d32f2f
      dark: "#c62828",  // #c62828
      contrastText: "#ffffff", // #ffffff
    },
    info: {
      light: "#90a4ae", // #90a4ae
      main: "#607d8b",  // #607d8b
      dark: "#34515e",  // #34515e
      contrastText: "#f5f5f5", // #f5f5f5
    },
    success: {
      light: "#81c784", // #81c784
      main: "#4a7c59",  // #4a7c59
      dark: "#1b5e20",  // #1b5e20
      contrastText: "#f5f5f5", // #f5f5f5
    },
    background: {
      default: "#1a1a1a", // #1a1a1a
      paper: "#1d1818",   // #1d1818
    },
    text: {
      primary: "#e0e0e0", // #e0e0e0
      secondary: "#a09797", // #a09797
      disabled: "#665e5e", // #665e5e
    },
  },
  typography: {
    fontFamily: vampireFontFamily,
    allVariants: {
      fontFamily: vampireFontFamily,
      color: "#e0e0e0",
    },
    h1: { fontFamily: '"Cinzel Decorative", serif', fontWeight: 700, letterSpacing: '0.02em' },
    h2: { fontFamily: vampireFontFamily, fontWeight: 600 },
    h3: { fontFamily: vampireFontFamily, fontStyle: 'italic' },
    button: {
      fontFamily: vampireFontFamily,
      textTransform: "capitalize",
      fontWeight: 500,
      letterSpacing: "0.05em",
    },
    body1: { lineHeight: 1.65 }
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: vampireFontFamily,
          textShadow: gothicTextShadow(theme, ownerState.color || 'primary'),
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark + '99',
            color: theme.palette.text.primary,
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const colorKey = (ownerState.color &&
            ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(ownerState.color) &&
            ownerState.color !== 'inherit')
            ? ownerState.color as ThemeColorWithMain
            : 'primary';

          const buttonPalette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = (buttonPalette as any).main || theme.palette.primary.main;
          const darkColor = (buttonPalette as any).dark || theme.palette.primary.dark;
          const contrastTextColor = (buttonPalette as any).contrastText || theme.palette.primary.contrastText;

          return {
            fontFamily: vampireFontFamily,
            textShadow: gothicTextShadow(theme, ownerState.color),
            borderRadius: "2px",
            border: `1px solid ${darkColor}77`,
            padding: "7px 15px",
            color: contrastTextColor,
            '&:hover': {
              borderColor: mainColor,
              backgroundColor: darkColor + '55',
              boxShadow: `0 0 8px ${mainColor}77`,
            },
            ...theme.scrollbarStyles(theme),
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "primary", // User's original
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: vampireFontFamily,
          textShadow: gothicTextShadow(theme, ownerState.color),
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontFamily: vampireFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1700px",
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
  },
  spinButtonBackgroundImage: (color) =>
    `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 30 L12 36 L18 30 M6 18 L12 12 L18 18'/></svg>`
    )}")`,
  scrollbarStyles: (theme: Theme) => ({
    "&::-webkit-scrollbar": {
      width: "0.6em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0,0,0,0.2)",
      boxShadow: `inset 0 0 8px ${theme.palette.background.paper}`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.dark + '80',
      outline: `1px solid ${theme.palette.secondary.dark + '60'}`,
      borderRadius: "2px",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark + 'AA',
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/vampire/vtm_00004_.png",
});

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
      letterSpacing: '0.01em',
      textTransform: "none",
      fontSize: "2.2rem",
      color: "#1a1a1a"
    },
    h2: { 
      fontFamily: cthulhuHeadingFontFamily, 
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontSize: "1.8rem",
      color: "#1a1a1a"
    },
    h3: { 
      fontFamily: cthulhuHeadingFontFamily, 
      fontWeight: 600,
      fontStyle: 'normal',
      fontSize: "1.5rem",
      color: "#1a1a1a"
    },
    h4: {
      fontFamily: cthulhuHeadingFontFamily,
      fontWeight: 600,
      fontSize: "1.3rem",
      color: "#1f1f1f"
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
      letterSpacing: "0.01em"
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem"
    },
    caption: {
      fontFamily: cthulhuMonoFontFamily,
      fontSize: "0.85rem",
      color: "#5f5f5f"
    },
    subtitle1: {
      fontFamily: cthulhuHeadingFontFamily,
      fontStyle: "italic",
      fontSize: "1.1rem"
    },
    subtitle2: {
      fontFamily: cthulhuFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#5f5f5f"
    }
  },
  shape: {
    borderRadius: 2, // Slightly rounded corners for a vintage feel
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 
            theme.palette.mode === 'light' 
              ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%23a9a9a9\' fill-opacity=\'0.05\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E")'
              : 'none',
          boxShadow: theme.palette.mode === 'light' 
            ? '0 2px 8px rgba(98, 74, 46, 0.15), 0 1px 3px rgba(0,0,0,0.05)'
            : '0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0,0,0,0.1)'
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: cthulhuFontFamily,
          textShadow: antiquarianTextShadow(theme, ownerState.color || 'primary'),
          color: theme.palette.text.primary,
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.dark,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '3px',
              left: '10%',
              width: '80%',
              height: '1px',
              backgroundColor: theme.palette.secondary.main + '99',
            }
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const colorKey = (ownerState.color &&
            ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(ownerState.color) &&
            ownerState.color !== 'inherit')
            ? ownerState.color as ThemeColorWithMain
            : 'primary';

          const buttonPalette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = (buttonPalette as any).main || theme.palette.primary.main;
          const darkColor = (buttonPalette as any).dark || theme.palette.primary.dark;
          const contrastTextColor = (buttonPalette as any).contrastText || theme.palette.primary.contrastText;

          return {
            fontFamily: cthulhuFontFamily,
            textShadow: theme.palette.mode === 'light' ? 'none' : antiquarianTextShadow(theme, ownerState.color),
            borderRadius: "2px",
            border: `1px solid ${darkColor}66`,
            padding: "8px 16px",
            color: theme.palette.mode === 'light' ? darkColor : contrastTextColor,
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.paper : 'transparent',
            boxShadow: theme.palette.mode === 'light' 
              ? '0 2px 4px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)'
              : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: darkColor,
              backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : darkColor + '33',
              boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(1px)',
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
          fontFamily: cthulhuFontFamily,
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
          '& a': {
            color: theme.palette.secondary.dark,
            textDecoration: 'none',
            borderBottom: `1px solid ${theme.palette.secondary.main}66`,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: theme.palette.secondary.main,
              borderBottomColor: theme.palette.secondary.main,
            }
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&::before, &::after': {
            borderTop: `thin solid ${theme.palette.text.secondary}33`
          },
          '&.MuiDivider-textAlignCenter::before, &.MuiDivider-textAlignCenter::after': {
            borderTop: `thin solid ${theme.palette.text.secondary}33`
          }
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: theme.palette.mode === 'light' 
            ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%23a9a9a9\' fill-opacity=\'0.06\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E")'
            : 'none',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
          border: `1px solid ${theme.palette.text.secondary}11`,
          // Slightly yellowish border for aged paper look
          borderColor: theme.palette.mode === 'light' ? 'rgba(98, 74, 46, 0.15)' : 'transparent'
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: 'none',
          border: `1px solid ${theme.palette.text.secondary}22`,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
          }
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: 'relative',
          '&::before': {
            content: '"•"',
            color: theme.palette.secondary.main,
            position: 'absolute',
            left: '-0.8em',
            fontSize: '1.2em',
            opacity: 0,
            transition: 'opacity 0.2s ease'
          },
          '&:hover::before': {
            opacity: 1
          }
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.text.secondary}22`,
          // Very subtle texture for tables
          backgroundImage: theme.palette.mode === 'light' 
            ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%23a9a9a9\' fill-opacity=\'0.03\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E")'
            : 'none',
        }),
        head: ({ theme }) => ({
          fontFamily: cthulhuHeadingFontFamily,
          color: theme.palette.primary.dark,
          fontWeight: 600,
          fontSize: '0.95rem'
        })
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          transition: 'background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s'
        },
        'html, body': {
          height: '100%',
          scrollBehavior: 'smooth'
        }
      }
    }
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
      backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)',
      boxShadow: theme.palette.mode === 'light' ? 'none' : `inset 0 0 6px ${theme.palette.background.paper}`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.mode === 'light' 
        ? theme.palette.primary.main + '40'  // Lighter for light mode
        : theme.palette.primary.dark + '80', // Darker for dark mode
      border: theme.palette.mode === 'light' 
        ? `1px solid ${theme.palette.primary.light + '30'}`
        : `1px solid ${theme.palette.primary.dark + '60'}`,
      borderRadius: "2px",
      "&:hover": {
        backgroundColor: theme.palette.mode === 'light'
          ? theme.palette.primary.main + '60'
          : theme.palette.primary.dark + 'AA',
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/vampire/vtm_00004_.png",
});