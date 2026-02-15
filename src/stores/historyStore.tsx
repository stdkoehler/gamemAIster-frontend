import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Interaction } from "../models/MissionModels";

type State = {
  // Persisted state
  interactions: Interaction[];
  playerInputOld: string;
  llmThinking: string;
  llmOutput: string;

  // Transient state (not persisted)
  playerInput: string;
};

type Action = {
  // Actions grouped by functionality
  // Input management
  updatePlayerInput: (value: string) => void;
  updatePlayerInputOld: (value: string) => void;
  updateLlmThinking: (value: string) => void;
  updateLlmOutput: (value: string) => void;

  // History management
  addInteraction: (interaction: Interaction) => void;
  loadHistoryData: (data: {
    interactions: Interaction[];
    lastPlayerInput: string;
    lastLlmThinking: string;
    lastLlmOutput: string;
  }) => void;
  clearHistory: () => void;

  // Complex state transitions
  performOptimisticUpdate: (newPlayerInput: string) => {
    originalState: HistorySnapshot;
    prevInteractionContext?: Interaction;
  };
  rollbackOptimisticUpdate: (snapshot: HistorySnapshot) => void;
  commitPlayerInput: (
    playerInput: string,
    llmThinking: string,
    llmOutput: string,
  ) => void;
};

interface HistorySnapshot {
  playerInput: string;
  playerInputOld: string;
  llmThinking: string;
  llmOutput: string;
  interactions: Interaction[];
}

const useHistoryStore = create<State & Action>()(
  persist(
    immer((set, get) => ({
      // Initial state
      interactions: [],
      playerInputOld: "",
      llmThinking: "",
      llmOutput: "",
      playerInput: "",

      // Simple state updates
      updatePlayerInput: (value: string) => set(() => ({ playerInput: value })),
      updatePlayerInputOld: (value: string) =>
        set(() => ({ playerInputOld: value })),
      updateLlmThinking: (value: string) => set(() => ({ llmThinking: value })),
      updateLlmOutput: (value: string) => set(() => ({ llmOutput: value })),

      // History management
      addInteraction: (interaction: Interaction) =>
        set((state) => {
          state.interactions.push(interaction); // So much simpler!
        }),
      loadHistoryData: (data: {
        interactions: Interaction[];
        lastPlayerInput: string;
        lastLlmThinking: string;
        lastLlmOutput: string;
      }) =>
        set(() => ({
          interactions: data.interactions,
          playerInputOld: data.lastPlayerInput,
          llmThinking: data.lastLlmThinking,
          llmOutput: data.lastLlmOutput,
          playerInput: "",
        })),
      clearHistory: () =>
        set(() => ({
          interactions: [],
          playerInputOld: "",
          llmThinking: "",
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
          llmThinking: currentState.llmThinking,
          llmOutput: currentState.llmOutput,
          interactions: [...currentState.interactions],
        };

        // Prepare previous interaction context
        const strippedLlmOutput = currentState.llmOutput.replace(
          /\b(?:What do you want to |What would you like to )\S[\S\s]*\?\s*$/,
          "",
        );

        const prevInteractionContext =
          currentState.playerInputOld !== "" && strippedLlmOutput !== ""
            ? {
                playerInput: currentState.playerInputOld,
                llmOutput: strippedLlmOutput,
              }
            : undefined;

        // Perform optimistic update
        set((state) => {
          if (prevInteractionContext) {
            state.interactions.push(prevInteractionContext); // Just push!
          }
          state.playerInputOld = newPlayerInput;
          state.llmThinking = "";
          state.llmOutput = "";
          state.playerInput = "";
        });

        return { originalState, prevInteractionContext };
      },

      rollbackOptimisticUpdate: (snapshot: HistorySnapshot) =>
        set(() => ({
          playerInput: snapshot.playerInput,
          playerInputOld: snapshot.playerInputOld,
          llmThinking: snapshot.llmThinking,
          llmOutput: snapshot.llmOutput,
          interactions: snapshot.interactions,
        })),

      commitPlayerInput: (
        playerInput: string,
        llmThinking: string,
        llmOutput: string,
      ) =>
        set(() => ({
          playerInputOld: playerInput,
          llmThinking: llmThinking,
          llmOutput: llmOutput,
          playerInput: "",
        })),
    })),
    {
      name: "history-storage",
      // Only persist certain fields
      partialize: (state) => ({
        interactions: state.interactions,
        playerInputOld: state.playerInputOld,
        llmThinking: state.llmThinking,
        llmOutput: state.llmOutput,
        playerInput: state.playerInput,
      }),
    },
  ),
);

export default useHistoryStore;
