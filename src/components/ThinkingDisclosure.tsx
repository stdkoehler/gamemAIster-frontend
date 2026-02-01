import React, { useState } from "react";
import { Box, Typography, alpha, Collapse, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PsychologyIcon from "@mui/icons-material/Psychology";

import { Colors } from "../styles/styles";

type ThinkingDisclosureProps = {
  content?: string;
  color: Colors;
  defaultExpanded?: boolean;
  title?: string;
};

export default function ThinkingDisclosure({
  content,
  color,
  defaultExpanded = false,
  title = "Thinking",
}: ThinkingDisclosureProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const trimmed = (content ?? "").trim();
  if (!trimmed) return null;

  return (
    <Box
      sx={{
        width: "100%",
        mb: 1,
        borderRadius: 1,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.4),
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: "relative",
        overflow: "hidden",
        // Ensure it sits above any overlapping containers / backgrounds
        zIndex: 1,
      }}
    >
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          py: 0.5,
          cursor: "pointer",
          backgroundColor: (theme) =>
            expanded
              ? alpha(theme.palette.background.default, 0.2)
              : "transparent",
          borderBottom: (theme) =>
            expanded
              ? `1px solid ${alpha(theme.palette.divider, 0.05)}`
              : "none",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: (theme) =>
              alpha(theme.palette.background.default, 0.3),
          },
          // guard against global styles that might collapse the header height
          minHeight: 28,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.9 }}
        >
          <PsychologyIcon fontSize="small" color={color} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: "text.primary",
              textTransform: "uppercase",
              letterSpacing: "1px",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {title}
          </Typography>
        </Box>

        <ExpandMoreIcon
          fontSize="small"
          sx={{
            color: "text.secondary",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        />
      </Box>

      <Collapse in={expanded} timeout="auto">
        <Box
          sx={{
            p: 2,
            maxHeight: 220,
            overflow: "auto",
            ...(theme as any).scrollbarStyles?.(theme),
          }}
        >
          <Typography
            variant="body2"
            component="div"
            sx={{
              fontFamily:
                "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
              fontSize: "0.8rem",
              whiteSpace: "pre-wrap",
              color: "text.primary",
              lineHeight: 1.5,
              textShadow: "none !important",
            }}
          >
            {trimmed}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
