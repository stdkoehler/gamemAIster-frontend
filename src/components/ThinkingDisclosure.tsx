import React, { useState } from "react";
import {
  Box,
  Typography,
  alpha,
  Collapse,
  useTheme,
  keyframes,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PsychologyIcon from "@mui/icons-material/Psychology";

import { Colors } from "../styles/styles";

// Pulse abnimation for streaming indicator
const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
`;

type ThinkingDisclosureProps = {
  content?: string;
  color: Colors;
  defaultExpanded?: boolean;
  title?: string;
  isStreaming?: boolean;
};

export default function ThinkingDisclosure({
  content,
  color,
  defaultExpanded = false,
  title = "Reasoning",
  isStreaming = false,
}: ThinkingDisclosureProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const trimmed = (content ?? "").trim();
  if (!trimmed && !isStreaming) return null;

  return (
    <Box
      sx={{
        width: "100%",
        mb: 1,
        borderRadius: 1,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.4),
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 0.75,
          cursor: "pointer",
          backgroundColor: expanded
            ? alpha(theme.palette.background.default, 0.2)
            : "transparent",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: alpha(theme.palette.background.default, 0.3),
          },
          minHeight: 32,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <PsychologyIcon
            fontSize="small"
            color={color}
            sx={{
              opacity: expanded ? 0.7 : 1,
              animation: isStreaming
                ? `${pulse} 1.5s infinite ease-in-out`
                : "none",
              filter: isStreaming
                ? `drop-shadow(0 0 2px ${theme.palette[color as "primary" | "secondary" | "error" | "info" | "success" | "warning"]?.main || "transparent"})`
                : "none",
            }}
          />
          <Box>
            <Typography
              variant="caption"
              sx={{
                opacity: expanded ? 0.7 : 1,
                fontFamily: "monospace",
                fontWeight: 700,
                color: { color },
                textTransform: "uppercase",
                letterSpacing: "1px",
                userSelect: "none",
                lineHeight: 1,
                display: "block",
              }}
            >
              {title}
            </Typography>
            {!expanded && isStreaming && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                  fontSize: "0.65rem",
                  color: { color },
                  fontStyle: "italic",
                  display: "block",
                  mt: -0.2,
                }}
              >
                Processing thoughts...
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              color: "text.secondary",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </Box>
      </Box>

      {/* Subtle Progress Bar for Streaming */}
      {!expanded && isStreaming && (
        <Box
          sx={{
            height: "2px",
            width: "100%",
            background: alpha(theme.palette.divider, 0.1),
            position: "absolute",
            bottom: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "30%",
              backgroundColor: `${color}.main`,
              borderRadius: 1,
              animation: "slide 1.5s infinite linear",
              "@keyframes slide": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(400%)" },
              },
            }}
          />
        </Box>
      )}

      <Collapse in={expanded} timeout="auto">
        <Box
          sx={{
            p: 2,
            maxHeight: 220,
            overflow: "auto",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
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
              color: "text.secondary",
              lineHeight: 1.5,
            }}
          >
            {trimmed}
            {isStreaming && <span className="cursor"> |</span>}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
