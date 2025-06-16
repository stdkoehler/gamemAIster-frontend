import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { ThemeProvider, Box, Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { getThemeForGameType } from "./theme";
import { signOut } from "firebase/auth";
import { auth } from "./auth/firebase";

import AdventureHeading from "./components/AdventureHeading";
import AppGrid from "./components/AppGrid";
import ImageContainer from "./components/ImageContainer";
import SplitScreen from "./components/SplitScreen";

import History from "./components/History";

import { MissionMenu } from "./components/MissionMenu";
import { CharacterManager } from "./components/CharacterCard";
import { getMission } from "./functions/restInterface";
import { GameType } from "./models/Types";

import { useMissionControlCallbacks } from "./hooks/missionControlCallbacks";
import useAppStore from "./stores/appStore";
import Login from "./components/Login";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE !== "false";

const App: React.FC = () => {
  console.log("App component rendered");
  // Get state from consolidated app store
  const { mission, adventure, gameType, setGameType, reset } = useAppStore();
  const { user, loading } = useFirebaseAuth();

  // Memoized theme calculation - only recalculates when gameType changes
  const currentTheme = useMemo(() => getThemeForGameType(gameType), [gameType]);

  const isFirstRender = useRef(true);

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
    useMissionControlCallbacks();

  // Memoize callbacks to prevent child rerenders
  const handleNewMission = useCallback(
    async (
      selectedGameType: GameType,
      background: string,
      nonHeroMode: boolean
    ) => {
      setGameType(selectedGameType);
      await sendNewMissionGenerate(selectedGameType, background, nonHeroMode);
    },
    [setGameType, sendNewMissionGenerate]
  );

  if (loading) return null;
  if (!user) return <Login />;

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
        <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              if (USE_FIREBASE) {
                signOut(auth);
              } else {
                localStorage.removeItem("demoUser");
                window.location.reload();
              }
            }}
          >
            Logout
          </Button>
        </Box>
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
                newCallback={handleNewMission}
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
                <History mission={mission} disabled={mission === null} />
              </AppGrid>
            </AppGrid>
          </SplitScreen>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
