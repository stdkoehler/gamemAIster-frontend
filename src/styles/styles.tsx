import { useTheme, Palette, PaletteColor, alpha, Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";

type KeysByType<O, T> = {
  [K in keyof O]-?: T extends O[K] ? K : never;
}[keyof O];

export type Colors = KeysByType<Palette, PaletteColor>;

export const menuStyle = (theme: Theme) => ({
  "& .MuiButtonBase-root.MuiMenuItem-root:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    textShadow: `0 0 6px ${theme.palette.primary.main}`,
    transition: "all 0.2s ease-in-out",
    color: theme.palette.primary.main,
  },
  "& .MuiButtonBase-root.MuiMenuItem-root": {
    color: theme.palette.text.primary,
  },
  "& .MuiList-root.MuiMenu-list": {
    padding: "8px",
  },
  "& .MuiPaper-root.MuiPopover-paper.MuiMenu-paper": {
    color: theme.palette.primary.main,
  },
  // No background/border/shadow override here (previously flattened to a
  // solid color with an inset-ring border) — left to the theme's own
  // MuiPaper styling so this menu matches every other popup/dropdown
  // (Create NPC, Dice, the mission dialogs) instead of looking like a
  // separate, plainer control.
});

// Deliberately thin: the input itself (text color, label, border in all its
// states, popup background) is left to the theme's own MuiInputBase /
// MuiOutlinedInput / MuiInputLabel / MuiPaper overrides — the same ones
// every other input and popup in the app gets — instead of hardcoding
// primary/magenta here. That hardcoding used to fight the theme's own
// focus-accent rule (e.g. Shadowrun's cyan), producing a mixed-color
// outline, and forced the label to glow magenta even where the rest of the
// app leaves plain labels alone. Only the parts with no theme-level
// equivalent (icon buttons, option highlighting) are still set here,
// using the theme's own primary color rather than a separate hardcoded one.
export const autocompleteStyle = (theme: Theme) => {
  const baseColor = theme.palette.primary.main;

  return {
    "& .MuiButtonBase-root.MuiIconButton-root.MuiAutocomplete-popupIndicator": {
      color: theme.palette.primary.light,
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: alpha(baseColor, 0.12),
        textShadow: `0 0 4px ${baseColor}`, // Neon glow
      },
    },
    "& .MuiButtonBase-root.MuiIconButton-root.MuiAutocomplete-clearIndicator": {
      color: theme.palette.primary.light,
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: alpha(baseColor, 0.12),
        textShadow: `0 0 4px ${baseColor}`, // Neon glow
      },
    },
    "& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused": {
      backgroundColor: alpha(baseColor, 0.12),
      textShadow: `0 0 4px ${baseColor}`, // Glow on focus
    },
  };
};

export function AutocompletePaper({
  children,
  className,
  ...other
}: React.HTMLAttributes<HTMLElement>) {
  const theme = useTheme();
  return (
    <Paper
      // Autocomplete passes its own className (incl. `MuiAutocomplete-paper`,
      // which the listbox styling below targets) and other props — incl. an
      // inline `style` with the width it computed to match the input — to
      // whatever component is given as the `paper` slot. Previously these
      // were silently dropped, leaving the popup to size/position itself
      // however the browser's default flow happened to lay it out instead
      // of matching the input, instead of properly tracking it.
      className={className}
      {...other}
      sx={{
        // No background/border/shadow overrides here — this lets the
        // dropdown inherit the theme's own MuiPaper styling (gradient,
        // texture, accent border) instead of a flat color with a plain
        // inset-ring border, matching Create NPC / Dice / the character
        // sheet rather than looking like a separate, plainer control.
        color: theme.palette.primary.main,
        "& .MuiAutocomplete-listbox": {
          padding: "8px",
          "& .MuiAutocomplete-option[aria-selected='true']": {
            bgcolor: alpha(theme.palette.primary.main, 0.16),
            "&.Mui-focused": {
              bgcolor: alpha(theme.palette.primary.main, 0.12),
            },
          },
          "& .MuiAutocomplete-option.Mui-focused": {
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            textShadow: `0 0 4px ${theme.palette.primary.main}`,
          },
        },
      }}
    >
      {children}
    </Paper>
  );
}

// Pure positioning for a centered modal Box/Paper — no background, border,
// or shadow opinions, so it can be layered onto a plain Box (which needs
// all of that specified) or onto a Paper (which already supplies its own
// themed background/border/shadow and would double up if given more).
export const modalPositionStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 4,
};

// Adds the loading spinner modal's own flat background + accent-colored
// outline on top of the positioning above. Kept deliberately plain (not a
// themed Paper) since it's a tiny, transient, content-free overlay — see
// BaseMissionModal below for the textured-Paper look used by the actual
// mission dialogs.
export const modalStyle = (theme: Theme) => {
  const accentMain = theme.accentColor ?? theme.palette.primary.main;
  const accentDark = theme.accentColor ?? theme.palette.primary.dark;
  return {
    ...modalPositionStyle,
    bgcolor: theme.palette.background.default,
    border: `1px solid ${accentDark}`,
    boxShadow: `0 0 12px ${alpha(accentMain, 0.25)}`,
    borderRadius: "8px",
  };
};

// ================================
// CharacterManager styles
// ================================

