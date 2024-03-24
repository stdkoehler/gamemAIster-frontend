import {
    ComponentProps,
    useState,
    useRef,
    useEffect,
  } from "react";
  import { Typography } from "@mui/material";
  
import { Colors } from "../styles/styles.tsx";
import { Interaction } from "../functions/restInterface.tsx";

type HistoryProps =  ComponentProps<typeof Typography> & {
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
    const [history, setHistory] = useState<string>("")
    const textFieldRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textFieldRef.current != null) {
          const textarea = textFieldRef.current;
          if (textarea != null) {
            textarea.scrollTop = textarea.scrollHeight;
          }
        }
      }, [history]);


      useEffect(() => {
        setHistory(buildHistory(value))
      }, [value])
    
      function buildHistory(interactions: Interaction[]): string {
        let newHistory = "";
        for (const interaction of interactions) {
          if (interaction.llmOutput !== "") {
            if (newHistory !== "") {
              newHistory += `\n\n===Player===\n ${interaction.playerInput}\n\n===Gamemaster===\n ${interaction.llmOutput}`;
            } else {
              newHistory = `===Player===\n ${interaction.playerInput}\n\n===Gamemaster===\n ${interaction.llmOutput}`;
            }
          }
        }
        return newHistory;
      }

  
    return (
      <Typography ref={textFieldRef} {...props}
        sx={{
            display: "flex",
            width: "90%" /* Fields take up full width of their container */,
            maxHeight: "30vh",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            paddingTop: 0,
          }}
        >
      {history}
      </Typography>
    );
  }
  