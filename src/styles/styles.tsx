import { useTheme, Palette, PaletteColor, alpha, Paper } from "@mui/material";

type KeysByType<O, T> = {
  [K in keyof O]-?: T extends O[K] ? K : never;
}[keyof O];

export type Colors = KeysByType<Palette, PaletteColor>;

export function MenuStyle() {
  const theme = useTheme();

  return {
    "& .MuiButtonBase-root.MuiMenuItem-root:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    "& .MuiList-root.MuiMenu-list": {
      padding: "8px 8px 8px 8px",
    },
    "& .MuiPaper-root.MuiPopover-paper.MuiMenu-paper": {
      color: theme.palette.primary.main,
    },
    "& .MuiPaper-root": {
      backgroundImage: "none",
      boxShadow: `inset 0px 0px 0px 1px ${theme.palette.primary.dark}, 0px 0px 0px 0px #FF0000, 0px 0px 0px 0px #FF0000`,
      "&::before": {
        backgroundColor: "#121212", //"#FF0000",
      },
    },
  };
}

export function AutocompleteStyle() {
  const theme = useTheme();

  const baseColor = theme.palette.primary.main;
  const editColor = theme.palette.primary.light;
  const darkColor = theme.palette.primary.dark;

  const hoverColor = baseColor;
  const disabledColor = baseColor;

  return {
    "& .MuiInputBase-root": {
      color: editColor,
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
      WebkitTextFillColor: disabledColor, // Adjust text color when disabled
    },
    // set color when inactive
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: hoverColor, // Adjust color on hover
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
        borderColor: hoverColor, // Adjust color on hover
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: darkColor, // Set default border color based on colorType
      },
    },
    "& .MuiButtonBase-root.MuiIconButton-root.MuiAutocomplete-popupIndicator": {
        "color": theme.palette.primary.light,
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
    },
    "& .MuiButtonBase-root.MuiIconButton-root.MuiAutocomplete-clearIndicator": {
        "color": theme.palette.primary.light,
        "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
    },
    "& .MuiFormLabel-root.MuiInputLabel-root": {
        "color": theme.palette.primary.light
    },
    "& .MuiPaper-root.MuiAutocomplete-paper": {
        "backgroundColor": theme.palette.primary.light
    },
    "& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    

  };
}


export function AutocompletePaper({children}: React.HTMLAttributes<HTMLElement>) {
    const theme = useTheme();
    return (
      <Paper 
        sx={{
          "color": theme.palette.primary.main,
          "& .MuiAutocomplete-listbox": {
            padding: "8px 8px 8px 8px",
            "& .MuiAutocomplete-option[aria-selected='true']": {
              bgcolor: alpha(theme.palette.primary.main, 0.16),
              "&.Mui-focused": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }
          },
          "& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused": {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },

            backgroundImage: "none",
            boxShadow: `inset 0px 0px 0px 1px ${theme.palette.primary.dark}, 0px 0px 0px 0px #FF0000, 0px 0px 0px 0px #FF0000`,
            "&::before": {
              backgroundColor: "#121212", //"#FF0000",
            },


          
        }}
      >
        {children}
      </Paper>
    );
  }
  


export function ModalStyle () {
    return {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "0px solid #000",
        boxShadow: 0,
        p: 4,
    };
    }

export function TextfieldStyle({ color }: { color: Colors }) {
  const theme = useTheme();
  const baseColor = theme.palette[color].main;
  const editColor = theme.palette[color].light;
  const darkColor = theme.palette[color].dark;

  const hoverColor = baseColor;
  const disabledColor = baseColor;

  return {
    display: "flex",
    width: "100%" /* Fields take up full width of their container */,
    paddingTop: 0,
    "& .MuiInputBase-root": {
      color: editColor,
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
      WebkitTextFillColor: disabledColor, // Adjust text color when disabled
    },
    // set color when inactive
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: hoverColor, // Adjust color on hover
      },
    },
    // set color when active
    "& .Mui-focused": {
      "&:hover fieldset": {
        borderColor: hoverColor, // Adjust color on hover
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: darkColor, // Set default border color based on colorType
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
        color: theme.palette[color].dark,
        cursor: "default !important",
      },
    },
  };
}
