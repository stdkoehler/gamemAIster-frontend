import React, { useState, useRef, useEffect } from "react";
import { Button, Typography, Box, Container } from "@mui/material";

import { Colors } from "../styles/styles.tsx";
import StyledTextField from "./StyledTextField.tsx";


export enum FieldContainerType {
  MAIN_SEND = "main_send",
  PLAYER_OLD = "player_old",
  GAMEMASTER = "gamemaster",
}

type FieldContainerProps = {
  sendCallback?: () => Promise<void>;
  changeCallback?: (arg: string) => void;
  stopCallback?: () => Promise<void>;
  value: string;
  instance: string;
  color: Colors;
  type: FieldContainerType;
  disabled?: boolean;
  placeholder?: string;
};

export default function FieldContainer({
  sendCallback,
  changeCallback,
  stopCallback,
  value,
  instance,
  color,
  type,
  disabled = false,
  placeholder = "",
}: FieldContainerProps) {
  const [editable, setEditable] = useState(
    type === FieldContainerType.MAIN_SEND
  );
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // Invoke your callback whenever the value changes
    if (textFieldRef.current != null) {
      const textarea = textFieldRef.current.querySelector("textarea");
      if (textarea != null) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
  }, [value]);

  useEffect(() => {
    // Focus the input field after sendPlayerInput is executed
    if (!locked && type === FieldContainerType.MAIN_SEND) {
      textFieldRef.current?.querySelector("textarea")?.focus();
    }
  }, [locked, type]);

  const textFieldRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    console.log("test_inner");
    if (sendCallback && !locked) {
      setLocked(true);
      setEditable(false);
      await sendCallback();
    }
    setLocked(false);
    setEditable(true);
  };

  const handleStop = async () => {
    if (stopCallback) {
      await stopCallback();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // don't register the return key
      handleSend();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Call the callback function with the updated value
    changeCallback?.(event.target.value);
  };

  return (
    <>
      <Typography
        variant="subtitle2"
        fontStyle="italic"
        color={color}
        sx={{ display: "flex" }}
      >
        <br />
        {instance}
        <br />
      </Typography>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        }}
      >
        {editable ? (
          <StyledTextField
            color={color}
            value={value}
            innerRef={textFieldRef}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            multiline
            disabled={disabled}
          />
        ) : (
          <Typography color={color} sx={{ whiteSpace: "pre-wrap" }}>
            {value}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {(type === FieldContainerType.PLAYER_OLD ||
            type === FieldContainerType.GAMEMASTER) && (
            <Button
              color={color}
              disabled={disabled}
              onClick={() => setEditable(!editable)}
            >
              Edit
            </Button>
          )}
          {(type === FieldContainerType.MAIN_SEND ||
            type === FieldContainerType.PLAYER_OLD) &&
            (locked ? (
              <Button color={color} disabled={disabled} onClick={handleStop}>
                Stop
              </Button>
            ) : (
              <Button color={color} disabled={disabled} onClick={handleSend}>
                Send
              </Button>
            ))}
        </Box>
      </Container>
    </>
  );
}
