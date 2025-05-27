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
  postStopGeneration,
  sendSpeechToText,
  sendTextToSpeech,
  sendTextToSpeechStream,
  sendPlayerInputToLlm,
} from "../functions/restInterface";
import { Interaction } from "../models/MissionModels";
import { HistoryHandle } from "../models/HistoryTypes";
import MemoizedFieldContainer from "./MemoizedFieldContainer";
import { FieldContainerType, FieldContainerHandle } from "./FieldContainer";
import useHistoryStore from "../stores/historyStore";

type HistoryProps = ComponentProps<typeof Container> & {
  mission: number | null;
  disabled: boolean;
};

const USE_TTS_STREAM = true;

const History = forwardRef<HistoryHandle, HistoryProps>(
  ({ mission, disabled, ...props }, ref) => {
    console.log("History component rendered");

    const llmOutputFieldRef = useRef<FieldContainerHandle>(null);

    const {
      interactions,
      playerInputOld,
      llmOutput,
      playerInput,
      loadHistoryData,
      clearHistory,
      setLlmOutput,
      setPlayerInputOld,
      setPlayerInput,
      setInteractions,
    } = useHistoryStore();

    // Audio state - local to component
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    // Direct API call - no need for callback wrapper
    const stopGeneration = useCallback(async (): Promise<void> => {
      try {
        await postStopGeneration();
      } catch (error) {
        console.error("Error stopping LLM generation:", error);
      }
    }, []);

    // Speech-to-text - handled locally like TTS
    const speechToTextCallback = useCallback(
      async (audioBlob: Blob) => {
        try {
          const transcript = await sendSpeechToText(audioBlob);
          setPlayerInput(transcript);
        } catch (err) {
          alert(
            "Speech-to-text failed: " +
              (err instanceof Error ? err.message : String(err))
          );
        }
      },
      [setPlayerInput]
    );

    // Simplified strip output function
    const stripOutput = useCallback((llmOutput: string): string => {
      const regexPattern =
        /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/;
      return llmOutput.replace(regexPattern, "");
    }, []);

    // Simplified player input handler
    const sendPlayerInputWithStreaming =
      useCallback(async (): Promise<void> => {
        if (mission === null || playerInput === "") return;

        const strippedLlmOutput = stripOutput(llmOutput);
        const prevInteractionContext =
          playerInputOld !== "" && strippedLlmOutput !== ""
            ? { playerInput: playerInputOld, llmOutput: strippedLlmOutput }
            : undefined;

        // Save current state for rollback
        const originalState = {
          playerInput,
          playerInputOld,
          llmOutput,
          interactions: [...interactions],
        };

        // Update state optimistically
        if (prevInteractionContext) {
          setInteractions([...interactions, prevInteractionContext]);
        }
        setPlayerInputOld(playerInput);
        setLlmOutput("");
        setPlayerInput("");

        // Start streaming
        llmOutputFieldRef.current?.startStream();

        try {
          let streamedContent = "";
          await sendPlayerInputToLlm({
            missionId: mission,
            setStateCallback: ({ llmOutput }) => {
              streamedContent = llmOutput;
              llmOutputFieldRef.current?.updateStream(llmOutput);
            },
            playerInputField: playerInput,
            prevInteraction: prevInteractionContext,
          });

          llmOutputFieldRef.current?.completeStream(streamedContent);
          setLlmOutput(streamedContent);
        } catch (error) {
          // Rollback on error
          setPlayerInputOld(originalState.playerInputOld);
          setLlmOutput(originalState.llmOutput);
          setPlayerInput(originalState.playerInput);
          setInteractions(originalState.interactions);
          console.error("Failed to send player input:", error);
        }
      }, [
        mission,
        playerInput,
        playerInputOld,
        llmOutput,
        interactions,
        stripOutput,
        setInteractions,
        setPlayerInputOld,
        setLlmOutput,
        setPlayerInput,
      ]);

    // Simplified regenerate handler
    const sendRegenerateWithStreaming = useCallback(async (): Promise<void> => {
      if (mission === null || playerInputOld === "") return;

      const prevInteraction = { playerInput: playerInputOld, llmOutput };

      llmOutputFieldRef.current?.startStream();

      try {
        let streamedContent = "";
        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({ llmOutput }) => {
            streamedContent = llmOutput;
            llmOutputFieldRef.current?.updateStream(llmOutput);
          },
          prevInteraction,
        });

        llmOutputFieldRef.current?.completeStream(streamedContent);
        setLlmOutput(streamedContent);
      } catch (error) {
        console.error("Failed to regenerate:", error);
      }
    }, [mission, playerInputOld, llmOutput, setLlmOutput]);

    useImperativeHandle(
      ref,
      () => ({
        loadHistoryData,
        clearHistory,
      }),
      [loadHistoryData, clearHistory]
    );

    // Enhanced audio cleanup with proper MediaSource handling
    const cleanupAudio = useCallback(() => {
      if (audio) {
        // Remove event listeners to prevent memory leaks
        audio.onended = null;
        audio.onerror = null;

        // Pause and reset the audio
        audio.pause();
        audio.currentTime = 0;

        // Store the src before clearing it
        const src = audio.src;

        // Clear the src to detach MediaSource
        audio.src = "";

        // Revoke the object URL if it's a blob URL
        if (src && src.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(src);
          } catch (e) {
            console.warn("Error revoking object URL:", e);
          }
        }

        // Force load to ensure the MediaSource is properly detached
        audio.load();

        setAudio(null);
        setIsPlaying(false);
      }
    }, [audio]);

    useEffect(() => {
      return cleanupAudio;
    }, [cleanupAudio]);

    const handlePlayTTS = useCallback(async () => {
      setAudioError(null);
      setLoadingAudio(true);

      try {
        // Always cleanup previous audio before creating new one
        cleanupAudio();

        const audioElem = USE_TTS_STREAM
          ? await sendTextToSpeechStream(llmOutput)
          : new Audio(URL.createObjectURL(await sendTextToSpeech(llmOutput)));

        audioElem.onended = () => setIsPlaying(false);
        audioElem.onerror = (e) => {
          console.error("Audio error:", e);
          setAudioError("Audio playback error.");
          setIsPlaying(false);
        };

        setAudio(audioElem);
        setIsPlaying(true);
        await audioElem.play();
      } catch (err) {
        console.error("TTS Error:", err);
        setAudioError(
          "❌ Could not synthesize or play audio: " +
            (err instanceof Error ? err.message : String(err))
        );
        setIsPlaying(false);
      } finally {
        setLoadingAudio(false);
      }
    }, [llmOutput, cleanupAudio]);

    const handleStopTTS = useCallback(() => {
      cleanupAudio();
    }, [cleanupAudio]);

    // Memoized interaction list
    const InteractionList = useCallback(
      (interactions: Interaction[]) => (
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
      ),
      []
    );

    const lastInteraction = {
      playerInput: playerInputOld,
      llmOutput: llmOutput,
    };

    return (
      <Container
        {...props}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "95%",
          overflow: "auto",
          paddingTop: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        {InteractionList(interactions)}

        <MemoizedFieldContainer
          sendCallback={sendRegenerateWithStreaming}
          stopCallback={stopGeneration}
          onCommit={setPlayerInputOld}
          value={lastInteraction.playerInput}
          instance="Player"
          color="secondary"
          type={FieldContainerType.PLAYER_OLD}
          disabled={disabled}
        />

        <MemoizedFieldContainer
          ref={llmOutputFieldRef}
          onCommit={setLlmOutput}
          onStreamComplete={setLlmOutput}
          value={lastInteraction.llmOutput}
          instance="Gamemaster"
          color="primary"
          type={FieldContainerType.GAMEMASTER}
          disabled={disabled}
        />

        {/* Simplified TTS Controls */}
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
              disabled={disabled}
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

        <MemoizedFieldContainer
          sendCallback={sendPlayerInputWithStreaming}
          onCommit={setPlayerInput}
          stopCallback={stopGeneration}
          value={playerInput}
          instance="Player"
          color="secondary"
          type={FieldContainerType.MAIN_SEND}
          disabled={disabled}
          placeholder="Begin by describing your character and what he's currently doing."
          speechToTextCallback={speechToTextCallback}
        />
      </Container>
    );
  }
);

export default memo(History);
