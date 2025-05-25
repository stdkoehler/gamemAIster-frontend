import {
  ComponentProps,
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
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
import { HistoryHandle, LoadedHistoryData } from "../models/HistoryTypes";
import FieldContainer, { FieldContainerType } from "./FieldContainer";
import { useHistoryCallbacks } from "../hooks/historyCallbacks";
import AppGrid from "./AppGrid";

type HistoryProps = ComponentProps<typeof Container> & {
  mission: number | null;
  disabled: boolean;
};

const USE_TTS_STREAM = true;

const History = forwardRef<HistoryHandle, HistoryProps>(
  ({ mission, disabled, ...props }, ref) => {
    console.log("History component rendered");

    const containerRef = useRef<HTMLDivElement>(null);

    // Local state for interactions and current conversation
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [playerInputOld, setPlayerInputOld] = useState<string>("");
    const [llmOutput, setLlmOutput] = useState<string>("");
    const [playerInput, setPlayerInput] = useState<string>("");

    // Audio state
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    // History callbacks
    const {
      sendRegenerate,
      sendPlayerInput: sendPlayerInputCallback,
      stopGeneration,
      changeCallbackPlayerInputOld,
      changeCallbackPlayerInput,
      changeCallbackLlmOutput,
      speechToTextCallback,
    } = useHistoryCallbacks({
      mission,
      interactions,
      setInteractions,
      playerInputOld,
      setPlayerInputOld,
      llmOutput,
      setLlmOutput,
      playerInput,
      setPlayerInput,
    });

    // Imperative handle for external control
    useImperativeHandle(
      ref,
      () => ({
        loadHistoryData: (data: LoadedHistoryData) => {
          setInteractions(data.interactions);
          setPlayerInputOld(data.lastPlayerInput);
          setLlmOutput(data.lastLlmOutput);
          setPlayerInput("");
        },
        clearHistory: () => {
          setInteractions([]);
          setPlayerInputOld("");
          setLlmOutput("");
          setPlayerInput("");
        },
      }),
      []
    );

    // Local storage persistence
    useEffect(() => {
      localStorage.setItem("interactions", JSON.stringify(interactions));
      localStorage.setItem("playerInputOld", playerInputOld);
      localStorage.setItem("llmOutput", llmOutput);
      localStorage.setItem("playerInput", playerInput);
    }, [interactions, playerInputOld, llmOutput, playerInput]);

    // Auto-scroll to bottom
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [interactions, playerInputOld, llmOutput]);

    const cleanupAudioElement = useCallback(
      (audioElem: HTMLAudioElement | null) => {
        if (!audioElem) return;
        try {
          audioElem.onerror = null;
          audioElem.onended = null;
          audioElem.pause();
          audioElem.currentTime = 0;
          const url = audioElem.src;
          if (url && url.startsWith("blob:")) {
            audioElem.src = "";
            try {
              URL.revokeObjectURL(url);
            } catch (e) {
              // Ignore cleanup errors
            }
          } else {
            audioElem.src = "";
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      },
      []
    );

    useEffect(() => {
      return () => {
        cleanupAudioElement(audio);
      };
    }, [audio, cleanupAudioElement]);

    const handlePlayTTS = async () => {
      setAudioError(null);
      setLoadingAudio(true);

      try {
        let audioElem: HTMLAudioElement;

        if (USE_TTS_STREAM) {
          audioElem = await sendTextToSpeechStream(llmOutput);
        } else {
          const blob = await sendTextToSpeech(llmOutput);
          const url = URL.createObjectURL(blob);
          audioElem = new Audio(url);
        }

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
              <Typography
                variant="subtitle2"
                fontStyle="italic"
                color="primary"
              >
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

    const lastInteraction = {
      playerInput: playerInputOld,
      llmOutput: llmOutput,
    };

    return (
      <>
        <Container
          ref={containerRef}
          {...props}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "95%",
            maxHeight: "60vh",
            overflow: "auto",
            paddingTop: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          {InteractionList(interactions)}
          {/* Player Input Old Field */}
          <FieldContainer
            sendCallback={sendRegenerate}
            stopCallback={stopGeneration}
            changeCallback={changeCallbackPlayerInputOld}
            value={lastInteraction.playerInput}
            instance="Player"
            color="secondary"
            type={FieldContainerType.PLAYER_OLD}
            disabled={disabled}
          />
          {/* Gamemaster Output Field */}
          <FieldContainer
            changeCallback={changeCallbackLlmOutput}
            value={lastInteraction.llmOutput}
            instance="Gamemaster"
            color="primary"
            type={FieldContainerType.GAMEMASTER}
            disabled={disabled}
          />
          {/* TTS Controls */}
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
        </Container>

        {/* Player Input Field - Now part of History */}
        <AppGrid
          sx={{
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          <FieldContainer
            sendCallback={sendPlayerInputCallback}
            changeCallback={changeCallbackPlayerInput}
            stopCallback={stopGeneration}
            value={playerInput}
            instance="Player"
            color="secondary"
            type={FieldContainerType.MAIN_SEND}
            disabled={disabled}
            placeholder="Begin by describing your character and what he's currently doing."
            speechToTextCallback={speechToTextCallback}
          />
        </AppGrid>
      </>
    );
  }
);

export default History;
