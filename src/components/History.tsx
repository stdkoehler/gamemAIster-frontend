import {
  ComponentProps,
  useRef,
  useEffect,
  useState,
  useCallback,
  useCallback,
  useMemo,
} from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
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

/**
 * Defines the structure of items for the virtualized list.
 * Each item has a type and corresponding data.
 */
type VirtualItem =
  | { type: "history"; data: Interaction; id: string }
  | { type: "playerInputOld"; data: string; id: string }
  | { type: "llmOutput"; data: string; id: string };

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

  const virtualizedItems: VirtualItem[] = useMemo(() => {
    const items: VirtualItem[] = interactions.map((interaction, index) => ({
      type: "history",
      data: interaction,
      id: `hist-${index}`,
    }));
    if (lastInteraction.playerInput !== "" || changePlayerInputOldCallback) { // Ensure we add if editable or has content
      items.push({
        type: "playerInputOld",
        data: lastInteraction.playerInput,
        id: "playerInputOld",
      });
    }
    if (lastInteraction.llmOutput !== "" || changeLlmOutputCallback) { // Ensure we add if editable or has content
      items.push({
        type: "llmOutput",
        data: lastInteraction.llmOutput,
        id: "llmOutput",
      });
    }
    return items;
  }, [interactions, lastInteraction, changePlayerInputOldCallback, changeLlmOutputCallback]);

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
    if (listRef.current) {
      listRef.current.scrollToItem({
        align: "end",
        index: virtualizedItems.length - 1,
      });
    }
  }, [virtualizedItems]); // Depends on virtualizedItems to scroll when they change

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
            <MarkdownRenderer
              value={interaction.playerInput}
              color="secondary"
            />
            <Typography variant="subtitle2" fontStyle="italic" color="primary">
              <br />
              Gamemaster
              <br />
            </Typography>
            <MarkdownRenderer value={interaction.llmOutput} color="primary" />
          </div>
        ))}
      </>
    );
  };

  // Row component now receives `data` (which is virtualizedItems) and `index` from FixedSizeList
  const Row = ({ index, data, style }: { index: number; data: VirtualItem[]; style: React.CSSProperties }) => {
    const item = data[index];
    // Apply the style to the root element of the Row for react-window.
    // This is crucial for react-window to position items correctly.
    switch (item.type) {
      case "history":
        return (
          <div style={style}>
            <Typography
              variant="subtitle2"
              fontStyle="italic"
              color="secondary"
            >
              <br />
              Player
              <br />
            </Typography>
            <MarkdownRenderer
              value={item.data.playerInput}
              color="secondary"
            />
            <Typography variant="subtitle2" fontStyle="italic" color="primary">
              <br />
              Gamemaster
              <br />
            </Typography>
            <MarkdownRenderer value={item.data.llmOutput} color="primary" />
          </div>
        );
      case "playerInputOld":
        return (
          <div style={style}>
            <FieldContainer
              sendCallback={sendCallback}
              stopCallback={stopCallback}
              changeCallback={changePlayerInputOldCallback}
              value={item.data}
              instance="Player"
              color="secondary"
              type={FieldContainerType.PLAYER_OLD}
              disabled={disabled}
            />
          </div>
        );
      case "llmOutput":
        return (
          <div style={style}>
            <FieldContainer
              changeCallback={changeLlmOutputCallback}
              value={item.data}
              instance="Gamemaster"
              color="primary"
              type={FieldContainerType.GAMEMASTER}
              disabled={disabled}
            />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <Container
      ref={containerRef}
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "95%" /* Fields take up full width of their container */,
        maxHeight: "60vh", // This will constrain the AutoSizer
        // overflow: "auto", // Removed, AutoSizer/FixedSizeList handle internal scrolling
        paddingTop: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      {/* Wrapper div for AutoSizer to work correctly within a flex container */}
      <div style={{ flexGrow: 1, minHeight: 0, width: "100%" }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              ref={listRef}
              height={height}
              itemCount={virtualizedItems.length}
              itemSize={150} // Adjust as needed
              itemData={virtualizedItems}
              width={width}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
      {/* TTS Buttons and Error Message Area */}
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
