import React, { useRef, useEffect, useMemo } from "react";
import { ThemeProvider, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { getThemeForGameType } from "./theme";

import AdventureHeading from "./components/AdventureHeading";
import AppGrid from "./components/AppGrid";
import ImageContainer from "./components/ImageContainer";
import SplitScreen from "./components/SplitScreen";

import History from "./components/History";

import { MissionMenu } from "./components/MissionMenu";
import { CharacterManager } from "./components/CharacterCard";
import { getMission } from "./functions/restInterface";
import { HistoryHandle } from "./models/HistoryTypes";
import { GameType } from "./models/Types";

import { useMissionControlCallbacks } from "./hooks/missionControlCallbacks";
import useAppStore from "./stores/appStore";

const App: React.FC = () => {
  console.log("App component rendered");

  // Get state from consolidated app store
  const { mission, adventure, gameType, setGameType, reset } = useAppStore();

  // Memoized theme calculation - only recalculates when gameType changes
  const currentTheme = useMemo(() => getThemeForGameType(gameType), [gameType]);

  const isFirstRender = useRef(true);
  const historyRef = useRef<HistoryHandle>(null);

  // Initial mission validation on first render
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

  // Mission control callbacks - simplified with new store
  const { sendNewMissionGenerate, saveMission, listMissions, loadMission } =
    useMissionControlCallbacks({
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
              <AppGrid
                sx={{
                  flexGrow: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flext-start",
                }}
              >
                <AdventureHeading>{adventure}</AdventureHeading>
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
};

export default App;