// Accordion grid style
export const accordionGridStyle = (theme: Theme) => ({
  "& .MuiPaper-root": {
    backgroundImage: "none",
    backgroundColor: theme.palette.background.default,
    boxShadow: `inset 0px 0px 0px 1px ${theme.palette.primary.dark}, 0px 0px 0px 0px #FF0000, 0px 0px 0px 0px #FF0000`,
    "&::before": {
      backgroundColor: theme.palette.background.default,
    },
  },
});

// Card box style
export const cardBoxStyle = (theme: Theme) => ({
  p: 2,
  border: "0px solid",
  borderColor: theme.palette.primary.dark,
  borderRadius: "4px",
});

// Info box and info inner box
export const infoBoxStyle = { my: 2 };
export const infoInnerBoxStyle = { textAlign: "right" as const };

// Cyberware & skills
export const skillsBoxStyle = {
  my: 2,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
};

// Damage grid and component box style
export const trackGridStyle = {
  flexDirection: "row" as const,
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap" as const,
};

export const trackMeterBoxStyle = {
  display: "flex",
  flexDirection: "row" as const,
  alignItems: "center",
  justifyContent: "center",
};

// ================================
// Damage color helpers
// ================================

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

const defaultTrackLow = hexToRgb("#11ea7b");
const defaultTrackMid = hexToRgb("#ffc400");
const defaultTrackHigh = hexToRgb("#e53f7e");

function calculateTransition(
  startColor: { r: number; g: number; b: number },
  endColor: { r: number; g: number; b: number },
  percentage: number,
) {
  const r = Math.round(
    startColor.r + (endColor.r - startColor.r) * (percentage / 100),
  );
  const g = Math.round(
    startColor.g + (endColor.g - startColor.g) * (percentage / 100),
  );
  const b = Math.round(
    startColor.b + (endColor.b - startColor.b) * (percentage / 100),
  );
  return `rgb(${r}, ${g}, ${b})`;
}

export function getTrackColor(
  value: number,
  colors?: { low: string; mid: string; high: string },
) {
  const c1 = colors ? hexToRgb(colors.low) : defaultTrackLow;
  const c2 = colors ? hexToRgb(colors.mid) : defaultTrackMid;
  const c3 = colors ? hexToRgb(colors.high) : defaultTrackHigh;
  const percentage = value * 100;
  if (percentage <= 50) {
    return calculateTransition(c1, c2, percentage * 2);
  } else {
    return calculateTransition(c2, c3, (percentage - 50) * 2);
  }
}

// Used for TextField showing current damage percentage
export const trackInputStyle = (damagePercentage: number) => (theme: Theme) => {
  const damageColor = getTrackColor(damagePercentage, theme.trackColors);

  return {
    padding: "5px 5px 5px 5px",
    width: "40%",
    "& .MuiInputBase-root": {
      color: damageColor,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: damageColor,
    },
    "& .MuiInputBase-root.Mui-disabled": {
      "& > fieldset": {
        borderColor: theme.palette.background.default,
      },
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: damageColor,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: damageColor,
      },
    },
    // Compound (".MuiOutlinedInput-root.Mui-focused", matching the single
    // element that actually carries both classes) rather than two plain
    // classes spread across a descendant chain — same specificity tier as
    // the theme's own focus-border rule, so this doesn't lose to it on
    // source order when both happen to match.
    "& .MuiOutlinedInput-root.Mui-focused": {
      "&:hover fieldset": {
        borderColor: theme.accentColor ?? damageColor,
      },
      "& .MuiOutlinedInput-notchedOutline": {
        // Themes with a dedicated "active" accent (e.g. Shadowrun's cyan)
        // take over the border fully on focus, so the damage-color border
        // doesn't show through alongside it. Themes without one keep the
        // damage-color border as before.
        borderColor: theme.accentColor ?? damageColor,
      },
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      background: `${theme.spinButtonBackgroundImage(damageColor)} no-repeat`,
      width: "2em",
      opacity: 1,
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      borderTopRightRadius: "0.25rem",
      borderBottomRightRadius: "0.25rem",
    },
  };
};

export const textfieldStyle = (color: Colors) => (theme: Theme) => {
  const baseColor = theme.palette[color].main;
  const editColor = theme.palette[color].light;
  const darkColor = theme.palette[color].dark;

  return {
    display: "flex",
    width: "100%",
    paddingTop: 0,
    "& .MuiInputBase-root": {
      color: editColor,
      transition: "all 0.2s ease-in-out",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: darkColor,
    },
    "& .MuiInputBase-root.Mui-disabled": {
      "& > fieldset": {
        borderColor: theme.palette.background.default,
      },
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: baseColor,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: baseColor,
      },
    },
    ".MuiOutlinedInput-root.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        // Themes with a dedicated "active" accent (e.g. Shadowrun's cyan)
        // take over the border fully on focus, so the field's own base
        // color doesn't show through alongside it. Themes without one keep
        // the base-color border as before.
        borderColor: theme.accentColor ?? darkColor,
      },
      "&:hover fieldset": {
        borderColor: baseColor,
      },
      "& .MuiInputBase-input": {
        // The theme's own global focus rule already swaps this text's
        // *glow* to the accent color — without also swapping the fill
        // color here, the letters stayed the field's base color underneath
        // an accent-colored glow, reading as a mismatched, off color
        // rather than a clean accent takeover.
        color: theme.accentColor ?? editColor,
      },
    },
  };
};
