import React, { useRef, useState, useEffect } from "react";
import { ThemeProvider, Box, Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme } from "./theme";

import AdventureHeading from "./components/AdventureHeading";
import AppGrid from "./components/AppGrid";
import ImageContainer from "./components/ImageContainer";
import SplitScreen from "./components/SplitScreen";
import FieldContainer, {
  FieldContainerType,
} from "./components/FieldContainer";

import History from "./components/History";

import { MissionMenu } from "./components/MissionMenu";
import { CharacterManager } from "./components/CharacterCard";
import { Interaction } from "./functions/restInterface";

import logo from "./assets/sr_00096_.png";

// ************* HOOK IMPORT (update the path as per request) ***************
import { useGamemasterCallbacks } from "./hooks/gamemasterCallbacks"; // <-- NOTE path

const placeholder = "GameMAIster";

const App: React.FC = () => {
  // --- State ---

  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    return JSON.parse(localStorage.getItem("interactions") || "[]");
  });
  const [playerInputOld, setPlayerInputOld] = useState<string>(() => {
    return localStorage.getItem("playerInputOld") || "";
  });
  const [llmOutput, setLlmOutput] = useState<string>(() => {
    return localStorage.getItem("llmOutput") || "";
  });
  const [playerInput, setPlayerInput] = useState<string>(() => {
    return localStorage.getItem("playerInput") || "";
  });
  const [mission, setMission] = useState<number | null>(() => {
    const missionValue = localStorage.getItem("mission");
    return missionValue ? parseInt(missionValue) : null;
  });
  const [adventure, setAdventure] = useState<string>(() => {
    return localStorage.getItem("adventure") || placeholder;
  });

  const isFirstRender = useRef(true);

  // --- Synced localStorage persistance ---
  useEffect(() => {
    localStorage.setItem("interactions", JSON.stringify(interactions));
    localStorage.setItem("playerInputOld", playerInputOld);
    localStorage.setItem("llmOutput", llmOutput);
    localStorage.setItem("playerInput", playerInput);
    mission === null
      ? localStorage.removeItem("mission")
      : localStorage.setItem("mission", mission.toString());
    localStorage.setItem("adventure", adventure);
  }, [
    interactions,
    playerInputOld,
    llmOutput,
    playerInput,
    mission,
    adventure,
  ]);

  // --- Reset helper ---
  const reset = React.useCallback(async () => {
    setMission(null);
    setAdventure(placeholder);
    setInteractions([]);
    setPlayerInputOld("");
    setLlmOutput("");
    setPlayerInput("");
  }, []);

  // --- Mission existence check on load or reset ---
  useEffect(() => {
    if (isFirstRender.current) {
      if (mission !== null) {
        import("./functions/restInterface").then(({ getMission }) => {
          getMission(mission)
            .then((result) => {
              if (result === null) {
                reset();
              }
            })
            .catch(() => {});
        });
      }
      isFirstRender.current = false;
    }
  }, [reset, mission]);

  // --- CENTRALIZED: All game/mission/interaction handlers from hook ---
  const {
    sendNewMissionGenerate,
    saveMission,
    listMissions,
    loadMission,
    sendRegenerate,
    sendPlayerInput,
    stopGeneration,
    changeCallbackPlayerInputOld,
    changeCallbackPlayerInput,
    changeCallbackLlmOutput,
  } = useGamemasterCallbacks({
    mission,
    setMission,
    setAdventure,
    interactions,
    setInteractions,
    playerInputOld,
    setPlayerInputOld,
    llmOutput,
    setLlmOutput,
    playerInput,
    setPlayerInput,
    reset,
  });

  // --- UI ---
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ImageContainer>{logo}</ImageContainer>
        <SplitScreen
          leftWeight={1}
          rightWeight={4}
          color={"primary"}
          scrollable
        >
          <AppGrid container spacing={2}>
            <MissionMenu
              newCallback={sendNewMissionGenerate}
              saveCallback={saveMission}
              listCallback={listMissions}
              loadCallback={loadMission}
            />
            <CharacterManager />
          </AppGrid>
          <AppGrid container spacing={2}>
            <AppGrid item xs={12}>
              <AdventureHeading>{adventure}</AdventureHeading>
            </AppGrid>
            <AppGrid item xs={12}>
              <History
                sendCallback={sendRegenerate}
                stopCallback={stopGeneration}
                changePlayerInputOldCallback={changeCallbackPlayerInputOld}
                changeLlmOutputCallback={changeCallbackLlmOutput}
                interactions={interactions}
                lastInteraction={{
                  playerInput: playerInputOld,
                  llmOutput: llmOutput,
                }}
                disabled={mission === null}
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "left",
                  width: "95%",
                }}
              >
                <FieldContainer
                  sendCallback={sendPlayerInput}
                  changeCallback={changeCallbackPlayerInput}
                  stopCallback={stopGeneration}
                  value={playerInput}
                  instance="Player"
                  color="secondary"
                  type={FieldContainerType.MAIN_SEND}
                  disabled={mission === null}
                  placeholder="Begin by describing your character and what he's currently doing."
                />
              </Container>
            </AppGrid>
          </AppGrid>
        </SplitScreen>
      </Box>
    </ThemeProvider>
  );
};

export default App;
