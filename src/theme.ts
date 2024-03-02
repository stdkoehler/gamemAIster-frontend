import { createTheme } from "@mui/material";

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
          color:theme.palette.primary.main
        })
      }
    }
  }
});
