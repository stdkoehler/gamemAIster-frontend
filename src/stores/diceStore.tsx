import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameType } from "../models/Types";
import { RolledDie } from "../components/Dice/diceConfig";

export interface DiceLogEntry {
  id: string;
  gameType: GameType;
  timestamp: number;
  rolls: RolledDie[];
  summary: string;
}

const MAX_LOG_ENTRIES = 50;

interface DiceState {
  isOpen: boolean;
  counts: Record<string, number>;
  /** Flat "+modifier" values for sections with a `modifierKey` (e.g.
   *  Dragonlance's ability mod + proficiency bonus), keyed by that key. */
  modifiers: Record<string, number>;
  log: DiceLogEntry[];
  open: () => void;
  close: () => void;
  setCount: (dieId: string, count: number) => void;
  setModifier: (key: string, value: number) => void;
  addLogEntry: (entry: Omit<DiceLogEntry, "id">) => void;
  removeLogEntry: (id: string) => void;
  /** Clears the whole log, or just one game's entries if `gameType` is given. */
  clearLog: (gameType?: GameType) => void;
}

const useDiceStore = create<DiceState>()(
  persist(
    (set) => ({
      isOpen: false,
      counts: {},
      modifiers: {},
      log: [],

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      setCount: (dieId, count) =>
        set((state) => ({ counts: { ...state.counts, [dieId]: count } })),

      setModifier: (key, value) =>
        set((state) => ({ modifiers: { ...state.modifiers, [key]: value } })),

      addLogEntry: (entry) =>
        set((state) => ({
          log: [
            { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` },
            ...state.log,
          ].slice(0, MAX_LOG_ENTRIES),
        })),

      removeLogEntry: (id) =>
        set((state) => ({ log: state.log.filter((entry) => entry.id !== id) })),

      clearLog: (gameType) =>
        set((state) => ({
          log: gameType ? state.log.filter((entry) => entry.gameType !== gameType) : [],
        })),
    }),
    {
      name: "dice-storage",
      partialize: (state) => ({ counts: state.counts, modifiers: state.modifiers, log: state.log }),
    }
  )
);

export default useDiceStore;
