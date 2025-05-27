import { useCallback } from "react";
import {
  sendPlayerInputToLlm,
  postStopGeneration,
  sendSpeechToText,
} from "../functions/restInterface";
import useHistoryStore from "../stores/historyStore";
import useAppStore from "../stores/appStore";

type UseHistoryCallbacksProps = {
  mission: number | null;
};

export type HistoryCallbacks = {
  sendRegenerate: () => Promise<void>;
  sendPlayerInput: () => Promise<void>;
  stopGeneration: () => Promise<void>;
  changeCallbackPlayerInputOld: (value: string) => void;
  changeCallbackPlayerInput: (value: string) => void;
  changeCallbackLlmOutput: (value: string) => void;
  speechToTextCallback: (audioBlob: Blob) => Promise<void>;
};

export function useHistoryCallbacks({
  mission,
}: UseHistoryCallbacksProps): HistoryCallbacks {
  function stripOutput(llmOutput: string): string {
    const regexPattern =
      /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/;
    return llmOutput.replace(regexPattern, "");
  }

  const sendRegenerate = useCallback(async (): Promise<void> => {
    const { mission } = useAppStore.getState();
    const { playerInputOld, llmOutput, setLlmOutput } =
      useHistoryStore.getState();

    if (mission !== null && playerInputOld !== "") {
      const prevInteraction =
        playerInputOld !== "" && llmOutput !== ""
          ? { playerInput: playerInputOld, llmOutput: llmOutput }
          : undefined;

      await sendPlayerInputToLlm({
        missionId: mission,
        setStateCallback: ({ llmOutput }) => setLlmOutput(llmOutput),
        prevInteraction: prevInteraction,
      });
    }
  }, []);

  const sendPlayerInput = useCallback(async (): Promise<void> => {
    const { mission } = useAppStore.getState();
    const {
      interactions,
      playerInput,
      playerInputOld,
      llmOutput,
      setInteractions,
      setPlayerInputOld,
      setLlmOutput,
      setPlayerInput,
    } = useHistoryStore.getState();

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

      try {
        await sendPlayerInputToLlm({
          missionId: mission,
          setStateCallback: ({ llmOutput }) => setLlmOutput(llmOutput),
          playerInputField: originalPlayerInput,
          prevInteraction: prevInteractionContext,
        });
      } catch (error) {
        // Rollback on error
        setPlayerInputOld(originalPlayerInputOld);
        setLlmOutput(originalLlmOutput);
        setPlayerInput(originalPlayerInput);
        setInteractions(originalInteractions);
        console.error("Failed to send player input:", error);
      }
    }
  }, []);

  const stopGeneration = useCallback(async (): Promise<void> => {
    try {
      await postStopGeneration();
    } catch (error) {
      console.error("Error stopping LLM generation:", error);
    }
  }, []);

  const changeCallbackPlayerInputOld = useCallback((value: string) => {
    useHistoryStore.getState().setPlayerInputOld(value);
  }, []);

  const changeCallbackPlayerInput = useCallback((value: string) => {
    useHistoryStore.getState().setPlayerInput(value);
  }, []);

  const changeCallbackLlmOutput = useCallback((value: string) => {
    useHistoryStore.getState().setLlmOutput(value);
  }, []);

  const speechToTextCallback = useCallback(async (audioBlob: Blob) => {
    try {
      const transcript = await sendSpeechToText(audioBlob);
      useHistoryStore.getState().setPlayerInput(transcript);
    } catch (err) {
      alert(
        "Speech-to-text failed: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }, []);

  return {
    sendRegenerate,
    sendPlayerInput,
    stopGeneration,
    changeCallbackPlayerInputOld,
    changeCallbackPlayerInput,
    changeCallbackLlmOutput,
    speechToTextCallback,
  };
}

export default useHistoryCallbacks;
