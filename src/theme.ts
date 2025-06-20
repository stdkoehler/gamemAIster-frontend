import { createTheme, Theme } from "@mui/material/styles";
import { GameType } from "./models/Types";

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
// function commonTextShadow(theme: Theme, ownerStateColor?: string, intensity: string = '4px'): string {
//   const color = getSafePaletteColor(theme, ownerStateColor);
//   return `0 0 ${intensity} ${color}`;
// }

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

// Enhanced blood text shadow for important elements
function bloodTextShadow(theme: Theme, _?: string): string {
  const baseColor = theme.palette.primary.main; // Always use primary (blood red) for this effect
  return `0px 0px 1px rgba(0,0,0,0.7), 0 0 3px ${baseColor}99, 0 0 7px ${baseColor}60`;
}

// Subtle text shadow for body text
function subtleGothicShadow(_: Theme): string {
  return `0px 1px 2px rgba(0,0,0,0.5)`;
}


function antiquarianTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  // Subtle sepia-toned shadow for an aged paper effect
  return theme.palette.mode === 'light' 
    ? `1px 1px 1px rgba(98, 74, 46, 0.3), 0 0 2px ${baseColor}40`
    : `1px 1px 2px rgba(0, 0, 0, 0.5), 0 0 3px ${baseColor}60`;
}


// Specific text shadow style for a "nautical glow" effect (good for 7th Sea)
function nauticalTextShadow(theme: Theme, ownerStateColor?: string): string {
  const color = getSafePaletteColor(theme, ownerStateColor);
  // A warm, lantern-like glow reminiscent of ship's lanterns
  return `0 0 2px ${color}, 0 0 6px ${color}88, 0 0 10px ${color}44`;
}

// Specific text shadow for weathered/aged effect (good for old maritime documents)
function weatheredTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  return theme.palette.mode === 'dark' 
    ? `1px 1px 2px rgba(0,0,0,0.8), 0 0 4px ${baseColor}66`
    : `1px 1px 3px rgba(139, 116, 85, 0.6), 0 0 6px ${baseColor}77`;
}

// Enhanced ocean text shadow for important elements
function oceanTextShadow(theme: Theme, _?: string): string {
  const baseColor = theme.palette.primary.main; // Always use primary (ocean blue) for this effect
  return `0px 0px 1px rgba(0,0,0,0.6), 0 0 4px ${baseColor}AA, 0 0 8px ${baseColor}55`;
}

// Subtle text shadow for body text
function subtleMaritimeShadow(theme: Theme): string {
  return theme.palette.mode === 'dark'
    ? `0px 1px 2px rgba(0,0,0,0.7)`
    : `0px 1px 2px rgba(101, 87, 67, 0.4)`;
}

// Antique text shadow for an aged parchment effect
function antiqueTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = getSafePaletteColor(theme, ownerStateColor);
  // Sepia-toned shadow for an aged paper/map effect
  return theme.palette.mode === 'light' 
    ? `1px 1px 1px rgba(139, 116, 85, 0.4), 0 0 3px ${baseColor}50`
    : `1px 1px 2px rgba(0, 0, 0, 0.6), 0 0 4px ${baseColor}70`;
}

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


// --- FONT DEFINITIONS (as before) ---
const defaultMonospaceFontFamily = '"Share Tech Mono", "Courier New", monospace';

const vampireFontFamily = '"IM Fell English SC", "Georgia", serif'; // Base font for that classic vampire feel
const vampireModernFontFamily = '"Cormorant Garamond", "Georgia", serif'; // More modern elegant serif
const vampireDisplayFontFamily = '"Cinzel Decorative", serif'; // Ornate display font for headings
const vampireSansFontFamily = '"Trajan Pro", "Trajan", "Optima", sans-serif'; // Clan-like sans font
const vampireHeadingFontFamily = '"Merlinn", Cinzel Decorative, "IM Fell English SC", "Georgia", serif'; // Use Merlinn as primary heading font

const cthulhuFontFamily = '"Libre Baskerville", "Times New Roman", serif'; // Classic serif for 1920s feel
const cthulhuHeadingFontFamily = '"Playfair Display", "Times New Roman", serif'; // Elegant serif for headings
const cthulhuMonoFontFamily = '"Courier Prime", "Courier New", monospace'; // Typewriter-like font

// 7th Sea font families - nautical and period-appropriate
const seventhSeaFontFamily = '"Libre Baskerville", "Baskerville", "Times New Roman", serif'; // Base serif for readability
const seventhSeaModernFontFamily = '"Crimson Text", "Georgia", serif'; // More modern elegant serif
const seventhSeaDisplayFontFamily = '"Pirata One", "Blackadder ITC", cursive'; // Pirate-style display font
const seventhSeaSansFontFamily = '"Cinzel", "Optima", "Gill Sans", sans-serif'; // Elegant caps font for headers
const seventhSeaScriptFontFamily = '"Kaushan Script", "Brush Script MT", cursive'; // Handwritten script for flavor
const seventhSeaHeadingFontFamily = '"Pirata One", "Cinzel", "Libre Baskerville", serif'; // Primary heading font

