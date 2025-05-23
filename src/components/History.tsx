import {
  ComponentProps,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { FixedSizeList } from "react-window";
import { Typography, Container, Button, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import MarkdownRenderer from "./MarkdownRenderer.tsx";

import {
  sendTextToSpeech,
  sendTextToSpeechStream,
} from "../functions/restInterface";
import { Interaction } from "../models/MissionModels";
import FieldContainer, { FieldContainerType } from "./FieldContainer";

/**
 * Props for the History component.
 * Extends MUI Container props.
 */
type HistoryProps = ComponentProps<typeof Container> & {
  /** Optional callback for sending the current player input. */
  sendCallback?: () => Promise<void>;
  /** Optional callback for stopping any ongoing generation. */
  stopCallback?: () => Promise<void>;
  /** Optional callback when an old player input is changed. */
  changePlayerInputOldCallback?: (arg: string) => void;
  /** Optional callback when an LLM output is changed. */
  changeLlmOutputCallback?: (arg: string) => void;
  /** Array of past interactions (player input and LLM output). */
  interactions: Interaction[];
  /** The most recent interaction. */
  lastInteraction: Interaction;
  /** Flag to disable interactions with the component. */
  disabled: boolean;
};

// Toggle this to switch between legacy Blob method and streaming
const USE_TTS_STREAM = true;

/**
 * History component displays the sequence of interactions between the player and the LLM.
 * It allows editing of the last player input and LLM output via FieldContainer components.
 * It also provides Text-to-Speech (TTS) functionality for the last LLM output.
 *
 * The `USE_TTS_STREAM` constant at the top of the file determines whether to use
 * streaming TTS (if true) or a legacy Blob-based method (if false).
 * Streaming can provide faster audio start times.
 *
 * @param props - The props for the component. See {@link HistoryProps}.
 * @returns The History component.
 */
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
  const listRef = useRef<FixedSizeList>(null);

  // State for TTS audio playback
  /** State variable for the current HTMLAudioElement instance. */
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  /** State variable to track if TTS audio is currently playing. */
  const [isPlaying, setIsPlaying] = useState(false);
  /** State variable to track if TTS audio is currently loading/synthesizing. */
  const [loadingAudio, setLoadingAudio] = useState(false);
  /** State variable to store any error messages related to TTS audio. */
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (listRef.current) {
      listRef.current.scrollToItem(interactions.length - 1, "end");
    }
  }, [interactions, lastInteraction]);

  /**
   * Utility function to safely clean up an HTMLAudioElement and its associated resources.
   * This includes pausing playback, detaching src, revoking object URLs (for Blob method),
   * and removing event listeners to prevent memory leaks or errors.
   * @param audioElem - The HTMLAudioElement to clean up.
   */
  const cleanupAudioElement = useCallback(
    (audioElem: HTMLAudioElement | null) => {
      if (!audioElem) return;
      try {
        // Remove event handlers to avoid firing during cleanup
        audioElem.onerror = null;
        audioElem.onended = null;
        audioElem.pause();
        audioElem.currentTime = 0;
        const url = audioElem.src;
        if (url && url.startsWith("blob:")) {
          audioElem.src = ""; // Detach before revoking
          try {
            URL.revokeObjectURL(url);
          } catch (e) {
            // harmless if already revoked
          }
        } else {
          audioElem.src = ""; // Detach anyway
        }
      } catch (e) {
        // Ignore any errors during cleanup
      }
    },
    []
  );

  // Clean up audio object on unmount or new playback
  useEffect(() => {
    return () => {
      cleanupAudioElement(audio);
    };
  }, [audio, cleanupAudioElement]);

  /**
   * Handles the Text-to-Speech (TTS) playback of the last LLM output.
   * It sets loading and error states, and calls either `sendTextToSpeechStream`
   * or `sendTextToSpeech` based on the `USE_TTS_STREAM` constant.
   * Manages the lifecycle of the HTMLAudioElement for playback.
   */
  const handlePlayTTS = async () => {
    setAudioError(null);
    setLoadingAudio(true);

    try {
      let audioElem: HTMLAudioElement;

      if (USE_TTS_STREAM) {
        audioElem = await sendTextToSpeechStream(lastInteraction.llmOutput);
      } else {
        const blob = await sendTextToSpeech(lastInteraction.llmOutput);
        const url = URL.createObjectURL(blob);
        audioElem = new Audio(url);
      }

      // Clean up previous audio instance
      if (audio) {
        cleanupAudioElement(audio);
      }

      audioElem.onended = () => setIsPlaying(false);
      audioElem.onerror = () => {
        setAudioError("Audio playback error.");
        setIsPlaying(false);
      };
      setAudio(audioElem);
      setIsPlaying(true);
      // We use .play() here even for the MediaSource-based audio
      try {
        await audioElem.play();
      } catch (err) {
        setAudioError(
          "❌ Could not start audio playback: " +
            (err instanceof Error ? err.message : String(err))
        );
        setIsPlaying(false);
      }
    } catch (err) {
      setAudioError(
        "❌ Could not synthesize or play audio: " +
          (err instanceof Error ? err.message : String(err))
      );
      setIsPlaying(false);
    } finally {
      setLoadingAudio(false);
    }
  };

  /**
   * Stops the currently playing TTS audio.
   * It cleans up the existing audio element and resets playback states.
   */
  const handleStopTTS = () => {
    if (audio) {
      // Remove event handlers to prevent triggering after cleanup
      audio.onerror = null;
      audio.onended = null;
      cleanupAudioElement(audio);
      setIsPlaying(false);
      setAudio(null);
    }
  };

  /**
   * InteractionList is an inline component that renders the list of past interactions.
   * Each interaction consists of player input and LLM output, displayed using MarkdownRenderer.
   *
   * @param interactions - Array of Interaction objects to display.
   * @returns JSX elements representing the list of interactions.
   */
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const interaction = interactions[index];
    return (
      <div style={style}>
        <Typography variant="subtitle2" fontStyle="italic" color="secondary">
          <br />
          Player
          <br />
        </Typography>
        <MarkdownRenderer value={interaction.playerInput} color="secondary" />
        <Typography variant="subtitle2" fontStyle="italic" color="primary">
          <br />
          Gamemaster
          <br />
        </Typography>
        <MarkdownRenderer value={interaction.llmOutput} color="primary" />
      </div>
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
        maxHeight: "60vh", // This will be used by FixedSizeList
        overflow: "hidden", // Changed from "auto" to "hidden" as FixedSizeList handles scrolling
        paddingTop: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <div style={{ flexGrow: 1, width: '100%' }}> {/* Wrapper div for FixedSizeList */}
        <FixedSizeList
          ref={listRef}
          height={containerRef.current?.clientHeight ? containerRef.current.clientHeight * 0.9 : 400} // Adjust height as needed
          itemCount={interactions.length}
          itemSize={150} // Adjust itemSize as needed
          width="100%"
        >
          {Row}
        </FixedSizeList>
      </div>
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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: 4,
        }}
      >
        {isPlaying ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<StopIcon />}
            onClick={handleStopTTS}
            disabled={disabled || !audio}
            sx={{ mt: 1, mb: 1 }}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={
              loadingAudio ? <CircularProgress size={20} /> : <PlayArrowIcon />
            }
            onClick={handlePlayTTS}
            disabled={
              disabled ||
              loadingAudio ||
              !lastInteraction.llmOutput ||
              isPlaying
            }
            sx={{ mt: 1, mb: 1 }}
          >
            {loadingAudio ? "Synthesizing..." : "Play"}
          </Button>
        )}
        {audioError && (
          <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
            {audioError}
          </Typography>
        )}
      </div>
    </Container>
  );
}
