import React, { useRef } from "react";
import Draggable from "react-draggable";
import { Box, Paper, Tabs, Tab, IconButton, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import useCharacterStore from "../../stores/characterStore";
import useAppStore from "../../stores/appStore";
import { CharacterProps } from "../../models/CharacterProps";
import { GameType } from "../../models/Types";
import { GAME_SYSTEMS } from "../../gameSystemRegistry";
import ShadowrunSheet from "./ShadowrunSheet";
import VampireSheet from "./VampireSheet";
import CthulhuSheet from "./CthulhuSheet";
import SeventhSeaSheet from "./SeventhSeaSheet";
import ExpanseSheet from "./ExpanseSheet";
import SlavicSheet from "./SlavicSheet";


function renderSheet(char: CharacterProps, onUpdate: (c: CharacterProps) => void) {
  switch (char.gameType) {
    case GameType.SHADOWRUN:
      return <ShadowrunSheet character={char} onUpdate={onUpdate} />;
    case GameType.VAMPIRE_THE_MASQUERADE:
      return <VampireSheet character={char} onUpdate={onUpdate} />;
    case GameType.CALL_OF_CTHULHU:
      return <CthulhuSheet character={char} onUpdate={onUpdate} />;
    case GameType.SEVENTH_SEA:
      return <SeventhSeaSheet character={char} onUpdate={onUpdate} />;
    case GameType.EXPANSE:
      return <ExpanseSheet character={char} onUpdate={onUpdate} />;
    case GameType.SLAVIC:
      return <SlavicSheet character={char} onUpdate={onUpdate} />;
    default:
      return null;
  }
}

export const CharacterSheetPopup: React.FC = () => {
  const { characters, activeCharacterId, isSheetOpen, closeSheet, openSheet, updateCharacter } =
    useCharacterStore();
  const gameType = useAppStore((s) => s.gameType);
  const nodeRef = useRef<HTMLDivElement>(null);

  const partyChars = characters.filter((ch) => ch.gameType === gameType);

  if (!isSheetOpen || partyChars.length === 0) return null;

  const activeId =
    activeCharacterId !== null && partyChars.some((ch) => ch.id === activeCharacterId)
      ? activeCharacterId
      : partyChars[0].id;

  const activeChar = partyChars.find((ch) => ch.id === activeId) ?? partyChars[0];

  return (
    <Draggable
      handle="#sheet-drag-handle"
      cancel=".MuiTab-root,.MuiIconButton-root"
      nodeRef={nodeRef}
      defaultPosition={{ x: 40, y: 40 }}
    >
      <Paper
        ref={nodeRef}
        elevation={12}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1300,
          width: `min(${GAME_SYSTEMS[gameType].sheetWidth ?? 920}px, calc(100vw - 80px))`,
          height: 700,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
          {/* ── Title bar / drag handle ── */}
          <Box
            id="sheet-drag-handle"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              cursor: "move",
              borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              userSelect: "none",
              minHeight: 40,
            })}
          >
            {/* Drag indicator */}
            <DragIndicatorIcon
              sx={{ mx: 0.5, color: "text.disabled", fontSize: 18, flexShrink: 0 }}
            />

            {/* System label */}
            <Typography
              variant="caption"
              sx={{ mr: 1, color: "text.secondary", letterSpacing: "0.08em", flexShrink: 0 }}
            >
              {GAME_SYSTEMS[gameType].sheetTitle}
            </Typography>

            {/* Character tabs */}
            {partyChars.length > 0 && (
              <Tabs
                value={activeId}
                onChange={(_, id) => openSheet(id as number)}
                sx={{
                  flexGrow: 1,
                  minHeight: 40,
                  "& .MuiTab-root": { minHeight: 40, cursor: "pointer" },
                }}
              >
                {partyChars.map((ch) => (
                  <Tab key={ch.id} label={ch.name} value={ch.id} />
                ))}
              </Tabs>
            )}

            {/* Close button */}
            <IconButton size="small" onClick={closeSheet} sx={{ mr: 0.5 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* ── Scrollable sheet content ── */}
          <Box
            key={activeChar.id}
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              // thin scrollbar
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-track": { bgcolor: "background.default" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "primary.dark",
                borderRadius: 3,
              },
            }}
          >
            {renderSheet(activeChar, updateCharacter)}
          </Box>
      </Paper>
    </Draggable>
  );
};

export default CharacterSheetPopup;
