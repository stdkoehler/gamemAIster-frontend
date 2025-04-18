import { ReactNode, ComponentProps } from "react";
import { Grid } from "@mui/material";

type AppGridProps = ComponentProps<typeof Grid> & {
  children: ReactNode;
};

export default function AppGrid({ children }: AppGridProps) {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "800px", // Use viewport width for 50% of screen width
        maxWidth: "100%", // Prevents overflow, making sure it doesn't exceed 100% width
        "@media (max-width: 1000px)": {
          width: "100%", // Adjusts width to 100% if the screen is too small
        },
      }}
    >
      {children}
    </Grid>
  );
}
