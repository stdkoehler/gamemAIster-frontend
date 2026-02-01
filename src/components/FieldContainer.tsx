import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import { Button, Typography, Box, Container } from "@mui/material";

import { Colors } from "../styles/styles.tsx";
import StyledTextField from "./StyledTextField.tsx";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import ThinkingDisclosure from "./ThinkingDisclosure.tsx";

/**
 * Enum for the different types of FieldContainer.
 * This determines the behavior and appearance of the field.
 */
export enum FieldContainerType {
  /** The main input field for sending messages. */
  MAIN_SEND = "main_send",
  /** A field representing an older player message, allowing edit/view. */
  PLAYER_OLD = "player_old",
  /** A field representing a gamemaster message, allowing edit/view. */
  GAMEMASTER = "gamemaster",
}

/**
 * Props for the FieldContainer component.
 */
type FieldContainerProps = {
  /** Optional callback function to be executed when a message is sent. */
  sendCallback?: (valueToSend: string) => Promise<void>;
  /** Optional callback function called when user commits changes (blur, send, etc). */
  onCommit?: (value: string) => void;
  /** Optional callback function to be executed when a stop action is triggered. */
  stopCallback?: () => Promise<void>;
  /** The current value of the field. */
  value: string;
  /** Optional current thinking text for streaming display. */
  thinking?: string;
  /** Identifier or label for the field instance (e.g., "Player Input", "Gamemaster Output"). */
  instance: string;
  /** The color theme for the field. See {@link Colors}. */
  color: Colors;
  /** The type of the field container. See {@link FieldContainerType}. */
  type: FieldContainerType;
  /** Optional flag to disable the field. Defaults to `false`. */
  disabled?: boolean;
  /** Optional placeholder text for the input field. */
  placeholder?: string;
  /** Optional callback function to handle speech-to-text transcription from audio. */
  speechToTextCallback?: (audioBlob: Blob) => Promise<void>;
  /** Optional flag to use local state for typing performance. Defaults to `true`. */
  useLocalState?: boolean;
  /** Optional callback to commit the final streamed value to context. */
  onStreamComplete?: (value: string, thinking: string) => void;
};

/**
 * Handle interface for FieldContainer imperative methods.
 */
export interface FieldContainerHandle {
  /** Updates the field with streaming content without triggering context updates. */
  updateStream: (content: string, thinking?: string) => void;
  /** Completes the stream and commits the final value to context. */
  completeStream: (finalContent: string, finalThinking?: string) => void;
  /** Starts streaming mode. */
  startStream: () => void;
}

// --- Subcomponents ---

/**
 * Props for the EditableField component.
 */
interface EditableFieldProps {
  /** The current value of the editable field. */
  value: string;
  /** Callback function triggered when the field value changes. */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Callback function triggered on blur events. */
  onBlur?: () => void;
  /** Callback function triggered on a key down event. */
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** The color theme for the field. */
  color: Colors;
  /** Placeholder text for the input field. */
  placeholder: string;
  /** Flag to disable the field. */
  disabled: boolean;
  /** Ref to the input field's underlying div element. */
  inputRef: React.RefObject<HTMLDivElement>;
}

/**
 * EditableField is a subcomponent that renders an editable text area.
 * It includes autofocus and scroll-to-bottom behavior on value change.
 *
 * @param props - The props for the component. See {@link EditableFieldProps}.
 * @returns The EditableField component.
 */
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

/**
 * Props for the DisplayField component.
 */
interface DisplayFieldProps {
  /** The value to be displayed as Markdown. */
  value: string;
  /** The color theme for the field. */
  color: Colors;
}

/**
 * DisplayField is a subcomponent that renders a non-editable field for displaying Markdown content.
 *
 * @param props - The props for the component. See {@link DisplayFieldProps}.
 * @returns The DisplayField component.
 */
function DisplayField({ value, color }: DisplayFieldProps) {
  return <MarkdownRenderer value={value} color={color} />;
}

/**
 * Props for the FieldButtonGroup component.
 */
