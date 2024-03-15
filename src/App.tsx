import React, { useState, useCallback } from "react";
import { ThemeProvider, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme } from "./theme";
import {
  SplitScreen,
  ImageContainer,
  AppGrid,
  AdventureHeading,
  FieldContainerComponent,
} from "./components/Components";

import { MissionMenu } from "./components/MissionMenu"
import { CharacterManager } from "./components/CharacterCard";
import { sendPlayerInputToLlm } from "./functions/restInterface";


import logo from "./assets/sr_00096_.png";

const App: React.FC = () => {
  const [history, setHistory] = useState<string>("");
  const [playerInputOld, setPlayerInputOld] = useState<string>("");
  const [llmOutput, setLlmOutput] = useState<string>("");
  const [playerInput, setPlayerInput] = useState<string>("");
  const [mission, setMission] = useState<number|null>(null);
  const [adventure] = useState<string>("Boom");

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

  const sendRegenerate = useCallback(async () => {
    if (playerInputOld != "") {
      await sendPlayerInputToLlm(
        playerInputOld,
        (newState: { llmOutput: string }) => {
          setLlmOutput(newState.llmOutput);
        }
      );
    }
  }, [llmOutput]);

  const sendPlayerInput = useCallback(async () => {
    if (playerInput != "") {
      let newHistory = history;
      const strippedLlmOutput = stripOutput(llmOutput);
      if (llmOutput !== "") {
        if (newHistory !== "") {
          newHistory += `\nPlayer: ${playerInputOld}\n\nGamemaster: ${strippedLlmOutput}`;
        } else {
          newHistory = `Player: ${playerInputOld}\n\nGamemaster: ${strippedLlmOutput}`;
        }
      }
      setHistory(newHistory);
      setPlayerInputOld(playerInput);
      setPlayerInput("");

      await sendPlayerInputToLlm(
        playerInput,
        (newState: { llmOutput: string }) => {
          setLlmOutput(newState.llmOutput);
        },
        playerInputOld,
        strippedLlmOutput
      );
    }
  }, [history, llmOutput, playerInput, playerInputOld]);

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
            <MissionMenu></MissionMenu>
            <CharacterManager></CharacterManager>
          </AppGrid>
          <AppGrid container spacing={2}>
            <AppGrid item xs={12}>
              <AdventureHeading>{adventure}</AdventureHeading>
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainerComponent
                value={history}
                name="History"
                colorType="primary"
                fixedRows={15}
                disabled={mission === null}
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainerComponent
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
              <FieldContainerComponent
                changeCallback={changeCallbackLlmOutput}
                value={llmOutput}
                name="Gamemaster"
                colorType="primary"
                fixedRows={10}
                disabled={mission === null}
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainerComponent
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
