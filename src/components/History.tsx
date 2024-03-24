import { ComponentProps, useState, useRef, useEffect } from "react";
import { Typography, Box, Container } from "@mui/material";

import { Colors } from "../styles/styles.tsx";
import { Interaction } from "../functions/restInterface.tsx";

type HistoryProps = ComponentProps<typeof Container> & {
  value: Interaction[];
  name: string;
  colorType: Colors;
};

export default function History({
  value,
  name,
  colorType,
  ...props
}: HistoryProps) {
  const [history, setHistory] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current != null) {
      const textarea = containerRef.current;
      if (textarea != null) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
  }, [value]);

  const InteractionList = (interactions: Interaction[]) => {
    return (
      <div>
        {interactions.map((interaction, index) => (
          <div key={index}>
            <Typography variant="subtitle2" fontStyle="italic" color="secondary">
              <br/>Player<br/>
            </Typography>
            <Typography color="secondary">
              {interaction.playerInput}
            </Typography>
            <Typography variant="subtitle2" fontStyle="italic" color="primary">
              <br/>Gamemaster<br/>
            </Typography>
            <Typography color="primary">
              {interaction.llmOutput}
            </Typography>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Container
      ref={containerRef}
      {...props}
      sx={{
        display: "flex",
        width: "95%" /* Fields take up full width of their container */,
        maxHeight: "30vh",
        overflow: "auto",
        paddingTop: 0,
        marginLeft: 0,
        marginRight: 0
      }}
    >
      {InteractionList(value)}
    </Container>
  );
}
