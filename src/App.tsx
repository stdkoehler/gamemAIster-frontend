import React, { useRef, useState, useEffect, useCallback } from "react";
import { ThemeProvider, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme } from "./theme";

import AdventureHeading from "./components/AdventureHeading";
import AppGrid from "./components/AppGrid";
import ImageContainer from "./components/ImageContainer";
import SplitScreen from "./components/SplitScreen";
import FieldContainer from "./components/FieldContainer";
import History from "./components/History";

import { MissionMenu } from "./components/MissionMenu";
import { CharacterManager } from "./components/CharacterCard";
import {
  sendPlayerInputToLlm,
  postNewMission,
  postSaveMission,
  getListMissions,
  getMission,
} from "./functions/restInterface";

import { Interaction } from "./components/History";

import logo from "./assets/sr_00096_.png";

const placeholder = "GameMAIster";

const App: React.FC = () => {
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

  useEffect(() => {
    // Function that is called whenever any of the dependency array is called
    // This is used to save the state in local storage so that it persists on page refresh
    localStorage.setItem("interactions", JSON.stringify(interactions));
    localStorage.setItem("playerInputOld", playerInputOld);
    localStorage.setItem("llmOutput", llmOutput);
    localStorage.setItem("playerInput", playerInput);
    mission === null
      ? localStorage.removeItem("mission")
      : localStorage.setItem("mission", mission.toString());
    localStorage.setItem("adventure", adventure);
  }, [history, playerInputOld, llmOutput, playerInput, mission, adventure]);

  const reset = useCallback(async () => {
    setMission(null);
    setAdventure(placeholder);
    setInteractions([]);
    setPlayerInputOld("");
    setLlmOutput("");
    setPlayerInput("");
  }, []);

  useEffect(() => {
    // Function to be executed only on browser refresh and on changes of reset, mission.
    // We use a isFirstRender ref that is initially set to true. Executing on first render,
    // we set is false. When mission or reset is changing now it will be false and we don't
    // execute the check.
    // We check if our current mission exists in database, otherwise we reset the state
    if (isFirstRender.current) {
      console.log(`Browser refreshed with mission_id ${mission}`);
      if (mission !== null) {
        getMission(mission)
          .then((result) => {
            if (result === null) {
              console.log("mission does not exist");
              reset();
            }
          })
          .catch((error) => {
            console.error("Error fetching mission:", error);
          });
      }
      isFirstRender.current = false;
    }
  }, [reset, mission]);

  function stripOutput(llmOutput: string): string {
    const regexPattern = /\bWhat\ do\ you\ want\ to\ \S[\S\s]*\?\s*$/;
    return llmOutput.replace(regexPattern, "")
  }

  const sendNewMissionGenerate = useCallback(async () => {
    console.log(mission);
    await reset();
    const response = await postNewMission();
    if (response !== null) {
      setMission(response.mission_id);
      setAdventure(response.name);
    }
  }, [reset, mission]);

  const saveMission = useCallback(
    async (nameCustom: string) => {
      console.log(mission);

      if (mission !== null) {
        console.log("save mission do");
        postSaveMission(mission, nameCustom);
      }
    },
    [mission]
  );

  const listMissions = useCallback(async () => {
    return getListMissions();
  }, []);

  const sendRegenerate = useCallback(async () => {
    if (mission !== null) {
      if (playerInputOld != "") {
        await sendPlayerInputToLlm(
          mission,
          playerInputOld,
          (newState: { llmOutput: string }) => {
            setLlmOutput(newState.llmOutput);
          }
        );
      }
    }
  }, [mission, playerInputOld]);

  const sendPlayerInput = useCallback(async () => {
    console.log(mission);
    if (mission !== null) {
      if (playerInput != "") {
        const strippedLlmOutput = stripOutput(llmOutput);
        const stepPlayerInput = playerInput;
        const stepPlayerInputOld = playerInputOld;

        setInteractions([
          ...interactions,
          { playerInput: playerInputOld, llmOutput: strippedLlmOutput },
        ]);

        setPlayerInputOld(stepPlayerInput);
        setPlayerInput("");

        try {
          await sendPlayerInputToLlm(
            mission,
            stepPlayerInput,
            (newState: { llmOutput: string }) => {
              setLlmOutput(newState.llmOutput);
            },
            stepPlayerInputOld,
            strippedLlmOutput
          );
        } catch (error) {
          console.error(error);
          setPlayerInputOld(stepPlayerInputOld);
          setPlayerInput(stepPlayerInput);
        }
      }
    }
  }, [mission, interactions, llmOutput, playerInput, playerInputOld]);

  const changeCallbackPlayerInputOld = useCallback((value: string) => {
    setPlayerInputOld(value);
  }, []);
  const changeCallbackPlayerInput = useCallback((value: string) => {
    setPlayerInput(value);
  }, []);
  const changeCallbackLlmOutput = useCallback((value: string) => {
    setLlmOutput(value);
  }, []);

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
          scrollable={true}
        >
          <AppGrid container spacing={2}>
            <MissionMenu
              newCallback={sendNewMissionGenerate}
              saveCallback={saveMission}
              listCallback={listMissions}
            ></MissionMenu>
            <CharacterManager></CharacterManager>
          </AppGrid>
          <AppGrid container spacing={2}>
            <AppGrid item xs={12}>
              <AdventureHeading>{adventure}</AdventureHeading>
            </AppGrid>
            <AppGrid item xs={12}>
              <History
                value={interactions}
                name="History"
                colorType="primary"
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainer
                sendCallback={sendRegenerate}
                changeCallback={changeCallbackPlayerInputOld}
                value={playerInputOld}
                name="Player Prev"
                colorType="secondary"
                updateButton="Regenerate"
                disabled={mission === null}
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainer
                changeCallback={changeCallbackLlmOutput}
                value={llmOutput}
                name="Gamemaster"
                colorType="primary"
                fixedRows={10}
                disabled={mission === null}
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainer
                sendCallback={sendPlayerInput}
                changeCallback={changeCallbackPlayerInput}
                value={playerInput}
                name="Player"
                colorType="secondary"
                initialEditable={true}
                disabled={mission === null}
              />
            </AppGrid>
          </AppGrid>
        </SplitScreen>
      </Box>
    </ThemeProvider>
  );
};

export default App;
