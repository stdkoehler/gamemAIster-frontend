import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { ThemeProvider, Box, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
import { NpcManager } from "./components/NpcCard";
import { CharacterManager } from "./components/CharacterManager";
import { CharacterSheetPopup } from "./components/CharacterSheet";
import { DiceRollerPopup } from "./components/Dice";
import { GlobalSnackbar } from "./components/GlobalSnackbar";
import {
  getMission,
  getCharacterSheets,
  LlmNotConfiguredError,
} from "./functions/restInterface";
import { GameType } from "./models/Types";
import { GAME_SYSTEMS } from "./gameSystemRegistry";

import { useMissionControlCallbacks } from "./hooks/missionControlCallbacks";
import useAppStore from "./stores/appStore";
import useCharacterStore from "./stores/characterStore";
import useNotificationStore from "./stores/notificationStore";
import Login from "./components/Login";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE !== "false";


const App: React.FC = () => {
  console.log("App component rendered");
  // Get state from consolidated app store
  const { mission, adventure, gameType, setGameType, reset } = useAppStore();
  const { user, loading } = useFirebaseAuth();
  const showError = useNotificationStore((s) => s.showError);

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
          .catch((err) => {
            console.error("Failed to validate current mission:", err);
            showError(
              err instanceof Error
                ? err.message
                : "Failed to reach the server to validate the current mission.",
            );
          });
      }
      isFirstRender.current = false;
    }
  }, [reset, mission, showError]);

  // Keep the character store (PCs + NPCs) in sync with the backend whenever
  // the active mission changes. This is the single place that refreshes
  // character sheets for a mission - components only ever read from
  // characterStore and filter by `isNpc`, so PCs and NPCs can't drift apart
  // by being fetched/stored independently of each other.
  const setCharacters = useCharacterStore((s) => s.setCharacters);
  useEffect(() => {
    if (mission === null) return;
    getCharacterSheets(mission)
      .then(setCharacters)
      .catch((err) => {
        console.error("Failed to sync character sheets:", err);
        showError(
          err instanceof Error
            ? err.message
            : "Failed to load characters and NPCs for this mission.",
        );
      });
  }, [mission, setCharacters, showError]);

  // Mission control callbacks - simplified with new store
  const {
    sendNewMissionGenerate,
    saveMission,
    listMissions,
    loadMission,
    getMissionData,
  } = useMissionControlCallbacks();

  // Memoize callbacks to prevent child rerenders
  const handleNewMission = useCallback(
    async (
      selectedGameType: GameType,
      background: string,
      detailedBackground: string,
      nonHeroMode: boolean,
      oracle: boolean,
    ) => {
      setGameType(selectedGameType);
      try {
        await sendNewMissionGenerate(
          selectedGameType,
          background,
          detailedBackground,
          nonHeroMode,
          oracle,
        );
      } catch (err) {
        if (err instanceof LlmNotConfiguredError) {
          showError(err.message);
        } else {
          throw err;
        }
      }
    },
    [setGameType, sendNewMissionGenerate, showError],
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
        <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
          <Typography
            variant="h2"
            sx={{
              textShadow: `0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)`,
              lineHeight: 1,
              ...currentTheme.titleOverlayStyle,
            }}
          >
            {GAME_SYSTEMS[gameType].title}
          </Typography>
        </Box>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: alpha(currentTheme.palette.background.paper, 0.35),
                borderRight: `0.5px solid ${alpha(currentTheme.palette.primary.main, 0.12)}`,
                px: 1.5,
                py: 1.5,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <MissionMenu
                newCallback={handleNewMission}
                saveCallback={saveMission}
                listCallback={listMissions}
                loadCallback={loadMission}
                getMissionData={getMissionData}
              />
              <CharacterManager />
              <NpcManager />
            </Box>
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
      <CharacterSheetPopup />
      <DiceRollerPopup />
      <GlobalSnackbar />
    </ThemeProvider>
  );
};

export default App;