interface FieldButtonGroupProps {
  /** Whether the associated field is currently editable. */
  isEditable: boolean;
  /** Whether content is currently being generated. */
  isGenerating: boolean;
  /** The type of the parent FieldContainer. */
  type: FieldContainerType;
  /** The color theme for the buttons. */
  color: Colors;
  /** Flag to disable the buttons. */
  disabled: boolean;
  /** Callback for when the Edit/View button is clicked. */
  onEditClick: () => void;
  /** Callback for when the Send button is clicked. */
  onSendClick: () => void;
  /** Callback for when the Stop button is clicked. */
  onStopClick: () => void;
}

/**
 * FieldButtonGroup is a subcomponent that renders a group of action buttons (Send, Stop, Edit/View)
 * based on the current state and type of the FieldContainer.
 *
 * @param props - The props for the component. See {@link FieldButtonGroupProps}.
 * @returns The FieldButtonGroup component.
 */
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
          sx={{ ml: 1, mt: 0.5, mb: 0.5 }}
        >
          {isEditable ? "View" : "Edit"}
        </Button>
      )}
      {(type === FieldContainerType.MAIN_SEND ||
        type === FieldContainerType.PLAYER_OLD) &&
        (isGenerating ? (
          <Button
            color={color}
            disabled={disabled}
            onClick={onStopClick}
            sx={{ ml: 1, mt: 0.5, mb: 0.5 }}
          >
            Stop
          </Button>
        ) : (
          <Button
            color={color}
            disabled={disabled}
            onClick={onSendClick}
            sx={{ ml: 1, mt: 0.5, mb: 0.5 }}
          >
            Send
          </Button>
        ))}
    </Box>
  );
}

/**
 * Props for the MicrophoneButton component.
 */
interface MicrophoneButtonProps {
  /** Whether the microphone is currently recording audio. */
  isRecording: boolean;
  /** The color theme for the button. */
  color: Colors;
  /** Flag to disable the button. */
  disabled: boolean;
  /** Callback for when the microphone button is clicked. */
  onClick: () => void;
}

function MicrophoneButton({
  isRecording,
  color,
  disabled,
  onClick,
}: MicrophoneButtonProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
      <Button
        variant={isRecording ? "contained" : "outlined"}
        color={isRecording ? "error" : color}
        onClick={onClick}
        disabled={disabled}
        startIcon={
          <span role="img" aria-label="microphone">
            {isRecording ? "🔴" : "🎤"}
          </span>
        }
      >
        {isRecording ? "Stop Recording" : "Record"}
      </Button>
    </Box>
  );
}

// --- Main Component ---

