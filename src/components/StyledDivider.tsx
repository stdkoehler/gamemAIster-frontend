import { ComponentProps } from "react";
import { Divider, alpha } from "@mui/material";
import { useTheme } from "@mui/material";

import { Colors } from "../styles/styles.tsx";

type StyledDividerProps = ComponentProps<typeof Divider> & {
  color: Colors;
};

export default function StyledDivider({ color, ...props }: StyledDividerProps) {
  const theme = useTheme();
  const baseColor = theme.palette[color].main;

  return (
    <Divider
      {...props}
      sx={{
        backgroundColor: () => alpha(baseColor, 0.5),
        marginX: 2,
      }}
    />
  );
}
