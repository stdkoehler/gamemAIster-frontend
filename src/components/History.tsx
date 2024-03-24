import React, {
    ReactNode,
    ComponentProps,
    useState,
    useRef,
    useEffect,
  } from "react";
  import { TextField, Button, Typography, Box, useTheme } from "@mui/material";
  

import { Colors } from "../styles/styles.tsx";

type HistoryProps =  ComponentProps<typeof Typography> & {
    value: string;
    name: string;
    colorType: Colors;
  };
export default function History({
    value,
    name,
    colorType,
    ...props
  }: HistoryProps) {

    const textFieldRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Invoke your callback whenever the value changes
        
        if (textFieldRef.current != null) {
          const textarea = textFieldRef.current;
          console.log("History effect")
          console.log(textarea)
          if (textarea != null) {
            textarea.scrollTop = textarea.scrollHeight;
          }
        }
      }, [value]);
    
  
  
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
      {value}
      </Typography>
    );
  }
  