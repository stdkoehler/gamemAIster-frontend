import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  Tooltip,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { accordionGridStyle } from "../styles/styles";
import { NpcCard } from "./NpcCard";
import useCharacterStore from "../stores/characterStore";
import useAppStore from "../stores/appStore";

export const CharacterManager: React.FC = () => {
  const theme = useTheme();
  const gameType = useAppStore((s) => s.gameType);
  const { characters, openSheet, updateCharacter } = useCharacterStore();

  // Show only characters matching the current game type
  const partyChars = characters.filter((c) => c.gameType === gameType);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        component="span"
        sx={{
          display: "block",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: alpha(theme.palette.primary.main, 0.38),
          textTransform: "uppercase",
          mb: 0.75,
          mt: 1.5,
        }}
      >
        Characters
      </Box>

      <Box sx={[{ mt: 1 }, accordionGridStyle]}>
        {partyChars.map((char) => (
          <Accordion key={char.id}>
            <AccordionSummary
              aria-controls={`char-${char.id}-content`}
              id={`char-${char.id}-header`}
              sx={{ "& .MuiAccordionSummary-content": { alignItems: "center" } }}
            >
              <Typography sx={{ flexGrow: 1 }}>{char.name}</Typography>
              <Tooltip title="Open character sheet">
                <Box
                  component="span"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    openSheet(char.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      openSheet(char.id);
                    }
                  }}
                  sx={{
                    ml: 1,
                    cursor: "pointer",
                    color: alpha(theme.palette.primary.main, 0.6),
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: "50%",
                    padding: "4px",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <OpenInNewIcon fontSize="small" />
                </Box>
              </Tooltip>
            </AccordionSummary>
            <NpcCard {...char} onCharacterUpdate={updateCharacter} />
          </Accordion>
        ))}

        {partyChars.length === 0 && (
          <Typography variant="caption" sx={{ color: "text.disabled", px: 1 }}>
            No characters for this system.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
