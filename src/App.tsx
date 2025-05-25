import React, { useRef, useState, useEffect, memo } from "react";
import { ThemeProvider, Box, Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { shadowrunTheme, vampireTheme, cthulhuTheme } from "./theme";

import AdventureHeading from "./components/AdventureHeading";
import AppGrid from "./components/AppGrid";
import ImageContainer from "./components/ImageContainer";
import SplitScreen from "./components/SplitScreen";

import History from "./components/History";

import { MissionMenu } from "./components/MissionMenu";
import { CharacterManager } from "./components/CharacterCard";
import { getMission } from "./functions/restInterface";
import { Interaction } from "./models/MissionModels";
import { HistoryHandle } from "./models/HistoryTypes";
import { GameType } from "./models/Types";

import { useMissionControlCallbacks } from "./hooks/missionControlCallbacks";
import { HistoryProvider, useHistoryContext } from "./contexts/HistoryContext";

const placeholder = "GamemAIster";

// Inner component that uses the history context
const AppContent: React.FC = memo(() => {
  console.log("App component rendered");

  const historyContext = useHistoryContext();

  // Core mission state - stays in App
  const [mission, setMission] = useState<number | null>(() => {
    const missionValue = localStorage.getItem("mission");
    return missionValue ? parseInt(missionValue) : null;
  });

  const [adventure, setAdventure] = useState<string>(() => {
    return localStorage.getItem("adventure") || placeholder;
  });

  // Theme and game type state
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
  const historyRef = useRef<HistoryHandle>(null);

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

  // Local storage for mission and adventure
  useEffect(() => {
    mission === null
      ? localStorage.removeItem("mission")
      : localStorage.setItem("mission", mission.toString());
    localStorage.setItem("adventure", adventure);
  }, [mission, adventure]);

  useEffect(() => {
    localStorage.setItem("gameType", gameType);
    handleThemeChange(gameType);
  }, [gameType]);

  const reset = React.useCallback(async () => {
    setMission(null);
    setAdventure(placeholder);
    // Use context method to clear history
    historyContext.clearHistory();
  }, [historyContext]);

  useEffect(() => {
    if (isFirstRender.current) {
      if (mission !== null) {
        getMission(mission)
          .then((result) => {
            if (result === null) {
              reset();
            } else {
              // Check if we need to hydrate History from localStorage after page refresh
              const storedInteractions = localStorage.getItem("interactions");
              if (
                storedInteractions &&
                JSON.parse(storedInteractions).length > 0
              ) {
                // Give History component time to mount, then hydrate
                setTimeout(() => {
                  historyContext.hydrateFromStorage();
                }, 0);
              }
            }
          })
          .catch(() => {});
      }
      isFirstRender.current = false;
    }
  }, [reset, mission, historyContext]);

  // Mission control callbacks - only for mission management
  const { sendNewMissionGenerate, saveMission, listMissions, loadMission } =
    useMissionControlCallbacks({
      mission,
      setMission,
      setAdventure,
      reset,
      setGameType,
      historyRef,
    });

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ImageContainer src={currentTheme.logo} />
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
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
            <AppGrid
              container
              spacing={2}
              direction="column"
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                minHeight: 0,
              }}
            >
              <AppGrid>
                <AdventureHeading>{adventure}</AdventureHeading>
              </AppGrid>
              <AppGrid
                sx={{
                  flexGrow: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* History now uses context for state management */}
                <History
                  ref={historyRef}
                  mission={mission}
                  disabled={mission === null}
                />
              </AppGrid>
            </AppGrid>
          </SplitScreen>
        </Box>
      </Box>
    </ThemeProvider>
  );
});

// Main App component wrapped with HistoryProvider
const App: React.FC = () => {
  return (
    <HistoryProvider>
      <AppContent />
    </HistoryProvider>
  );
};

export default App;
