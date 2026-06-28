import { useRef, useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
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
import { TtsVoice } from "../models/Types";
import MemoizedFieldContainer from "./MemoizedFieldContainer";
import { FieldContainerType, FieldContainerHandle } from "./FieldContainer";
import useHistoryStore from "../stores/historyStore";
import useAppStore from "../stores/appStore";
import useCharacterStore from "../stores/characterStore";
import { useShallow } from "zustand/react/shallow";

type HistoryProps = {
  mission: number | null;
  disabled: boolean;
};

const USE_TTS_STREAM = true;

const History = ({ mission, disabled }: HistoryProps) => {
  console.log("History component rendered");
  const theme = useTheme();
  const llmOutputFieldRef = useRef<FieldContainerHandle>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ===== STORE STATE =====
  const { playerInput, playerInputOld, llmThinking, llmOutput, interactions } =
    useHistoryStore(
      useShallow((state) => ({
        playerInput: state.playerInput,
        playerInputOld: state.playerInputOld,
        llmThinking: state.llmThinking,
        llmOutput: state.llmOutput,
        interactions: state.interactions,
      })),
    );

  // ===== STORE SETTERS =====
  const updatePlayerInput = useHistoryStore((state) => state.updatePlayerInput);
  const updatePlayerInputOld = useHistoryStore(
    (state) => state.updatePlayerInputOld,
  );
  const updateLlmThinking = useHistoryStore((state) => state.updateLlmThinking);
  const updateLlmOutput = useHistoryStore((state) => state.updateLlmOutput);
  const performOptimisticUpdate = useHistoryStore(
    (state) => state.performOptimisticUpdate,
  );
  const rollbackOptimisticUpdate = useHistoryStore(
    (state) => state.rollbackOptimisticUpdate,
  );
  const commitPlayerInput = useHistoryStore((state) => state.commitPlayerInput);
  const flushPendingCharacterSaves = useCharacterStore((state) => state.flushPendingSaves);

  // ===== TTS VOICE =====
  const ttsVoice = useAppStore((state) => state.ttsVoice);
  const setTtsVoice = useAppStore((state) => state.setTtsVoice);

  // ===== LOCAL STATE =====
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [interactions, llmOutput, playerInputOld]);

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
    [updatePlayerInput],
  );

  const sendPlayerInputWithStreaming = useCallback(
    async (inputValue: string): Promise<void> => {
      if (mission === null || inputValue === "") return;

      // The GM prompt is built from the latest backend character data each
      // turn, so make sure any debounced sidebar/sheet edit reached the
      // backend before it does, instead of waiting for the save timer.
      flushPendingCharacterSaves();

      const { originalState, prevInteractionContext } =
        performOptimisticUpdate(inputValue);

      llmOutputFieldRef.current?.startStream();

      try {
        let streamedContent = "";
        let streamedThinking = "";

        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({
            llmOutput: newLlmOutput,
            llmThinking: newLlmThinking,
          }) => {
            streamedContent = newLlmOutput;
            streamedThinking = newLlmThinking || "";
            llmOutputFieldRef.current?.updateStream(
              newLlmOutput,
              newLlmThinking,
            );
          },
          playerInputField: inputValue,
          prevInteraction: prevInteractionContext,
        });

        llmOutputFieldRef.current?.completeStream(
          streamedContent,
          streamedThinking,
        );
        updateLlmOutput(streamedContent);
        updateLlmThinking(streamedThinking);
      } catch (error) {
        rollbackOptimisticUpdate(originalState);
        console.log("Failed to send player input:", error);
      }
    },
    [
      mission,
      performOptimisticUpdate,
      updateLlmOutput,
      updateLlmThinking,
      rollbackOptimisticUpdate,
      flushPendingCharacterSaves,
    ],
  );

  const sendRegenerateWithStreaming = useCallback(
    async (inputValue: string): Promise<void> => {
      if (mission === null || inputValue === "") return;

      flushPendingCharacterSaves();

      const prevInteraction = {
        playerInput: inputValue,
        llmOutput: llmOutput,
      };

      commitPlayerInput(inputValue, "", "");
      llmOutputFieldRef.current?.startStream();

      try {
        let streamedContent = "";
        let streamedThinking = "";

        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({
            llmOutput: newLlmOutput,
            llmThinking: newLlmThinking,
          }) => {
            streamedContent = newLlmOutput;
            streamedThinking = newLlmThinking || "";
            llmOutputFieldRef.current?.updateStream(
              newLlmOutput,
              newLlmThinking,
            );
          },
          prevInteraction,
        });

        llmOutputFieldRef.current?.completeStream(
          streamedContent,
          streamedThinking,
        );
        updateLlmOutput(streamedContent);
        updateLlmThinking(streamedThinking);
      } catch (error) {
        console.error("Failed to regenerate:", error);
      }
    },
    [
      mission,
      llmOutput,
      commitPlayerInput,
      updateLlmOutput,
      updateLlmThinking,
      flushPendingCharacterSaves,
    ],
  );

  // ===== AUDIO MANAGEMENT =====
  const cleanupAudio = useCallback(() => {
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
      const src = audio.src;
      audio.src = "";
      if (src && src.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(src);
        } catch (e) {
          console.warn("Error revoking object URL:", e);
        }
      }
      audio.load();
      setAudio(null);
      setIsPlaying(false);
    }
  }, [audio]);

  const handlePlayTTS = useCallback(async () => {
    setAudioError(null);
    setLoadingAudio(true);
    try {
      cleanupAudio();
      const audioElem = USE_TTS_STREAM
        ? await sendTextToSpeechStream(llmOutput, ttsVoice)
        : new Audio(
            URL.createObjectURL(await sendTextToSpeech(llmOutput, ttsVoice)),
          );
      audioElem.onended = () => setIsPlaying(false);
      audioElem.onerror = (e) => {
        console.error("Audio error:", e);
        setAudioError("Audio playback error.");
        setIsPlaying(false);
        audioElem.onerror = null;
      };
      setAudio(audioElem);
      setIsPlaying(true);
      await audioElem.play();
    } catch (err) {
      console.error("TTS Error:", err);
      setAudioError(
        "❌ Could not synthesize or play audio: " +
          (err instanceof Error ? err.message : String(err)),
      );
      setIsPlaying(false);
    } finally {
      setLoadingAudio(false);
    }
  }, [llmOutput, ttsVoice, cleanupAudio]);

  const handleStopTTS = useCallback(() => {
    cleanupAudio();
  }, [cleanupAudio]);

  useEffect(() => {
    return cleanupAudio;
  }, [cleanupAudio]);

  // ===== RENDER HELPERS =====
  const InteractionList = useCallback(
    (interactions: Interaction[]) => (
      <>
        {interactions.map((interaction, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {/* Player role label */}
            <Typography
              variant="tagLabel"
              color="secondary"
              sx={{
                display: "block",
                color: alpha(theme.palette.secondary.main, 0.45),
                mt: index > 0 ? 1.5 : 0,
                mb: 0.5,
              }}
            >
              Player
            </Typography>
            {/* Player action echo */}
            <Box sx={{ mb: 1.5 }}>
              <MarkdownRenderer
                value={interaction.playerInput}
                color="secondary"
              />
            </Box>
            {/* GM role label */}
            <Typography
              variant="tagLabel"
              sx={{
                display: "block",
                color: alpha(theme.palette.primary.main, 0.45),
                mt: 1.5,
                mb: 0.5,
              }}
            >
              Gamemaster
            </Typography>
            {/* GM narration block */}
            <MarkdownRenderer value={interaction.llmOutput} color="primary" />
          </Box>
        ))}
      </>
    ),
    [theme],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Scrollable narrative area */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 3,
          py: 2,
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(theme.palette.primary.main, 0.25),
            borderRadius: "2px",
            "&:hover": { background: alpha(theme.palette.primary.main, 0.45) },
          },
        }}
      >
        {InteractionList(interactions)}

        {/* Previous player input for current turn (editable / regeneratable) */}
        {playerInputOld && (
          <Box sx={{ mt: 2 }}>
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
          </Box>
        )}

        {/* Current GM output */}
        <MemoizedFieldContainer
          ref={llmOutputFieldRef}
          onCommit={updateLlmOutput}
          onStreamComplete={updateLlmOutput}
          value={llmOutput}
          thinking={llmThinking}
          instance="Gamemaster"
          color="primary"
          type={FieldContainerType.GAMEMASTER}
          disabled={disabled}
        />

        {/* TTS controls — only visible when there is GM output to play */}
        {llmOutput && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              mt: 0.5,
              flexWrap: "wrap",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="tts-voice-label">Voice</InputLabel>
              <Select
                labelId="tts-voice-label"
                value={ttsVoice}
                label="Voice"
                onChange={(e) => setTtsVoice(e.target.value as TtsVoice)}
                disabled={disabled || isPlaying || loadingAudio}
              >
                {Object.values(TtsVoice).map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isPlaying ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<StopIcon />}
                onClick={handleStopTTS}
                disabled={disabled}
                size="small"
              >
                Stop Audio
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  loadingAudio ? (
                    <CircularProgress size={16} />
                  ) : (
                    <PlayArrowIcon />
                  )
                }
                onClick={handlePlayTTS}
                disabled={disabled || loadingAudio || isPlaying}
                size="small"
              >
                {loadingAudio ? "Synthesizing..." : "Play"}
              </Button>
            )}
            {audioError && (
              <Typography color="error" variant="caption">
                {audioError}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Input bar — fixed at bottom, outside the scroll area */}
      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          flexShrink: 0,
        }}
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <MemoizedFieldContainer
          sendCallback={sendPlayerInputWithStreaming}
          onCommit={updatePlayerInput}
          stopCallback={stopGeneration}
          value={playerInput}
          instance="Player"
          color="secondary"
          type={FieldContainerType.MAIN_SEND}
          disabled={disabled}
          placeholder="Describe what your character does…"
          speechToTextCallback={speechToTextCallback}
        />
      </Box>
    </Box>
  );
};

export default History;
