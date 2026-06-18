import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CharacterProps } from "../models/CharacterProps";
import { CharacterRecord } from "../models/MissionModels";
import { DEFAULT_CHARACTERS } from "../data/defaultCharacters";

const DEFAULT_RECORDS: CharacterRecord[] = DEFAULT_CHARACTERS.map((data) => ({
  sheetId: null,
  isProtagonist: false,
  data,
}));

interface CharacterState {
  characters: CharacterRecord[];
  activeCharacterId: number | null;
  isSheetOpen: boolean;
  openSheet: (characterId: number) => void;
  closeSheet: () => void;
  updateCharacterData: (updated: CharacterProps) => void;
  setCharacters: (records: CharacterRecord[]) => void;
  addCharacter: (record: CharacterRecord) => void;
  removeCharacter: (sheetId: number) => void;
  setProtagonist: (characterId: number) => void;
}

const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      characters: DEFAULT_RECORDS,
      activeCharacterId: null,
      isSheetOpen: false,

      openSheet: (characterId) =>
        set({ activeCharacterId: characterId, isSheetOpen: true }),

      closeSheet: () => set({ isSheetOpen: false }),

      updateCharacterData: (updated) =>
        set((state) => ({
          characters: state.characters.map((r) =>
            r.data.id === updated.id ? { ...r, data: updated } : r
          ),
        })),

      setCharacters: (records) =>
        set({
          characters:
            records.length === 1 && !records[0].isProtagonist
              ? [{ ...records[0], isProtagonist: true }]
              : records,
        }),

      addCharacter: (record) =>
        set((state) => {
          const next = [...state.characters, record];
          return {
            characters:
              next.length === 1 ? [{ ...record, isProtagonist: true }] : next,
          };
        }),

      removeCharacter: (sheetId) =>
        set((state) => ({
          characters: state.characters.filter((r) => r.sheetId !== sheetId),
        })),

      setProtagonist: (characterId) =>
        set((state) => ({
          characters: state.characters.map((r) => ({
            ...r,
            isProtagonist: r.data.id === characterId,
          })),
        })),
    }),
    {
      name: "character-storage",
      version: 1,
      migrate: (persisted: any, version: number) => {
        if (version < 1) {
          const oldChars: any[] = persisted?.characters ?? [];
          return {
            ...persisted,
            characters: oldChars.map((c) =>
              c.data !== undefined
                ? c
                : { sheetId: null, isProtagonist: false, data: c }
            ),
          };
        }
        return persisted;
      },
      partialize: (state) => ({ characters: state.characters }),
    }
  )
);

export default useCharacterStore;
