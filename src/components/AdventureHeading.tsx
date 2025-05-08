import { ComponentProps } from "react";
import { Typography, useTheme } from "@mui/material";

type AdventureHeadingProps = ComponentProps<typeof Typography>;

export default function AdventureHeading(props: AdventureHeadingProps) {
  const theme = useTheme();
  return (
    <Typography
      {...props}
      sx={{ color: theme.palette.primary.main, fontSize: "2rem" }}
    />
  );
}
