import { ReactNode } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";

import { Colors } from "../styles/styles.tsx";

type SplitScreenProps = {
  children: ReactNode[];
  leftWeight: number;
  rightWeight: number;
  color: Colors;
  scrollable?: boolean;
};

export default function SplitScreen({
  children,
  leftWeight = 1,
  rightWeight = 1,
  color,
  scrollable = false,
}: SplitScreenProps) {
  const [left, right] = children;
  const theme = useTheme();
  const darkColor = theme.palette[color].dark;
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box
        sx={{
          flex: leftWeight,
          maxHeight: "80vh",
          overflowY: scrollable ? "auto" : "visible",
          padding: "8px",
          ...theme.scrollbarStyles,
        }}
      >
        {left}
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: rightWeight,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
