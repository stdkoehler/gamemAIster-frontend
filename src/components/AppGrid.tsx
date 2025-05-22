import { ReactNode, ComponentProps } from "react";
import { Grid } from "@mui/material";

/**
 * Props for the AppGrid component.
 * Extends MUI Grid props and requires children.
 */
type AppGridProps = ComponentProps<typeof Grid> & {
  /** The content to be displayed within the grid. */
  children: ReactNode;
};

/**
 * AppGrid is a styled MUI Grid container.
 * It provides a flex container that centers its children and has a responsive width.
 *
 * @param props - The props for the component. See {@link AppGridProps}.
 * @returns The AppGrid component.
 */
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
