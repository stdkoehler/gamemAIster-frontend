import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { accordionGridStyle } from "../styles/styles";
import { NpcCard } from "./NpcCard";
import useCharacterStore from "../stores/characterStore";
import useAppStore from "../stores/appStore";
import { createBlankCharacter } from "../data/defaultCharacters";
import {
  upsertCharacterSheet,
  deleteCharacterSheet,
} from "../functions/restInterface";
import { CharacterRecord } from "../models/MissionModels";

export const CharacterManager: React.FC = () => {
  const theme = useTheme();
  const gameType = useAppStore((s) => s.gameType);
  const missionId = useAppStore((s) => s.mission);
  const { characters, openSheet, updateCharacterData, addCharacter, removeCharacter, setProtagonist } =
    useCharacterStore();

  const [pendingDeleteRecord, setPendingDeleteRecord] = useState<CharacterRecord | null>(null);

  const partyChars = characters.filter((r) => r.data.gameType === gameType);

  const handleCreate = useCallback(async () => {
    const id = Date.now();
    const data = createBlankCharacter(gameType, id);
    if (!data) return;

    if (missionId !== null) {
      try {
        const saved = await upsertCharacterSheet({
          character_sheet_id: null,
          mission_id: missionId,
          name: data.name,
          game_type: gameType,
          content: data,
          is_protagonist: false,
        });
        addCharacter({ sheetId: saved.character_sheet_id, isProtagonist: false, data });
      } catch (err) {
        console.error("Failed to create character sheet:", err);
      }
    } else {
      addCharacter({ sheetId: null, isProtagonist: false, data });
    }
  }, [gameType, missionId, addCharacter]);

  const handleDelete = useCallback(async () => {
    if (!pendingDeleteRecord) return;
    const { sheetId } = pendingDeleteRecord;
    if (sheetId !== null && missionId !== null) {
      try {
        await deleteCharacterSheet(sheetId, missionId);
      } catch (err) {
        console.error("Failed to delete character sheet:", err);
      }
    }
    removeCharacter(sheetId!);
    setPendingDeleteRecord(null);
  }, [pendingDeleteRecord, missionId, removeCharacter]);

  const handleSetProtagonist = useCallback(
    async (record: CharacterRecord) => {
      const newIsProtagonist = !record.isProtagonist;
      setProtagonist(newIsProtagonist ? record.data.id : -1);

      if (record.sheetId !== null && missionId !== null) {
        try {
          await upsertCharacterSheet({
            character_sheet_id: record.sheetId,
            mission_id: missionId,
            name: record.data.name,
            game_type: gameType,
            content: record.data,
            is_protagonist: newIsProtagonist,
          });
        } catch (err) {
          console.error("Failed to update protagonist flag:", err);
        }
      }
    },
    [setProtagonist, missionId, gameType]
  );

  const iconButtonSx = {
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
  };

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

      <Button
        onClick={handleCreate}
        startIcon={<PersonAddIcon sx={{ fontSize: "14px !important" }} />}
        sx={{ width: "100%", justifyContent: "flex-start", mb: 0 }}
      >
        Create Character
      </Button>

      <Box sx={[{ mt: 1 }, accordionGridStyle]}>
        {partyChars.map((record) => (
          <Accordion key={record.data.id}>
            <AccordionSummary
              aria-controls={`char-${record.data.id}-content`}
              id={`char-${record.data.id}-header`}
              sx={{ "& .MuiAccordionSummary-content": { alignItems: "center" } }}
            >
              <Typography sx={{ flexGrow: 1 }}>
                {record.isProtagonist ? "★ " : ""}{record.data.name}
              </Typography>

              <Tooltip title={record.isProtagonist ? "Remove protagonist" : "Set as protagonist"}>
                <Box
                  component="span"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); handleSetProtagonist(record); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); handleSetProtagonist(record); }
                  }}
                  sx={{
                    ...iconButtonSx,
                    color: record.isProtagonist
                      ? theme.palette.primary.main
                      : alpha(theme.palette.primary.main, 0.4),
                  }}
                >
                  {record.isProtagonist ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                </Box>
              </Tooltip>

              <Tooltip title="Open character sheet">
                <Box
                  component="span"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); openSheet(record.data.id); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); openSheet(record.data.id); }
                  }}
                  sx={iconButtonSx}
                >
                  <OpenInNewIcon fontSize="small" />
                </Box>
              </Tooltip>

              <Tooltip title="Remove character">
                <Box
                  component="span"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); setPendingDeleteRecord(record); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); setPendingDeleteRecord(record); }
                  }}
                  sx={iconButtonSx}
                >
                  <CloseIcon fontSize="small" />
                </Box>
              </Tooltip>
            </AccordionSummary>
            <NpcCard {...record.data} onCharacterUpdate={updateCharacterData} />
          </Accordion>
        ))}

        {partyChars.length === 0 && (
          <Typography variant="caption" sx={{ color: "text.disabled", px: 1 }}>
            No characters for this mission.
          </Typography>
        )}
      </Box>

      <Dialog open={pendingDeleteRecord !== null} onClose={() => setPendingDeleteRecord(null)}>
        <DialogTitle>Remove Character?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <strong>{pendingDeleteRecord?.data.name}</strong> from the party?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteRecord(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
