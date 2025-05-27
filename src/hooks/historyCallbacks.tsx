import { useCallback } from "react";
import {
  postStopGeneration,
  sendSpeechToText,
} from "../functions/restInterface";
import useHistoryStore from "../stores/historyStore";

export type HistoryCallbacks = {
  stopGeneration: () => Promise<void>;
  changeCallbackPlayerInputOld: (value: string) => void;
  changeCallbackPlayerInput: (value: string) => void;
  changeCallbackLlmOutput: (value: string) => void;
  speechToTextCallback: (audioBlob: Blob) => Promise<void>;
};

export function useHistoryCallbacks(): HistoryCallbacks {
  // Get store actions directly - no need to wrap them
  const { setPlayerInputOld, setPlayerInput, setLlmOutput } = useHistoryStore();

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

  // Return store actions directly instead of wrapping them
  return {
    stopGeneration,
    changeCallbackPlayerInputOld: setPlayerInputOld,
    changeCallbackPlayerInput: setPlayerInput,
    changeCallbackLlmOutput: setLlmOutput,
    speechToTextCallback,
  };
}

export default useHistoryCallbacks;
