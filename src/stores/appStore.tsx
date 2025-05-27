import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameType } from "../models/Types";
import useHistoryStore from "./historyStore";

interface AppState {
  // Mission state
  mission: number | null;
  adventure: string;
  gameType: GameType;

  // Actions
  setMission: (mission: number | null) => void;
  setAdventure: (adventure: string) => void;
  setGameType: (gameType: GameType) => void;
  reset: () => Promise<void>;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      mission: null,
      adventure: "GamemAIster",
      gameType: GameType.SHADOWRUN,

      // Actions
      setMission: (mission) => set({ mission }),
      setAdventure: (adventure) => set({ adventure }),
      setGameType: (gameType) => set({ gameType }),

      reset: async () => {
        set({
          mission: null,
          adventure: "GamemAIster",
        });
        // Also clear history when resetting
        useHistoryStore.getState().clearHistory();
      },
    }),
    {
      name: "app-storage", // localStorage key
      // Only persist the essential state
      partialize: (state) => ({
        mission: state.mission,
        adventure: state.adventure,
        gameType: state.gameType,
      }),
    }
  )
);

export default useAppStore;
