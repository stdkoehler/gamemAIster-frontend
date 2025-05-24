import {
  ComponentProps,
  useRef,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import {
  Typography,
  Container,
  Button,
  CircularProgress,
  Box,
  styled,
  useTheme,
} from "@mui/material";
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
const HistoryComponent = ({
  sendCallback,
  stopCallback,
  changePlayerInputOldCallback,
  changeLlmOutputCallback,
  interactions,
  lastInteraction,
  disabled,
}: HistoryProps) {
  console.log('History component rendering');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VirtuosoHandle>(null);
  const theme = useTheme();

  // Create a styled scroller component for Virtuoso
  const StyledScroller = styled("div")(({ theme }) => ({
    ...theme.scrollbarStyles(theme),
  }));

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
      listRef.current.scrollToIndex({
        index: interactions.length - 1,
        align: "end",
      });
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
   * Renders a row in the virtualized list. Includes all interactions and the two FieldContainers at the end.
   */
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    console.log('Row component rendering, index:', index);
    if (index < interactions.length) {
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
    } else if (index === interactions.length) {
      // First FieldContainer (Player)
      return (
        <div style={style}>
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
        </div>
      );
    } else if (index === interactions.length + 1) {
      // Second FieldContainer (Gamemaster) + TTS controls
      return (
        <div style={style}>
          <FieldContainer
            changeCallback={changeLlmOutputCallback}
            value={lastInteraction.llmOutput}
            instance="Gamemaster"
            color="primary"
            type={FieldContainerType.GAMEMASTER}
            disabled={disabled}
          />
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
                  loadingAudio ? (
                    <CircularProgress size={20} />
                  ) : (
                    <PlayArrowIcon />
                  )
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
        </div>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        width: "100%",
        "& .virtuoso-scroller": {
          ...theme.scrollbarStyles(theme),
        },
      }}
    >
      <Virtuoso
        ref={listRef}
        style={{
          height: "100%",
          width: "100%",
        }}
        components={{
          Scroller: StyledScroller,
        }}
        totalCount={interactions.length + 2}
        itemContent={(index) => Row({ index, style: { paddingRight: "8px" } })}
      />
    </Box>
  );
};

export default memo(HistoryComponent);
