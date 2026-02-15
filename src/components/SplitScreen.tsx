import { ReactNode } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";

import { Colors } from "../styles/styles.tsx";

/**
 * Props for the SplitScreen component.
 */
type SplitScreenProps = {
  /**
   * An array of two ReactNode children. The first child will be placed in the left pane,
   * and the second child will be placed in the right pane.
   */
  children: ReactNode[];
  /** The flex weight for the left pane. Determines its proportion of the available width. */
  leftWeight: number;
  /** The flex weight for the right pane. Determines its proportion of the available width. */
  rightWeight: number;
  /** The color theme. Note: This prop is currently defined but not used by the component. */
  color: Colors;
  /**
   * If true, the left pane will have a maximum height of 80vh and will be scrollable
   * if its content exceeds this height. Defaults to `false`.
   */
  scrollable?: boolean;
};

/**
 * SplitScreen is a layout component that divides its children into two panes (left and right).
 * The relative widths of the panes are determined by `leftWeight` and `rightWeight`.
 * The left pane can optionally be made scrollable.
 *
 * @param props - The props for the component. See {@link SplitScreenProps}.
 *                It expects exactly two children.
 * @returns The SplitScreen component.
 */
export default function SplitScreen({
  children,
  leftWeight = 1,
  rightWeight = 1,
  scrollable = false,
}: SplitScreenProps) {
  const [left, right] = children;
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        minHeight: 0,
        flex: 1,
      }}
    >
      <Box
        sx={{
          flex: leftWeight,
          maxHeight: "80vh",
          overflowY: scrollable ? "auto" : "visible",
          padding: "8px",
          minHeight: 0,
          display: "flex",
          flexDirection: "column", // Changed from "row" to "column"
        }}
      >
        {left}
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: rightWeight,
          flexDirection: "row",
          minHeight: 0,
          padding: "8px", // Add consistent padding
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
