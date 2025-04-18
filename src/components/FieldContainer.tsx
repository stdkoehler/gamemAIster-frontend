import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Typography, Box, Container } from "@mui/material";

import { Colors } from "../styles/styles.tsx";
import StyledTextField from "./StyledTextField.tsx";
import MarkdownRenderer from "./MarkdownRenderer.tsx";

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

// --- Subcomponents ---

// Editable input field with autofocus and scroll on value change
function EditableField({
  value,
  onChange,
  onKeyDown,
  color,
  placeholder,
  disabled,
  inputRef,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  color: Colors;
  placeholder: string;
  disabled: boolean;
  inputRef: React.RefObject<HTMLDivElement>;
}) {
  useEffect(() => {
    const textarea = inputRef.current?.querySelector("textarea");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
      textarea.focus();
    }
  }, [value, inputRef]);

  return (
    <StyledTextField
      color={color}
      value={value}
      innerRef={inputRef}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      multiline
      disabled={disabled}
    />
  );
}

// Markdown display field
function DisplayField({ value, color }: { value: string; color: Colors }) {
  return <MarkdownRenderer value={value} color={color} />;
}

// Send/Stop/Edit button group
function FieldButtonGroup({
  isEditable,
  isGenerating,
  type,
  color,
  disabled,
  onEditClick,
  onSendClick,
  onStopClick,
}: {
  isEditable: boolean;
  isGenerating: boolean;
  type: FieldContainerType;
  color: Colors;
  disabled: boolean;
  onEditClick: () => void;
  onSendClick: () => void;
  onStopClick: () => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {(type === FieldContainerType.PLAYER_OLD ||
        type === FieldContainerType.GAMEMASTER) && (
        <Button color={color} disabled={disabled} onClick={onEditClick}>
          {isEditable ? "View" : "Edit"}
        </Button>
      )}
      {(type === FieldContainerType.MAIN_SEND ||
        type === FieldContainerType.PLAYER_OLD) &&
        (isGenerating ? (
          <Button color={color} disabled={disabled} onClick={onStopClick}>
            Stop
          </Button>
        ) : (
          <Button color={color} disabled={disabled} onClick={onSendClick}>
            Send
          </Button>
        ))}
    </Box>
  );
}

// --- Main Component ---

const FieldContainer: React.FC<FieldContainerProps> = ({
  sendCallback,
  changeCallback,
  stopCallback,
  value,
  instance,
  color,
  type,
  disabled = false,
  placeholder = "",
}) => {
  const [isEditable, setIsEditable] = useState(
    type === FieldContainerType.MAIN_SEND
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  // Use useCallback for stable memoized handlers
  const handleSend = useCallback(async () => {
    if (sendCallback && !isGenerating) {
      setIsGenerating(true);
      setIsEditable(false);
      await sendCallback();
      setIsGenerating(false);
      setIsEditable(true);
    }
  }, [sendCallback, isGenerating]);

  const handleStop = useCallback(async () => {
    if (stopCallback) {
      await stopCallback();
    }
  }, [stopCallback]);

  const handleEditToggle = useCallback(() => {
    setIsEditable((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault(); // don't register the return key
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      changeCallback?.(event.target.value);
    },
    [changeCallback]
  );

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
        {isEditable ? (
          <EditableField
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            color={color}
            placeholder={placeholder}
            disabled={disabled}
            inputRef={textFieldRef}
          />
        ) : (
          <DisplayField value={value} color={color} />
        )}
        <FieldButtonGroup
          isEditable={isEditable}
          isGenerating={isGenerating}
          type={type}
          color={color}
          disabled={disabled}
          onEditClick={handleEditToggle}
          onSendClick={handleSend}
          onStopClick={handleStop}
        />
      </Container>
    </>
  );
};

export default FieldContainer;
