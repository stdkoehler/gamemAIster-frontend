import { ReactNode, ComponentProps } from "react";
import { Grid } from "@mui/material";

type AppGridProps = ComponentProps<typeof Grid> & {
  children: ReactNode;
};

export default function AppGrid({ children, ...props }: AppGridProps) {
  return (
    <Grid
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "800px",
        maxWidth: "100%",
        "@media (max-width: 1000px)": {
          width: "100%",
        },
        ...(props.sx || {}),
      }}
    >
      {children}
    </Grid>
  );
}
