import { ComponentProps } from "react";
import { Typography } from "@mui/material";

type AdventureHeadingProps = ComponentProps<typeof Typography>;

export default function AdventureHeading(props: AdventureHeadingProps) {
  return <Typography {...props} sx={{ color: "#9c27b0", fontSize: "2rem" }} />;
}
