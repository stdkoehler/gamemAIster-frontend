import React, { useState, useCallback } from "react";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme } from "./theme";
import {
  SplitScreen,
  ImageContainer,
  AppGrid,
  AdventureHeading,
  FieldContainerComponent,
} from "./Components";
import { sendPlayerInputToLlm } from "./RestInterface";

import logo from "./assets/sr_00096_.png";

const App: React.FC = () => {
  const [history, setHistory] = useState<string>("");
  const [playerInputOld, setPlayerInputOld] = useState<string>("");
  const [llmOutput, setLlmOutput] = useState<string>("");
  const [playerInput, setPlayerInput] = useState<string>("");
  const [adventure] = useState<string>("Boom");

  const sendPlayerInput = useCallback(() => {
    let newHistory = history;
    if (llmOutput !== "") {
      if (newHistory !== "") {
        newHistory += `\nPlayer: ${playerInputOld}\nGamemaster: ${llmOutput}`;
      } else {
        newHistory = `Player: ${playerInputOld}\nGamemaster: ${llmOutput}`;
      }
    }

    sendPlayerInputToLlm(playerInput, (newState: { llmOutput: string }) => {
      setLlmOutput(newState.llmOutput);
    });

    setHistory(newHistory);
    setPlayerInputOld(playerInput);
    setPlayerInput("");
  }, [history, llmOutput, playerInput, playerInputOld]);

  const changeCallback = useCallback((value: string) => {
    setPlayerInput(value);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ImageContainer>{logo}</ImageContainer>
      <SplitScreen leftWeight={1} rightWeight={5} color={"primary"}>
        <AppGrid container spacing={2}>
          <AppGrid item xs={12}>
            <div>
              <p>Inventory</p>
            </div>
          </AppGrid>
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
              changeCallback={changeCallback}
              value={playerInputOld}
              name="Player Prev"
              colorType="secondary"
              updateButton="Regenerate"
            />
          </AppGrid>
          <AppGrid item xs={12}>
            <FieldContainerComponent
              sendCallback={sendPlayerInput}
              changeCallback={changeCallback}
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
              changeCallback={changeCallback}
              value={playerInput}
              name="Player"
              colorType="secondary"
              initialEditable={true}
            />
          </AppGrid>
        </AppGrid>
      </SplitScreen>
    </ThemeProvider>
  );
};

export default App;