// Epanse font families
const expanseModernFontFamily = '"Orbitron", "Roboto Condensed", "Arial", sans-serif'; // Primary sci-fi font
const expanseDisplayFontFamily = '"Audiowide", "Orbitron", sans-serif'; // Bold display font for headings
const expanseBodyFontFamily = '"Roboto", "Arial", sans-serif'; // Clean readable font for body text
const expanseMonoFontFamily = '"Roboto Mono", "Courier New", monospace'; // Monospace for tech/data displays
const expanseHeadingFontFamily = '"Exo 2", "Audiowide", "Orbitron", sans-serif'; // Main heading font


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
    h1: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "2.3rem",
      color: "#f392ff"
    },
    h2: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "1.8rem",
      color: "#d500f9"
    },
    h3: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 600,
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      fontSize: "1.4rem",
      color: "#ffc400"
    },
    h4: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 500,
      fontSize: "1.15rem",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "#fff350"
    },
    h5: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 500,
      fontSize: "1.05rem",
      letterSpacing: "0.03em",
      color: "#a0a0a0"
    },
    h6: {
      fontFamily: defaultMonospaceFontFamily,
      fontWeight: 500,
      fontSize: "0.95rem",
      letterSpacing: "0.02em",
      color: "#a0a0a0"
    },
    subtitle1: {
      fontFamily: defaultMonospaceFontFamily,
      fontStyle: "italic",
      fontSize: "1.05rem",
      color: "#e0e0e0"
    },
    subtitle2: {
      fontFamily: defaultMonospaceFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#a0a0a0"
    },
    button: {
      fontFamily: defaultMonospaceFontFamily,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 600,
      fontSize: "1rem",
      color: "#fff350"
    },
    body1: {
      lineHeight: 1.7,
      letterSpacing: "0.01em",
      fontSize: "1rem",
      color: "#e0e0e0"
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem",
      color: "#a0a0a0"
    },
    caption: {
      fontFamily: defaultMonospaceFontFamily,
      fontStyle: "italic",
      fontSize: "0.85rem",
      color: "#616161"
    }
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
      light: "#ff6659", // Blood red, slightly brighter
      main: "#c00000",  // Deep blood red
      dark: "#870000",  // Dark dried blood
      contrastText: "#e6c5c1"//"#e8e6e3", // Off-white, easier on eyes than pure white
    },
    secondary: {
      light: "#c095d5", // Light purple - more vibrant for accents
      main: "#7b1fa2",  // Rich purple (Lasombra/Tremere vibes)
      dark: "#4a0072",  // Deep purple
      contrastText: "#d8c1e6"//"#e8e6e3", // Off-white, easier on eyes than pure white
    },
    warning: {
      light: "#ffc947", // Gold (Ventrue)
      main: "#a98f5b",  // Antique gold
      dark: "#6d5a38",  // Tarnished gold
      contrastText: "#e6e2c1",
    },
    error: {
      light: "#ff5252", // Brighter red
      main: "#b71c1c",  // Deep crimson
      dark: "#7f0000",  // Very dark red
      contrastText: "#ffffff", // White
    },
    info: {
      light: "#90a4ae", // Blueish gray
      main: "#546e7a",  // Steel blue-gray (Nosferatu)
      dark: "#29434e",  // Dark navy
      contrastText: "#f5f5f5",
    },
    success: {
      light: "#81c784",
      main: "#3a5741",  // Forest green (Gangrel)
      dark: "#1b4032",  // Deep green
      contrastText: "#f5f5f5",
    },
    background: {
      default: "#14100f", // Very dark reddish-black
      paper: "#1d1515",   // Dark burgundy-black
    },
    text: {
      primary: "#e6c5c1",//"#e8e6e3", // Off-white, easier on eyes than pure white
      secondary: "#bdb3ad", // Muted cream
      disabled: "#6c5f5f", // Muted red-gray
    },
  },
  typography: {
    fontFamily: vampireModernFontFamily,
    allVariants: {
      fontFamily: vampireModernFontFamily,
      color: "#e8e6e3",
    },
    h1: { 
      fontFamily: vampireHeadingFontFamily, 
      fontWeight: 700, 
      letterSpacing: '0.03em',
      fontSize: "2.5rem",
      margin: "0.5em 0 0.7em"
    },
    h2: { 
      fontFamily: vampireDisplayFontFamily, 
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontSize: "2rem"
    },
    h3: { 
      fontFamily: vampireSansFontFamily,
      fontWeight: 500,
      fontSize: "1.7rem",
      letterSpacing: '0.04em',
      textTransform: "uppercase"
    },
    h4: {
      fontFamily: vampireSansFontFamily,
      fontWeight: 500,
      fontSize: "1.4rem",
      letterSpacing: '0.06em',
      textTransform: "uppercase"
    },
    h5: {
      fontFamily: vampireFontFamily,
      fontSize: "1.2rem",
      letterSpacing: '0.03em',
    },
    h6: {
      fontFamily: vampireFontFamily,
      fontSize: "1.1rem",
      letterSpacing: '0.02em',
    },
    subtitle1: {
      fontFamily: vampireModernFontFamily,
      fontStyle: "italic",
      fontSize: "1.1rem"
    },
    subtitle2: {
      fontFamily: vampireModernFontFamily,
      fontStyle: "italic",
      fontSize: "0.95rem",
      color: "#bdb3ad"
    },
    button: {
      fontFamily: vampireSansFontFamily,
      textTransform: "uppercase",
      fontWeight: 500,
      letterSpacing: "0.08em",
    },
    body1: { 
      lineHeight: 1.7,
      letterSpacing: "0.01em",
      fontSize: "1rem" 
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.95rem"
    },
    caption: {
      fontFamily: vampireModernFontFamily,
      fontStyle: "italic",
      fontSize: "0.85rem",
      color: "#9c8e87"
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [
          {
            fontFamily: 'Merlinn',
            src: 'url(/src/assets/Merlinn.ttf) format("truetype")',
            fontWeight: 'normal',
            fontStyle: 'normal',
          },
        ],
        '*, *::before, *::after': {
          transition: 'background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s'
        },
        'html, body': {
          height: '100%',
          scrollBehavior: 'smooth'
        },
        body: ({ theme }: { theme: Theme }) => ({
          background: `radial-gradient(circle at 50% 50%, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }),
        'a': ({ theme }: { theme: Theme }) => ({
          color: theme.palette.primary.main,
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: theme.palette.primary.light,
            textShadow: `0 0 8px ${theme.palette.primary.light}80`,
          }
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}B3, ${theme.palette.background.default}E6)`,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          borderRadius: theme.shape.borderRadius,
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
          borderRight: '1px solid rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.light}4D, transparent)`,
          }
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: vampireSansFontFamily,
          textShadow: subtleGothicShadow(theme),
          color: theme.palette.text.secondary,
          letterSpacing: '0.05em',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          position: 'relative',
          paddingTop: '0.7rem',
          paddingBottom: '0.7rem',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '5%',
            width: '90%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}4D, transparent)`,
            opacity: 0,
            transition: 'opacity 0.3s ease'
          },
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}14`, // rgba(192, 0, 0, 0.08) equivalent
            color: theme.palette.text.primary,
            textShadow: bloodTextShadow(theme, ownerState.color),
            letterSpacing: '0.06em',
            '&::after': {
              opacity: 1
            }
          },
          '&.Mui-selected': {
            backgroundColor: `${theme.palette.primary.main}26`, // rgba(192, 0, 0, 0.15) equivalent
            color: theme.palette.primary.light,
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}40`, // rgba(192, 0, 0, 0.25) equivalent
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
          const mainColor = buttonPalette.main;
          const lightColor = buttonPalette.light;
          const contrastTextColor = buttonPalette.contrastText;

          return {
            fontFamily: vampireSansFontFamily,
            textShadow: subtleGothicShadow(theme),
            letterSpacing: '0.1em',
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${mainColor}77`,
            padding: "8px 20px",
            minHeight: '44px',
            color: contrastTextColor,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              borderColor: lightColor,
              backgroundColor: `${mainColor}26`, // Converting hex to rgba with 0.15 opacity
              boxShadow: `0 0 10px ${mainColor}55, inset 0 0 8px ${mainColor}33`,
            },
            ...theme.scrollbarStyles(theme),
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "textPrimary", // Using text.primary for better contrast
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          // if we don't overwrite color here, if color = "primary" is passed, primary.main will be used.
          const colorKey = (ownerState.color &&
            ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(ownerState.color) &&
            ownerState.color !== 'inherit')
            ? ownerState.color as ThemeColorWithMain
            : 'primary';

          const buttonPalette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = buttonPalette.main;

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith('h') ? 
              gothicTextShadow(theme, ownerState.color) : 
              subtleGothicShadow(theme),
            ...theme.scrollbarStyles(theme),
          }
        },
        h1: ({ theme }) => ({
          textShadow: bloodTextShadow(theme, 'primary'),
          '&::after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '1px',
            marginTop: '0.2em',
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}77, transparent)`,
          }
        }),
        h2: ({ theme }) => ({
          textShadow: bloodTextShadow(theme, 'primary'),
          '&::after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '1px',
            marginTop: '0.2em',
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}55, transparent)`,
          }
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontFamily: vampireModernFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1500px",
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: `${theme.palette.primary.main}33`, // rgba(192, 0, 0, 0.2) equivalent
          '&::before, &::after': {
            borderTop: `thin solid ${theme.palette.primary.main}33`
          },
          '&.MuiDivider-textAlignCenter': {
            '&::before, &::after': {
              borderTop: `thin solid ${theme.palette.primary.main}33`
            }
          }
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}B3`,
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}B3, ${theme.palette.background.default}E6)`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          borderRadius: theme.shape.borderRadius,
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
          borderRight: '1px solid rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}4D, transparent)`,
          }
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ }) => ({
          padding: '16px 16px 0 16px',
        }),
        title: ({ theme }) => ({
          fontFamily: vampireSansFontFamily,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontSize: '1.1rem',
          textShadow: bloodTextShadow(theme, 'primary'),
        }),
        subheader: ({ theme }) => ({
          fontFamily: vampireModernFontFamily,
          fontStyle: 'italic',
          fontSize: '0.9rem',
          color: theme.palette.text.secondary,
        })
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({  }) => ({
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px',
          }
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({  }) => ({
          padding: '8px 16px 16px 16px',
          justifyContent: 'flex-end',
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `${theme.palette.background.default}CC`, // rgba(20, 12, 12, 0.8) equivalent
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          },
          borderLeft: `1px solid ${theme.palette.primary.main}33`, // rgba(192, 0, 0, 0.2) equivalent
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.main}26`, // rgba(192, 0, 0, 0.15) equivalent
          '&.Mui-expanded': {
            minHeight: 48,
            background: `${theme.palette.primary.main}14`, // rgba(192, 0, 0, 0.08) equivalent
          }
        }),
        content: ({  }) => ({
          '&.Mui-expanded': {
            margin: '12px 0',
          }
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: 'relative',
          borderBottom: `1px solid ${theme.palette.primary.main}1A`, // rgba(192, 0, 0, 0.1) equivalent
          '&::before': {
            content: '"•"',
            color: theme.palette.primary.main,
            position: 'absolute',
            left: 0,
            opacity: 0,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transform: 'translateX(-8px)',
          },
          '&:hover::before': {
            opacity: 1,
            transform: 'translateX(0)',
          }
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.dark}33`,
          padding: '12px 16px',
        }),
        head: ({ theme }) => ({
          color: theme.palette.primary.light,
          fontFamily: vampireSansFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '0.9rem',
          fontWeight: 500,
          textShadow: bloodTextShadow(theme, 'primary'),
          background: `${theme.palette.primary.dark}1A`, // rgba(135, 0, 0, 0.1) equivalent
        })
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: vampireModernFontFamily,
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&.Mui-focused': {
            boxShadow: `0 0 0 1px ${theme.palette.primary.main}77, 0 0 8px ${theme.palette.primary.main}33`,
            borderColor: `${theme.palette.primary.main}77`,
          },
          '&:hover': {
            borderColor: `${theme.palette.primary.main}44`,
          }
        }),
        input: ({ theme }) => ({
          padding: '10px 14px',
          '&::placeholder': {
            color: theme.palette.text.disabled,
            fontStyle: 'italic',
          }
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({  }) => ({
          borderColor: 'rgba(255, 255, 255, 0.15)',
          transition: 'all 0.3s ease',
        }),
        root: ({ theme }) => ({
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.primary.main}66`, // rgba(192, 0, 0, 0.4) equivalent
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.primary.main}77`,
          }
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.main}33`, // rgba(192, 0, 0, 0.2) equivalent
        }),
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          height: 2,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: vampireSansFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.85rem',
          minHeight: 48,
          transition: 'all 0.3s ease',
          '&:hover': {
            color: theme.palette.primary.light,
            textShadow: bloodTextShadow(theme, 'primary'),
          },
          '&.Mui-selected': {
            color: theme.palette.primary.light,
            textShadow: bloodTextShadow(theme, 'primary'),
          }
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: vampireSansFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '0.75rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&.MuiChip-colorPrimary': {
            backgroundColor: `${theme.palette.primary.main}26`, // rgba(192, 0, 0, 0.15) equivalent
            borderColor: `${theme.palette.primary.main}4D`, // rgba(192, 0, 0, 0.3) equivalent
            color: theme.palette.primary.light,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: `${theme.palette.secondary.main}26`, // rgba(123, 31, 162, 0.15) equivalent
            borderColor: `${theme.palette.secondary.main}4D`, // rgba(123, 31, 162, 0.3) equivalent
            color: theme.palette.secondary.light,
          },
        }),
        label: ({  }) => ({
          paddingLeft: 12,
          paddingRight: 12,
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
        '@font-face': [
          {
            fontFamily: 'Merlinn',
            src: 'url(/src/assets/Merlinn.ttf) format("truetype")',
            fontWeight: 'normal',
            fontStyle: 'normal',
          },
        ],
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
  logo: "/src/assets/callofcthulhu/coc_00354_.png",
});

export const seventhSeaTheme = createTheme({
// palette: {
//   mode: "dark",
//   primary: {
//     light: "#7a8a97", // Weathered steel blue
//     main: "#3f4c5c",  // Muted naval gray-blue
//     dark: "#2a333e",  // Ship hull dark blue-gray
//     contrastText: "#eae2d0" // Old sail canvas
//   },
//   secondary: {
//     light: "#b58c50", // Faded brass
//     main: "#8c5c2f",  // Tarnished bronze
//     dark: "#5d3a1e",  // Dark aged wood
//     contrastText: "#eae2d0" // Same parchment-like cream
//   },
//   warning: {
//     light: "#c2a249", // Dull gold
//     main: "#a1742b",  // Antique gold
//     dark: "#714f1c",  // Deep brass
//     contrastText: "#1e1e1e", // Near-black
//   },
//   error: {
//     light: "#b06b6b", // Dried blood red
//     main: "#7e3e3e",  // Rusty red
//     dark: "#5a2d2d",  // Dark blood
//     contrastText: "#f4f0e6", // Aged parchment
//   },
//   info: {
//     light: "#7a9473", // Seaweed green
//     main: "#556b4e",  // Mossy olive
//     dark: "#384836",  // Swamp dark
//     contrastText: "#eae2d0",
//   },
//   success: {
//     light: "#849c82", // Weathered green
//     main: "#5a7157",  // Verdant moss
//     dark: "#3b4d38",  // Deep forest floor
//     contrastText: "#eae2d0",
//   },
//   background: {
//     default: "#13110f", // Pitch dark wood
//     paper: "#1c1a17",   // Aged deck planks
//   },
//   text: {
//     primary: "#eae2d0", // Aged parchment
//     secondary: "#c2b49a", // Faded ink
//     disabled: "#8b7760", // Weathered leather
//   },
// },

// typography: {
//   fontFamily: seventhSeaFontFamily,
//   allVariants: {
//     fontFamily: seventhSeaFontFamily,
//     color: "#eae2d0", // Main parchment tone
//   },
//   h1: { 
//     fontFamily: seventhSeaHeadingFontFamily, 
//     fontWeight: 700, 
//     letterSpacing: '0.02em',
//     fontSize: "2.5rem",
//     margin: "0.5em 0 0.7em",
//     color: "#f1e7cf", // Highlighted parchment
//   },
//   h2: { 
//     fontFamily: seventhSeaDisplayFontFamily, 
//     fontWeight: 600,
//     letterSpacing: '0.01em',
//     fontSize: "2rem",
//     color: "#dfd3b8", // Slightly faded
//   },
//   h3: { 
//     fontFamily: seventhSeaSansFontFamily,
//     fontWeight: 500,
//     fontSize: "1.7rem",
//     letterSpacing: '0.03em',
//     textTransform: "uppercase",
//     color: "#cbb899", // Ink-worn tone
//   },
//   h4: {
//     fontFamily: seventhSeaSansFontFamily,
//     fontWeight: 500,
//     fontSize: "1.4rem",
//     letterSpacing: '0.05em',
//     textTransform: "uppercase",
//     color: "#cbb899",
//   },
//   h5: {
//     fontFamily: seventhSeaFontFamily,
//     fontSize: "1.2rem",
//     letterSpacing: '0.02em',
//     color: "#bca98d", // Very faded parchment
//   },
//   h6: {
//     fontFamily: seventhSeaFontFamily,
//     fontSize: "1.1rem",
//     letterSpacing: '0.01em',
//     color: "#bca98d",
//   },
//   subtitle1: {
//     fontFamily: seventhSeaScriptFontFamily,
//     fontStyle: "normal",
//     fontSize: "1.1rem",
//     color: "#d3c2a6", // Antique margin note
//   },
//   subtitle2: {
//     fontFamily: seventhSeaModernFontFamily,
//     fontStyle: "italic",
//     fontSize: "0.95rem",
//     color: "#b4a287", // Muted ink
//   },
//   button: {
//     fontFamily: seventhSeaSansFontFamily,
//     textTransform: "uppercase",
//     fontWeight: 500,
//     letterSpacing: "0.06em",
//     color: "#e0d6c0", // Paper-like cream
//   },
//   body1: { 
//     lineHeight: 1.7,
//     letterSpacing: "0.01em",
//     fontSize: "1rem",
//     color: "#eae2d0", // Core body text
//   },
//   body2: {
//     lineHeight: 1.6,
//     fontSize: "0.95rem",
//     color: "#c2b49a", // Secondary text
//   },
//   caption: {
//     fontFamily: seventhSeaModernFontFamily,
//     fontStyle: "italic",
//     fontSize: "0.85rem",
//     color: "#9c8b75", // Aged ink fade
//   },
// },
palette: {
  mode: "dark",
  primary: {
    light: "#FAE4A0", // aged parchment
    main: "#D8B868",  // golden parchment
    dark: "#8A6B30",  // darkened edge parchment
    contrastText: "#FAE4A0" // dark ink
  },
  secondary: {
    light: "#EFB058", // treasure amber
    main: "#B75B27",  // worn leather
    dark: "#5A2F18",  // scorched wood
    contrastText: "#FDF3D0" // faded sailcloth
  },
  warning: {
    light: "#FFC060", // bright brass
    main: "#D68730",  // aged brass
    dark: "#A04E0A",
    contrastText: "#D68730",
  },
  error: {
    light: "#D46A4C", // blood red
    main: "#7A3020",  // dried blood
    dark: "#501210",
    contrastText: "#FDF3D0",
  },
  info: {
    light: "#C0A97D", // aged jungle map
    main: "#89754E",  // expedition gear
    dark: "#574622",
    contrastText: "#F5F0E6",
  },
  success: {
    light: "#A8A86D", // mossy gold
    main: "#67663A",  // faded foliage
    dark: "#36311C",
    contrastText: "#F5F0E6",
  },
  background: {
    default: "#13110f", // Pitch dark wood
    paper: "#1c1a17",   // Aged deck planks
  },
  text: {
    primary: "#A39880", // deep ink
    secondary: "#aa8c5e", // faded brown ink
    disabled: "#2D1C0C", // dusted ink
  },
},
typography: {
  fontFamily: seventhSeaFontFamily,
  allVariants: {
    fontFamily: seventhSeaFontFamily,
    color: "#2D1C0C",  // inked text
  },
  h1: {
    fontFamily: seventhSeaHeadingFontFamily,
    fontWeight: 700,
    fontSize: "2.5rem",
    letterSpacing: '0.02em',
    margin: "0.5em 0 0.7em",
    color: "#4A3010",  // deep sepia
  },
  h2: {
    fontFamily: seventhSeaDisplayFontFamily,
    fontWeight: 600,
    letterSpacing: '0.01em',
    fontSize: "2rem",
    color: "#5A3E21",
  },
  h3: {
    fontFamily: seventhSeaSansFontFamily,
    fontWeight: 500,
    fontSize: "1.7rem",
    letterSpacing: '0.03em',
    textTransform: "uppercase",
    color: "#5A4A32",
  },
  h4: {
    fontFamily: seventhSeaSansFontFamily,
    fontWeight: 500,
    fontSize: "1.4rem",
    letterSpacing: '0.05em',
    textTransform: "uppercase",
    color: "#6D5A3F",
  },
  h5: {
    fontFamily: seventhSeaFontFamily,
    fontSize: "1.2rem",
    letterSpacing: '0.02em',
    color: "#7A664C",
  },
  h6: {
    fontFamily: seventhSeaFontFamily,
    fontSize: "1.1rem",
    letterSpacing: '0.01em',
    color: "#7A664C",
  },
  subtitle1: {
    fontFamily: seventhSeaScriptFontFamily,
    fontStyle: "normal",
    fontSize: "1.1rem",
    color: "#6C5438",
  },
  subtitle2: {
    fontFamily: seventhSeaModernFontFamily,
    fontStyle: "italic",
    fontSize: "0.95rem",
    color: "#9A8666",
  },
  button: {
    fontFamily: seventhSeaSansFontFamily,
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "0.06em",
    color: "#2D1C0C",
  },
  body1: {
    lineHeight: 1.7,
    letterSpacing: "0.01em",
    fontSize: "1rem",
    color: "#2D1C0C",
  },
  body2: {
    lineHeight: 1.6,
    fontSize: "0.95rem",
    color: "#5A4A32",
  },
  caption: {
    fontFamily: seventhSeaModernFontFamily,
    fontStyle: "italic",
    fontSize: "0.85rem",
    color: "#A08868",
  },
},

  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [
          {
            fontFamily: 'Pirata One',
            src: 'url(/src/assets/PirataOne-Regular.ttf) format("truetype")',
            fontWeight: 'normal',
            fontStyle: 'normal',
          },
        ],
        '*, *::before, *::after': {
          transition: 'background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s'
        },
        'html, body': {
          height: '100%',
          scrollBehavior: 'smooth'
        },
        body: ({ theme }: { theme: Theme }) => ({
          background: 
            `radial-gradient(ellipse at top, ${theme.palette.primary.dark}22 0%, transparent 50%),
            radial-gradient(ellipse at bottom, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
          ,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }),
        'a': ({ theme }: { theme: Theme }) => ({
          color: theme.palette.secondary.main,
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: theme.palette.secondary.light,
            textShadow: `0 0 8px ${theme.palette.secondary.light}80`,
          }
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(135deg, ${theme.palette.background.paper}CC, ${theme.palette.background.default}E6)`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          borderRadius: theme.shape.borderRadius,
          borderTop: '1px solid rgba(245, 243, 240, 0.08)',
          borderLeft: '1px solid rgba(245, 243, 240, 0.06)',
          borderRight: '1px solid rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}60, transparent)`,
          }
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: seventhSeaSansFontFamily,
          textShadow: subtleMaritimeShadow(theme),
          color: theme.palette.text.secondary,
          letterSpacing: '0.04em',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          position: 'relative',
          paddingTop: '0.7rem',
          paddingBottom: '0.7rem',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '5%',
            width: '90%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}60, transparent)`,
            opacity: 0,
            transition: 'opacity 0.3s ease'
          },
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}18`,
            color: theme.palette.text.primary,
            textShadow: nauticalTextShadow(theme, ownerState.color),
            letterSpacing: '0.05em',
            '&::after': {
              opacity: 1
            }
          },
          '&.Mui-selected': {
            backgroundColor: `${theme.palette.primary.main}30`,
            color: theme.palette.primary.light,
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}48`,
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
          const mainColor = buttonPalette.main;
          const lightColor = buttonPalette.light;
          const contrastTextColor = buttonPalette.contrastText;

          return {
            fontFamily: seventhSeaSansFontFamily,
            textShadow: subtleMaritimeShadow(theme),
            letterSpacing: '0.08em',
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${mainColor}88`,
            padding: "8px 20px",
            minHeight: '44px',
            color: contrastTextColor,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${mainColor}20, ${mainColor}10)`,
            '&:hover': {
              borderColor: lightColor,
              backgroundColor: `${mainColor}30`,
              boxShadow: `0 0 12px ${mainColor}66, inset 0 0 10px ${mainColor}40`,
              textShadow: nauticalTextShadow(theme, ownerState.color),
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
          const colorKey = (ownerState.color &&
            ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(ownerState.color) &&
            ownerState.color !== 'inherit')
            ? ownerState.color as ThemeColorWithMain
            : 'primary';

          const buttonPalette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = buttonPalette.main;

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith('h') ? 
              weatheredTextShadow(theme, ownerState.color) : 
              subtleMaritimeShadow(theme),
            ...theme.scrollbarStyles(theme),
          }
        },
        h1: ({ theme }) => ({
          textShadow: oceanTextShadow(theme, 'primary'),
          position: 'relative',
          '&::after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '2px',
            marginTop: '0.3em',
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}88, ${theme.palette.primary.main}66, ${theme.palette.secondary.main}88, transparent)`,
          }
        }),
        h2: ({ theme }) => ({
          textShadow: oceanTextShadow(theme, 'secondary'),
          position: 'relative',
          '&::after': {
            content: '""',
            display: 'block',
            width: '80%',
            height: '1px',
            marginTop: '0.2em',
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}77, transparent)`,
          }
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontFamily: seventhSeaFontFamily,
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1500px",
          },
          ...theme.scrollbarStyles(theme),
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: `${theme.palette.secondary.main}44`,
          '&::before, &::after': {
            borderTop: `thin solid ${theme.palette.secondary.main}44`
          },
          '&.MuiDivider-textAlignCenter': {
            '&::before, &::after': {
              borderTop: `thin solid ${theme.palette.secondary.main}44`
            }
          }
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}CC`,
          backgroundImage: `
            linear-gradient(135deg, ${theme.palette.background.paper}CC, ${theme.palette.background.default}E6),
            linear-gradient(45deg, transparent 40%, ${theme.palette.secondary.main}08 50%, transparent 60%)
          `,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(245, 243, 240, 0.1)',
          borderRadius: theme.shape.borderRadius,
          borderTop: '1px solid rgba(245, 243, 240, 0.08)',
          borderLeft: '1px solid rgba(245, 243, 240, 0.06)',
          borderRight: '1px solid rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}60, transparent)`,
          }
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: () => ({
          padding: '16px 16px 0 16px',
        }),
        title: ({ theme }) => ({
          fontFamily: seventhSeaSansFontFamily,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontSize: '1.1rem',
          textShadow: oceanTextShadow(theme, 'primary'),
        }),
        subheader: ({ theme }) => ({
          fontFamily: seventhSeaScriptFontFamily,
          fontStyle: 'normal',
          fontSize: '0.95rem',
          color: theme.palette.text.secondary,
        })
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: () => ({
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px',
          }
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: () => ({
          padding: '8px 16px 16px 16px',
          justifyContent: 'flex-end',
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `${theme.palette.background.default}DD`,
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 3px 15px rgba(0, 0, 0, 0.4)',
          },
          borderLeft: `2px solid ${theme.palette.secondary.main}44`,
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.secondary.main}33`,
          '&.Mui-expanded': {
            minHeight: 48,
            background: `${theme.palette.primary.main}18`,
          }
        }),
        content: () => ({
          '&.Mui-expanded': {
            margin: '12px 0',
          }
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: 'relative',
          borderBottom: `1px solid ${theme.palette.secondary.main}22`,
          '&::before': {
            content: '"⚓"',
            color: theme.palette.secondary.main,
            position: 'absolute',
            left: 0,
            opacity: 0,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transform: 'translateX(-12px)',
            fontSize: '0.8em',
          },
          '&:hover::before': {
            opacity: 1,
            transform: 'translateX(0)',
          }
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.dark}44`,
          padding: '12px 16px',
        }),
        head: ({ theme }) => ({
          color: theme.palette.secondary.light,
          fontFamily: seventhSeaSansFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '0.9rem',
          fontWeight: 500,
          textShadow: oceanTextShadow(theme, 'secondary'),
          background: `${theme.palette.primary.dark}22`,
        })
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: seventhSeaFontFamily,
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(245, 243, 240, 0.15)',
          transition: 'all 0.3s ease',
          '&.Mui-focused': {
            boxShadow: `0 0 0 1px ${theme.palette.secondary.main}88, 0 0 10px ${theme.palette.secondary.main}44`,
            borderColor: `${theme.palette.secondary.main}88`,
          },
          '&:hover': {
            borderColor: `${theme.palette.secondary.main}55`,
          }
        }),
        input: ({ theme }) => ({
          padding: '10px 14px',
          '&::placeholder': {
            color: theme.palette.text.disabled,
            fontStyle: 'italic',
          }
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: () => ({
          borderColor: 'rgba(245, 243, 240, 0.2)',
          transition: 'all 0.3s ease',
        }),
        root: ({ theme }) => ({
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.secondary.main}77`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.secondary.main}88`,
          }
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.secondary.main}44`,
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
          fontFamily: seventhSeaSansFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '0.85rem',
          minHeight: 48,
          transition: 'all 0.3s ease',
          '&:hover': {
            color: theme.palette.secondary.light,
            textShadow: nauticalTextShadow(theme, 'secondary'),
          },
          '&.Mui-selected': {
            color: theme.palette.secondary.light,
            textShadow: nauticalTextShadow(theme, 'secondary'),
          }
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: seventhSeaSansFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontSize: '0.75rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(245, 243, 240, 0.15)',
          '&.MuiChip-colorPrimary': {
            backgroundColor: `${theme.palette.primary.main}30`,
            borderColor: `${theme.palette.primary.main}60`,
            color: theme.palette.primary.light,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: `${theme.palette.secondary.main}30`,
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
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 48' fill='none' stroke='${color}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 30 L12 36 L18 30 M6 18 L12 12 L18 18'/></svg>`
    )}")`,
  scrollbarStyles: (theme) => ({
    "&::-webkit-scrollbar": {
      width: "0.5em",
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.3)',
      boxShadow: theme.palette.mode === 'light' ? 'none' : `inset 0 0 6px ${theme.palette.background.paper}`,
      borderRadius: "2px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.mode === 'light' 
        ? theme.palette.secondary.main + '50'  // Amber for light mode
        : theme.palette.secondary.dark + '90', // Darker amber for dark mode
      border: theme.palette.mode === 'light' 
        ? `1px solid ${theme.palette.secondary.light + '40'}`
        : `1px solid ${theme.palette.secondary.dark + '70'}`,
      borderRadius: "2px",
      background: theme.palette.mode === 'light'
        ? `linear-gradient(45deg, ${theme.palette.secondary.main}60, ${theme.palette.secondary.light}40)`
        : `linear-gradient(45deg, ${theme.palette.secondary.dark}80, ${theme.palette.secondary.main}60)`,
      "&:hover": {
        backgroundColor: theme.palette.mode === 'light'
          ? theme.palette.secondary.main + '70'
          : theme.palette.secondary.main + 'CC',
        boxShadow: `0 0 4px ${theme.palette.secondary.main}66`,
      },
      cursor: "default !important",
    },
    "&::-webkit-scrollbar-corner": {
      backgroundColor: theme.palette.background.default,
    },
  }),
  logo: "/src/assets/seventh_sea/ComfyUI_temp_kokjp_00005_.png",
});


