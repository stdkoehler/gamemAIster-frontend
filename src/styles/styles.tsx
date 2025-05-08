import { useTheme, Palette, PaletteColor, alpha, Paper } from "@mui/material";

type KeysByType<O, T> = {
  [K in keyof O]-?: T extends O[K] ? K : never;
}[keyof O];

export type Colors = KeysByType<Palette, PaletteColor>;

export function MenuStyle() {
  const theme = useTheme();

  return {
    "& .MuiButtonBase-root.MuiMenuItem-root:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      textShadow: `0 0 6px ${theme.palette.primary.main}`, // Neon glow effect
      transition: "all 0.2s ease-in-out",
    },
    "& .MuiList-root.MuiMenu-list": {
      padding: "8px",
    },
    "& .MuiPaper-root.MuiPopover-paper.MuiMenu-paper": {
      color: theme.palette.primary.main,
    },
    "& .MuiPaper-root": {
      backgroundImage: "none",
      backgroundColor: theme.palette.background.default, // Use background color from theme
      boxShadow: `inset 0px 0px 0px 1px ${
        theme.palette.primary.dark
      }, 0 0 8px ${alpha(theme.palette.primary.main, 0.25)}`, // Added outer glow
      borderRadius: "6px",
      "&::before": {
        backgroundColor: theme.palette.background.default, // Use background color from theme
      },
    },
  };
}

export function AutocompleteStyle() {
  const theme = useTheme();

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

export function ModalStyle() {
  const theme = useTheme();
  return {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: theme.palette.background.default, // Use background color from theme
    border: `1px solid ${theme.palette.primary.dark}`, // Slight border for visibility
    boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.25)}`, // Soft glow effect
    borderRadius: "8px",
    p: 4,
  };
}

// ================================
// CharacterCard & CharacterManager styles
// ================================

// Action Buttons box style
export function ActionButtonsBoxStyle() {
  return {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
  };
}

// Individual action button style
export function ActionButtonStyle() {
  return {
    width: "20%",
    textAlign: "center",
  };
}

// Accordion grid style
export function AccordionGridStyle() {
  const theme = useTheme();
  return {
    "& .MuiPaper-root": {
      backgroundImage: "none",
      backgroundColor: theme.palette.background.default,
      boxShadow: `inset 0px 0px 0px 1px ${theme.palette.primary.dark}, 0px 0px 0px 0px #FF0000, 0px 0px 0px 0px #FF0000`,
      "&::before": {
        backgroundColor: theme.palette.background.default,
      },
    },
  };
}

// Card box style
export function CardBoxStyle() {
  const theme = useTheme();
  return {
    p: 2,
    border: "0px solid",
    borderColor: theme.palette.primary.dark,
    borderRadius: "4px",
  };
}

// Info box and info inner box
export function InfoBoxStyle() {
  return { my: 2 };
}

export function InfoInnerBoxStyle() {
  return { textAlign: "right" };
}

// Cyberware & skills
export function CyberwareBoxStyle() {
  return {
    my: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };
}

export const SkillsBoxStyle = CyberwareBoxStyle; // Alias; if future difference, split

// Damage grid and component box style
export function DamageGridStyle() {
  return {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  };
}

export function DamageComponentBoxStyle() {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };
}

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

const color1Rgb = hexToRgb("#11ea7b");
const color2Rgb = hexToRgb("#ffc400");
const color3Rgb = hexToRgb("#e53f7e");

function calculateTransition(
  startColor: { r: number; g: number; b: number },
  endColor: { r: number; g: number; b: number },
  percentage: number
) {
  const r = Math.round(
    startColor.r + (endColor.r - startColor.r) * (percentage / 100)
  );
  const g = Math.round(
    startColor.g + (endColor.g - startColor.g) * (percentage / 100)
  );
  const b = Math.round(
    startColor.b + (endColor.b - startColor.b) * (percentage / 100)
  );
  return `rgb(${r}, ${g}, ${b})`;
}

export function getDamageColor(value: number) {
  const percentage = value * 100;
  if (percentage <= 50) {
    return calculateTransition(color1Rgb, color2Rgb, percentage * 2);
  } else {
    return calculateTransition(color2Rgb, color3Rgb, (percentage - 50) * 2);
  }
}

// Used for TextField showing current damage percentage
export function CreateDamageInputFieldStyle(damagePercentage: number) {
  const damageColor = getDamageColor(damagePercentage);
  const theme = useTheme();

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
}

export function TextfieldStyle({ color }: { color: Colors }) {
  const theme = useTheme();
  const baseColor = theme.palette[color].main;
  const editColor = theme.palette[color].light;
  const darkColor = theme.palette[color].dark;

  return {
    display: "flex",
    width: "100%", // Fields take up full width of their container
    paddingTop: 0,
    "& .MuiInputBase-root": {
      color: editColor,
      transition: "all 0.2s ease-in-out",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: darkColor, // Set default border color based on colorType
    },
    "& .MuiInputBase-root.Mui-disabled": {
      "& > fieldset": {
        borderColor: theme.palette.background.default,
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
    ".MuiOutlinedInput-root.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: darkColor, // Focus border
      },
      "&:hover fieldset": {
        borderColor: baseColor,
      },
    },
    "& .MuiInputBase-input.MuiOutlinedInput-input": {
      ...theme.scrollbarStyles,
    },
  };
}
