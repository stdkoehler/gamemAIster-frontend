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
      backgroundColor: "#121212", // Deep cyberpunk backdrop
      boxShadow: `inset 0px 0px 0px 1px ${
        theme.palette.primary.dark
      }, 0 0 8px ${alpha(theme.palette.primary.main, 0.25)}`, // Added outer glow
      borderRadius: "6px",
      "&::before": {
        backgroundColor: "#121212",
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
        borderColor: "#121212", // Adjust color when disabled
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
      backgroundColor: theme.palette.background.default,
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
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.dark}`, // Slight border for visibility
    boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.25)}`, // Soft glow effect
    borderRadius: "8px",
    p: 4,
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
        borderColor: "#121212", // Adjust color when disabled
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
      "&::-webkit-scrollbar": {
        width: "0.4em",
        cursor: "default !important",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        outline: "1px solid",
        color: darkColor,
        cursor: "default !important",
      },
    },
  };
}
