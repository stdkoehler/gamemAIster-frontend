import React, { useCallback, useRef } from "react";
import Draggable from "react-draggable";
import { Box, Paper, Tabs, Tab, IconButton, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
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
import DragonlanceSheet from "./DragonlanceSheet";
import DesolateFrontierSheet from "./DesolateFrontierSheet";

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
    case GameType.DRAGONLANCE:
      return <DragonlanceSheet character={char} onUpdate={onUpdate} />;
    case GameType.DESOLATE_FRONTIER:
      return <DesolateFrontierSheet character={char} onUpdate={onUpdate} />;
    default:
      return null;
  }
}

export const CharacterSheetPopup: React.FC = () => {
  const {
    characters,
    activeCharacterId,
    activeIsNpc,
    isSheetOpen,
    closeSheet,
    openSheet,
    updateCharacterData,
    flushPendingSaves,
  } = useCharacterStore();
  const gameType = useAppStore((s) => s.gameType);
  const nodeRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Only show the kind of sheet (PC or NPC) the popup was opened for, so
  // the tabs never mix party members and NPCs together.
  const visibleChars = characters.filter(
    (r) => r.data.gameType === gameType && !!r.isNpc === activeIsNpc,
  );

  // `characters` is fetched from the backend exactly once, when the mission
  // loads (see App.tsx) - re-fetching here on every sheet open would clobber
  // any edit that hasn't been persisted yet (debounced by `updateCharacterData`),
  // which is what caused stat edits to randomly revert.
  const activeId =
    activeCharacterId !== null && visibleChars.some((r) => r.data.id === activeCharacterId)
      ? activeCharacterId
      : visibleChars[0]?.data.id ?? null;

  const activeRecord = visibleChars.find((r) => r.data.id === activeId) ?? visibleChars[0];

  // Flush any debounced edit immediately instead of waiting for the save
  // timer, so closing the sheet right after an edit can't lose it.
  const handleClose = useCallback(() => {
    flushPendingSaves();
    closeSheet();
  }, [flushPendingSaves, closeSheet]);

  const handleExport = useCallback(() => {
    if (!activeRecord) return;
    const blob = new Blob([JSON.stringify(activeRecord.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeRecord.data.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeRecord]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as CharacterProps;
          updateCharacterData(data);
        } catch {
          console.error("Invalid character JSON file");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [updateCharacterData]
  );

  if (!isSheetOpen || visibleChars.length === 0) return null;
  if (!activeRecord) return null;

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
          <DragIndicatorIcon
            sx={{ mx: 0.5, color: "text.disabled", fontSize: 18, flexShrink: 0 }}
          />

          <Typography
            variant="caption"
            sx={{ mr: 1, color: "text.secondary", letterSpacing: "0.08em", flexShrink: 0 }}
          >
            {activeIsNpc ? "NPCs" : GAME_SYSTEMS[gameType].partyLabel}
          </Typography>

          {visibleChars.length > 0 && (
            <Tabs
              value={activeId}
              onChange={(_, id) => openSheet(id as number)}
              sx={{
                flexGrow: 1,
                minHeight: 40,
                "& .MuiTab-root": { minHeight: 40, cursor: "pointer" },
              }}
            >
              {visibleChars.map((r) => (
                <Tab key={r.data.id} label={r.data.name || "New Character"} value={r.data.id} />
              ))}
            </Tabs>
          )}

          {/* Import / Export */}
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleImport}
          />
          <Tooltip title="Import character from JSON">
            <IconButton size="small" onClick={() => importInputRef.current?.click()}>
              <FileUploadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export character as JSON">
            <IconButton size="small" onClick={handleExport}>
              <FileDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={handleClose} sx={{ mr: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ── Scrollable sheet content ── */}
        <Box
          key={activeRecord.data.id}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-track": { bgcolor: "background.default" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "primary.dark", borderRadius: 3 },
          }}
        >
          {renderSheet(activeRecord.data, updateCharacterData)}
        </Box>
      </Paper>
    </Draggable>
  );
};

export default CharacterSheetPopup;
