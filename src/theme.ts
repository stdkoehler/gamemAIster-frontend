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
function bloodTextShadow(theme: Theme, ownerStateColor?: string): string {
  const baseColor = theme.palette.primary.main; // Always use primary (blood red) for this effect
  return `0px 0px 1px rgba(0,0,0,0.7), 0 0 3px ${baseColor}99, 0 0 7px ${baseColor}60`;
}

// Subtle text shadow for body text
function subtleGothicShadow(_theme: Theme): string { 
  return `0px 1px 2px rgba(0,0,0,0.5)`;
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

const vampireFontFamily = '"IM Fell English SC", "Georgia", serif'; 
const vampireModernFontFamily = '"Cormorant Garamond", "Georgia", serif'; 
const vampireDisplayFontFamily = '"Cinzel Decorative", serif'; 
const vampireSansFontFamily = '"Trajan Pro", "Trajan", "Optima", sans-serif'; 
const vampireHeadingFontFamily = '"Merlinn", Cinzel Decorative, "IM Fell English SC", "Georgia", serif'; 

const cthulhuFontFamily = '"Libre Baskerville", "Times New Roman", serif'; 
const cthulhuHeadingFontFamily = '"Playfair Display", "Times New Roman", serif'; 
const cthulhuMonoFontFamily = '"Courier Prime", "Courier New", monospace'; 

// --- Your Themes with Fixes ---

export const shadowrunTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#f392ff", 
      main: "#d500f9", 
      dark: "#9e00c5", 
      contrastText: "#f392ff", 
    },
    secondary: {
      light: "#fff350", 
      main: "#ffc400", 
      dark: "#b28900", 
      contrastText: "#fff350", 
    },
    warning: {
      light: "#ffac42", 
      main: "#ff7f00", 
      dark: "#c55e00", 
      contrastText: "#000000", 
    },
    error: {
      light: "#ff6f6f", 
      main: "#ff0000", 
      dark: "#c70000", 
      contrastText: "#ffffff", 
    },
    info: {
      light: "#6effff", 
      main: "#00e5ff", 
      dark: "#00b2cc", 
      contrastText: "#000000", 
    },
    success: {
      light: "#76ff03", 
      main: "#4caf50", 
      dark: "#00701a", 
      contrastText: "#000000", 
    },
    background: {
      default: "#0c0c0f", 
      paper: "#1a1a1f",   
    },
    text: {
      primary: "#e0e0e0", 
      secondary: "#a0a0a0", 
      disabled: "#616161", 
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
        root: ({ theme, ownerState }: { theme: Theme; ownerState: any }) => ({
          fontFamily: defaultMonospaceFontFamily,
          textShadow: neonTextShadow(theme, ownerState.color || 'primary'),
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
          const colorKey = (ownerState.color &&
            ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(ownerState.color) &&
            ownerState.color !== 'inherit') 
            ? ownerState.color as ThemeColorWithMain
            : 'primary';

          const buttonPalette = theme.palette[colorKey] || theme.palette.primary;
          const mainColorUsed = (buttonPalette as any).main || theme.palette.primary.main;
          const lightColorUsed = (buttonPalette as any).light || theme.palette.primary.light;
          const textColorUsed = (buttonPalette as any).contrastText && (buttonPalette as any).contrastText !== '#000000' && (buttonPalette as any).contrastText !== '#000'
                            ? (buttonPalette as any).contrastText
                            : mainColorUsed;


          return {
            fontFamily: defaultMonospaceFontFamily,
            textShadow: neonTextShadow(theme, ownerState.color), 
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: mainColorUsed + '33',
            boxShadow: `0 0 5px ${mainColorUsed}33`,
            borderRadius: "2px",
            padding: "6px 18px",
            color: textColorUsed,
            '&:hover': {
              borderColor: lightColorUsed + '33',
              backgroundColor: mainColorUsed + '33', 
              boxShadow: `0 0 10px ${mainColorUsed}99`, 
            },
            ...theme.scrollbarStyles(theme),
          };
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          textShadow: neonTextShadow(theme, ownerState.color),
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
  spinButtonBackgroundImage: (color) => 
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
  logo: "/src/assets/shadowrun/sr_00096_.png", 
});


export const vampireTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#ff6659", 
      main: "#c00000",  
      dark: "#870000",  
      contrastText: "#e6c5c1"
    },
    secondary: {
      light: "#c095d5", 
      main: "#7b1fa2",  
      dark: "#4a0072",  
      contrastText: "#d8c1e6"
    },
    warning: {
      light: "#ffc947", 
      main: "#a98f5b",  
      dark: "#6d5a38",  
      contrastText: "#e6e2c1",
    },
    error: {
      light: "#ff5252", 
      main: "#b71c1c",  
      dark: "#7f0000",  
      contrastText: "#ffffff", 
    },
    info: {
      light: "#90a4ae", 
      main: "#546e7a",  
      dark: "#29434e",  
      contrastText: "#f5f5f5",
    },
    success: {
      light: "#81c784",
      main: "#3a5741",  
      dark: "#1b4032",  
      contrastText: "#f5f5f5",
    },
    background: {
      default: "#14100f", 
      paper: "#1d1515",   
    },
    text: {
      primary: "#e6c5c1",
      secondary: "#bdb3ad", 
      disabled: "#6c5f5f", 
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
        body: ({ theme }) => ({
          background: `radial-gradient(circle at 50% 50%, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }),
        'a': ({ theme }) => ({
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
        root: ({ theme, ownerState }: { theme: Theme; ownerState: any }) => ({
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
            backgroundColor: `${theme.palette.primary.main}14`, 
            color: theme.palette.text.primary,
            textShadow: bloodTextShadow(theme, ownerState.color),
            letterSpacing: '0.06em',
            '&::after': {
              opacity: 1
            }
          },
          '&.Mui-selected': {
            backgroundColor: `${theme.palette.primary.main}26`, 
            color: theme.palette.primary.light,
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}40`, 
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
          const mainColorUsed = buttonPalette.main;
          const lightColorUsed = buttonPalette.light;
          const contrastTextColorUsed = buttonPalette.contrastText;

          return {
            fontFamily: vampireSansFontFamily,
            textShadow: subtleGothicShadow(theme),
            letterSpacing: '0.1em',
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${mainColorUsed}77`,
            padding: "8px 20px",
            minHeight: '44px',
            color: contrastTextColorUsed,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              borderColor: lightColorUsed,
              backgroundColor: `${mainColorUsed}26`, 
              boxShadow: `0 0 10px ${mainColorUsed}55, inset 0 0 8px ${mainColorUsed}33`,
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
          const mainColorUsed = buttonPalette.main;
          
          return {
            color: mainColorUsed,
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
          borderColor: `${theme.palette.primary.main}33`, 
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
        root: ({ theme }) => ({ // theme is used by bloodTextShadow
          padding: '16px 16px 0 16px',
        }),
        title: ({ theme }: { theme: Theme }) => ({
          fontFamily: vampireSansFontFamily,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontSize: '1.1rem',
          textShadow: bloodTextShadow(theme, 'primary'),
        }),
        subheader: ({ theme }: { theme: Theme }) => ({
          fontFamily: vampireModernFontFamily,
          fontStyle: 'italic',
          fontSize: '0.9rem',
          color: theme.palette.text.secondary,
        })
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: () => ({ // theme removed
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px',
          }
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: () => ({ // theme removed
          padding: '8px 16px 16px 16px',
          justifyContent: 'flex-end',
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `${theme.palette.background.default}CC`, 
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          },
          borderLeft: `1px solid ${theme.palette.primary.main}33`, 
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.primary.main}26`, 
          '&.Mui-expanded': {
            minHeight: 48,
            background: `${theme.palette.primary.main}14`, 
          }
        }),
        content: () => ({ // theme removed
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
          borderBottom: `1px solid ${theme.palette.primary.main}1A`, 
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
          background: `${theme.palette.primary.dark}1A`, 
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
        input: ({ theme }: { theme: Theme }) => ({
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
        notchedOutline: ({ theme }) => ({
          borderColor: 'rgba(255, 255, 255, 0.15)',
          transition: 'all 0.3s ease',
        }),
        root: ({ theme }) => ({
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.primary.main}66`, 
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
          borderBottom: `1px solid ${theme.palette.primary.main}33`, 
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
            backgroundColor: `${theme.palette.primary.main}26`, 
            borderColor: `${theme.palette.primary.main}4D`, 
            color: theme.palette.primary.light,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: `${theme.palette.secondary.main}26`, 
            borderColor: `${theme.palette.secondary.main}4D`, 
            color: theme.palette.secondary.light,
          },
        }),
        label: () => ({ // theme removed
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
        ? theme.palette.primary.main + '40'  
        : theme.palette.primary.dark + '80', 
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
      light: "#6b705c", 
      main: "#3a3a3a", 
      dark: "#1f1f1f", 
      contrastText: "#f0eee4", 
    },
    secondary: {
      light: "#b56576", 
      main: "#6d597a", 
      dark: "#355070", 
      contrastText: "#f0eee4", 
    },
    warning: {
      light: "#cb997e", 
      main: "#a07855", 
      dark: "#774936", 
      contrastText: "#f0eee4", 
    },
    error: {
      light: "#bc4749", 
      main: "#9a031e", 
      dark: "#540b0e", 
      contrastText: "#f0eee4", 
    },
    info: {
      light: "#829399", 
      main: "#5f6f78", 
      dark: "#2e4756", 
      contrastText: "#f0eee4", 
    },
    success: {
      light: "#84a98c", 
      main: "#52796f", 
      dark: "#354f52", 
      contrastText: "#f0eee4", 
    },
    background: {
      default: "#e9e7de", 
      paper: "#f5f3e9", 
    },
    text: {
      primary: "#2e2e2e", 
      secondary: "#5a5a58", 
      disabled: "#a5a5a2", 
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
    borderRadius: 2, 
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
        root: ({ theme, ownerState }: { theme: Theme, ownerState: any}) => ({
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
          const darkColorUsed = (buttonPalette as any).dark || theme.palette.primary.dark;
          const contrastTextColorUsed = (buttonPalette as any).contrastText || theme.palette.primary.contrastText;

          return {
            fontFamily: cthulhuFontFamily,
            textShadow: theme.palette.mode === 'light' ? 'none' : antiquarianTextShadow(theme, ownerState.color),
            borderRadius: "2px",
            border: `1px solid ${darkColorUsed}66`,
            padding: "8px 16px",
            color: theme.palette.mode === 'light' ? darkColorUsed : contrastTextColorUsed,
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.paper : 'transparent',
            boxShadow: theme.palette.mode === 'light' 
              ? '0 2px 4px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)'
              : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: darkColorUsed,
              backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : darkColorUsed + '33',
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
        color: "textPrimary", 
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
            maxWidth: "1400px", 
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
        ? theme.palette.primary.main + '40'  
        : theme.palette.primary.dark + '80', 
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