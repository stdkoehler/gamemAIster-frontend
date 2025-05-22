import { ComponentProps } from "react";
import { Divider, alpha } from "@mui/material";
import { useTheme } from "@mui/material";

import { Colors } from "../styles/styles.tsx";

/**
 * Props for the StyledDivider component.
 * Extends MUI Divider props and adds a custom `color` prop.
 */
type StyledDividerProps = ComponentProps<typeof Divider> & {
  /** The color theme for the divider. See {@link Colors}. */
  color: Colors;
};

/**
 * StyledDivider is a component that renders an MUI Divider with custom styling.
 * It uses the provided `color` prop to fetch the corresponding main color from the theme
 * and applies it as the background color with 50% opacity.
 * It also adds a horizontal margin.
 *
 * @param props - The props for the component. See {@link StyledDividerProps}.
 * @returns The StyledDivider component.
 */
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
