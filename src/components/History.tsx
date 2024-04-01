import { ComponentProps, useRef, useEffect } from "react";
import { Typography, Container } from "@mui/material";

import { Interaction } from "../functions/restInterface.tsx";
import FieldContainer, { FieldContainerType } from "./FieldContainer.tsx";

type HistoryProps = ComponentProps<typeof Container> & {
  sendCallback?: () => Promise<void>;
  stopCallback?: () => Promise<void>;
  changePlayerInputOldCallback?: (arg: string) => void;
  changeLlmOutputCallback?: (arg: string) => void;
  interactions: Interaction[];
  lastInteraction: Interaction;
  disabled: boolean;
};

export default function History({
  sendCallback,
  stopCallback,
  changePlayerInputOldCallback,
  changeLlmOutputCallback,
  interactions,
  lastInteraction,
  disabled,
  ...props
}: HistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [interactions, lastInteraction]);

  const InteractionList = (interactions: Interaction[]) => {
    return (
      <>
        {interactions.map((interaction, index) => (
          <div key={index}>
            <Typography
              variant="subtitle2"
              fontStyle="italic"
              color="secondary"
            >
              <br />
              Player
              <br />
            </Typography>
            <Typography color="secondary" sx={{ whiteSpace: "pre-wrap" }}>
              {interaction.playerInput}
            </Typography>
            <Typography variant="subtitle2" fontStyle="italic" color="primary">
              <br />
              Gamemaster
              <br />
            </Typography>
            <Typography color="primary" sx={{ whiteSpace: "pre-wrap" }}>
              {interaction.llmOutput}
            </Typography>
          </div>
        ))}
      </>
    );
  };

  return (
    <Container
      ref={containerRef}
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "95%" /* Fields take up full width of their container */,
        maxHeight: "60vh",
        overflow: "auto",
        paddingTop: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      {InteractionList(interactions)}
      {/* {lastInteraction.playerInput !== "" && ( */}
      <FieldContainer
        sendCallback={sendCallback}
        stopCallback={stopCallback}
        changeCallback={changePlayerInputOldCallback}
        value={lastInteraction.playerInput}
        instance="Player"
        color="secondary"
        type={FieldContainerType.PLAYER_OLD}
        disabled={disabled}
      />
      {/* )} */}
      {/* {lastInteraction.llmOutput !== "" && ( */}
      <FieldContainer
        changeCallback={changeLlmOutputCallback}
        value={lastInteraction.llmOutput}
        instance="Gamemaster"
        color="primary"
        type={FieldContainerType.GAMEMASTER}
        disabled={disabled}
      />
      {/* )} */}
    </Container>
  );
}
