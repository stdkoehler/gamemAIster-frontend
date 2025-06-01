import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Interaction } from "../models/MissionModels";

type State = {
  // Persisted state
  interactions: Interaction[];
  playerInputOld: string;
  llmOutput: string;

  // Transient state (not persisted)
  playerInput: string;
};

type Action = {
  // Actions grouped by functionality
  // Input management
  updatePlayerInput: (value: string) => void;
  updatePlayerInputOld: (value: string) => void;
  updateLlmOutput: (value: string) => void;

  // History management
  addInteraction: (interaction: Interaction) => void;
  loadHistoryData: (data: {
    interactions: Interaction[];
    lastPlayerInput: string;
    lastLlmOutput: string;
  }) => void;
  clearHistory: () => void;

  // Complex state transitions
  performOptimisticUpdate: (newPlayerInput: string) => {
    originalState: HistorySnapshot;
    prevInteractionContext?: Interaction;
  };
  rollbackOptimisticUpdate: (snapshot: HistorySnapshot) => void;
  commitPlayerInput: (playerInput: string, llmOutput: string) => void;
};

interface HistorySnapshot {
  playerInput: string;
  playerInputOld: string;
  llmOutput: string;
  interactions: Interaction[];
}

const useHistoryStore = create<State & Action>()(
  persist(
    (set, get) => ({
      // Initial state
      interactions: [],
      playerInputOld: "",
      llmOutput: "",
      playerInput: "",

      // Simple state updates
      updatePlayerInput: (value: string) => set(() => ({ playerInput: value })),
      updatePlayerInputOld: (value: string) =>
        set(() => ({ playerInputOld: value })),
      updateLlmOutput: (value: string) => set(() => ({ llmOutput: value })),

      // History management
      addInteraction: (interaction: Interaction) =>
        set((state) => ({
          interactions: [...state.interactions, interaction],
        })),
      loadHistoryData: (data: {
        interactions: Interaction[];
        lastPlayerInput: string;
        lastLlmOutput: string;
      }) =>
        set(() => ({
          interactions: data.interactions,
          playerInputOld: data.lastPlayerInput,
          llmOutput: data.lastLlmOutput,
          playerInput: "",
        })),
      clearHistory: () =>
        set(() => ({
          interactions: [],
          playerInputOld: "",
          llmOutput: "",
          playerInput: "",
        })),

      // Complex state transitions
      performOptimisticUpdate: (newPlayerInput: string) => {
        const currentState = get();

        // Create snapshot for potential rollback
        const originalState: HistorySnapshot = {
          playerInput: newPlayerInput,
          playerInputOld: currentState.playerInputOld,
          llmOutput: currentState.llmOutput,
          interactions: [...currentState.interactions],
        };

        // Prepare previous interaction context
        const strippedLlmOutput = currentState.llmOutput.replace(
          /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/,
          ""
        );

        const prevInteractionContext =
          currentState.playerInputOld !== "" && strippedLlmOutput !== ""
            ? {
                playerInput: currentState.playerInputOld,
                llmOutput: strippedLlmOutput,
              }
            : undefined;

        // Perform optimistic update
        set((state) => ({
          interactions: prevInteractionContext
            ? [...state.interactions, prevInteractionContext]
            : state.interactions,
          playerInputOld: newPlayerInput,
          llmOutput: "",
          playerInput: "",
        }));

        return { originalState, prevInteractionContext };
      },

      rollbackOptimisticUpdate: (snapshot: HistorySnapshot) =>
        set(() => ({
          playerInput: snapshot.playerInput,
          playerInputOld: snapshot.playerInputOld,
          llmOutput: snapshot.llmOutput,
          interactions: snapshot.interactions,
        })),

      commitPlayerInput: (playerInput: string, llmOutput: string) =>
        set(() => ({
          playerInputOld: playerInput,
          llmOutput: llmOutput,
          playerInput: "",
        })),
    }),
    {
      name: "history-storage",
      // Only persist certain fields
      partialize: (state) => ({
        interactions: state.interactions,
        playerInputOld: state.playerInputOld,
        llmOutput: state.llmOutput,
        // Don't persist playerInput (draft text)
      }),
    }
  )
);

export default useHistoryStore;
