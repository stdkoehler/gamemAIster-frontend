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
      }}
    >
      {children}
    </Grid>
  );
}
