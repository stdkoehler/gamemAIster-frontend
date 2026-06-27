import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import StopIcon from "@mui/icons-material/Stop";

import { Colors } from "../styles/styles.tsx";
import StyledTextField from "./StyledTextField.tsx";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import ThinkingDisclosure from "./ThinkingDisclosure.tsx";

export enum FieldContainerType {
  MAIN_SEND = "main_send",
  PLAYER_OLD = "player_old",
  GAMEMASTER = "gamemaster",
}

type FieldContainerProps = {
  sendCallback?: (valueToSend: string) => Promise<void>;
  onCommit?: (value: string) => void;
  stopCallback?: () => Promise<void>;
  value: string;
  thinking?: string;
  instance: string;
  color: Colors;
  type: FieldContainerType;
  disabled?: boolean;
  placeholder?: string;
  speechToTextCallback?: (audioBlob: Blob) => Promise<void>;
  useLocalState?: boolean;
  onStreamComplete?: (value: string, thinking: string) => void;
};

export interface FieldContainerHandle {
  updateStream: (content: string, thinking?: string) => void;
  completeStream: (finalContent: string, finalThinking?: string) => void;
  startStream: () => void;
}

// --- Subcomponents ---

interface EditableFieldProps {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  color: Colors;
  placeholder: string;
  disabled: boolean;
  inputRef: React.RefObject<HTMLDivElement>;
}

function EditableField({
  value,
  onChange,
  onBlur,
  onKeyDown,
  color,
  placeholder,
  disabled,
  inputRef,
}: EditableFieldProps) {
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
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      multiline
      disabled={disabled}
    />
  );
}

interface DisplayFieldProps {
  value: string;
  color: Colors;
}

function DisplayField({ value, color }: DisplayFieldProps) {
  return <MarkdownRenderer value={value} color={color} />;
}

interface FieldButtonGroupProps {
  isEditable: boolean;
  isGenerating: boolean;
  type: FieldContainerType;
  color: Colors;
  disabled: boolean;
  onEditClick: () => void;
  onSendClick: () => void;
  onStopClick: () => void;
}

function FieldButtonGroup({
  isEditable,
  isGenerating,
  type,
  color,
  disabled,
  onEditClick,
  onSendClick,
  onStopClick,
}: FieldButtonGroupProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {(type === FieldContainerType.PLAYER_OLD ||
        type === FieldContainerType.GAMEMASTER) && (
        <Button
          color={color}
          disabled={disabled}
          onClick={onEditClick}
          size="small"
          sx={{ ml: 1, mt: 0.5, mb: 0.5 }}
        >
          {isEditable ? "View" : "Edit"}
        </Button>
      )}
      {type === FieldContainerType.PLAYER_OLD &&
        (isGenerating ? (
          <Button
            color={color}
            disabled={disabled}
            onClick={onStopClick}
            size="small"
            sx={{ ml: 1, mt: 0.5, mb: 0.5 }}
          >
            Stop
          </Button>
        ) : (
          <Button
            color={color}
            disabled={disabled}
            onClick={onSendClick}
            size="small"
            sx={{ ml: 1, mt: 0.5, mb: 0.5 }}
          >
            Regen
          </Button>
        ))}
    </Box>
  );
}

// --- Main Component ---

