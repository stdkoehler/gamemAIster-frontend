import {
  ComponentProps,
  useRef,
  useEffect,
  useState,
  useCallback,
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
import MemoizedFieldContainer from "./MemoizedFieldContainer";
import { FieldContainerType, FieldContainerHandle } from "./FieldContainer";
import useHistoryStore from "../stores/historyStore";

type HistoryProps = ComponentProps<typeof Container> & {
  mission: number | null;
  disabled: boolean;
};

const USE_TTS_STREAM = true;

const History = ({ mission, disabled, ...props }: HistoryProps) => {
  console.log("History component rendered");
  // ===== REFS & STORE =====
  const llmOutputFieldRef = useRef<FieldContainerHandle>(null);

  // ===== STORE STATE =====
  const playerInput = useHistoryStore((state) => state.playerInput);
  const playerInputOld = useHistoryStore((state) => state.playerInputOld);
  const llmOutput = useHistoryStore((state) => state.llmOutput);
  const interactions = useHistoryStore((state) => state.interactions);
  // ===== STORE SETTER =====
  const updatePlayerInput = useHistoryStore((state) => state.updatePlayerInput);
  const updatePlayerInputOld = useHistoryStore(
    (state) => state.updatePlayerInputOld
  );
  const updateLlmOutput = useHistoryStore((state) => state.updateLlmOutput);
  const addInteraction = useHistoryStore((state) => state.addInteraction);
  const performOptimisticUpdate = useHistoryStore(
    (state) => state.performOptimisticUpdate
  );
  const rollbackOptimisticUpdate = useHistoryStore(
    (state) => state.rollbackOptimisticUpdate
  );
  const commitPlayerInput = useHistoryStore((state) => state.commitPlayerInput);

  // ===== LOCAL STATE =====
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // ===== API CALLBACKS =====
  const stopGeneration = useCallback(async (): Promise<void> => {
    try {
      await postStopGeneration();
    } catch (error) {
      console.error("Error stopping LLM generation:", error);
    }
  }, []);

  const speechToTextCallback = useCallback(
    async (audioBlob: Blob) => {
      try {
        const transcript = await sendSpeechToText(audioBlob);
        updatePlayerInput(transcript);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setAudioError("Speech-to-text failed: " + errorMessage);
      }
    },
    [updatePlayerInput]
  );

  const sendPlayerInputWithStreaming = useCallback(
    async (inputValue: string): Promise<void> => {
      if (mission === null || inputValue === "") return;

      const { originalState, prevInteractionContext } =
        performOptimisticUpdate(inputValue);

      llmOutputFieldRef.current?.startStream();

      try {
        let streamedContent = "";
        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({ llmOutput: newLlmOutput }) => {
            streamedContent = newLlmOutput;
            llmOutputFieldRef.current?.updateStream(newLlmOutput);
          },
          playerInputField: inputValue,
          prevInteraction: prevInteractionContext,
        });

        llmOutputFieldRef.current?.completeStream(streamedContent);
        updateLlmOutput(streamedContent);
      } catch (error) {
        rollbackOptimisticUpdate(originalState);
        console.log("Failed to send player input:", error);
      }
    },
    [
      mission,
      performOptimisticUpdate,
      updateLlmOutput,
      rollbackOptimisticUpdate,
    ]
  );

  const sendRegenerateWithStreaming = useCallback(
    async (inputValue: string): Promise<void> => {
      if (mission === null || inputValue === "") return;

      const prevInteraction = {
        playerInput: inputValue,
        llmOutput: llmOutput,
      };

      commitPlayerInput(inputValue, ""); // Clear LLM output for regeneration
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
        updateLlmOutput(streamedContent);
      } catch (error) {
        console.error("Failed to regenerate:", error);
      }
    },
    [mission, llmOutput, commitPlayerInput, updateLlmOutput]
  );

  // ===== AUDIO MANAGEMENT =====
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
        audioElem.onerror = null; // Prevent further error events
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

  // ===== COMPONENT LIFECYCLE =====
  useEffect(() => {
    return cleanupAudio;
  }, [cleanupAudio]);

  // ===== RENDER HELPERS =====
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
            <Typography variant="subtitle2" fontStyle="italic" color="primary">
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
        onCommit={updatePlayerInputOld}
        value={playerInputOld}
        instance="Player"
        color="secondary"
        type={FieldContainerType.PLAYER_OLD}
        disabled={disabled}
      />

      <MemoizedFieldContainer
        ref={llmOutputFieldRef}
        onCommit={updateLlmOutput}
        onStreamComplete={updateLlmOutput}
        value={llmOutput}
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
              loadingAudio ? <CircularProgress size={20} /> : <PlayArrowIcon />
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
        onCommit={updatePlayerInput}
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
};

export default memo(History);
