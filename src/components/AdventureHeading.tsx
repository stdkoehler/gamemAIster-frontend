import { ComponentProps } from "react";
import { Typography, useTheme } from "@mui/material";

/**
 * Props for the AdventureHeading component.
 * These are the same as the props for MUI Typography.
 */
type AdventureHeadingProps = ComponentProps<typeof Typography>;

/**
 * AdventureHeading is a component that displays a heading with a specific style.
 * It is a wrapper around MUI Typography with a default variant of "h1" and primary color.
 *
 * @param props - The props for the component. See {@link AdventureHeadingProps}.
 * @returns The AdventureHeading component.
 */
export default function AdventureHeading(props: AdventureHeadingProps) {
  const theme = useTheme();
  return (
    <Typography
      {...props}
      variant="h1"
      sx={{ color: theme.palette.primary.main }}
    />
  );
}
