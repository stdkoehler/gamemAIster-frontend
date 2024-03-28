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
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            outline: "1px solid",
            color: darkColor,
          },
        }}
      >
        {left}
      </Box>
      <Box
        sx={{
          flex: rightWeight,
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
