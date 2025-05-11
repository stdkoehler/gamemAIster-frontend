import {
  ComponentProps,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
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

type HistoryProps = ComponentProps<typeof Container> & {
  sendCallback?: () => Promise<void>;
  stopCallback?: () => Promise<void>;
  changePlayerInputOldCallback?: (arg: string) => void;
  changeLlmOutputCallback?: (arg: string) => void;
  interactions: Interaction[];
  lastInteraction: Interaction;
  disabled: boolean;
};

// Toggle this to switch between legacy Blob method and streaming
const USE_TTS_STREAM = true;

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

  // State for TTS audio playback
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [interactions, lastInteraction]);

  // Utility to safely clean up an audio element and its object URL
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

  // Play function supporting streaming as well as fallback
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

  return (
    <Container
      ref={containerRef}
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "95%" /* Fields take up full width of their container */,
        maxHeight: "60vh",
        overflow: "auto",
        paddingTop: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      {InteractionList(interactions)}
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