const FieldContainer = forwardRef<FieldContainerHandle, FieldContainerProps>(
  (
    {
      sendCallback,
      onCommit,
      stopCallback,
      value,
      thinking = "",
      instance,
      color,
      type,
      disabled = false,
      placeholder = "",
      speechToTextCallback,
      useLocalState = true,
      onStreamComplete,
    },
    ref,
  ) => {
    const theme = useTheme();

    const [isEditable, setIsEditable] = useState(
      type === FieldContainerType.MAIN_SEND,
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const [streamValue, setStreamValue] = useState("");
    const [streamThinking, setStreamThinking] = useState("");
    const [isStreamingActive, setIsStreamingActive] = useState(false);
    const textFieldRef = useRef<HTMLDivElement>(null!);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
      if (useLocalState && !isStreamingActive) {
        setLocalValue(value);
      }
    }, [value, useLocalState, isStreamingActive]);

    const displayValue = isStreamingActive
      ? streamValue
      : useLocalState
        ? localValue
        : value;

    const displayThinking = isStreamingActive ? streamThinking : thinking;

    const updateStream = useCallback(
      (content: string, newThinking?: string) => {
        setStreamValue(content);
        if (newThinking !== undefined) {
          setStreamThinking(newThinking);
        }
      },
      [],
    );

    const completeStream = useCallback(
      (finalContent: string, finalThinking?: string) => {
        setStreamValue(finalContent);
        if (finalThinking !== undefined) {
          setStreamThinking(finalThinking);
        }
        setIsStreamingActive(false);
        if (onStreamComplete) {
          onStreamComplete(finalContent, finalThinking || "");
        }
      },
      [onStreamComplete],
    );

    const startStream = useCallback(() => {
      setIsStreamingActive(true);
      setStreamValue("");
      setStreamThinking("");
    }, []);

    useImperativeHandle(
      ref,
      () => ({ updateStream, completeStream, startStream }),
      [updateStream, completeStream, startStream],
    );

    const commitValue = useCallback(() => {
      if (useLocalState && onCommit && localValue !== value) {
        onCommit(localValue);
      }
    }, [useLocalState, onCommit, localValue, value]);

    const handleSend = useCallback(async () => {
      if (sendCallback && !isGenerating) {
        setIsGenerating(true);
        setIsEditable(false);
        const toSend = localValue;
        if (type === FieldContainerType.MAIN_SEND) {
          setLocalValue("");
        }
        await sendCallback(toSend);
        setIsGenerating(false);
        if (type === FieldContainerType.MAIN_SEND) {
          setIsEditable(true);
        }
      }
    }, [sendCallback, isGenerating, localValue, type]);

    const handleStop = useCallback(async () => {
      if (stopCallback) {
        await stopCallback();
      }
    }, [stopCallback]);

    const handleEditToggle = useCallback(() => {
      if (isEditable && type !== FieldContainerType.MAIN_SEND) {
        commitValue();
      }
      setIsEditable((prev) => !prev);
    }, [isEditable, commitValue, type]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && event.shiftKey) {
          event.preventDefault();
          handleSend();
        }
      },
      [handleSend],
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isStreamingActive) return;
        if (useLocalState) {
          setLocalValue(event.target.value);
        }
      },
      [useLocalState, isStreamingActive],
    );

    const handleBlur = useCallback(() => {
      if (!isStreamingActive) {
        commitValue();
      }
    }, [commitValue, isStreamingActive]);

    const handleMicClick = useCallback(async () => {
      if (!isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const mediaRecorder = new window.MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          mediaRecorder.start();
          setIsRecording(true);
        } catch {
          alert("Microphone access denied or not available.");
        }
      } else {
        const mediaRecorder = mediaRecorderRef.current;
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          mediaRecorder.onstop = async () => {
            setIsRecording(false);
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            if (typeof speechToTextCallback === "function") {
              await speechToTextCallback(audioBlob);
            }
          };
        }
      }
    }, [isRecording, speechToTextCallback]);

    const MemoizedDisplayField = memo(DisplayField);

    // ===== MAIN_SEND: modern horizontal input bar =====
    if (type === FieldContainerType.MAIN_SEND) {
      const paletteColor = theme.palette[color];
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.25,
          }}
        >
          {/* Text input — colors mirror StyledTextField's TextfieldStyle */}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            color={color}
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreamingActive}
            inputRef={textFieldRef}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: paletteColor.light,
                backgroundColor: theme.palette.background.paper,
                transition: "all 0.2s ease-in-out",
                "& fieldset": {
                  borderColor: paletteColor.dark,
                },
                "&:hover fieldset": {
                  borderColor: paletteColor.main,
                },
                // Targets the notchedOutline by class (not the bare
                // `fieldset` tag) so this has the same class-selector
                // count as the theme's own equivalent global focus-border
                // rule, putting the tiebreak on a guaranteed-higher count
                // (this selector has one extra ancestor class) rather than
                // a narrower tag-vs-class specificity margin.
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  // Themes with a dedicated "active" accent (e.g.
                  // Shadowrun's cyan) take over the border fully on focus,
                  // so the field's own base color doesn't show through
                  // alongside it. Themes without one keep the base-color
                  // border as before.
                  borderColor: theme.accentColor ?? paletteColor.dark,
                },
                "&.Mui-focused .MuiInputBase-input": {
                  // The theme's own global focus rule already swaps this
                  // text's *glow* to the accent color (e.g. cyan) — without
                  // also swapping the actual fill color here, the letters
                  // stayed the field's base color (e.g. yellow) underneath
                  // a cyan glow, which read as a mismatched, slightly off
                  // color rather than a clean accent takeover.
                  color: theme.accentColor ?? paletteColor.light,
                },
                "&.Mui-disabled fieldset": {
                  borderColor: theme.palette.background.default,
                },
              },
              "& .MuiInputBase-input": {
                fontStyle: "italic",
                "&::placeholder": {
                  color: alpha(paletteColor.main, 0.45),
                  opacity: 1,
                  fontStyle: "italic",
                },
                "&.Mui-disabled": {
                  WebkitTextFillColor: paletteColor.main,
                },
              },
            }}
          />

          {/* Mic button */}
          <IconButton
            size="small"
            onClick={handleMicClick}
            disabled={disabled}
            sx={{
              width: 36,
              height: 36,
              color: isRecording
                ? theme.palette.error.main
                : alpha(paletteColor.main, 0.5),
              border: `0.5px solid ${alpha(paletteColor.main, 0.2)}`,
              borderRadius: "8px",
              flexShrink: 0,
              "&:hover": {
                background: alpha(paletteColor.main, 0.1),
                color: paletteColor.main,
              },
            }}
          >
            {isRecording ? (
              <MicOffIcon fontSize="small" />
            ) : (
              <MicIcon fontSize="small" />
            )}
          </IconButton>

          {/* Send / Stop button */}
          <IconButton
            size="small"
            onClick={
              isGenerating || isStreamingActive ? handleStop : handleSend
            }
            disabled={disabled && !isGenerating && !isStreamingActive}
            sx={{
              width: 36,
              height: 36,
              background: alpha(paletteColor.main, 0.2),
              border: `0.5px solid ${alpha(paletteColor.main, 0.5)}`,
              color: paletteColor.main,
              borderRadius: "8px",
              flexShrink: 0,
              "&:hover": {
                background: alpha(paletteColor.main, 0.35),
              },
              "&.Mui-disabled": { opacity: 0.35 },
            }}
          >
            {isGenerating || isStreamingActive ? (
              <StopIcon fontSize="small" />
            ) : (
              <ArrowUpwardIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      );
    }

    // ===== PLAYER_OLD / GAMEMASTER: narrative display =====

    // Render nothing when GAMEMASTER has no content and isn't streaming —
    // the component stays mounted so the imperative ref (streaming handle) keeps working.
    if (
      type === FieldContainerType.GAMEMASTER &&
      !displayValue.trim() &&
      !displayThinking.trim() &&
      !isStreamingActive
    ) {
      return null;
    }

    return (
      <>
        {/* Subtle role label */}
        <Typography
          variant="tagLabel"
          color={color}
          sx={{
            display: "block",
            color: alpha(theme.palette[color].main, 0.45),
            mt: 1.5,
            mb: 0.5,
          }}
        >
          {instance}
        </Typography>

        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            gap: 1,
          }}
        >
          {/* Content column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
              minWidth: 0,
              gap: 0.5,
            }}
          >
            <Box sx={{ width: "100%", mt: 1 }}>
              <ThinkingDisclosure
                content={displayThinking}
                color={color}
                isStreaming={isStreamingActive && !displayValue.trim()}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              {isEditable ? (
                <EditableField
                  value={displayValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  color={color}
                  placeholder={placeholder}
                  disabled={disabled || isStreamingActive}
                  inputRef={textFieldRef}
                />
              ) : type === FieldContainerType.PLAYER_OLD ? (
                /* Player action echo: same markdown rendering as GM */
                <MemoizedDisplayField value={displayValue} color={color} />
              ) : (
                /* GM narration: full markdown prose */
                <MemoizedDisplayField value={displayValue} color={color} />
              )}
            </Box>
          </Box>

          {/* Buttons column */}
          <Box sx={{ flex: "0 0 auto", flexShrink: 0 }}>
            <FieldButtonGroup
              isEditable={isEditable}
              isGenerating={isGenerating || isStreamingActive}
              type={type}
              color={color}
              disabled={disabled}
              onEditClick={handleEditToggle}
              onSendClick={handleSend}
              onStopClick={handleStop}
            />
          </Box>
        </Container>
      </>
    );
  },
);

FieldContainer.displayName = "FieldContainer";

export default FieldContainer;
