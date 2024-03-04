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
import { CharacterManager } from "./components/CharacterCard";
import { sendPlayerInputToLlm } from "./functions/restInterface";

import logo from "./assets/sr_00096_.png";

const App: React.FC = () => {
  const [history, setHistory] = useState<string>("");
  const [playerInputOld, setPlayerInputOld] = useState<string>("");
  const [llmOutput, setLlmOutput] = useState<string>("");
  const [playerInput, setPlayerInput] = useState<string>("");
  const [adventure] = useState<string>("Boom");

  const sendPlayerInput = useCallback(async () => {
    let newHistory = history;
    if (llmOutput !== "") {
      if (newHistory !== "") {
        newHistory += `\nPlayer: ${playerInputOld}\nGamemaster: ${llmOutput}`;
      } else {
        newHistory = `Player: ${playerInputOld}\nGamemaster: ${llmOutput}`;
      }
    }
    setHistory(newHistory);
    setPlayerInputOld(playerInput);
    setPlayerInput("");

    await sendPlayerInputToLlm(playerInput, playerInputOld, llmOutput, (newState: { llmOutput: string }) => {
      setLlmOutput(newState.llmOutput);
    });

    
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
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainerComponent
                sendCallback={sendPlayerInput}
                changeCallback={changeCallbackPlayerInputOld}
                value={playerInputOld}
                name="Player Prev"
                colorType="secondary"
                updateButton="Regenerate"
              />
            </AppGrid>
            <AppGrid item xs={12}>
              <FieldContainerComponent
                sendCallback={sendPlayerInput}
                changeCallback={changeCallbackLlmOutput}
                value={llmOutput}
                name="Gamemaster"
                colorType="primary"
                updateButton="Update"
                fixedRows={10}
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
              />
            </AppGrid>
          </AppGrid>
        </SplitScreen>
      </Box>
    </ThemeProvider>
  );
};

export default App;
