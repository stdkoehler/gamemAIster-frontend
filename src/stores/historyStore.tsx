import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Interaction } from "../models/MissionModels";

interface HistoryState {
  interactions: Interaction[];
  playerInputOld: string;
  llmOutput: string;
  playerInput: string;
  setInteractions: (interactions: Interaction[]) => void;
  setPlayerInputOld: (value: string) => void;
  setLlmOutput: (value: string) => void;
  setPlayerInput: (value: string) => void;
  loadHistoryData: (data: {
    interactions: Interaction[];
    lastPlayerInput: string;
    lastLlmOutput: string;
  }) => void;
  clearHistory: () => void;
  // hydrateFromStorage: () => void; // No longer needed, persist middleware handles this
}

const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      interactions: [],
      playerInputOld: "",
      llmOutput: "",
      playerInput: "",
      setInteractions: (interactions) => set({ interactions }),
      setPlayerInputOld: (value) => set({ playerInputOld: value }),
      setLlmOutput: (value) => set({ llmOutput: value }),
      setPlayerInput: (value) => set({ playerInput: value }),
      loadHistoryData: (data) =>
        set({
          interactions: data.interactions,
          playerInputOld: data.lastPlayerInput,
          llmOutput: data.lastLlmOutput,
          playerInput: "", // Clear current player input
        }),
      clearHistory: () =>
        set({
          interactions: [],
          playerInputOld: "",
          llmOutput: "",
          playerInput: "",
        }),
      // hydrateFromStorage is removed as persist middleware handles rehydration.
    }),
    {
      name: "history-storage", // localStorage key
    }
  )
);

export default useHistoryStore;