export const expanseTheme = createTheme({
  palette: {
    mode: "dark",
primary: {
  light: "#a389d0",  // Ion thruster glow
  main: "#70609c",   // Protomolecule activation purple
  dark: "#4b3b94",    // Uranus station at twilight
  contrastText: "#ede7f6" // Ceres station lighting
},
    secondary: {
      light: "#ffb74d", // Orange (Mars)
      main: "#f57c00",  // Deep orange
      dark: "#e65100",  // Burnt orange
      contrastText: "#fff3e0",
    },
    warning: {
      light: "#e57373", // Light red
      main: "#d32f2f",  // Alert red
      dark: "#c62828",  // Dark red
      contrastText: "#ffffff",
    },
    error: {
      light: "#e57373", // Light red
      main: "#d32f2f",  // Alert red
      dark: "#c62828",  // Dark red
      contrastText: "#ffffff",
    },
info: {
  light: "#7c4dff",   // Luminous purple (ionized particles)  
  main: "#5e35b1",    // Core "protomolecule" glow (deep but vibrant)  
  dark: "#311b92",    // Shadowed radiation (ultra-deep purple)  
  contrastText: "#ede7f6", // Soft violet-white (readable on all states)  
},
    success: {
      light: "#81c784",
      main: "#388e3c",  // System green
      dark: "#1b5e20",  
      contrastText: "#e8f5e8",
    },
background: {
  default: "#0c071b",       // Deep cosmic void (almost black with purple undertones)
  paper: "#1e1038",        // Dark "Rocinante hull" purple-gray (elevated surfaces)
},
text: {
  primary: "#f3e5f5",       // Soft violet-white (like Ceres station lighting)
  secondary: "#b39ddb",     // Dusty lavender (muted but legible)
  disabled: "#5e35b1",      // Deep purple with 30% opacity (suggest "disabled" state)
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
      letterSpacing: '0.02em',
      fontSize: "1.8rem",
      margin: "0.5em 0 0.7em",
      textTransform: "uppercase"
    },
    h2: { 
      fontFamily: expanseDisplayFontFamily, 
      fontWeight: 600,
      letterSpacing: '0.05em',
      fontSize: "2.2rem",
      textTransform: "uppercase"
    },
    h3: { 
      fontFamily: expanseModernFontFamily,
      fontWeight: 500,
      fontSize: "1.8rem",
      letterSpacing: '0.08em',
      textTransform: "uppercase"
    },
    h4: {
      fontFamily: expanseModernFontFamily,
      fontWeight: 500,
      fontSize: "1.5rem",
      letterSpacing: '0.06em',
      textTransform: "uppercase"
    },
    h5: {
      fontFamily: expanseModernFontFamily,
      fontSize: "1.3rem",
      letterSpacing: '0.04em',
      fontWeight: 400
    },
    h6: {
      fontFamily: expanseModernFontFamily,
      fontSize: "1.1rem",
      letterSpacing: '0.03em',
      fontWeight: 400
    },
    subtitle1: {
      fontFamily: expanseBodyFontFamily,
      fontSize: "1.1rem",
      fontWeight: 300
    },
    subtitle2: {
      fontFamily: expanseBodyFontFamily,
      fontSize: "0.95rem",
      color: "#90caf9",
      fontWeight: 300
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
      fontFamily: expanseBodyFontFamily
    },
    body2: {
      lineHeight: 1.5,
      fontSize: "0.9rem",
      fontFamily: expanseBodyFontFamily
    },
    caption: {
      fontFamily: expanseMonoFontFamily,
      fontSize: "0.8rem",
      color: "#546e7a",
      letterSpacing: "0.03em"
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [
          {
            fontFamily: 'Exo 2',
            src: 'url(/src/assets/Exo2-Regular.ttf) format("truetype")',
            fontWeight: 'normal',
            fontStyle: 'normal',
          },
        ],
        '*, *::before, *::after': {
          transition: 'background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s'
        },
        'html, body': {
          height: '100%',
          scrollBehavior: 'smooth'
        },
        body: ({ theme }: { theme: Theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #0d1117 50%, ${theme.palette.background.paper} 100%)`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 25% 25%, rgba(1, 87, 155, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(56, 142, 60, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: -1
          }
        }),
        'a': ({ theme }: { theme: Theme }) => ({
          color: theme.palette.primary.light,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: theme.palette.info.light,
            textShadow: `0 0 8px ${theme.palette.info.light}80`,
          }
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(135deg, ${theme.palette.background.paper}E6, ${theme.palette.background.default}CC)`,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}66, transparent)`,
          }
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          fontFamily: expanseModernFontFamily,
          textShadow: subtleTechShadow(theme),
          color: theme.palette.text.secondary,
          letterSpacing: '0.06em',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
          position: 'relative',
          paddingTop: '0.8rem',
          paddingBottom: '0.8rem',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '8%',
            width: '84%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}55, transparent)`,
            opacity: 0,
            transition: 'opacity 0.2s ease'
          },
          '&:hover': {
            backgroundColor: `${theme.palette.info.main}18`,
            color: theme.palette.text.primary,
            textShadow: techGlowShadow(theme, ownerState.color),
            letterSpacing: '0.08em',
            '&::after': {
              opacity: 1
            }
          },
          '&.Mui-selected': {
            backgroundColor: `${theme.palette.info.main}2A`,
            color: theme.palette.info.light,
            '&:hover': {
              backgroundColor: `${theme.palette.info.main}40`,
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
          const mainColor = buttonPalette.main;
          const lightColor = buttonPalette.light;
          const contrastTextColor = buttonPalette.contrastText;

          return {
            fontFamily: expanseModernFontFamily,
            textShadow: subtleTechShadow(theme),
            letterSpacing: '0.12em',
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${mainColor}88`,
            padding: "10px 24px",
            minHeight: '44px',
            color: contrastTextColor,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${mainColor}22, ${mainColor}11)`,
            '&:hover': {
              borderColor: lightColor,
              backgroundColor: `${mainColor}33`,
              boxShadow: `0 0 16px ${mainColor}66, inset 0 0 12px ${mainColor}22`,
              textShadow: `0 0 8px ${lightColor}88`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${lightColor}33, transparent)`,
              transition: 'left 0.5s ease',
            },
            '&:hover::before': {
              left: '100%',
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
          const colorKey = (ownerState.color &&
            ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(ownerState.color) &&
            ownerState.color !== 'inherit')
            ? ownerState.color as ThemeColorWithMain
            : 'primary';

          const palette = theme.palette[colorKey] || theme.palette.primary;
          const mainColor = palette.main;

          return {
            color: mainColor,
            textShadow: ownerState.variant?.startsWith('h') ? 
              techGlowShadow(theme, ownerState.color) : 
              subtleTechShadow(theme),
            ...theme.scrollbarStyles(theme),
          }
        },
        h1: ({ theme }) => ({
          textShadow: holoTextShadow(theme, 'info'),
          '&::after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '2px',
            marginTop: '0.3em',
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}AA, ${theme.palette.primary.main}AA, transparent)`,
          }
        }),
        h2: ({ theme }) => ({
          textShadow: holoTextShadow(theme, 'info'),
          '&::after': {
            content: '""',
            display: 'block',
            width: '80%',
            height: '1px',
            marginTop: '0.3em',
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}77, transparent)`,
          }
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
          '&::before, &::after': {
            borderTop: `thin solid ${theme.palette.info.main}44`
          },
          '&.MuiDivider-textAlignCenter': {
            '&::before, &::after': {
              borderTop: `thin solid ${theme.palette.info.main}44`
            }
          }
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.default}DD`,
          backgroundImage: `linear-gradient(135deg, ${theme.palette.background.paper}E6, ${theme.palette.background.default}CC)`,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.palette.info.main}77, transparent)`,
          }
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ }) => ({
          padding: '20px 20px 0 20px',
        }),
        title: ({ theme }) => ({
          fontFamily: expanseModernFontFamily,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: '1.2rem',
          textShadow: techGlowShadow(theme, 'info'),
        }),
        subheader: ({ theme }) => ({
          fontFamily: expanseBodyFontFamily,
          fontSize: '0.9rem',
          color: theme.palette.text.secondary,
          fontWeight: 300
        })
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({  }) => ({
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          }
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({  }) => ({
          padding: '8px 20px 20px 20px',
          justifyContent: 'flex-end',
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `${theme.palette.background.default}EE`,
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          },
          borderLeft: `2px solid ${theme.palette.info.main}44`,
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.info.main}33`,
          '&.Mui-expanded': {
            minHeight: 48,
            background: `${theme.palette.info.main}18`,
          }
        }),
        content: ({  }) => ({
          '&.Mui-expanded': {
            margin: '12px 0',
          }
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: 'relative',
          borderBottom: `1px solid ${theme.palette.info.main}22`,
          '&::before': {
            content: '"▶"',
            color: theme.palette.info.main,
            position: 'absolute',
            left: 0,
            opacity: 0,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            transform: 'translateX(-8px)',
            fontSize: '0.8rem'
          },
          '&:hover::before': {
            opacity: 1,
            transform: 'translateX(0)',
          }
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.info.dark}44`,
          padding: '14px 18px',
        }),
        head: ({ theme }) => ({
          color: theme.palette.info.light,
          fontFamily: expanseModernFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.85rem',
          fontWeight: 600,
          textShadow: techGlowShadow(theme, 'info'),
          background: `${theme.palette.info.dark}22`,
        })
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: expanseBodyFontFamily,
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          transition: 'all 0.2s ease',
          '&.Mui-focused': {
            boxShadow: `0 0 0 1px ${theme.palette.info.main}88, 0 0 12px ${theme.palette.info.main}44`,
            borderColor: `${theme.palette.info.main}88`,
          },
          '&:hover': {
            borderColor: `${theme.palette.info.main}55`,
          }
        }),
        input: ({ theme }) => ({
          padding: '12px 16px',
          '&::placeholder': {
            color: theme.palette.text.disabled,
            fontFamily: expanseBodyFontFamily,
          }
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({  }) => ({
          borderColor: 'rgba(255, 255, 255, 0.2)',
          transition: 'all 0.2s ease',
        }),
        root: ({ theme }) => ({
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.info.main}77`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.info.main}88`,
          }
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
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '0.8rem',
          minHeight: 48,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: theme.palette.info.light,
            textShadow: techGlowShadow(theme, 'info'),
          },
          '&.Mui-selected': {
            color: theme.palette.info.light,
            textShadow: techGlowShadow(theme, 'info'),
          }
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: expanseModernFontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '0.7rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          '&.MuiChip-colorPrimary': {
            backgroundColor: `${theme.palette.primary.main}33`,
            borderColor: `${theme.palette.primary.main}66`,
            color: theme.palette.primary.light,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: `${theme.palette.secondary.main}33`,
            borderColor: `${theme.palette.secondary.main}66`,
            color: theme.palette.secondary.light,
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: `${theme.palette.info.main}33`,
            borderColor: `${theme.palette.info.main}66`,
            color: theme.palette.info.light,
          },
        }),
        label: ({  }) => ({
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
      backgroundColor: 'rgba(0,0,0,0.3)',
      boxShadow: `inset 0 0 6px ${theme.palette.background.default}`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.dark + 'AA',
      border: `1px solid ${theme.palette.primary.main}66`,
      borderRadius: "2px",
      boxShadow: `0 0 6px ${theme.palette.primary.main}44`,
      "&:hover": {
        backgroundColor: theme.palette.primary.main + 'CC',
        boxShadow: `0 0 8px ${theme.palette.primary.main}77`,
      },
      cursor: "default !important",
    },
  }),
  logo: "/src/assets/expanse/ComfyUI_temp_rpdvh_00062_.png",
});


/**
 * Helper function to get the appropriate theme for a game type
 * @param gameType The game type to get the theme for
 * @returns The corresponding theme object
 */
export function getThemeForGameType(gameType: GameType): Theme {
  switch (gameType) {
    case GameType.VAMPIRE_THE_MASQUERADE:
      return vampireTheme;
    case GameType.CALL_OF_CTHULHU:
      return cthulhuTheme;
    case GameType.SEVENTH_SEA:
      return seventhSeaTheme;
    case GameType.EXPANSE:
      return expanseTheme;
    case GameType.SHADOWRUN:
    default:
      return shadowrunTheme;
  }
}

