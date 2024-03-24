import { createTheme } from "@mui/material";


/*
import colorsys

def calculate_shades(main_color):
    # Convert hex color to RGB
    main_color = main_color.lstrip("#")
    r, g, b = tuple(int(main_color[i:i+2], 16) for i in (0, 2, 4))

    # Convert RGB to HSL
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)

    # Calculate light and dark shades
    light_l = min(1, l + 0.2)
    dark_l = max(0, l - 0.2)

    # Convert HSL back to RGB
    light_r, light_g, light_b = colorsys.hls_to_rgb(h, light_l, s)
    dark_r, dark_g, dark_b = colorsys.hls_to_rgb(h, dark_l, s)

    # Convert RGB to hex
    light_hex = "#{:02x}{:02x}{:02x}".format(int(light_r * 255), int(light_g * 255), int(light_b * 255))
    dark_hex = "#{:02x}{:02x}{:02x}".format(int(dark_r * 255), int(dark_g * 255), int(dark_b * 255))

    return light_hex, dark_hex

# Example usage
main_color = "#e53f7e"
light, dark = calculate_shades(main_color)

print("Secondary color shades:")
print("  light:", light)
print("  main:", main_color)
print("  dark:", dark)
*/

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#e5c8ea",
      main: "#9c27b0",
      dark: "#6d1b7b",
      contrastText: "#000",
    },
    secondary: {
      light: "#fff3cc",
      main: "#ffc400",
      dark: "#b28900",
      contrastText: "#000",
    },
    warning: {
      light: "#f9a5c4",
      main: "#e53f7e",
      dark: "#a0204f",
      contrastText: "#000",
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: () => ({
          "&:focus": {
            outline: "none"
          }
        })
      }
    },
    MuiTypography: {
      styleOverrides: {
        root:({theme}) => ({
          color:theme.palette.primary.main,
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
            color: theme.palette.primary.dark,
            cursor: "default !important",
          },
        })
      }
    }
    
  }
});