/**
 * FieldContainer is a versatile component that provides an input or display field
 * with associated action buttons. It can be configured for different roles like
 * sending messages, displaying past player messages, or gamemaster messages.
 * It handles edit/view states, message sending/stopping, and character-by-character input changes.
 *
 * @param props - The props for the component. See {@link FieldContainerProps}.
 * @returns The FieldContainer component.
 */
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
    /** State variable to control if the field is in edit mode or display mode.
     *  Initialized to `true` if the type is `MAIN_SEND`, `false` otherwise.
     */
    const [isEditable, setIsEditable] = useState(
      type === FieldContainerType.MAIN_SEND,
    );
    /** State variable to track if content is currently being generated (e.g., waiting for an API response). */
    const [isGenerating, setIsGenerating] = useState(false);
    /** State variable to track if audio is currently being recorded. */
    const [isRecording, setIsRecording] = useState(false);
    /** Local state for typing performance - only used when useLocalState is true */
    const [localValue, setLocalValue] = useState(value);
    /** Local state for streaming content - bypasses context during streaming */
    const [streamValue, setStreamValue] = useState("");
    /** Local state for streaming thinking content */
    const [streamThinking, setStreamThinking] = useState("");
    /** Flag to track if currently in streaming mode */
    const [isStreamingActive, setIsStreamingActive] = useState(false);
    /** Ref to the underlying TextField component to manage focus and scroll. */
    const textFieldRef = useRef<HTMLDivElement>(null!);
    /** Ref to the MediaRecorder instance for audio recording. */
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    /** Ref to store audio chunks during recording. */
    const audioChunksRef = useRef<Blob[]>([]);

    // Sync local value with external value when it changes (but not during streaming)
    useEffect(() => {
      if (useLocalState && !isStreamingActive) {
        setLocalValue(value);
      }
    }, [value, useLocalState, isStreamingActive]);

    // Determine which value to use for display
    const displayValue = isStreamingActive
      ? streamValue
      : useLocalState
        ? localValue
        : value;

    // Determine thinking for display
    const displayThinking = isStreamingActive ? streamThinking : thinking;

    // Expose imperative methods for streaming
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
          // Pass both back to parent
          onStreamComplete(finalContent, finalThinking || "");
        }
      },
      [onStreamComplete],
    );

    const startStream = useCallback(() => {
      setIsStreamingActive(true);
      setStreamValue("");
      setStreamThinking(""); // Reset thinking stream
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        updateStream,
        completeStream,
        startStream,
      }),
      [updateStream, completeStream, startStream],
    );

    /**
     * Commits the current local value to the parent component.
     */
    const commitValue = useCallback(() => {
      if (useLocalState && onCommit && localValue !== value) {
        console.log("commit", localValue);
        onCommit(localValue);
      }
    }, [useLocalState, onCommit, localValue, value]);

    /**
     * Handles the send action.
     * If a `sendCallback` is provided and not currently generating, it sets `isGenerating` to true,
     * `isEditable` to false, calls the `sendCallback`, and then resets the states.
     */
    const handleSend = useCallback(async () => {
      if (sendCallback && !isGenerating) {
        // Commit any pending changes before sending
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

    /**
     * Handles the stop action.
     * If a `stopCallback` is provided, it calls the `stopCallback`.
     */
    const handleStop = useCallback(async () => {
      if (stopCallback) {
        await stopCallback();
      }
    }, [stopCallback]);

    /**
     * Toggles the editable state of the field.
     */
    const handleEditToggle = useCallback(() => {
      // Commit changes when switching from edit to view mode
      if (isEditable && type !== FieldContainerType.MAIN_SEND) {
        commitValue();
      }
      setIsEditable((prev) => !prev);
    }, [isEditable, commitValue, type]);

    /**
     * Handles key down events in the editable field.
     * Specifically, triggers `handleSend` if Shift + Enter is pressed.
     * @param event - The keyboard event.
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && event.shiftKey) {
          event.preventDefault(); // don't register the return key
          handleSend();
        }
      },
      [handleSend],
    );

    /**
     * Handles the change event of the editable field.
     * Updates local state for performance
     * @param event - The text area change event.
     */
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;

        // Don't allow editing during streaming
        if (isStreamingActive) {
          return;
        }

        if (useLocalState) {
          // Update local state immediately for performance
          setLocalValue(newValue);
        }
      },
      [useLocalState, isStreamingActive],
    );

    /**
     * Handles blur events to commit changes.
     */
    const handleBlur = useCallback(() => {
      if (!isStreamingActive) {
        commitValue();
      }
    }, [commitValue, isStreamingActive]);

    /**
     * Handles the microphone button click.
     * Toggles audio recording on and off using the MediaRecorder API.
     */
    const handleMicClick = useCallback(async () => {
      if (!isRecording) {
        // Start recording
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
        } catch (err) {
          alert("Microphone access denied or not available.");
        }
      } else {
        // Stop recording
        const mediaRecorder = mediaRecorderRef.current;
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          mediaRecorder.onstop = async () => {
            setIsRecording(false);
            // Combine audio chunks into a single blob
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
    const MemoizedMicrophoneButton = memo(MicrophoneButton);

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
            flexDirection: "row", // Main container is now a horizontal row
            alignItems: "center", // Aligns buttons to the bottom of the field/disclosure
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            gap: 1,
          }}
        >
          {/* Left Column: Vertical Stack for Thinking + Field */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
              minWidth: 0,
              gap: 0.5, // Space between thinking disclosure and field
            }}
          >
            <Box sx={{ width: "100%", marginTop: 1 }}>
              <ThinkingDisclosure content={displayThinking} color={color} />
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
              ) : (
                <MemoizedDisplayField value={displayValue} color={color} />
              )}
            </Box>
          </Box>

          {/* Right Column: Button Group */}
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
        {type === FieldContainerType.MAIN_SEND && (
          <MemoizedMicrophoneButton
            isRecording={isRecording}
            color={color}
            disabled={disabled}
            onClick={handleMicClick}
          />
        )}
      </>
    );
  },
);

FieldContainer.displayName = "FieldContainer";

export default FieldContainer;
