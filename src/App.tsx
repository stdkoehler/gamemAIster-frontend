import React, { useRef, useState, useEffect } from "react";
import { ThemeProvider, Box, Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { shadowrunTheme, vampireTheme, cthulhuTheme } from "./theme";

import AdventureHeading from "./components/AdventureHeading";
import AppGrid from "./components/AppGrid";
import ImageContainer from "./components/ImageContainer";
import SplitScreen from "./components/SplitScreen";
import FieldContainer, {
  FieldContainerType,
} from "./components/FieldContainer";

import History from "./components/History";

import { MissionMenu, GameType } from "./components/MissionMenu";
import { CharacterManager } from "./components/CharacterCard";
import { Interaction, getMission } from "./functions/restInterface";

// ************* HOOK IMPORT (update the path as per request) ***************
import { useGamemasterCallbacks } from "./hooks/gamemasterCallbacks"; // <-- NOTE path

const placeholder = "GamemAIster";

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
  const [currentTheme, setCurrentTheme] = useState(() => {
    const storedGameType = localStorage.getItem("gameType");
    switch (storedGameType) {
      case GameType.VAMPIRE_THE_MASQUERADE:
        return vampireTheme;
      case GameType.CALL_OF_CTHULHU:
        return cthulhuTheme;
      default:
        return shadowrunTheme;
    }
  });
  const [gameType, setGameType] = useState<GameType>(() => {
    const storedGameType = localStorage.getItem("gameType");
    return storedGameType ? (storedGameType as GameType) : GameType.SHADOWRUN;
  });

  const isFirstRender = useRef(true);

  const handleThemeChange = (gameType: GameType) => {
    switch (gameType) {
      case GameType.SHADOWRUN:
        setCurrentTheme(shadowrunTheme);
        break;
      case GameType.VAMPIRE_THE_MASQUERADE:
        setCurrentTheme(vampireTheme);
        break;
      case GameType.CALL_OF_CTHULHU:
        setCurrentTheme(cthulhuTheme);
        break;
      default:
        setCurrentTheme(shadowrunTheme);
    }
  };

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

  useEffect(() => {
    localStorage.setItem("gameType", gameType);
    handleThemeChange(gameType);
  }, [gameType]);

  // --- Reset helper ---
  const reset = React.useCallback(async () => {
    setMission(null);
    setAdventure(placeholder);
    setInteractions([]);
    setPlayerInputOld("");
    setLlmOutput("");
    setPlayerInput("");
  }, [placeholder]);

  // --- Mission existence check on load or reset ---
  useEffect(() => {
    if (isFirstRender.current) {
      if (mission !== null) {
        getMission(mission)
          .then((result) => {
            if (result === null) {
              reset();
            }
          })
          .catch(() => {});
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
    setGameType,
  });

  // --- UI ---
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ImageContainer src={currentTheme.logo} />
        <SplitScreen
          leftWeight={1}
          rightWeight={4}
          color={"primary"}
          scrollable
        >
          <AppGrid container spacing={2}>
            <MissionMenu
              newCallback={async (
                selectedGameType: GameType,
                background: string
              ) => {
                setGameType(selectedGameType);
                await sendNewMissionGenerate(selectedGameType, background);
              }}
              saveCallback={saveMission}
              listCallback={listMissions}
              loadCallback={loadMission}
            />
            <CharacterManager />
          </AppGrid>
          <AppGrid container spacing={2}>
            <AppGrid>
              <AdventureHeading>{adventure}</AdventureHeading>
            </AppGrid>
            <AppGrid>
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
            <AppGrid>
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
