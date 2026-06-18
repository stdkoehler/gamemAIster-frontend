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
  "& .MuiPaper-root": {
    backgroundImage: "none",
    backgroundColor: theme.palette.background.default,
    boxShadow: `inset 0px 0px 0px 1px ${
      theme.palette.primary.dark
    }, 0 0 8px ${alpha(theme.palette.primary.main, 0.25)}`,
    borderRadius: "6px",
    "&::before": {
      backgroundColor: theme.palette.background.default,
    },
  },
});

export const autocompleteStyle = (theme: Theme) => {
  const baseColor = theme.palette.primary.main;
  const editColor = theme.palette.primary.light;
  const darkColor = theme.palette.primary.dark;

  return {
    "& .MuiInputBase-root": {
      color: editColor,
      transition: "all 0.2s ease-in-out",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: darkColor, // Set default border color based on colorType
    },
    "& .MuiInputBase-root.Mui-disabled": {
      "& > fieldset": {
        borderColor: theme.palette.background.default, // Use background color from theme
      },
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: baseColor, // Adjust text color when disabled
    },
    // set color when inactive
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: baseColor, // Adjust color on hover
      },
    },
    "& .MuiOutlinedInput-input": {
      "&:hover fieldset": {
        color: editColor, // Adjust color on hover
      },
    },
    // set color when active
    "& .Mui-focused": {
      "&:hover fieldset": {
        borderColor: baseColor, // Adjust color on hover
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: darkColor, // Set border color when focused
      },
    },
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
    "& .MuiFormLabel-root.MuiInputLabel-root": {
      color: theme.palette.primary.light,
      textShadow: `0 0 2px ${theme.palette.primary.main}`, // Futuristic label look
    },
    "& .MuiPaper-root.MuiAutocomplete-paper": {
      backgroundColor: theme.palette.background.default, // Use background color from theme
      boxShadow: `0 0 10px ${alpha(baseColor, 0.3)}`, // Popup glow
    },
    "& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused": {
      backgroundColor: alpha(baseColor, 0.12),
      textShadow: `0 0 4px ${baseColor}`, // Glow on focus
    },
  };
}

export function AutocompletePaper({
  children,
}: React.HTMLAttributes<HTMLElement>) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.default, // Use background color from theme
        color: theme.palette.primary.main,
        boxShadow: `inset 0px 0px 0px 1px ${
          theme.palette.primary.dark
        }, 0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
        borderRadius: "6px",
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

export const modalStyle = (theme: Theme) => ({
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: theme.palette.background.default,
  border: `1px solid ${theme.palette.primary.dark}`,
  boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.25)}`,
  borderRadius: "8px",
  p: 4,
});

// ================================
// CharacterCard & CharacterManager styles
// ================================

// Action Buttons box style
export const actionButtonsBoxStyle = {
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
};

// Individual action button style
export const actionButtonStyle = {
  textAlign: "center" as const,
};

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
export const cyberwareBoxStyle = {
  my: 2,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
};
export const skillsBoxStyle = cyberwareBoxStyle;

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
    "& .Mui-focused": {
      "&:hover fieldset": {
        borderColor: damageColor,
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: damageColor,
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
        borderColor: darkColor, // Focus border
      },
      "&:hover fieldset": {
        borderColor: baseColor,
      },
    },
  };
};
