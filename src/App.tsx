import React, { useState, useCallback } from "react";
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
  const [history, setHistory] = useState<string>("");
  const [playerInputOld, setPlayerInputOld] = useState<string>("");
  const [llmOutput, setLlmOutput] = useState<string>("");
  const [playerInput, setPlayerInput] = useState<string>("");
  const [mission, setMission] = useState<number | null>(null);
  const [adventure, setAdventure] = useState<string>("--UNNITIALIZED--");

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
    const response = await postNewMission();
    if (response !== null) {
      setMission(response.mission_id);
      setAdventure(response.name);
    }
  }, [mission]);

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

  const listMissions = useCallback(
    async () => {
      return getListMissions();
      },
    []
  );

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
