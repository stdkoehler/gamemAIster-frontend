import React, { useRef, useState, useEffect, useCallback } from "react";
import { ThemeProvider, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme } from "./theme";

import AdventureHeading from "./components/AdventureHeading";
import AppGrid from "./components/AppGrid";
import ImageContainer from "./components/ImageContainer";
import SplitScreen from "./components/SplitScreen";
import FieldContainer from "./components/FieldContainer";

import { MissionMenu } from "./components/MissionMenu";
import { CharacterManager } from "./components/CharacterCard";
import {
  sendPlayerInputToLlm,
  postNewMission,
  postSaveMission,
  getListMissions,
  getMission,
} from "./functions/restInterface";

import logo from "./assets/sr_00096_.png";

type Interaction = {
  playerInput: string;
  llmOutput: string;
};

interface AppendHistory {
  history: string;
  interactions: Interaction[];
}

const App: React.FC = () => {
  const [history, setHistory] = useState<string>(() => {
    return localStorage.getItem("history") || "";
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
    return localStorage.getItem("adventure") || "-- Create a new mission --";
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    // Function that is called whenever any of the dependency array is called
    // This is used to save the state in local storage so that it persists on page refresh
    localStorage.setItem("history", history);
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
    setAdventure("-- Create a new mission --");
    setHistory("");
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
    // strip "What do you want to do" and following ?,\s,\n
    // strip "What do you want to answer" and following ?,\s,\n
    let strippedLlmOutput = llmOutput.replace(
      /^\s*What\sdo\syou\swant\sto\sdo\s*\??\s*[\r\n]*/gm,
      ""
    );
    strippedLlmOutput = strippedLlmOutput.replace(
      /^\s*What\sdo\syou\swant\sto\sanswer\s*\??\s*[\r\n]*/gm,
      ""
    );
    return strippedLlmOutput;
  }

  function appendInteractions({
    history,
    interactions,
  }: AppendHistory): string {
    let newHistory = history;
    for (const interaction of interactions) {
      if (interaction.llmOutput !== "") {
        if (newHistory !== "") {
          newHistory += `\nPlayer: ${interaction.playerInput}\n\nGamemaster: ${interaction.llmOutput}`;
        } else {
          newHistory = `Player: ${interaction.playerInput}\n\nGamemaster: ${interaction.llmOutput}`;
        }
      }
    }
    return newHistory;
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
        const interactions = [
          { playerInput: playerInputOld, llmOutput: strippedLlmOutput },
        ];
        const newHistory = appendInteractions({ history, interactions });

        try {
          await sendPlayerInputToLlm(
            mission,
            playerInput,
            (newState: { llmOutput: string }) => {
              setLlmOutput(newState.llmOutput);
            },
            playerInputOld,
            strippedLlmOutput
          );

          setHistory(newHistory);
          setPlayerInputOld(playerInput);
          setPlayerInput("");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [mission, history, llmOutput, playerInput, playerInputOld]);

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
              <FieldContainer
                value={history}
                name="History"
                colorType="primary"
                fixedRows={15}
                disabled={mission === null}
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
