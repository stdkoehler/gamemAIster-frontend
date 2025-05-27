import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameType } from "../models/Types";

interface AppState {
  // Mission state
  mission: number | null;
  adventure: string;
  gameType: GameType;

  // Actions
  setMission: (mission: number | null) => void;
  setAdventure: (adventure: string) => void;
  setGameType: (gameType: GameType) => void;
  reset: () => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      mission: null,
      adventure: "GamemAIster",
      gameType: GameType.SHADOWRUN,

      // Actions
      setMission: (mission) => set({ mission }),
      setAdventure: (adventure) => set({ adventure }),
      setGameType: (gameType) => set({ gameType }),

      // Simplified reset - let components handle their own cleanup
      reset: () => {
        set({
          mission: null,
          adventure: "GamemAIster",
        });
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
