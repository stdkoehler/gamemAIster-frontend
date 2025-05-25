import {
  ComponentProps,
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import { Typography, Container, Button, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import MarkdownRenderer from "./MarkdownRenderer.tsx";

import {
  sendTextToSpeech,
  sendTextToSpeechStream,
  sendPlayerInputToLlm,
} from "../functions/restInterface";
import { Interaction } from "../models/MissionModels";
import { HistoryHandle } from "../models/HistoryTypes";
import MemoizedFieldContainer from "./MemoizedFieldContainer";
import { FieldContainerType, FieldContainerHandle } from "./FieldContainer";
import { useHistoryCallbacks } from "../hooks/historyCallbacks";
import { useHistoryContext } from "../contexts/HistoryContext";
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
    const llmOutputFieldRef = useRef<FieldContainerHandle>(null);

    // Get state from context instead of local state
    const {
      interactions,
      playerInputOld,
      llmOutput,
      playerInput,
      loadHistoryData,
      clearHistory,
      hydrateFromStorage,
      setLlmOutput,
      setPlayerInputOld,
      setPlayerInput,
      setInteractions,
    } = useHistoryContext();

    // Audio state - keep local as it's UI-specific
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    // History callbacks - now only needs mission
    const {
      stopGeneration,
      changeCallbackPlayerInputOld,
      changeCallbackPlayerInput,
      changeCallbackLlmOutput,
      speechToTextCallback,
    } = useHistoryCallbacks({
      mission,
    });

    // Strip output function
    function stripOutput(llmOutput: string): string {
      const regexPattern =
        /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/;
      return llmOutput.replace(regexPattern, "");
    }

    // Enhanced sendPlayerInput with direct streaming
    const sendPlayerInputWithStreaming =
      useCallback(async (): Promise<void> => {
        if (mission !== null && playerInput !== "") {
          const strippedLlmOutput = stripOutput(llmOutput);

          const prevInteractionContext =
            playerInputOld !== "" && strippedLlmOutput !== ""
              ? { playerInput: playerInputOld, llmOutput: strippedLlmOutput }
              : undefined;

          const originalPlayerInput = playerInput;
          const originalPlayerInputOld = playerInputOld;
          const originalLlmOutput = llmOutput;
          const originalInteractions = [...interactions];

          if (prevInteractionContext) {
            setInteractions([...interactions, prevInteractionContext]);
          }

          setPlayerInputOld(originalPlayerInput);
          setLlmOutput("");
          setPlayerInput("");

          // Start streaming mode on the LLM output field
          if (llmOutputFieldRef.current) {
            llmOutputFieldRef.current.startStream();
          }

          let streamedContent = "";
          try {
            await sendPlayerInputToLlm({
              missionId: mission,
              setStateCallback: ({ llmOutput }) => {
                // Stream directly to the field instead of context
                streamedContent = llmOutput;
                if (llmOutputFieldRef.current) {
                  llmOutputFieldRef.current.updateStream(llmOutput);
                }
              },
              playerInputField: originalPlayerInput,
              prevInteraction: prevInteractionContext,
            });

            // Complete the stream and commit to context
            if (llmOutputFieldRef.current) {
              llmOutputFieldRef.current.completeStream(streamedContent);
            }
          } catch (error) {
            // Rollback on error
            setPlayerInputOld(originalPlayerInputOld);
            setLlmOutput(originalLlmOutput);
            setPlayerInput(originalPlayerInput);
            setInteractions(originalInteractions);
            console.error("Failed to send player input:", error);
          }
        }
      }, [
        mission,
        interactions,
        llmOutput,
        playerInput,
        playerInputOld,
        setPlayerInputOld,
        setLlmOutput,
        setPlayerInput,
        setInteractions,
      ]);

    // Enhanced sendRegenerate with direct streaming
    const sendRegenerateWithStreaming = useCallback(async (): Promise<void> => {
      if (mission !== null && playerInputOld !== "") {
        const prevInteraction =
          playerInputOld !== ""
            ? { playerInput: playerInputOld, llmOutput: llmOutput }
            : undefined;

        // Start streaming mode on the LLM output field
        if (llmOutputFieldRef.current) {
          llmOutputFieldRef.current.startStream();
        }

        let streamedContent = "";
        try {
          await sendPlayerInputToLlm({
            missionId: mission,
            setStateCallback: ({ llmOutput }) => {
              streamedContent = llmOutput;
              // Stream directly to the field instead of context
              if (llmOutputFieldRef.current) {
                llmOutputFieldRef.current.updateStream(llmOutput);
              }
            },
            prevInteraction: prevInteraction,
          });

          // Complete the stream and commit to context
          if (llmOutputFieldRef.current) {
            llmOutputFieldRef.current.completeStream(streamedContent);
          }
        } catch (error) {
          console.error("Failed to regenerate:", error);
        }
      }
    }, [mission, playerInputOld, llmOutput]);

    // Handle stream completion - commit final value to context
    const handleStreamComplete = useCallback(
      (finalContent: string) => {
        setLlmOutput(finalContent);
      },
      [setLlmOutput]
    );

    // Imperative handle for external control - now uses context methods
    useImperativeHandle(
      ref,
      () => ({
        loadHistoryData,
        clearHistory,
        hydrateFromStorage,
      }),
      [loadHistoryData, clearHistory, hydrateFromStorage]
    );

    // Auto-scroll to bottom
    // useEffect(() => {
    //   if (containerRef.current) {
    //     containerRef.current.scrollTop = containerRef.current.scrollHeight;
    //   }
    // }, [interactions, playerInputOld, llmOutput]);

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
          <MemoizedFieldContainer
            sendCallback={sendRegenerateWithStreaming}
            stopCallback={stopGeneration}
            onCommit={changeCallbackPlayerInputOld}
            value={lastInteraction.playerInput}
            instance="Player"
            color="secondary"
            type={FieldContainerType.PLAYER_OLD}
            disabled={disabled}
          />
          {/* Gamemaster Output Field - Now with streaming support */}
          <MemoizedFieldContainer
            ref={llmOutputFieldRef}
            onCommit={changeCallbackLlmOutput}
            onStreamComplete={handleStreamComplete}
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
                disabled={disabled || loadingAudio || isPlaying}
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
          <MemoizedFieldContainer
            sendCallback={sendPlayerInputWithStreaming}
            onCommit={changeCallbackPlayerInput}
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

// Memoize the History component to prevent unnecessary rerenders
export default memo(History);
