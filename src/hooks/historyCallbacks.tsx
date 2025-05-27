import { useCallback } from "react";
import {
  sendPlayerInputToLlm,
  postStopGeneration,
  sendSpeechToText,
} from "../functions/restInterface";
import useHistoryStore from "../stores/historyStore";

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
  const {
    interactions,
    setInteractions,
    playerInputOld,
    setPlayerInputOld,
    llmOutput,
    setLlmOutput,
    playerInput,
    setPlayerInput,
  } = useHistoryStore();

  function stripOutput(llmOutput: string): string {
    const regexPattern =
      /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/;
    return llmOutput.replace(regexPattern, "");
  }

  const sendRegenerate = useCallback(async (): Promise<void> => {
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
  }, [mission, playerInputOld, llmOutput, setLlmOutput]);

  const sendPlayerInput = useCallback(async (): Promise<void> => {
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

  const stopGeneration = useCallback(async (): Promise<void> => {
    try {
      await postStopGeneration();
    } catch (error) {
      console.error("Error stopping LLM generation:", error);
    }
  }, []);

  const changeCallbackPlayerInputOld = useCallback(
    (value: string) => {
      setPlayerInputOld(value);
    },
    [setPlayerInputOld]
  );

  const changeCallbackPlayerInput = useCallback(
    (value: string) => {
      setPlayerInput(value);
    },
    [setPlayerInput]
  );

  const changeCallbackLlmOutput = useCallback(
    (value: string) => {
      setLlmOutput(value);
    },
    [setLlmOutput]
  );

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
